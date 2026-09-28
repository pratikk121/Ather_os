import React, { useState } from 'react';
import {
  Folder,
  Terminal,
  FileText,
  CheckSquare,
  Timer,
  Music,
  Waves,
  BookOpen,
  Flame,
  Activity,
  Sliders,
} from 'lucide-react';
import { WindowId, ThemePreset } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { LiquidSurface } from '../glass/LiquidSurface';

interface DockItemDef {
  id: WindowId;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const DOCK_ITEMS_DEF: DockItemDef[] = [
  { id: 'files', label: 'Files', icon: Folder },
  { id: 'terminal', label: 'Kernel Terminal', icon: Terminal },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'pomodoro', label: 'Flow Timer', icon: Timer },
  { id: 'music', label: 'AetherPlayer', icon: Music },
  { id: 'ambient', label: 'Ambient Mixer', icon: Waves },
  { id: 'journal', label: 'Life Journal', icon: BookOpen },
  { id: 'habits', label: 'Habit Streaks', icon: Flame },
  { id: 'system', label: 'System', icon: Activity },
  { id: 'settings', label: 'Personalization', icon: Sliders },
];

const THEME_GRADIENTS: Record<ThemePreset, Record<WindowId, string>> = {
  monochrome: {
    files: 'from-zinc-200 via-zinc-400 to-zinc-600',
    terminal: 'from-white via-zinc-300 to-zinc-600',
    notes: 'from-zinc-100 via-zinc-300 to-zinc-500',
    tasks: 'from-zinc-300 via-zinc-400 to-zinc-600',
    pomodoro: 'from-white via-zinc-200 to-zinc-500',
    music: 'from-zinc-200 via-zinc-400 to-zinc-700',
    ambient: 'from-zinc-300 via-zinc-500 to-zinc-800',
    journal: 'from-zinc-100 via-zinc-300 to-zinc-600',
    habits: 'from-white via-zinc-400 to-zinc-700',
    system: 'from-zinc-200 via-zinc-400 to-zinc-600',
    settings: 'from-zinc-400 via-zinc-600 to-zinc-800',
  },
  cyberpunk: {
    files: 'from-amber-400 to-yellow-500',
    terminal: 'from-emerald-400 to-cyan-400',
    notes: 'from-cyan-400 to-blue-500',
    tasks: 'from-blue-400 to-indigo-500',
    pomodoro: 'from-indigo-400 to-purple-500',
    music: 'from-purple-400 to-pink-500',
    ambient: 'from-pink-400 to-rose-500',
    journal: 'from-emerald-400 to-teal-500',
    habits: 'from-amber-400 to-orange-500',
    system: 'from-rose-400 to-red-500',
    settings: 'from-cyan-400 to-purple-500',
  },
  emerald: {
    files: 'from-emerald-300 to-teal-600',
    terminal: 'from-teal-300 to-emerald-600',
    notes: 'from-emerald-400 to-green-600',
    tasks: 'from-teal-400 to-cyan-600',
    pomodoro: 'from-green-300 to-emerald-600',
    music: 'from-teal-300 to-emerald-700',
    ambient: 'from-emerald-400 to-green-600',
    journal: 'from-green-400 to-teal-500',
    habits: 'from-emerald-300 to-green-600',
    system: 'from-teal-400 to-emerald-800',
    settings: 'from-emerald-400 to-zinc-600',
  },
  solar: {
    files: 'from-amber-300 to-orange-500',
    terminal: 'from-yellow-400 to-amber-600',
    notes: 'from-orange-300 to-amber-500',
    tasks: 'from-amber-400 to-red-500',
    pomodoro: 'from-rose-400 to-orange-500',
    music: 'from-orange-400 to-amber-600',
    ambient: 'from-yellow-300 to-orange-600',
    journal: 'from-amber-400 to-yellow-500',
    habits: 'from-orange-400 to-red-600',
    system: 'from-amber-500 to-rose-600',
    settings: 'from-orange-400 to-zinc-600',
  },
  arctic: {
    files: 'from-sky-200 to-blue-400',
    terminal: 'from-cyan-200 to-sky-400',
    notes: 'from-blue-200 to-indigo-400',
    tasks: 'from-sky-300 to-blue-500',
    pomodoro: 'from-cyan-300 to-blue-400',
    music: 'from-indigo-200 to-sky-400',
    ambient: 'from-blue-300 to-teal-400',
    journal: 'from-sky-200 to-indigo-400',
    habits: 'from-cyan-200 to-blue-500',
    system: 'from-sky-300 to-indigo-500',
    settings: 'from-blue-200 to-zinc-500',
  },
  nebula: {
    files: 'from-purple-300 to-indigo-500',
    terminal: 'from-indigo-300 to-purple-600',
    notes: 'from-fuchsia-300 to-purple-500',
    tasks: 'from-purple-400 to-pink-500',
    pomodoro: 'from-violet-400 to-purple-600',
    music: 'from-purple-400 to-fuchsia-500',
    ambient: 'from-indigo-400 to-violet-600',
    journal: 'from-purple-300 to-indigo-600',
    habits: 'from-fuchsia-400 to-pink-600',
    system: 'from-purple-400 to-violet-700',
    settings: 'from-indigo-400 to-zinc-600',
  },
  custom: {
    files: 'from-zinc-200 via-zinc-400 to-zinc-600',
    terminal: 'from-white via-zinc-300 to-zinc-600',
    notes: 'from-zinc-100 via-zinc-300 to-zinc-500',
    tasks: 'from-zinc-300 via-zinc-400 to-zinc-600',
    pomodoro: 'from-white via-zinc-200 to-zinc-500',
    music: 'from-zinc-200 via-zinc-400 to-zinc-700',
    ambient: 'from-zinc-300 via-zinc-500 to-zinc-800',
    journal: 'from-zinc-100 via-zinc-300 to-zinc-600',
    habits: 'from-white via-zinc-400 to-zinc-700',
    system: 'from-zinc-200 via-zinc-400 to-zinc-600',
    settings: 'from-zinc-400 via-zinc-600 to-zinc-800',
  },
};

