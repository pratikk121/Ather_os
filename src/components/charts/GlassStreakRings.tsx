import React from 'react';
import { Habit } from '../../types';

interface GlassStreakRingsProps {
  habits: Habit[];
}

export const GlassStreakRings: React.FC<GlassStreakRingsProps> = ({ habits }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {habits.map((habit) => {
        const weeklyCompleted = habit.completedDates.filter((d) => {
          const past7 = new Date();
          past7.setDate(past7.getDate() - 7);
          return new Date(d) >= past7;
        }).length;

        const targetPercent = Math.min(100, Math.round((weeklyCompleted / habit.targetPerWeek) * 100));

        return (
          <div
            key={habit.id}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center gap-1.5"
          >
            {/* Circular Progress */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-white/10"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-amber-400 transition-all duration-700"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - targetPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm">{habit.icon}</span>
            </div>

            <span className="text-[11px] font-semibold text-slate-200 truncate max-w-full">
              {habit.name}
            </span>

            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
              <span>🔥 {habit.streak}d streak</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
