import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { useActivityStore } from '../../stores/useActivityStore';
import { GlassStreakRings } from '../charts/GlassStreakRings';

export const HabitTrackerApp: React.FC = () => {
  const { habits, addHabit, toggleHabitCheckin, deleteHabit } = useActivityStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [newIcon, setNewIcon] = useState('⚡');
  const targetPerWeek = 7;

  const todayStr = new Date().toISOString().split('T')[0];

  // Last 7 days for check-in matrix
  const past7Days: { dateStr: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    past7Days.push({
      dateStr: d.toISOString().split('T')[0],
      label: d.toLocaleDateString([], { weekday: 'narrow' }),
    });
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newIcon, targetPerWeek);
    setNewHabitName('');
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Top Streak Rings */}
      <GlassStreakRings habits={habits} />

      {/* Add New Habit Form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
        <input
          type="text"
          placeholder="New habit (e.g. Read 20 pages, Stretch)..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-1 px-2.5 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />

        <select
          value={newIcon}
          onChange={(e) => setNewIcon(e.target.value)}
          className="px-2 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
        >
          <option value="⚡">⚡ Energy</option>
          <option value="📖">📖 Reading</option>
          <option value="🧘">🧘 Mindfulness</option>
          <option value="💻">💻 Code Flow</option>
          <option value="💧">💧 Water</option>
          <option value="🏃">🏃 Run</option>
          <option value="🥗">🥗 Health</option>
        </select>

        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Habits 7-Day Checklist Matrix */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
          <span>Habit</span>
          <div className="flex items-center gap-2 pr-2">
            {past7Days.map((d) => (
              <span key={d.dateStr} className="w-6 text-center text-[10px] uppercase">
                {d.label}
              </span>
            ))}
          </div>
        </div>

        {habits.map((habit) => {
          return (
            <div
              key={habit.id}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between transition group"
            >
              {/* Left Habit Info */}
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{habit.icon}</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">{habit.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-amber-400 font-mono">
                      🔥 {habit.streak} day streak
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-day checkboxes */}
              <div className="flex items-center gap-2">
                {past7Days.map((d) => {
                  const done = habit.completedDates.includes(d.dateStr);
                  const isToday = d.dateStr === todayStr;

                  return (
                    <button
                      key={d.dateStr}
                      onClick={() => toggleHabitCheckin(habit.id, d.dateStr)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                        done
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : isToday
                          ? 'border border-amber-500/50 hover:bg-amber-500/20 text-transparent'
                          : 'bg-white/5 hover:bg-white/10 text-transparent'
                      }`}
                      title={d.dateStr}
                    >
                      <Check className={`w-3.5 h-3.5 stroke-[3] ${done ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  );
                })}

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 ml-1 transition"
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
