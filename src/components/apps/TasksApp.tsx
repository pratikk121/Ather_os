import React, { useState } from 'react';
import { Plus, Trash2, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../../types';
import { useProductivityStore } from '../../stores/useProductivityStore';

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'today', label: 'Today’s Focus' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Completed' },
];

const PRIORITY_BADGES: Record<TaskPriority, { label: string; style: string }> = {
  low: { label: 'Low', style: 'bg-surface-interactive text-content-secondary border-border-subtle' },
  medium: { label: 'Medium', style: 'bg-status-info/20 text-status-info border-status-info/40' },
  high: { label: 'High', style: 'bg-status-warning/20 text-status-warning border-status-warning/40' },
  urgent: { label: 'Urgent', style: 'bg-status-error/20 text-status-error border-status-error/40' },
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
    <div className="flex flex-col h-full gap-3 text-content-primary">
      {/* Quick Add Bar */}
      <form onSubmit={handleAddTask} className="flex items-center gap-2 p-2 rounded-xl bg-surface-interactive/40 border border-border-subtle">
        <input
          type="text"
          aria-label="New task title"
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs bg-surface-interactive border border-border-subtle rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:border-accent-primary"
        />
        <select
          aria-label="Task priority"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
          className="px-2.5 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent-primary"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent Priority</option>
        </select>
        <div className="flex items-center space-x-1 text-xs text-content-secondary bg-surface-interactive border border-border-subtle px-2.5 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-accent-primary" aria-hidden="true" />
          <input
            type="number"
            aria-label="Estimated minutes"
            min="5"
            max="240"
            step="5"
            value={newEst}
            onChange={(e) => setNewEst(Number(e.target.value))}
            className="w-10 bg-transparent text-center focus:outline-none text-content-primary text-xs font-semibold"
          />
          <span>m</span>
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-accent-soft hover:bg-accent-primary/25 text-accent-primary border border-accent-primary/40 text-xs font-bold flex items-center gap-1.5 transition shadow-sm focus-visible:ring-2 focus-visible:ring-accent-primary"
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
              className="flex flex-col rounded-xl border border-border-subtle bg-surface-interactive/30 p-2.5 overflow-hidden shadow-inner"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-content-primary">{col.label}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-interactive text-content-secondary font-semibold">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div role="list" className="flex-1 overflow-y-auto space-y-2 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-20 flex items-center justify-center text-[11px] text-content-muted border border-dashed border-border-subtle rounded-lg">
                    No tasks here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      role="listitem"
                      className="p-3 rounded-lg bg-surface-interactive/50 hover:bg-surface-interactive border border-border-subtle flex flex-col gap-1.5 transition text-left group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className={`text-xs font-semibold leading-snug ${task.status === 'done' ? 'line-through text-content-muted' : 'text-content-primary'}`}>
                          {task.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          aria-label={`Delete task: ${task.title}`}
                          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-content-muted hover:text-status-error p-1 rounded transition focus-visible:ring-1 focus-visible:ring-status-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-content-secondary mt-1">
                        <span className={`px-2 py-0.5 rounded font-medium border ${PRIORITY_BADGES[task.priority].style}`}>
                          {PRIORITY_BADGES[task.priority].label}
                        </span>
                        {task.estimateMinutes && (
                          <span className="flex items-center gap-1 font-mono text-content-muted">
                            <Clock className="w-3 h-3 text-content-muted" />
                            {task.estimateMinutes}m
                          </span>
                        )}
                      </div>

                      {/* Move Status Controls */}
                      <div className="flex items-center justify-end gap-1.5 mt-1.5 pt-1.5 border-t border-border-subtle">
                        {col.id !== 'backlog' && (
                          <button
                            type="button"
                            onClick={() => {
                              const prevMap: Record<TaskStatus, TaskStatus> = {
                                backlog: 'backlog',
                                today: 'backlog',
                                in_progress: 'today',
                                done: 'in_progress',
                              };
                              updateTaskStatus(task.id, prevMap[task.status]);
                            }}
                            aria-label={`Move ${task.title} left`}
                            className="p-1 rounded hover:bg-surface-selected text-content-muted hover:text-content-primary transition"
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextMap: Record<TaskStatus, TaskStatus> = {
                                backlog: 'today',
                                today: 'in_progress',
                                in_progress: 'done',
                                done: 'done',
                              };
                              updateTaskStatus(task.id, nextMap[task.status]);
                            }}
                            aria-label={`Move ${task.title} right`}
                            className="p-1 rounded hover:bg-surface-selected text-content-muted hover:text-content-primary transition"
                            title="Move Right"
                          >
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
