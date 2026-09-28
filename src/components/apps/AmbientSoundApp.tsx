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
    <div className="flex flex-col h-full gap-3 text-content-primary">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div>
          <h3 className="text-xs font-bold text-content-primary">Procedural Ambient Synthesizers</h3>
          <p className="text-[11px] text-content-secondary mt-0.5">Real-time Web Audio sound generators for cognitive flow</p>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleStopAll}
            aria-label="Mute all active soundscapes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-error/20 hover:bg-status-error/30 text-status-error text-xs font-semibold border border-status-error/40 transition focus-visible:ring-2 focus-visible:ring-status-error"
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
                  ? 'bg-surface-selected border-accent-primary/60 shadow-md ring-1 ring-accent-primary/30'
                  : 'bg-surface-interactive/40 border-border-subtle hover:bg-surface-interactive'
              }`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className={`p-2 rounded-xl ${
                      track.isPlaying
                        ? 'bg-accent-soft text-accent-primary shadow-sm'
                        : 'bg-surface-interactive text-content-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-content-primary">{track.name}</h4>
                    <p className="text-[10px] text-accent-primary mt-0.5">{meta.benefit}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(track.id, track.type, track.isPlaying, track.volume)}
                  aria-pressed={track.isPlaying}
                  aria-label={`${track.isPlaying ? 'Mute' : 'Play'} ${track.name}`}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    track.isPlaying
                      ? 'bg-accent-primary text-accent-contrast shadow-sm'
                      : 'bg-surface-interactive text-content-secondary hover:bg-surface-selected hover:text-content-primary border border-border-subtle'
                  }`}
                >
                  {track.isPlaying ? 'Active' : 'Turn On'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-1">
                <Volume2 className="w-4 h-4 text-content-muted" aria-hidden="true" />
                <input
                  type="range"
                  aria-label={`Volume for ${track.name}`}
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!track.isPlaying}
                  value={track.volume}
                  onChange={(e) => handleVolume(track.id, Number(e.target.value))}
                  className="flex-1 h-1.5 bg-surface-interactive rounded-lg appearance-none cursor-pointer accent-accent-primary disabled:opacity-30"
                />
                <span className="text-[11px] font-mono text-content-primary w-10 text-right font-semibold">
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
