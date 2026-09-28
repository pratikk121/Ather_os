import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { useMediaStore } from '../../stores/useMediaStore';
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
    obsidian: 'from-black via-zinc-950 to-neutral-950',
    monochrome: 'from-zinc-950 via-zinc-900 to-black',
    silver: 'from-zinc-900 via-neutral-900 to-slate-950',
    carbon: 'from-[#0c0c0e] via-[#141417] to-[#080809]',
    graphite: 'from-neutral-950 via-zinc-900 to-black',
    aurora: 'from-[#022c22] via-[#064e3b] to-[#021c17]',
    nebula: 'from-[#2e1065] via-[#3b0764] to-[#0f0728]',
    cyberpunk: 'from-[#4c0519] via-[#2e1065] to-[#082f49]',
    deepsea: 'from-[#082f49] via-[#0c4a6e] to-[#02131e]',
    minimal: 'from-black via-zinc-950 to-black',
  };

  const getAmbientColors = () => {
    const preset = settings.themePreset;
    const accent = settings.accentColor;

    if (preset === 'cyberpunk' || accent === 'rose' || (preset === 'custom' && accent === 'cyan')) {
      return {
        s1: 'bg-cyan-500/[0.18]',
        s2: 'bg-pink-500/[0.16]',
        s3: 'bg-purple-600/[0.18]',
      };
    }
    if (preset === 'emerald' || accent === 'emerald') {
      return {
        s1: 'bg-emerald-400/[0.18]',
        s2: 'bg-teal-500/[0.16]',
        s3: 'bg-green-600/[0.14]',
      };
    }
    if (preset === 'solar' || accent === 'amber') {
      return {
        s1: 'bg-amber-400/[0.18]',
        s2: 'bg-orange-500/[0.16]',
        s3: 'bg-rose-600/[0.14]',
      };
    }
    if (preset === 'arctic' || (preset === 'custom' && accent === 'cyan')) {
      return {
        s1: 'bg-sky-400/[0.18]',
        s2: 'bg-blue-500/[0.16]',
        s3: 'bg-cyan-300/[0.14]',
      };
    }
    if (preset === 'nebula' || accent === 'purple') {
      return {
        s1: 'bg-purple-500/[0.20]',
        s2: 'bg-indigo-500/[0.18]',
        s3: 'bg-fuchsia-600/[0.16]',
      };
    }
    return {
      s1: 'bg-white/[0.05]',
      s2: 'bg-zinc-300/[0.04]',
      s3: 'bg-white/[0.03]',
    };
  };

  const ambient = getAmbientColors();
  const isAudioPulsing = settings.audioReactiveEnv && isPlaying;

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => {
        setSelectedIconId(null);
        if (contextMenu.isOpen) setContextMenu({ ...contextMenu, isOpen: false });
      }}
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${
        wallpapers[settings.wallpaper] || wallpapers.obsidian
      } text-zinc-100 flex flex-col justify-between select-none transition-colors duration-500`}
    >
      {/* Dynamic Theme & Audio-Reactive Ambient Fluid Light Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${ambient.s1} rounded-full blur-3xl transition-all duration-700 ${
            isAudioPulsing ? 'scale-125 animate-pulse' : 'animate-pulse-slow'
          }`}
        />
        <div
          className={`absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] ${ambient.s2} rounded-full blur-3xl transition-all duration-700 delay-300 ${
            isAudioPulsing ? 'scale-110' : 'animate-pulse-slow'
          }`}
        />
        <div
          className={`absolute top-1/2 right-1/3 w-80 h-80 ${ambient.s3} rounded-full blur-3xl transition-all duration-700 delay-500 ${
            isAudioPulsing ? 'scale-120 animate-pulse' : 'animate-pulse-slow'
          }`}
        />
      </div>

      {/* Top Status Bar */}
      <TopBar />

      {/* Desktop Physical Workspace with Interactive Icons & Floating Windows */}
      <main className="relative flex-1 w-full h-full overflow-hidden p-3">
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
