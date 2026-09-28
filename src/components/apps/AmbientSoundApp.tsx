import React from 'react';
import { CloudRain, Waves, Wind, Activity, Trees, Volume2, Square } from 'lucide-react';
import { useMediaStore } from '../../stores/useMediaStore';
import { audioEngine } from '../../services/audioEngine';

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
          <h3 className="text-xs font-semibold text-slate-200">Ambient Soundscapes</h3>
          <p className="text-[10px] text-slate-400">Procedural synthesizers for focus and relaxation</p>
        </div>
        {activeCount > 0 && (
          <button
            onClick={handleStopAll}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] border border-rose-500/30 transition"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Mute All</span>
          </button>
        )}
      </div>

      {/* Mixer Sliders */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {ambientTracks.map((track) => {
          const Icon = AMBIENT_ICONS[track.type] || Wind;
          return (
            <div
              key={track.id}
              className={`p-3 rounded-xl border transition ${
                track.isPlaying
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      track.isPlaying
                        ? 'bg-cyan-500/30 text-cyan-200'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">{track.name}</span>
                </div>

                <button
                  onClick={() => handleToggle(track.id, track.type, track.isPlaying, track.volume)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    track.isPlaying
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {track.isPlaying ? 'Active' : 'Turn On'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  disabled={!track.isPlaying}
                  value={track.volume}
                  onChange={(e) => handleVolume(track.id, Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-30"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
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
