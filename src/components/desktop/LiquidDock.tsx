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
import { WindowId } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';
import { LiquidSurface } from '../glass/LiquidSurface';

interface DockItem {
  id: WindowId;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'files', label: 'Files', icon: Folder, color: 'from-zinc-200 via-zinc-400 to-zinc-600' },
  { id: 'terminal', label: 'Kernel Terminal', icon: Terminal, color: 'from-white via-zinc-300 to-zinc-600' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-zinc-100 via-zinc-300 to-zinc-500' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'from-zinc-300 via-zinc-400 to-zinc-600' },
  { id: 'pomodoro', label: 'Flow Timer', icon: Timer, color: 'from-white via-zinc-200 to-zinc-500' },
  { id: 'music', label: 'AetherPlayer', icon: Music, color: 'from-zinc-200 via-zinc-400 to-zinc-700' },
  { id: 'ambient', label: 'Ambient Mixer', icon: Waves, color: 'from-zinc-300 via-zinc-500 to-zinc-800' },
  { id: 'journal', label: 'Life Journal', icon: BookOpen, color: 'from-zinc-100 via-zinc-300 to-zinc-600' },
  { id: 'habits', label: 'Habit Streaks', icon: Flame, color: 'from-white via-zinc-400 to-zinc-700' },
  { id: 'system', label: 'System', icon: Activity, color: 'from-zinc-200 via-zinc-400 to-zinc-600' },
  { id: 'settings', label: 'Customizer', icon: Sliders, color: 'from-zinc-400 via-zinc-600 to-zinc-800' },
];

export const LiquidDock: React.FC = () => {
  const { windows, openWindow, focusWindow } = useWindowStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hasActiveWindows = Object.values(windows).some((w) => w.isOpen && !w.isMinimized);

  const handleAppClick = (id: WindowId) => {
    if (!windows[id]?.isOpen || windows[id]?.isMinimized) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none flex justify-center items-end pb-3 z-30 group/dock">
      <nav
        aria-label="Application Dock"
        role="toolbar"
        className={`pointer-events-auto transition-all duration-300 ease-out select-none ${
          hasActiveWindows
            ? 'translate-y-11 opacity-40 hover:translate-y-0 hover:opacity-100 group-hover/dock:translate-y-0 group-hover/dock:opacity-100'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <LiquidSurface
          material="frosted"
          borderRadius={24}
          className="px-3 py-1.5 flex flex-row flex-nowrap items-center space-x-1.5 border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/85 max-w-[calc(100vw-32px)] overflow-x-auto no-scrollbar"
        >
          {DOCK_ITEMS.map((item, index) => {
            const isOpen = windows[item.id]?.isOpen;
            const isMinimized = windows[item.id]?.isMinimized;
            const Icon = item.icon;

            // Calculate fisheye magnification
            let scale = 1;
            let translateY = 0;
            if (hoveredIndex !== null) {
              const distance = Math.abs(hoveredIndex - index);
              if (distance === 0) {
                scale = 1.35;
                translateY = -12;
              } else if (distance === 1) {
                scale = 1.18;
                translateY = -6;
              } else if (distance === 2) {
                scale = 1.06;
                translateY = -2;
              }
            }

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center group transition-all duration-150 flex-shrink-0"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  transformOrigin: 'bottom center',
                }}
              >
                {/* Accessible Tooltip */}
                <div
                  role="tooltip"
                  id={`dock-tooltip-${item.id}`}
                  className="absolute -top-9 px-2.5 py-1 rounded-lg bg-black/95 text-zinc-100 text-[11px] font-semibold border border-white/20 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap z-50"
                >
                  {item.label}
                </div>

                {/* App Icon Button */}
                <button
                  type="button"
                  onClick={() => handleAppClick(item.id)}
                  aria-label={`Launch ${item.label}`}
                  aria-describedby={`dock-tooltip-${item.id}`}
                  className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center relative overflow-hidden transition-all shadow-md bg-gradient-to-br ${item.color} p-[1.5px] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none`}
                >
                  <div className="w-full h-full rounded-[9px] bg-black/75 hover:bg-black/40 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                  </div>
                </button>

                {/* Active / Running Indicator Dot */}
                <div className="h-1 flex items-center justify-center mt-1">
                  {isOpen && (
                    <div
                      aria-hidden="true"
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isMinimized
                          ? 'bg-zinc-500'
                          : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]'
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
