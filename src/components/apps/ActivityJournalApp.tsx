import React, { useState } from 'react';
import { Trash2, Globe, Coffee, Dumbbell, BookOpen, Code, Sparkles } from 'lucide-react';
import { ActivityCategory } from '../../types';
import { useActivityStore } from '../../stores/useActivityStore';
import { GlassHeatmap } from '../charts/GlassHeatmap';

const CATEGORY_META: Record<
  ActivityCategory,
  { label: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  coding: { label: 'Coding / Building', icon: Code, color: 'text-accent-primary bg-accent-soft border-accent-primary/40' },
  productivity: { label: 'Productivity', icon: Sparkles, color: 'text-accent-secondary bg-surface-interactive border-border-subtle' },
  reading: { label: 'Deep Reading', icon: BookOpen, color: 'text-status-success bg-status-success/20 border-status-success/30' },
  fitness: { label: 'Workout / Fitness', icon: Dumbbell, color: 'text-status-error bg-status-error/20 border-status-error/30' },
  mindfulness: { label: 'Mindfulness', icon: Coffee, color: 'text-status-warning bg-status-warning/20 border-status-warning/30' },
  social: { label: 'Social & Offline', icon: Globe, color: 'text-status-info bg-status-info/20 border-status-info/30' },
  sleep: { label: 'Rest & Recovery', icon: Coffee, color: 'text-accent-secondary bg-surface-interactive border-border-subtle' },
};

export const ActivityJournalApp: React.FC = () => {
  const { activities, addActivity, deleteActivity } = useActivityStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('coding');
  const [type, setType] = useState<'online' | 'offline'>('online');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [notes, setNotes] = useState('');

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addActivity({
      title: title.trim(),
      category,
      type,
      durationMinutes,
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setNotes('');
  };

  const totalMinutesToday = activities
    .filter(
      (a) =>
        new Date(a.timestamp).toISOString().split('T')[0] ===
        new Date().toISOString().split('T')[0]
    )
    .reduce((sum, a) => sum + a.durationMinutes, 0);

  return (
    <div className="flex flex-col h-full gap-3 text-content-primary">
      {/* 28-day Activity Matrix */}
      <GlassHeatmap activities={activities} />

      {/* Log New Activity Section */}
      <form onSubmit={handleLog} className="p-3 rounded-xl bg-surface-interactive/40 border border-border-subtle flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-content-primary">Log Activity</span>
          <span className="text-[10px] text-accent-primary font-mono">
            Today: {Math.floor(totalMinutesToday / 60)}h {totalMinutesToday % 60}m
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="What did you work on or do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-surface-interactive border border-border-subtle rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:border-accent-primary"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            className="px-2 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent-primary"
          >
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'online' | 'offline')}
              className="px-2 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-lg text-content-primary focus:outline-none"
            >
              <option value="online">🌐 Online</option>
              <option value="offline">🌲 Offline</option>
            </select>

            <div className="flex items-center bg-surface-interactive border border-border-subtle px-2 py-1 rounded-lg text-xs">
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-10 bg-transparent text-center focus:outline-none text-content-primary text-xs"
              />
              <span className="text-content-muted text-[10px]">m</span>
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-accent-soft hover:bg-accent-primary/25 text-accent-primary border border-accent-primary/40 text-xs font-semibold transition"
            >
              Log
            </button>
          </div>
        </div>
      </form>

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <span className="text-xs font-semibold text-content-secondary px-1">Recent Timeline</span>
        {activities.map((act) => {
          const meta = CATEGORY_META[act.category] || CATEGORY_META.coding;
          const Icon = meta.icon;
          const dateFormatted = new Date(act.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={act.id}
              className="p-2.5 rounded-xl bg-surface-interactive/30 hover:bg-surface-interactive/60 border border-border-subtle flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg border ${meta.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-medium text-content-primary">{act.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-interactive text-content-muted border border-border-subtle">
                      {act.type}
                    </span>
                  </div>
                  {act.notes && <p className="text-[10px] text-content-muted mt-0.5">{act.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-content-primary">
                    {act.durationMinutes}m
                  </span>
                  <span className="block text-[10px] text-content-muted font-mono">{dateFormatted}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteActivity(act.id)}
                  aria-label={`Delete activity: ${act.title}`}
                  className="opacity-0 group-hover:opacity-100 text-content-muted hover:text-status-error p-1 rounded transition focus-visible:ring-1 focus-visible:ring-status-error"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
