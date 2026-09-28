import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { useActivityStore, getLocalDateStr } from '../../stores/useActivityStore';
import { GlassStreakRings } from '../charts/GlassStreakRings';

export const HabitTrackerApp: React.FC = () => {
  const { habits, addHabit, toggleHabitCheckin, deleteHabit } = useActivityStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [newIcon, setNewIcon] = useState('⚡');
  const targetPerWeek = 7;

  const today = new Date();
  const todayStr = getLocalDateStr(today);

  // 7-day chronological sequence ending on today
  const past7Days = Array.from({ length: 7 }, (_, idx) => {
    const daysAgo = 6 - idx; // 6 days ago -> today
    const d = new Date();
    d.setDate(today.getDate() - daysAgo);
    const dateStr = getLocalDateStr(d);
    const isToday = dateStr === todayStr;
    const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. Mon, Tue, Wed
    const dayNum = d.getDate();
    const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return {
      dateStr,
      shortDay,
      dayNum,
      isToday,
      fullDate,
    };
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newIcon, targetPerWeek);
    setNewHabitName('');
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100 select-none">
      {/* Top Streak Rings */}
      <GlassStreakRings habits={habits} />

      {/* Add New Habit Form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
        <input
          type="text"
          placeholder="New habit (e.g. Read 20 pages, Stretch, Gym)..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-1 px-2.5 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
        />

        <select
          value={newIcon}
          onChange={(e) => setNewIcon(e.target.value)}
          className="px-2 py-1.5 text-xs bg-zinc-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
        >
          <option value="⚡">⚡ Energy</option>
          <option value="📖">📖 Reading</option>
          <option value="🧘">🧘 Mindfulness</option>
          <option value="💻">💻 Code Flow</option>
          <option value="💧">💧 Water</option>
          <option value="🏃">🏃 Workout</option>
          <option value="🥗">🥗 Nutrition</option>
        </select>

        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1 transition shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Habit</span>
        </button>
      </form>

      {/* Habits 7-Day Checklist Matrix */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {/* Table Column Header */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-semibold text-zinc-400">
          <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">Habit Name & Streaks</span>
          <div className="flex items-center gap-1.5">
            {past7Days.map((d) => (
              <div
                key={d.dateStr}
                className={`w-7 flex flex-col items-center justify-center rounded-lg py-0.5 transition ${
                  d.isToday
                    ? 'bg-amber-400/20 border border-amber-400/60 text-amber-300 font-bold'
                    : 'text-zinc-400'
                }`}
                title={d.fullDate}
              >
                <span className="text-[9px] font-semibold uppercase">{d.shortDay.slice(0, 2)}</span>
                <span className="text-[10px] font-mono leading-none">{d.dayNum}</span>
              </div>
            ))}
            {/* Header spacer aligned with delete action button */}
            <div className="w-6 ml-1" aria-hidden="true" />
          </div>
        </div>

        {/* Habit Rows */}
        {habits.map((habit) => {
          return (
            <div
              key={habit.id}
              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between transition group"
            >
              {/* Left Habit Info */}
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="text-xl flex-shrink-0">{habit.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{habit.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-amber-400 font-mono font-semibold">
                      🔥 {habit.streak}d streak
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      • {habit.completedDates.length} total
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-day checkboxes with pixel-perfect alignment */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {past7Days.map((d) => {
                  const done = habit.completedDates.includes(d.dateStr);

                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => toggleHabitCheckin(habit.id, d.dateStr)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        done
                          ? 'bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(251,191,36,0.5)] scale-100'
                          : d.isToday
                          ? 'border border-amber-400/60 hover:bg-amber-400/20 text-transparent hover:border-amber-300'
                          : 'bg-white/5 hover:bg-white/15 border border-white/10 text-transparent'
                      }`}
                      title={`${habit.name} - ${d.fullDate}: ${done ? 'Completed' : 'Not completed'}`}
                    >
                      <Check className={`w-3.5 h-3.5 stroke-[3] transition-opacity ${done ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => deleteHabit(habit.id)}
                  className="w-6 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 ml-1 transition rounded-lg hover:bg-white/5"
                  title="Delete Habit"
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
