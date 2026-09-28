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
    <header
      role="banner"
      aria-label="AetherOS Status Bar"
      className="h-10 px-4 m-2 glass-pill flex items-center justify-between z-50 select-none text-xs text-slate-200"
    >
      {/* Brand & Focus Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 font-bold tracking-wide text-white">
          <div
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          />
          <span className="text-white font-extrabold text-sm tracking-tight">
            AetherOS
          </span>
        </div>

        <div className="h-3 w-px bg-white/20" aria-hidden="true" />

        {/* Pomodoro quick badge */}
        {pomodoro.isRunning && (
          <div
            role="status"
            aria-label={`Flow timer running, ${Math.floor(pomodoro.remainingSeconds / 60)} minutes remaining`}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/25"
          >
            <Clock className="w-3 h-3 text-zinc-300" />
            <span className="font-mono font-medium text-xs">
              {Math.floor(pomodoro.remainingSeconds / 60)}:
              {(pomodoro.remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Music Playing Now indicator */}
        {isPlaying && currentTrack && (
          <div
            role="status"
            aria-label={`Now playing: ${currentTrack.title}`}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20"
          >
            <Volume2 className="w-3 h-3 animate-bounce text-zinc-300" />
            <span className="truncate max-w-[150px] font-medium text-xs">{currentTrack.title}</span>
          </div>
        )}
      </div>

      {/* Center Search Launcher Shortcut */}
      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        aria-label="Open command palette and search (Press Command + K or Control + K)"
        className="flex items-center space-x-2 px-3.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition border border-white/15 text-zinc-200 hover:text-white group focus-visible:ring-2 focus-visible:ring-white"
      >
        <Command className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
        <span className="text-xs font-semibold">Search & Launch</span>
        <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300 border border-white/15 group-hover:text-white font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls: Telemetry & Clock */}
      <div className="flex items-center space-x-4">
        {/* Companion Status */}
        <div
          role="status"
          className="flex items-center space-x-1.5"
          title={settings.isCompanionConnected ? 'Companion Connected' : 'Running Offline'}
        >
          {settings.isCompanionConnected ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-400/90" />
          )}
          <span className="text-[11px] text-slate-300 hidden md:inline font-medium">
            {settings.isCompanionConnected ? 'Local Sync' : 'Offline Mode'}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-300 hidden lg:inline">{dateStr}</span>
          <span className="font-bold text-white">{timeStr}</span>
        </div>
      </div>
    </header>
  );
};
