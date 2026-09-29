import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, TaskItem, PomodoroState, TaskStatus } from '../types';

interface ProductivityStoreState {
  notes: Note[];
  activeNoteId: string | null;
  tasks: TaskItem[];
  pomodoro: PomodoroState;

  // Notes actions
  addNote: (title?: string, content?: string) => string;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'tags'>>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;

  // Tasks actions
  addTask: (title: string, priority?: TaskItem['priority'], estimateMinutes?: number) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  // Pomodoro actions
  setPomodoroMode: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
  setPomodoroRunning: (isRunning: boolean) => void;
  tickPomodoro: () => void;
  resetPomodoro: () => void;

  // Backup / Restore
  restoreProductivityState: (state: { notes?: Note[]; tasks?: TaskItem[] }) => void;
}

const INITIAL_NOTES: Note[] = [
  {
    id: 'welcome-note',
    title: '✨ Welcome to AetherOS',
    content: `# Welcome to AetherOS

Your ambient liquid glass personal life-hub.

### Key Features:
- **Liquid Glass Interface**: SVG displacement refraction, chromatic rims, and spring physics powered by \`quick-liquid\`.
- **FocusDesk**: Live markdown notes and Kanban task boards.
- **AetherPlayer**: Local audio streaming and procedural ambient soundscape generator.
- **LifeMetrics**: Track your online flow states and offline habits.
- **Universal Launcher**: Press \`Cmd+K\` or \`Ctrl+K\` to open anything instantly.
`,
    tags: ['welcome', 'guide'],
    updatedAt: Date.now(),
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Explore Liquid Glass Desktop',
    status: 'today',
    priority: 'high',
    estimateMinutes: 15,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'Configure Ambient Soundscape Mixer',
    status: 'today',
    priority: 'medium',
    estimateMinutes: 10,
    createdAt: Date.now() - 2400000,
  },
  {
    id: 'task-3',
    title: 'Log Today’s Offline Habits (Workout & Reading)',
    status: 'backlog',
    priority: 'low',
    estimateMinutes: 5,
    createdAt: Date.now() - 1200000,
  },
];

export const useProductivityStore = create<ProductivityStoreState>()(
  persist(
    (set, get) => ({
      notes: INITIAL_NOTES,
      activeNoteId: 'welcome-note',
      tasks: INITIAL_TASKS,
      pomodoro: {
        mode: 'work',
        durationSeconds: 25 * 60,
        remainingSeconds: 25 * 60,
        isRunning: false,
        sessionsCompleted: 0,
      },

      addNote: (title = 'Untitled Note', content = '') => {
        const id = `note-${Date.now()}`;
        const newNote: Note = {
          id,
          title,
          content,
          tags: [],
          updatedAt: Date.now(),
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: id,
        }));
        return id;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => {
          const remaining = state.notes.filter((n) => n.id !== id);
          return {
            notes: remaining,
            activeNoteId: state.activeNoteId === id ? remaining[0]?.id || null : state.activeNoteId,
          };
        });
      },

      setActiveNote: (id) => set({ activeNoteId: id }),

      addTask: (title, priority = 'medium', estimateMinutes = 25) => {
        const newTask: TaskItem = {
          id: `task-${Date.now()}`,
          title,
          status: 'today',
          priority,
          estimateMinutes,
          createdAt: Date.now(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  completedAt: status === 'done' ? Date.now() : undefined,
                }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      setPomodoroMode: (mode) => {
        const durations = {
          work: 25 * 60,
          shortBreak: 5 * 60,
          longBreak: 15 * 60,
        };
        set({
          pomodoro: {
            ...get().pomodoro,
            mode,
            durationSeconds: durations[mode],
            remainingSeconds: durations[mode],
            isRunning: false,
          },
        });
      },

      setPomodoroRunning: (isRunning) => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning },
        }));
      },

      tickPomodoro: () => {
        const { pomodoro } = get();
        if (!pomodoro.isRunning) return;

        if (pomodoro.remainingSeconds <= 1) {
          const durations = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
          let nextMode: 'work' | 'shortBreak' | 'longBreak';
          const newCompleted = pomodoro.mode === 'work' ? pomodoro.sessionsCompleted + 1 : pomodoro.sessionsCompleted;

          if (pomodoro.mode === 'work') {
            nextMode = newCompleted % 4 === 0 ? 'longBreak' : 'shortBreak';
          } else {
            nextMode = 'work';
          }

          set({
            pomodoro: {
              ...pomodoro,
              mode: nextMode,
              durationSeconds: durations[nextMode],
              remainingSeconds: durations[nextMode],
              isRunning: false,
              sessionsCompleted: newCompleted,
            },
          });
        } else {
          set({
            pomodoro: {
              ...pomodoro,
              remainingSeconds: pomodoro.remainingSeconds - 1,
            },
          });
        }
      },

      resetPomodoro: () => {
        const { pomodoro } = get();
        set({
          pomodoro: {
            ...pomodoro,
            remainingSeconds: pomodoro.durationSeconds,
            isRunning: false,
          },
        });
      },

      restoreProductivityState: (payload) => {
        set((state) => ({
          notes: Array.isArray(payload.notes) ? payload.notes : state.notes,
          tasks: Array.isArray(payload.tasks) ? payload.tasks : state.tasks,
          activeNoteId: Array.isArray(payload.notes) && payload.notes.length > 0 ? payload.notes[0].id : state.activeNoteId,
        }));
      },
    }),
    {
      name: 'aetheros_productivity_storage',
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
        tasks: state.tasks,
      }),
    }
  )
);
