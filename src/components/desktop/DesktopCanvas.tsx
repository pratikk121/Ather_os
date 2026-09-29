import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { applyThemeToElement } from '../../theme/tokens';
import { TopBar } from './TopBar';
import { LiquidDock } from './LiquidDock';
import { WindowFrame } from './WindowFrame';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { WindowId } from '../../types';

// Apps imports
import { NotesApp } from '../apps/NotesApp';
import { TasksApp } from '../apps/TasksApp';
import { FocusTimerApp } from '../apps/FocusTimerApp';
import { MusicPlayerApp } from '../apps/MusicPlayerApp';
import { AmbientSoundApp } from '../apps/AmbientSoundApp';
import { ActivityJournalApp } from '../apps/ActivityJournalApp';
import { HabitTrackerApp } from '../apps/HabitTrackerApp';
import { SystemMonitorApp } from '../apps/SystemMonitorApp';
import { SettingsApp } from '../apps/SettingsApp';
import { TerminalApp } from '../apps/TerminalApp';
import { FileExplorerApp } from '../apps/FileExplorerApp';
import { CommandPalette } from './CommandPalette';
import { companionClient } from '../../services/companionClient';

interface DesktopShortcut {
  id: WindowId;
  label: string;
  iconType: any;
}

const DESKTOP_SHORTCUTS: DesktopShortcut[] = [
  { id: 'files', label: 'Files', iconType: 'files' },
  { id: 'terminal', label: 'Terminal', iconType: 'terminal' },
  { id: 'notes', label: 'Notes', iconType: 'notes' },
  { id: 'tasks', label: 'Tasks', iconType: 'tasks' },
  { id: 'pomodoro', label: 'Flow Timer', iconType: 'pomodoro' },
  { id: 'music', label: 'Music', iconType: 'music' },
  { id: 'ambient', label: 'Ambient', iconType: 'ambient' },
  { id: 'journal', label: 'Journal', iconType: 'journal' },
  { id: 'habits', label: 'Habits', iconType: 'habits' },
  { id: 'system', label: 'Telemetry', iconType: 'system' },
  { id: 'settings', label: 'Personalization', iconType: 'settings' },
];

