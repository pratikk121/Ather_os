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
  notes: 'from-zinc-100 via-zinc-300 to-zinc-500',
  tasks: 'from-zinc-300 via-zinc-400 to-zinc-600',
  pomodoro: 'from-white via-zinc-200 to-zinc-500',
  music: 'from-zinc-200 via-zinc-400 to-zinc-700',
  ambient: 'from-zinc-300 via-zinc-500 to-zinc-800',
  journal: 'from-zinc-100 via-zinc-300 to-zinc-600',
  habits: 'from-white via-zinc-400 to-zinc-700',
  system: 'from-zinc-200 via-zinc-400 to-zinc-600',
  settings: 'from-zinc-400 via-zinc-600 to-zinc-800',
  terminal: 'from-white via-zinc-300 to-zinc-600',
  files: 'from-zinc-200 via-zinc-400 to-zinc-600',
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
  const gradient = ICON_GRADIENTS[iconType] || 'from-zinc-200 to-zinc-600';

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
