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
import { WindowId } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';

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

const ICON_GRADIENTS = {
  notes: 'from-cyan-400 to-blue-500',
  tasks: 'from-blue-400 to-indigo-500',
  pomodoro: 'from-indigo-400 to-purple-500',
  music: 'from-purple-400 to-pink-500',
  ambient: 'from-pink-400 to-rose-500',
  journal: 'from-emerald-400 to-teal-500',
  habits: 'from-amber-400 to-orange-500',
  system: 'from-rose-400 to-red-500',
  settings: 'from-slate-400 to-zinc-500',
  terminal: 'from-emerald-500 to-cyan-500',
  files: 'from-amber-400 to-yellow-500',
};

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  label,
  iconType,
  isSelected,
  onSelect,
}) => {
  const { openWindow, focusWindow, windows } = useWindowStore();
  const Icon = ICON_MAP[iconType] || FileText;
  const gradient = ICON_GRADIENTS[iconType] || 'from-cyan-400 to-blue-500';

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
      className={`w-20 p-2 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer select-none transition-all duration-150 group ${
        isSelected
          ? 'bg-cyan-500/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md'
          : 'hover:bg-white/[0.06] border border-transparent'
      }`}
    >
      {/* Refractive Glass Icon Badge */}
      <div
        className={`w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-150 group-hover:scale-105 group-active:scale-95`}
      >
        <div className="w-full h-full rounded-[14px] bg-slate-950/75 backdrop-blur-md flex items-center justify-center">
          <Icon className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
        </div>
      </div>

      {/* Label with Shadow & High Contrast */}
      <span className="text-[11px] font-semibold text-white text-center leading-tight tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-w-full truncate px-1 rounded bg-slate-950/30">
        {label}
      </span>
    </div>
  );
};
