import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Canvas 2D context in JSDOM
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
  if (contextId === '2d') {
    return {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      fillStyle: '',
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
    };
  }
  return null;
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock Web Audio API
class AudioContextMock {
  currentTime = 0;
  destination = {};
  state = 'running';

  createAnalyser() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      fftSize: 256,
      frequencyBinCount: 128,
      getByteFrequencyData: vi.fn((arr) => arr.fill(100)),
    };
  }
  createGain() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      gain: { value: 1, setValueAtTime: vi.fn() },
    };
  }
  createOscillator() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      type: 'sine',
    };
  }
  createBiquadFilter() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      type: 'lowpass',
    };
  }
  createBufferSource() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      buffer: null,
      loop: false,
    };
  }
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(1024),
    };
  }
  close = vi.fn();
  resume = vi.fn();
}

// Attach mocks to global
global.AudioContext = AudioContextMock as unknown as typeof AudioContext;
(global as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext = AudioContextMock as unknown as typeof AudioContext;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLElement.prototype.scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

