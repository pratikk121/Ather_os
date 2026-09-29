// Web Audio Engine for Ambient Synthesis & Visualizer Analysis

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private ambientGains: Map<string, GainNode> = new Map();
  private ambientNodes: Map<string, { stop: () => void }> = new Map();
  private mediaSources: WeakMap<HTMLMediaElement, MediaElementAudioSourceNode> = new WeakMap();

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode {
    const ctx = this.getContext();
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 128;
    }
    return this.analyser;
  }

  public getFrequencyData(): Uint8Array {
    const analyser = this.getAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    return data;
  }

  public connectMediaElement(el: HTMLMediaElement): MediaElementAudioSourceNode | null {
    if (!el) return null;
    try {
      const ctx = this.getContext();
      let sourceNode = this.mediaSources.get(el);
      if (!sourceNode) {
        sourceNode = ctx.createMediaElementSource(el);
        const analyser = this.getAnalyser();
        sourceNode.connect(analyser);
        analyser.connect(ctx.destination);
        this.mediaSources.set(el, sourceNode);
      }
      return sourceNode;
    } catch (err) {
      console.warn('AudioEngine: MediaElement connection fallback:', err);
      return null;
    }
  }

  // Procedural Ambient Generators
  public startAmbientSound(id: string, type: 'rain' | 'waves' | 'brownNoise' | 'binaural' | 'forest', volume: number) {
    this.stopAmbientSound(id);
    const ctx = this.getContext();

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(this.getAnalyser());
    gainNode.connect(ctx.destination);
    this.ambientGains.set(id, gainNode);

    if (type === 'rain' || type === 'forest') {
      // Noise buffer with bandpass filter
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gainNode);
      noise.start();

      this.ambientNodes.set(id, {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
            filter.disconnect();
          } catch {}
        },
      });
    } else if (type === 'brownNoise') {
      // Brown noise generator
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      noise.connect(gainNode);
      noise.start();

      this.ambientNodes.set(id, {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {}
        },
      });
    } else if (type === 'binaural') {
      // Dual oscillator with 6Hz difference for theta brainwave entrainment
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.frequency.setValueAtTime(216, ctx.currentTime);
      osc2.frequency.setValueAtTime(222, ctx.currentTime); // 6Hz delta

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      osc1.start();
      osc2.start();

      this.ambientNodes.set(id, {
        stop: () => {
          try {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch {}
        },
      });
    } else if (type === 'waves') {
      // Modulated pink noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      // LFO modulation for tidal swell
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10s wave cycle
      lfoGain.gain.setValueAtTime(200, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(gainNode);

      noise.start();
      lfo.start();

      this.ambientNodes.set(id, {
        stop: () => {
          try {
            noise.stop();
            lfo.stop();
            noise.disconnect();
            lfo.disconnect();
            lfoGain.disconnect();
            filter.disconnect();
          } catch {}
        },
      });
    }
  }

  public setAmbientVolume(id: string, volume: number) {
    const gainNode = this.ambientGains.get(id);
    if (gainNode && this.ctx) {
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  public stopAmbientSound(id: string) {
    const node = this.ambientNodes.get(id);
    if (node) {
      try {
        node.stop();
      } catch {}
      this.ambientNodes.delete(id);
    }
    const gainNode = this.ambientGains.get(id);
    if (gainNode) {
      try {
        gainNode.disconnect();
      } catch {}
      this.ambientGains.delete(id);
    }
  }
}

export const audioEngine = new AudioEngine();
