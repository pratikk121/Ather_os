import React from 'react';
import { Habit } from '../../types';
import { getLocalDateStr } from '../../stores/useActivityStore';

interface GlassStreakRingsProps {
  habits: Habit[];
}

export const GlassStreakRings: React.FC<GlassStreakRingsProps> = ({ habits }) => {
  const today = new Date();
  const past7Dates = new Set(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return getLocalDateStr(d);
    })
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {habits.map((habit) => {
        const weeklyCompleted = habit.completedDates.filter((d) => past7Dates.has(d)).length;
        const targetPercent = Math.min(100, Math.round((weeklyCompleted / habit.targetPerWeek) * 100));

        return (
          <div
            key={habit.id}
            className="p-2.5 rounded-xl bg-surface-interactive/40 border border-border-subtle flex flex-col items-center text-center gap-1.5"
          >
            {/* Circular Progress */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-surface-interactive"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-current text-accent-primary transition-all duration-700"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - targetPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm">{habit.icon}</span>
            </div>

            <span className="text-[11px] font-semibold text-content-primary truncate max-w-full">
              {habit.name}
            </span>

            <div className="flex items-center gap-1 text-[10px] text-accent-primary font-mono font-semibold">
              <span>🔥 {habit.streak}d streak</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
