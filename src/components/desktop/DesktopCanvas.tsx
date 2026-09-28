import React, { useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { TopBar } from './TopBar';
import { LiquidDock } from './LiquidDock';
import { WindowFrame } from './WindowFrame';

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
import { CommandPalette } from './CommandPalette';

export const DesktopCanvas: React.FC = () => {
  const { settings, setLightPosition } = useSettingsStore();
  const { windows } = useWindowStore();

  // Track cursor position to cast dynamic specular rim highlights
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setLightPosition({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setLightPosition]);

  const wallpapers = {
    aurora: 'from-slate-950 via-indigo-950/80 to-slate-950',
    nebula: 'from-purple-950 via-slate-950 to-cyan-950/70',
    cyberpunk: 'from-slate-950 via-rose-950/50 to-blue-950',
    deepsea: 'from-slate-950 via-teal-950/60 to-slate-950',
    minimal: 'from-slate-950 to-zinc-950',
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${
        wallpapers[settings.wallpaper] || wallpapers.aurora
      } text-slate-100 flex flex-col justify-between select-none`}
    >
      {/* Ambient background glowing light nodes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-700" />
      </div>

      {/* Top Status Bar */}
      <TopBar />

      {/* Desktop Workspace with Floating Windows */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
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

      {/* Command Palette Modal */}
      <CommandPalette />

      {/* Floating Liquid Dock */}
      <LiquidDock />
    </div>
  );
};