export const LiquidDock: React.FC = () => {
  const { windows, openWindow, focusWindow } = useWindowStore();
  const { settings } = useSettingsStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hasActiveWindows = Object.values(windows).some((w) => w.isOpen && !w.isMinimized);
  const shouldAutoHide = settings.dockAutoHide === 'smart' && hasActiveWindows;
  const maxMag = settings.dockMagnification || 1.35;

  const activeTheme = settings.themePreset || 'monochrome';
  const themeGradients = THEME_GRADIENTS[activeTheme] || THEME_GRADIENTS.monochrome;

  const handleAppClick = (id: WindowId) => {
    if (!windows[id]?.isOpen || windows[id]?.isMinimized) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none flex justify-center items-end pb-4 z-40 group/dock overflow-visible">
      <nav
        aria-label="Application Dock"
        role="toolbar"
        className={`pointer-events-auto transition-all duration-300 ease-out select-none overflow-visible ${
          shouldAutoHide
            ? 'translate-y-12 opacity-35 hover:translate-y-0 hover:opacity-100 group-hover/dock:translate-y-0 group-hover/dock:opacity-100'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <LiquidSurface
          material="frosted"
          borderRadius={26}
          contentClassName="flex flex-row flex-nowrap items-end space-x-2 px-3.5 py-2 overflow-visible"
          className="border border-white/20 shadow-2xl backdrop-blur-3xl bg-black/80 overflow-visible"
        >
          {DOCK_ITEMS_DEF.map((item, index) => {
            const isOpen = windows[item.id]?.isOpen;
            const isMinimized = windows[item.id]?.isMinimized;
            const Icon = item.icon;
            const gradient = themeGradients[item.id] || 'from-zinc-200 to-zinc-600';

            // Calculate unclipped fisheye magnification
            let scale = 1;
            let translateY = 0;
            if (hoveredIndex !== null) {
              const distance = Math.abs(hoveredIndex - index);
              if (distance === 0) {
                scale = maxMag;
                translateY = -14;
              } else if (distance === 1) {
                scale = 1 + (maxMag - 1) * 0.55;
                translateY = -7;
              } else if (distance === 2) {
                scale = 1 + (maxMag - 1) * 0.2;
                translateY = -2;
              }
            }

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center group transition-transform duration-150 ease-out flex-shrink-0 overflow-visible"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  transformOrigin: 'bottom center',
                }}
              >
                {/* Floating Tooltip outside bounding box */}
                <div
                  role="tooltip"
                  id={`dock-tooltip-${item.id}`}
                  className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/95 text-zinc-100 text-[11px] font-semibold border border-white/20 shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap z-50 drop-shadow-lg"
                >
                  {item.label}
                </div>

                {/* App Icon Button */}
                <button
                  type="button"
                  onClick={() => handleAppClick(item.id)}
                  aria-label={`Launch ${item.label}`}
                  aria-describedby={`dock-tooltip-${item.id}`}
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center relative transition-all shadow-md bg-gradient-to-br ${gradient} p-[1.5px] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none`}
                >
                  <div className="w-full h-full rounded-[10px] bg-black/75 hover:bg-black/35 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                  </div>
                </button>

                {/* Active / Running Indicator Dot */}
                <div className="h-1.5 flex items-center justify-center mt-1">
                  {isOpen && (
                    <div
                      aria-hidden="true"
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isMinimized
                          ? 'bg-zinc-500'
                          : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.95)]'
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </LiquidSurface>
      </nav>
    </div>
  );
};

