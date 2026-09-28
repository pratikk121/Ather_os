import React, { useState, useEffect } from 'react';
import { Command, Wifi, WifiOff, Clock, Volume2 } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { useProductivityStore } from '../../stores/useProductivityStore';

export const TopBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  const { settings, setCommandPaletteOpen } = useSettingsStore();
  const { isPlaying, playlist, currentTrackIndex } = useMediaStore();
  const { pomodoro } = useProductivityStore();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTrack = playlist[currentTrackIndex];

  return (
    <header className="h-10 px-4 m-2 glass-pill flex items-center justify-between z-50 select-none text-xs text-slate-300">
      {/* Brand & Focus Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-bold tracking-wide text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent font-extrabold text-sm">
            AetherOS
          </span>
        </div>

        <div className="h-3 w-px bg-white/20" />

        {/* Pomodoro quick badge */}
        {pomodoro.isRunning && (
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>
              {Math.floor(pomodoro.remainingSeconds / 60)}:
              {(pomodoro.remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Music Playing Now indicator */}
        {isPlaying && currentTrack && (
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Volume2 className="w-3 h-3 animate-bounce" />
            <span className="truncate max-w-[140px]">{currentTrack.title}</span>
          </div>
        )}
      </div>

      {/* Center Search Launcher Shortcut */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-slate-300 hover:text-white group"
      >
        <Command className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs font-medium">Search & Launch</span>
        <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-slate-400 border border-white/10 group-hover:text-slate-200">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls: Telemetry & Clock */}
      <div className="flex items-center space-x-4">
        {/* Companion Status */}
        <div
          className="flex items-center space-x-1"
          title={settings.isCompanionConnected ? 'Companion Connected' : 'Running Offline'}
        >
          {settings.isCompanionConnected ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-400/70" />
          )}
          <span className="text-[11px] text-slate-400 hidden md:inline">
            {settings.isCompanionConnected ? 'Local Sync' : 'Offline'}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-slate-400 hidden lg:inline">{dateStr}</span>
          <span className="font-semibold text-slate-200">{timeStr}</span>
        </div>
      </div>
    </header>
  );
};
