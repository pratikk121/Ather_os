import React from 'react';
import { ActivityEntry } from '../../types';

interface GlassHeatmapProps {
  activities: ActivityEntry[];
}

export const GlassHeatmap: React.FC<GlassHeatmapProps> = ({ activities }) => {
  // Generate last 28 days
  const days: { dateStr: string; label: string; count: number; minutes: number }[] = [];
  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayActivities = activities.filter(
      (a) => new Date(a.timestamp).toISOString().split('T')[0] === dateStr
    );
    const totalMinutes = dayActivities.reduce((sum, a) => sum + a.durationMinutes, 0);

    days.push({
      dateStr,
      label: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      count: dayActivities.length,
      minutes: totalMinutes,
    });
  }

  const getColor = (minutes: number) => {
    if (minutes === 0) return 'bg-white/5 border-white/5';
    if (minutes < 30) return 'bg-cyan-500/20 border-cyan-500/30';
    if (minutes < 60) return 'bg-cyan-500/40 border-cyan-500/50';
    if (minutes < 120) return 'bg-indigo-500/60 border-indigo-500/70';
    return 'bg-purple-500/80 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]';
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-200">28-Day Activity Matrix</span>
        <span className="text-[10px] text-slate-400">Online & Offline Activity</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className={`aspect-square rounded-md border flex flex-col items-center justify-center p-1 transition hover:scale-105 group relative ${getColor(
              day.minutes
            )}`}
          >
            {/* Tooltip */}
            <div className="absolute -top-8 px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 border border-white/10 shadow-lg">
              {day.label}: {day.minutes} mins ({day.count} sessions)
            </div>
            <span className="text-[9px] font-mono text-slate-300/80">
              {day.minutes > 0 ? `${day.minutes}m` : '·'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
        <span>Less active</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-white/5 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded bg-cyan-500/20 border border-cyan-500/30" />
          <div className="w-2.5 h-2.5 rounded bg-cyan-500/40 border border-cyan-500/50" />
          <div className="w-2.5 h-2.5 rounded bg-indigo-500/60 border border-indigo-500/70" />
          <div className="w-2.5 h-2.5 rounded bg-purple-500/80 border border-purple-400" />
        </div>
        <span>More active</span>
      </div>
    </div>
  );
};
