import React, { useState } from 'react';
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
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-cyan-400 to-blue-500' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'from-blue-400 to-indigo-500' },
  { id: 'pomodoro', label: 'Flow Timer', icon: Timer, color: 'from-indigo-400 to-purple-500' },
  { id: 'music', label: 'AetherPlayer', icon: Music, color: 'from-purple-400 to-pink-500' },
  { id: 'ambient', label: 'Ambient Mixer', icon: Waves, color: 'from-pink-400 to-rose-500' },
  { id: 'journal', label: 'Life Journal', icon: BookOpen, color: 'from-emerald-400 to-teal-500' },
  { id: 'habits', label: 'Habit Streaks', icon: Flame, color: 'from-amber-400 to-orange-500' },
  { id: 'system', label: 'System', icon: Activity, color: 'from-rose-400 to-red-500' },
  { id: 'settings', label: 'Customizer', icon: Sliders, color: 'from-slate-400 to-zinc-500' },
];

export const LiquidDock: React.FC = () => {
  const { windows, openWindow, focusWindow } = useWindowStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleAppClick = (id: WindowId) => {
    if (!windows[id].isOpen || windows[id].isMinimized) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-end">
      <LiquidSurface
        material="frosted"
        borderRadius={24}
        className="px-4 py-2 flex items-end space-x-2 border border-white/20 shadow-2xl backdrop-blur-2xl bg-slate-950/60"
      >
        {DOCK_ITEMS.map((item, index) => {
          const isOpen = windows[item.id].isOpen;
          const isMinimized = windows[item.id].isMinimized;
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
              className="relative flex flex-col items-center group transition-all duration-150"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Tooltip */}
              <div className="absolute -top-9 px-2 py-1 rounded-md bg-slate-900/90 text-slate-100 text-[10px] font-semibold border border-white/10 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>

              {/* App Icon Button */}
              <button
                onClick={() => handleAppClick(item.id)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden transition-all shadow-md bg-gradient-to-br ${item.color} p-[1px]`}
              >
                <div className="w-full h-full rounded-[11px] bg-slate-950/70 hover:bg-slate-950/40 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
              </button>

              {/* Active / Running Indicator Dot */}
              <div className="h-1 flex items-center justify-center mt-1">
                {isOpen && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isMinimized
                        ? 'bg-slate-500'
                        : 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]'
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </LiquidSurface>
    </div>
  );
};
