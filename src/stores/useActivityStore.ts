import { create } from 'zustand';
import { ActivityEntry, Habit } from '../types';

interface ActivityStoreState {
  activities: ActivityEntry[];
  habits: Habit[];
  telemetry: {
    cpuUsage: number;
    memoryUsage: number;
    uptimeSeconds: number;
  };

  // Activity Actions
  addActivity: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
  deleteActivity: (id: string) => void;

  // Habit Actions
  addHabit: (name: string, icon: string, targetPerWeek?: number) => void;
  toggleHabitCheckin: (habitId: string, dateStr: string) => void;
  deleteHabit: (habitId: string) => void;

  // Telemetry Actions
  updateTelemetry: (telemetry: Partial<ActivityStoreState['telemetry']>) => void;
}

export const getLocalDateStr = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPastDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return getLocalDateStr(d);
};

const INITIAL_ACTIVITIES: ActivityEntry[] = [
  {
    id: 'act-1',
    title: 'Focus Session: Architecture & Liquid Glass Shader',
    category: 'coding',
    type: 'online',
    durationMinutes: 50,
    timestamp: Date.now() - 3600000 * 2,
    notes: 'Configured refraction maps and spring gestures',
  },
  {
    id: 'act-2',
    title: 'Outdoor Run & Sunlight',
    category: 'fitness',
    type: 'offline',
    durationMinutes: 35,
    timestamp: Date.now() - 3600000 * 5,
    notes: '5km easy pace',
  },
  {
    id: 'act-3',
    title: 'Deep Reading: Physics of Optics & Dispersion',
    category: 'reading',
    type: 'offline',
    durationMinutes: 40,
    timestamp: Date.now() - 3600000 * 9,
    notes: 'Chapters 3 & 4',
  },
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Morning Meditation & Breathwork',
    icon: '🧘',
    targetPerWeek: 7,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2), getPastDateStr(3)],
    streak: 4,
  },
  {
    id: 'habit-2',
    name: 'Physical Workout / Movement',
    icon: '⚡',
    targetPerWeek: 5,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(3)],
    streak: 2,
  },
  {
    id: 'habit-3',
    name: 'Read 30 Mins (Offline)',
    icon: '📖',
    targetPerWeek: 7,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2)],
    streak: 3,
  },
  {
    id: 'habit-4',
    name: 'Deep Code Flow State',
    icon: '💻',
    targetPerWeek: 5,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2), getPastDateStr(4)],
    streak: 3,
  },
];

export const useActivityStore = create<ActivityStoreState>((set) => ({
  activities: INITIAL_ACTIVITIES,
  habits: INITIAL_HABITS,
  telemetry: {
    cpuUsage: 18,
    memoryUsage: 42,
    uptimeSeconds: 7420,
  },

  addActivity: (entry) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: `act-${Date.now()}`,
      timestamp: Date.now(),
    };
    set((state) => ({ activities: [newEntry, ...state.activities] }));
  },

  deleteActivity: (id) => {
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    }));
  },

  addHabit: (name, icon, targetPerWeek = 7) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      icon,
      targetPerWeek,
      completedDates: [],
      streak: 0,
    };
    set((state) => ({ habits: [...state.habits, newHabit] }));
  },

  toggleHabitCheckin: (habitId, dateStr) => {
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id !== habitId) return habit;
        const exists = habit.completedDates.includes(dateStr);
        const updatedDates = exists
          ? habit.completedDates.filter((d) => d !== dateStr)
          : [...habit.completedDates, dateStr];

        // Recalculate streak
        let streak = 0;
        let checkDate = new Date();
        while (true) {
          const ds = getLocalDateStr(checkDate);
          if (updatedDates.includes(ds)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            // Check if today was missed but yesterday completed
            if (streak === 0 && ds === getLocalDateStr(new Date())) {
              checkDate.setDate(checkDate.getDate() - 1);
              const yesterdayDs = getLocalDateStr(checkDate);
              if (updatedDates.includes(yesterdayDs)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
              }
            }
            break;
          }
        }

        return { ...habit, completedDates: updatedDates, streak };
      }),
    }));
  },

  deleteHabit: (habitId) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
    }));
  },

  updateTelemetry: (telemetry) => {
    set((state) => ({
      telemetry: { ...state.telemetry, ...telemetry },
    }));
  },
}));
