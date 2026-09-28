import React from 'react';
import {
  FileText,
  CheckSquare,
  Timer,
  Music,
  Waves,
  BookOpen,
  Flame,
  Activity,
  Sliders,
  Terminal,
  Folder,
} from 'lucide-react';
import { WindowId, ThemePreset } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface DesktopIconProps {
  id: WindowId;
  label: string;
  iconType: 'notes' | 'tasks' | 'pomodoro' | 'music' | 'ambient' | 'journal' | 'habits' | 'system' | 'settings' | 'terminal' | 'files';
  isSelected: boolean;
  onSelect: (id: WindowId) => void;
}

const ICON_MAP = {
  notes: FileText,
  tasks: CheckSquare,
  pomodoro: Timer,
  music: Music,
  ambient: Waves,
  journal: BookOpen,
  habits: Flame,
  system: Activity,
  settings: Sliders,
  terminal: Terminal,
  files: Folder,
};

const THEME_GRADIENTS: Record<ThemePreset, Record<string, string>> = {
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
    settings: 'from-zinc-300 via-zinc-500 to-zinc-700',
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
    settings: 'from-zinc-300 via-zinc-500 to-zinc-700',
  },
};

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  label,
  iconType,
  isSelected,
  onSelect,
}) => {
  const { openWindow, focusWindow, windows } = useWindowStore();
  const { settings } = useSettingsStore();
  const Icon = ICON_MAP[iconType] || FileText;

  const activeTheme = settings.themePreset || 'monochrome';
  const themeGradients = THEME_GRADIENTS[activeTheme] || THEME_GRADIENTS.monochrome;
  const gradient = themeGradients[iconType] || 'from-zinc-200 to-zinc-600';

  const handleDoubleClick = () => {
    if (!windows[id]?.isOpen || windows[id]?.isMinimized) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleDoubleClick();
      }}
      aria-label={`Desktop shortcut: ${label}`}
      className={`w-16 p-1.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer select-none transition-all duration-150 group ${
        isSelected
          ? 'bg-white/15 border border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.25)] backdrop-blur-md'
          : 'hover:bg-white/[0.06] border border-transparent'
      }`}
    >
      {/* Refractive Glass Icon Badge */}
      <div
        className={`w-10 h-10 rounded-xl p-[1.5px] bg-gradient-to-br ${gradient} shadow-md transition-transform duration-150 group-hover:scale-105 group-active:scale-95`}
      >
        <div className="w-full h-full rounded-[10px] bg-black/75 backdrop-blur-md flex items-center justify-center">
          <Icon className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
        </div>
      </div>

      {/* Label with Shadow & High Contrast */}
      <span className="text-[10px] font-medium text-white text-center leading-tight tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-w-full truncate px-1 rounded bg-black/40">
        {label}
      </span>
    </div>
  );
};
