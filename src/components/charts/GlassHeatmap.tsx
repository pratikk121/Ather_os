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
    if (minutes === 0) return 'bg-surface-interactive/30 border-border-subtle text-content-muted';
    if (minutes < 30) return 'bg-accent-soft border-border-default text-content-secondary';
    if (minutes < 60) return 'bg-accent-primary/40 border-accent-primary/50 text-content-primary';
    if (minutes < 120) return 'bg-accent-primary/75 border-accent-primary text-accent-contrast font-semibold';
    return 'bg-accent-primary text-accent-contrast font-bold border-accent-primary shadow-[0_0_8px_var(--aether-accent-primary)]';
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-surface-interactive/40 border border-border-subtle">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-content-primary">28-Day Activity Matrix</span>
        <span className="text-[10px] text-content-muted">Online & Offline Activity</span>
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
            <div className="absolute -top-8 px-2 py-1 rounded bg-surface-elevated text-content-primary text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 border border-border-default shadow-lg">
              {day.label}: {day.minutes} mins ({day.count} sessions)
            </div>
            <span className="text-[9px] font-mono text-content-muted leading-none">
              {day.minutes > 0 ? `${day.minutes}m` : '·'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-content-muted pt-1">
        <span>Less active</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-surface-interactive border border-border-subtle" />
          <div className="w-2.5 h-2.5 rounded bg-accent-soft border border-border-default" />
          <div className="w-2.5 h-2.5 rounded bg-accent-primary/40 border border-accent-primary/50" />
          <div className="w-2.5 h-2.5 rounded bg-accent-primary/75 border border-accent-primary" />
          <div className="w-2.5 h-2.5 rounded bg-accent-primary border border-accent-primary" />
        </div>
        <span>More active</span>
      </div>
    </div>
  );
};
