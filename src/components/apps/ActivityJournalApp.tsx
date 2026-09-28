import React, { useState } from 'react';
import { Trash2, Globe, Coffee, Dumbbell, BookOpen, Code, Sparkles } from 'lucide-react';
import { ActivityCategory } from '../../types';
import { useActivityStore } from '../../stores/useActivityStore';
import { GlassHeatmap } from '../charts/GlassHeatmap';

const CATEGORY_META: Record<
  ActivityCategory,
  { label: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  coding: { label: 'Coding / Building', icon: Code, color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
  productivity: { label: 'Productivity', icon: Sparkles, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30' },
  reading: { label: 'Deep Reading', icon: BookOpen, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  fitness: { label: 'Workout / Fitness', icon: Dumbbell, color: 'text-rose-400 bg-rose-500/20 border-rose-500/30' },
  mindfulness: { label: 'Mindfulness', icon: Coffee, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
  social: { label: 'Social & Offline', icon: Globe, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
  sleep: { label: 'Rest & Recovery', icon: Coffee, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
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
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* 28-day Activity Matrix */}
      <GlassHeatmap activities={activities} />

      {/* Log New Activity Section */}
      <form onSubmit={handleLog} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200">Log Activity</span>
          <span className="text-[10px] text-cyan-300 font-mono">
            Today: {Math.floor(totalMinutesToday / 60)}h {totalMinutesToday % 60}m
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="What did you work on or do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            className="px-2 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
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
              className="px-2 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
            >
              <option value="online">🌐 Online</option>
              <option value="offline">🌲 Offline</option>
            </select>

            <div className="flex items-center bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-xs">
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-10 bg-transparent text-center focus:outline-none text-white text-xs"
              />
              <span className="text-slate-400 text-[10px]">m</span>
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/40 text-xs font-semibold transition"
            >
              Log
            </button>
          </div>
        </div>
      </form>

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <span className="text-xs font-semibold text-slate-300 px-1">Recent Timeline</span>
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
              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg border ${meta.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-medium text-white">{act.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-400">
                      {act.type}
                    </span>
                  </div>
                  {act.notes && <p className="text-[10px] text-slate-400 mt-0.5">{act.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-cyan-300">
                    {act.durationMinutes}m
                  </span>
                  <p className="text-[10px] text-slate-500">{dateFormatted}</p>
                </div>
                <button
                  onClick={() => deleteActivity(act.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
