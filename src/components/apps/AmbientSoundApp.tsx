import React from 'react';
import { CloudRain, Waves, Wind, Activity, Trees, Volume2, Square } from 'lucide-react';
import { useMediaStore } from '../../stores/useMediaStore';
import { audioEngine } from '../../services/audioEngine';

const AMBIENT_DESCRIPTIONS: Record<string, { desc: string; benefit: string }> = {
  'ambient-rain': { desc: 'Gentle droplet impacts with lowpass filtering', benefit: 'Broad-spectrum focus & reading' },
  'ambient-waves': { desc: 'Rhythmic 10-second tidal swell modulation', benefit: 'Calms sympathetic nervous system' },
  'ambient-brown': { desc: 'Deep warm rumble with reduced treble', benefit: 'Ideal for deep programming & writing' },
  'ambient-binaural': { desc: '432Hz dual-carrier with 6Hz alpha beat', benefit: 'Flow state & mental clarity' },
  'ambient-forest': { desc: 'Gentle wind through pine foliage', benefit: 'Reduces cortisol & restores attention' },
};

const AMBIENT_ICONS = {
  rain: CloudRain,
  waves: Waves,
  brownNoise: Wind,
  binaural: Activity,
  forest: Trees,
};

export const AmbientSoundApp: React.FC = () => {
  const { ambientTracks, toggleAmbientTrack, setAmbientVolume, stopAllAmbient } = useMediaStore();

  const handleToggle = (id: string, type: any, isPlaying: boolean, volume: number) => {
    if (isPlaying) {
      audioEngine.stopAmbientSound(id);
    } else {
      audioEngine.startAmbientSound(id, type, volume);
    }
    toggleAmbientTrack(id);
  };

  const handleVolume = (id: string, volume: number) => {
    setAmbientVolume(id, volume);
    audioEngine.setAmbientVolume(id, volume);
  };

  const handleStopAll = () => {
    ambientTracks.forEach((t) => {
      if (t.isPlaying) {
        audioEngine.stopAmbientSound(t.id);
      }
    });
    stopAllAmbient();
  };

  const activeCount = ambientTracks.filter((t) => t.isPlaying).length;

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xs font-bold text-white">Procedural Ambient Synthesizers</h3>
          <p className="text-[11px] text-slate-300 mt-0.5">Real-time Web Audio sound generators for cognitive flow</p>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleStopAll}
            aria-label="Mute all active soundscapes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/25 hover:bg-rose-500/35 text-rose-200 text-xs font-semibold border border-rose-500/40 transition focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Mute All ({activeCount})</span>
          </button>
        )}
      </div>

      {/* Mixer Sliders */}
      <div role="list" aria-label="Ambient sound tracks" className="flex-1 overflow-y-auto space-y-3 pr-1">
        {ambientTracks.map((track) => {
          const Icon = AMBIENT_ICONS[track.type] || Wind;
          const meta = AMBIENT_DESCRIPTIONS[track.id] || { desc: 'Procedural noise generator', benefit: 'Focus enhancement' };

          return (
            <div
              key={track.id}
              role="listitem"
              className={`p-3.5 rounded-xl border transition ${
                track.isPlaying
                  ? 'bg-cyan-500/15 border-cyan-400/50 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className={`p-2 rounded-xl ${
                      track.isPlaying
                        ? 'bg-cyan-500/30 text-cyan-200 shadow-sm'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{track.name}</h4>
                    <p className="text-[10px] text-cyan-200/90 mt-0.5">{meta.benefit}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(track.id, track.type, track.isPlaying, track.volume)}
                  aria-pressed={track.isPlaying}
                  aria-label={`${track.isPlaying ? 'Mute' : 'Play'} ${track.name}`}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    track.isPlaying
                      ? 'bg-cyan-500/35 text-cyan-100 border border-cyan-400/60 shadow-sm'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white border border-white/15'
                  }`}
                >
                  {track.isPlaying ? 'Active' : 'Turn On'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-1">
                <Volume2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  type="range"
                  aria-label={`Volume for ${track.name}`}
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!track.isPlaying}
                  value={track.volume}
                  onChange={(e) => handleVolume(track.id, Number(e.target.value))}
                  className="flex-1 h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-30"
                />
                <span className="text-[11px] font-mono text-slate-200 w-10 text-right font-semibold">
                  {Math.round(track.volume * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
