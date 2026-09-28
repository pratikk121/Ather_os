import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Disc,
  ListMusic,
} from 'lucide-react';
import { useMediaStore } from '../../stores/useMediaStore';
import { AudioVisualizer } from '../audio/AudioVisualizer';

export const MusicPlayerApp: React.FC = () => {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    setVolume,
    setCurrentTime,
    setDuration,
  } = useMediaStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, currentTrack, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />

      {/* Main Track Card */}
      <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 shadow-sm">
        {/* Animated Vinyl / Artwork */}
        <div
          aria-hidden="true"
          className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg flex-shrink-0"
        >
          <div className="w-full h-full rounded-[10px] bg-slate-950/85 flex items-center justify-center">
            <Disc
              className={`w-10 h-10 text-cyan-400 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>

        {/* Track Info & Visualizer */}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-sm text-white truncate">
            {currentTrack?.title || 'No Track Selected'}
          </h3>
          <p className="text-xs text-cyan-300 font-medium mt-0.5">{currentTrack?.artist || 'Unknown Artist'}</p>

          <div className="mt-2" aria-hidden="true">
            <AudioVisualizer isPlaying={isPlaying} className="w-full h-6" />
          </div>
        </div>
      </div>

      {/* Scrubber */}
      <div className="flex flex-col gap-1 px-1">
        <input
          type="range"
          aria-label="Track progress seek bar"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[11px] text-slate-300 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Volume */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-300" aria-hidden="true" />
          <input
            type="range"
            aria-label="Music volume"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Previous track"
            className="p-2.5 rounded-full hover:bg-white/10 text-slate-200 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="p-3.5 rounded-full bg-cyan-500/35 hover:bg-cyan-500/45 text-cyan-100 border border-cyan-400/50 transition shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={nextTrack}
            aria-label="Next track"
            className="p-2.5 rounded-full hover:bg-white/10 text-slate-200 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="w-16 text-right">
          <span className="text-[11px] text-slate-300 font-mono font-medium">
            {currentTrackIndex + 1}/{playlist.length}
          </span>
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto space-y-1 mt-1 border-t border-white/10 pt-2 pr-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-1 px-1">
          <ListMusic className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
          <span>Playlist Queue</span>
        </div>
        {playlist.map((track, i) => (
          <div
            key={track.id}
            role="button"
            tabIndex={0}
            onClick={() => playTrack(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') playTrack(i);
            }}
            aria-label={`Play ${track.title} by ${track.artist}`}
            className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition ${
              i === currentTrackIndex
                ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-400/40 font-bold'
                : 'hover:bg-white/5 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-4 text-[11px] font-mono text-slate-400">{i + 1}</span>
              <span className="truncate">{track.title}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono ml-2">
              {formatTime(track.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