export const DesktopCanvas: React.FC = () => {
  const { settings, setLightPosition } = useSettingsStore();
  const { windows } = useWindowStore();
  const { isPlaying } = useMediaStore();

  const [selectedIconId, setSelectedIconId] = useState<WindowId | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0,
    y: 0,
    isOpen: false,
  });

  // Connect to companion telemetry server
  useEffect(() => {
    companionClient.connect();
  }, []);

  // Apply theme tokens on initial mount and when themePreset or accentColor updates
  useEffect(() => {
    if (typeof document !== 'undefined') {
      applyThemeToElement(document.documentElement, settings.themePreset, settings.accentColor);
    }
  }, [settings.themePreset, settings.accentColor]);

  // Track cursor position for dynamic rim light
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setLightPosition({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setLightPosition]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true,
    });
  };

  const wallpapers: Record<string, string> = {
    obsidian: 'from-[#0b0c10] via-[#1f2833] to-[#0b0c10]',
    monochrome: 'from-[#121214] via-[#1a1a24] to-[#09090b]',
    silver: 'from-[#1c1d22] via-[#2a2c35] to-[#121316]',
    carbon: 'from-[#18181b] via-[#27272a] to-[#0f0f11]',
    graphite: 'from-[#141416] via-[#22232a] to-[#0e0e10]',
    aurora: 'from-[#042f2e] via-[#065f46] to-[#022c22]',
    nebula: 'from-[#311042] via-[#4c1d95] to-[#1e1b4b]',
    cyberpunk: 'from-[#581c87] via-[#831843] to-[#0c4a6e]',
    deepsea: 'from-[#0c4a6e] via-[#0369a1] to-[#082f49]',
    minimal: 'from-[#18181b] via-[#09090b] to-[#18181b]',
  };

  const isAudioPulsing = settings.audioReactiveEnv && isPlaying;
  const hasActiveWindows = Object.values(windows).some((w) => w.isOpen && !w.isMinimized);

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => {
        setSelectedIconId(null);
        if (contextMenu.isOpen) setContextMenu({ ...contextMenu, isOpen: false });
      }}
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${
        wallpapers[settings.wallpaper] || wallpapers.obsidian
      } text-content-primary flex flex-col justify-between select-none transition-colors duration-500`}
    >
      {/* Dynamic Theme-Derived Fluid Light Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          style={{ backgroundColor: 'var(--aether-ambient-glow-1)' }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
            isAudioPulsing ? 'scale-125 animate-pulse' : 'animate-pulse-slow'
          }`}
        />
        <div
          style={{ backgroundColor: 'var(--aether-ambient-glow-2)' }}
          className={`absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl transition-all duration-700 delay-300 ${
            isAudioPulsing ? 'scale-110' : 'animate-pulse-slow'
          }`}
        />
        <div
          style={{ backgroundColor: 'var(--aether-ambient-glow-3)' }}
          className={`absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl transition-all duration-700 delay-500 ${
            isAudioPulsing ? 'scale-120 animate-pulse' : 'animate-pulse-slow'
          }`}
        />
      </div>

      {/* Top Status Bar */}
      <TopBar />

      {/* Desktop Physical Workspace with Interactive Icons & Floating Windows */}
      <main className="relative flex-1 w-full h-full overflow-hidden p-3">
        {/* Ambient Spatial Centerpiece (Displayed when all windows are minimized or closed) */}
        {!hasActiveWindows && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 pb-12">
            <div className="pointer-events-auto flex flex-col items-center gap-4 text-center max-w-sm p-6 rounded-3xl bg-surface-primary/80 backdrop-blur-2xl border border-border-default shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-content-primary drop-shadow-md">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs font-semibold text-content-secondary mt-1 uppercase tracking-wider font-mono">
                  {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border-default to-transparent" />

              <p className="text-[11px] text-content-muted">
                All windows minimized. Click any dock icon or press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-surface-interactive border border-border-default text-content-primary font-mono text-[10px]">
                  ⌘K
                </kbd>{' '}
                to launch.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => useWindowStore.getState().openWindow('terminal')}
                  className="px-3 py-1.5 rounded-xl bg-surface-interactive hover:bg-surface-selected border border-border-default text-xs text-content-primary font-semibold transition hover:scale-105 shadow-sm"
                >
                  Terminal
                </button>
                <button
                  type="button"
                  onClick={() => useWindowStore.getState().openWindow('notes')}
                  className="px-3 py-1.5 rounded-xl bg-surface-interactive hover:bg-surface-selected border border-border-default text-xs text-content-primary font-semibold transition hover:scale-105 shadow-sm"
                >
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => useWindowStore.getState().openWindow('settings')}
                  className="px-3 py-1.5 rounded-xl bg-accent-soft hover:bg-accent-primary/25 border border-accent-primary/40 text-xs text-accent-primary font-semibold transition hover:scale-105 shadow-md"
                >
                  Personalize
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Shortcut Column */}
        {settings.showDesktopIcons && (
          <div className="absolute top-2 left-2 flex flex-col flex-wrap max-h-[calc(100vh-120px)] gap-1.5 z-0">
            {DESKTOP_SHORTCUTS.map((item) => (
              <DesktopIcon
                key={item.id}
                id={item.id}
                label={item.label}
                iconType={item.iconType}
                isSelected={selectedIconId === item.id}
                onSelect={(id) => setSelectedIconId(id)}
              />
            ))}
          </div>
        )}

        {/* Windows Layer */}
        {windows.files.isOpen && (
          <WindowFrame window={windows.files}>
            <FileExplorerApp />
          </WindowFrame>
        )}

        {windows.terminal.isOpen && (
          <WindowFrame window={windows.terminal}>
            <TerminalApp />
          </WindowFrame>
        )}

        {windows.notes.isOpen && (
          <WindowFrame window={windows.notes}>
            <NotesApp />
          </WindowFrame>
        )}

        {windows.tasks.isOpen && (
          <WindowFrame window={windows.tasks}>
            <TasksApp />
          </WindowFrame>
        )}

        {windows.pomodoro.isOpen && (
          <WindowFrame window={windows.pomodoro}>
            <FocusTimerApp />
          </WindowFrame>
        )}

        {windows.music.isOpen && (
          <WindowFrame window={windows.music}>
            <MusicPlayerApp />
          </WindowFrame>
        )}

        {windows.ambient.isOpen && (
          <WindowFrame window={windows.ambient}>
            <AmbientSoundApp />
          </WindowFrame>
        )}

        {windows.journal.isOpen && (
          <WindowFrame window={windows.journal}>
            <ActivityJournalApp />
          </WindowFrame>
        )}

        {windows.habits.isOpen && (
          <WindowFrame window={windows.habits}>
            <HabitTrackerApp />
          </WindowFrame>
        )}

        {windows.system.isOpen && (
          <WindowFrame window={windows.system}>
            <SystemMonitorApp />
          </WindowFrame>
        )}

        {windows.settings.isOpen && (
          <WindowFrame window={windows.settings}>
            <SettingsApp />
          </WindowFrame>
        )}

        {/* Floating Minimized Apps Quick Tray (Bottom-Left) */}
        {Object.values(windows).some((w) => w.isOpen && w.isMinimized) && (
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-surface-elevated/90 backdrop-blur-2xl p-2 rounded-2xl border border-border-default shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <span className="text-[10px] font-mono text-content-muted uppercase px-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse" />
              <span>Minimized:</span>
            </span>
            {Object.values(windows)
              .filter((w) => w.isOpen && w.isMinimized)
              .map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => useWindowStore.getState().openWindow(w.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-interactive hover:bg-surface-selected border border-border-default text-xs text-content-primary font-semibold transition hover:scale-105 shadow-md"
                  title={`Click to restore ${w.title}`}
                >
                  <span>{w.title}</span>
                  <span className="text-[9px] font-mono text-accent-primary">↗ Restore</span>
                </button>
              ))}
          </div>
        )}
      </main>

      {/* Context Right-Click Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
      />

      {/* Universal Command Palette Modal (Cmd+K) */}
      <CommandPalette />

      {/* Floating Liquid Dock */}
      <LiquidDock />
    </div>
  );
};
