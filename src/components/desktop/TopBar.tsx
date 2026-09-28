import React, { useState, useEffect } from 'react';
import { Command, Wifi, WifiOff, Clock, Volume2 } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { useWindowStore } from '../../stores/useWindowStore';

export const TopBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  const { settings, setCommandPaletteOpen } = useSettingsStore();
  const { isPlaying, playlist, currentTrackIndex } = useMediaStore();
  const { pomodoro } = useProductivityStore();
  const { windows, focusWindow, openWindow, activeWindowId } = useWindowStore();

  const openWindows = Object.values(windows).filter((w) => w.isOpen);

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
      className="h-10 px-4 m-2 glass-pill flex items-center justify-between z-50 select-none text-xs text-content-secondary"
    >
      {/* Brand, Active App Tabs & Focus Status */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="flex items-center space-x-2 font-bold tracking-wide text-content-primary flex-shrink-0">
          <div
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_8px_var(--aether-accent-primary)]"
          />
          <span className="font-extrabold text-sm tracking-tight text-content-primary">
            AetherOS
          </span>
        </div>

        <div className="h-3 w-px bg-border-subtle flex-shrink-0" aria-hidden="true" />

        {/* Active & Minimized App Tabs (Quick Taskbar) */}
        {openWindows.length > 0 && (
          <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[280px] lg:max-w-md py-0.5">
            {openWindows.map((w) => {
              const isFocused = activeWindowId === w.id && !w.isMinimized;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    if (w.isMinimized) {
                      openWindow(w.id);
                    } else {
                      focusWindow(w.id);
                    }
                  }}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs transition truncate flex-shrink-0 ${
                    isFocused
                      ? 'bg-surface-selected text-content-primary font-bold border border-border-strong shadow-sm'
                      : w.isMinimized
                      ? 'bg-surface-interactive text-content-muted border border-border-subtle hover:bg-surface-selected hover:text-content-primary'
                      : 'bg-surface-interactive/60 text-content-secondary border border-border-subtle hover:bg-surface-selected'
                  }`}
                  title={`${w.title}${w.isMinimized ? ' (Minimized - click to restore)' : ''}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isFocused
                        ? 'bg-accent-primary shadow-[0_0_6px_var(--aether-accent-primary)]'
                        : w.isMinimized
                        ? 'bg-status-warning'
                        : 'bg-content-muted'
                    }`}
                  />
                  <span className="truncate max-w-[90px]">{w.title}</span>
                  {w.isMinimized && <span className="text-[10px] text-status-warning font-mono">_</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Pomodoro quick badge */}
        {pomodoro.isRunning && (
          <div
            role="status"
            aria-label={`Flow timer running, ${Math.floor(pomodoro.remainingSeconds / 60)} minutes remaining`}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-surface-interactive text-content-primary border border-border-subtle flex-shrink-0"
          >
            <Clock className="w-3 h-3 text-content-muted" />
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
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-surface-interactive text-content-primary border border-border-subtle flex-shrink-0"
          >
            <Volume2 className="w-3 h-3 animate-bounce text-accent-primary" />
            <span className="truncate max-w-[120px] font-medium text-xs">{currentTrack.title}</span>
          </div>
        )}
      </div>

      {/* Center Search Launcher Shortcut */}
      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        aria-label="Open command palette and search (Press Command + K or Control + K)"
        className="flex items-center space-x-2 px-3.5 py-1 rounded-lg bg-surface-interactive hover:bg-surface-selected transition border border-border-subtle text-content-secondary hover:text-content-primary group focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        <Command className="w-3.5 h-3.5 text-content-muted group-hover:text-content-primary" />
        <span className="text-xs font-semibold">Search & Launch</span>
        <kbd className="px-1.5 py-0.5 rounded bg-surface-base/70 text-[10px] text-content-muted border border-border-subtle group-hover:text-content-primary font-mono">
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
            <Wifi className="w-3.5 h-3.5 text-status-success" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-status-warning" />
          )}
          <span className="text-[11px] text-content-secondary hidden md:inline font-medium">
            {settings.isCompanionConnected ? 'Local Sync' : 'Offline Mode'}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-content-muted hidden lg:inline">{dateStr}</span>
          <span className="font-bold text-content-primary">{timeStr}</span>
        </div>
      </div>
    </header>
  );
};
