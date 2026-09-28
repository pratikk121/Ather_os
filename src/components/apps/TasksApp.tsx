import React, { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../../types';
import { useProductivityStore } from '../../stores/useProductivityStore';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-slate-500/30' },
  { id: 'today', label: 'Today’s Focus', color: 'border-cyan-500/40' },
  { id: 'in_progress', label: 'In Progress', color: 'border-amber-500/40' },
  { id: 'done', label: 'Completed', color: 'border-emerald-500/40' },
];

const PRIORITY_BADGES: Record<TaskPriority, { label: string; style: string }> = {
  low: { label: 'Low', style: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  medium: { label: 'Medium', style: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  high: { label: 'High', style: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  urgent: { label: 'Urgent', style: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
};

export const TasksApp: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask } = useProductivityStore();
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newEst, setNewEst] = useState(25);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newPriority, newEst);
    setNewTitle('');
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Quick Add Bar */}
      <form onSubmit={handleAddTask} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
          className="px-2 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-300 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex items-center space-x-1 text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <input
            type="number"
            min="5"
            max="240"
            step="5"
            value={newEst}
            onChange={(e) => setNewEst(Number(e.target.value))}
            className="w-10 bg-transparent text-center focus:outline-none text-white text-xs"
          />
          <span>m</span>
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Kanban Board Columns */}
      <div className="flex-1 grid grid-cols-4 gap-2.5 overflow-hidden">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-xl bg-black/20 border ${col.color} p-2.5 overflow-hidden`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">{col.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex flex-col gap-1.5 transition text-left group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className={`text-xs font-medium leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-0.5 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className={`px-1.5 py-0.5 rounded border ${PRIORITY_BADGES[task.priority].style}`}>
                        {PRIORITY_BADGES[task.priority].label}
                      </span>
                      {task.estimateMinutes && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          {task.estimateMinutes}m
                        </span>
                      )}
                    </div>

                    {/* Move Status Controls */}
                    <div className="flex items-center justify-end gap-1 mt-1 pt-1 border-t border-white/5 opacity-80 group-hover:opacity-100">
                      {col.id !== 'backlog' && (
                        <button
                          onClick={() => {
                            const prevStatus: Record<TaskStatus, TaskStatus> = {
                              today: 'backlog',
                              in_progress: 'today',
                              done: 'in_progress',
                              backlog: 'backlog',
                            };
                            updateTaskStatus(task.id, prevStatus[task.status]);
                          }}
                          className="px-1.5 py-0.5 text-[9px] rounded bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          ←
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button
                          onClick={() => {
                            const nextStatus: Record<TaskStatus, TaskStatus> = {
                              backlog: 'today',
                              today: 'in_progress',
                              in_progress: 'done',
                              done: 'done',
                            };
                            updateTaskStatus(task.id, nextStatus[task.status]);
                          }}
                          className="px-1.5 py-0.5 text-[9px] rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-medium"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
