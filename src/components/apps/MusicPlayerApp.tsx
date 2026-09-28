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
      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
        {/* Animated Vinyl / Artwork */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg flex-shrink-0">
          <div className="w-full h-full rounded-[10px] bg-slate-950/80 flex items-center justify-center">
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
          <p className="text-xs text-cyan-300/80 mt-0.5">{currentTrack?.artist || 'Unknown Artist'}</p>

          <div className="mt-2">
            <AudioVisualizer isPlaying={isPlaying} className="w-full h-6" />
          </div>
        </div>
      </div>

      {/* Scrubber */}
      <div className="flex flex-col gap-1 px-1">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Volume */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevTrack}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/40 transition shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="w-16 text-right">
          <span className="text-[10px] text-slate-400">
            {currentTrackIndex + 1}/{playlist.length}
          </span>
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto space-y-1 mt-1 border-t border-white/10 pt-2 pr-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 px-1">
          <ListMusic className="w-3.5 h-3.5 text-cyan-400" />
          <span>Queue</span>
        </div>
        {playlist.map((track, i) => (
          <div
            key={track.id}
            onClick={() => playTrack(i)}
            className={`p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition ${
              i === currentTrackIndex
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium'
                : 'hover:bg-white/5 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-4 text-[10px] text-slate-500">{i + 1}</span>
              <span className="truncate">{track.title}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-2">
              {formatTime(track.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
