import React, { useState } from 'react';
import { Plus, Trash2, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../../types';
import { useProductivityStore } from '../../stores/useProductivityStore';

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-slate-500/40', bg: 'bg-slate-900/30' },
  { id: 'today', label: 'Today’s Focus', color: 'border-cyan-500/50', bg: 'bg-cyan-950/20' },
  { id: 'in_progress', label: 'In Progress', color: 'border-amber-500/50', bg: 'bg-amber-950/20' },
  { id: 'done', label: 'Completed', color: 'border-emerald-500/50', bg: 'bg-emerald-950/20' },
];

const PRIORITY_BADGES: Record<TaskPriority, { label: string; style: string }> = {
  low: { label: 'Low', style: 'bg-slate-600/30 text-slate-200 border-slate-500/40' },
  medium: { label: 'Medium', style: 'bg-blue-600/30 text-blue-200 border-blue-500/40' },
  high: { label: 'High', style: 'bg-amber-600/30 text-amber-200 border-amber-500/50' },
  urgent: { label: 'Urgent', style: 'bg-rose-600/30 text-rose-200 border-rose-500/50' },
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
      <form onSubmit={handleAddTask} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10">
        <input
          type="text"
          aria-label="New task title"
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs bg-white/10 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <select
          aria-label="Task priority"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
          className="px-2.5 py-1.5 text-xs bg-slate-900 border border-white/15 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent Priority</option>
        </select>
        <div className="flex items-center space-x-1 text-xs text-slate-300 bg-white/10 border border-white/15 px-2.5 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
          <input
            type="number"
            aria-label="Estimated minutes"
            min="5"
            max="240"
            step="5"
            value={newEst}
            onChange={(e) => setNewEst(Number(e.target.value))}
            className="w-10 bg-transparent text-center focus:outline-none text-white text-xs font-semibold"
          />
          <span>m</span>
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-100 border border-cyan-400/50 text-xs font-bold flex items-center gap-1.5 transition shadow-sm focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Kanban Board Columns */}
      <div className="flex-1 grid grid-cols-4 gap-3 overflow-hidden">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              role="region"
              aria-label={`${col.label} column`}
              className={`flex flex-col rounded-xl border ${col.color} ${col.bg} p-2.5 overflow-hidden shadow-inner`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-100">{col.label}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-slate-200 font-semibold">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div role="list" className="flex-1 overflow-y-auto space-y-2 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-20 flex items-center justify-center text-[11px] text-slate-400/70 border border-dashed border-white/10 rounded-lg">
                    No tasks here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      role="listitem"
                      className="p-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 flex flex-col gap-1.5 transition text-left group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className={`text-xs font-semibold leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {task.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          aria-label={`Delete task: ${task.title}`}
                          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-slate-400 hover:text-rose-400 p-1 rounded transition focus-visible:ring-1 focus-visible:ring-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 mt-1">
                        <span className={`px-2 py-0.5 rounded font-medium border ${PRIORITY_BADGES[task.priority].style}`}>
                          {PRIORITY_BADGES[task.priority].label}
                        </span>
                        {task.estimateMinutes && (
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.estimateMinutes}m
                          </span>
                        )}
                      </div>

                      {/* Move Status Controls */}
                      <div className="flex items-center justify-end gap-1.5 mt-1.5 pt-1.5 border-t border-white/10">
                        {col.id !== 'backlog' && (
                          <button
                            type="button"
                            onClick={() => {
                              const prevStatus: Record<TaskStatus, TaskStatus> = {
                                today: 'backlog',
                                in_progress: 'today',
                                done: 'in_progress',
                                backlog: 'backlog',
                              };
                              updateTaskStatus(task.id, prevStatus[task.status]);
                            }}
                            aria-label={`Move ${task.title} to previous column`}
                            className="px-2 py-1 text-[10px] rounded bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 transition"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus: Record<TaskStatus, TaskStatus> = {
                                backlog: 'today',
                                today: 'in_progress',
                                in_progress: 'done',
                                done: 'done',
                              };
                              updateTaskStatus(task.id, nextStatus[task.status]);
                            }}
                            aria-label={`Move ${task.title} to next column`}
                            className="px-2 py-1 text-[10px] rounded bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-200 font-semibold flex items-center gap-1 transition border border-cyan-500/30"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
