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
import { audioEngine } from '../../services/audioEngine';

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
        audioEngine.connectMediaElement(audioRef.current);
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
    <div className="flex flex-col h-full gap-3 text-content-primary">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />

      {/* Main Track Card */}
      <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-surface-interactive/40 border border-border-subtle shadow-sm">
        {/* Animated Vinyl / Artwork */}
        <div
          aria-hidden="true"
          className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-elevated border border-border-subtle p-0.5 shadow-lg flex-shrink-0"
        >
          <div className="w-full h-full rounded-[10px] bg-surface-base/85 flex items-center justify-center">
            <Disc
              className={`w-10 h-10 text-accent-primary ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>

        {/* Track Info & Visualizer */}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-sm text-content-primary truncate">
            {currentTrack?.title || 'No Track Selected'}
          </h3>
          <p className="text-xs text-accent-primary font-medium mt-0.5">{currentTrack?.artist || 'Unknown Artist'}</p>

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
          className="w-full h-1.5 bg-surface-interactive rounded-lg appearance-none cursor-pointer accent-accent-primary"
        />
        <div className="flex justify-between text-[11px] text-content-muted font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Volume */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-content-secondary" aria-hidden="true" />
          <input
            type="range"
            aria-label="Music volume"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1.5 bg-surface-interactive rounded-lg appearance-none cursor-pointer accent-accent-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Previous track"
            className="p-2.5 rounded-full hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="p-3.5 rounded-full bg-accent-soft hover:bg-accent-primary/25 text-accent-primary border border-accent-primary/40 transition shadow-lg focus-visible:ring-2 focus-visible:ring-accent-primary"
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
            className="p-2.5 rounded-full hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="w-16 text-right">
          <span className="text-[11px] text-content-muted font-mono font-medium">
            {currentTrackIndex + 1}/{playlist.length}
          </span>
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto space-y-1 mt-1 border-t border-border-subtle pt-2 pr-1">
        <div className="flex items-center gap-1.5 text-xs text-content-secondary font-semibold mb-1 px-1">
          <ListMusic className="w-3.5 h-3.5 text-accent-primary" aria-hidden="true" />
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
                ? 'bg-accent-soft text-accent-primary border border-accent-primary/40 font-bold'
                : 'hover:bg-surface-interactive text-content-secondary'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-4 text-[11px] font-mono text-content-muted">{i + 1}</span>
              <span className="truncate">{track.title}</span>
            </div>
            <span className="text-[11px] text-content-muted font-mono ml-2">
              {formatTime(track.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
