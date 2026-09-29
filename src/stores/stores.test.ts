import { describe, it, expect } from 'vitest';
import { useWindowStore } from './useWindowStore';
import { useProductivityStore } from './useProductivityStore';
import { useMediaStore } from './useMediaStore';
import { useActivityStore, calculateHabitStreak, getLocalDateStr } from './useActivityStore';
import { useSettingsStore } from './useSettingsStore';

describe('AetherOS Core Stores & Functional Invariants', () => {
  describe('Window Manager Lifecycle & Focus Invariants', () => {
    it('manages opening, closing, minimizing, and focusing windows cleanly', () => {
      const store = useWindowStore.getState();
      store.openWindow('notes');
      expect(useWindowStore.getState().windows.notes.isOpen).toBe(true);
      expect(useWindowStore.getState().activeWindowId).toBe('notes');

      store.openWindow('tasks');
      expect(useWindowStore.getState().windows.tasks.isOpen).toBe(true);
      expect(useWindowStore.getState().activeWindowId).toBe('tasks');

      // Minimizing the active window transfers focus to next visible window (notes)
      store.minimizeWindow('tasks');
      expect(useWindowStore.getState().windows.tasks.isMinimized).toBe(true);
      expect(useWindowStore.getState().activeWindowId).toBe('notes');

      // Restoring tasks brings it to front and focuses it
      store.openWindow('tasks');
      expect(useWindowStore.getState().windows.tasks.isMinimized).toBe(false);
      expect(useWindowStore.getState().activeWindowId).toBe('tasks');

      // Closing active window transfers focus to notes
      store.closeWindow('tasks');
      expect(useWindowStore.getState().windows.tasks.isOpen).toBe(false);
      expect(useWindowStore.getState().activeWindowId).toBe('notes');

      // Closing the last open window gracefully sets activeWindowId to null without crashing
      store.closeWindow('notes');
      expect(useWindowStore.getState().activeWindowId).toBeNull();
    });

    it('handles minimizing all open windows cleanly', () => {
      const store = useWindowStore.getState();
      store.openWindow('terminal');
      store.openWindow('music');
      expect(useWindowStore.getState().activeWindowId).toBe('music');

      store.minimizeWindow('music');
      expect(useWindowStore.getState().activeWindowId).toBe('terminal');

      store.minimizeWindow('terminal');
      expect(useWindowStore.getState().activeWindowId).toBeNull();

      // Restoring from dock restores focus
      store.focusWindow('terminal');
      expect(useWindowStore.getState().windows.terminal.isMinimized).toBe(false);
      expect(useWindowStore.getState().activeWindowId).toBe('terminal');
    });
  });

  describe('Pomodoro State Machine', () => {
    it('transitions to shortBreak for sessions 1-3, and longBreak on 4th completed work session', () => {
      const store = useProductivityStore.getState();
      store.setPomodoroMode('work');
      useProductivityStore.setState({
        pomodoro: {
          mode: 'work',
          durationSeconds: 25 * 60,
          remainingSeconds: 1,
          isRunning: true,
          sessionsCompleted: 0,
        },
      });

      // Session 1 completion -> shortBreak
      store.tickPomodoro();
      let state = useProductivityStore.getState().pomodoro;
      expect(state.sessionsCompleted).toBe(1);
      expect(state.mode).toBe('shortBreak');

      // Finish shortBreak -> work
      useProductivityStore.setState({ pomodoro: { ...state, remainingSeconds: 1, isRunning: true } });
      store.tickPomodoro();
      expect(useProductivityStore.getState().pomodoro.mode).toBe('work');

      // Advance to 3 completed sessions
      useProductivityStore.setState({
        pomodoro: {
          mode: 'work',
          durationSeconds: 25 * 60,
          remainingSeconds: 1,
          isRunning: true,
          sessionsCompleted: 3,
        },
      });

      // Session 4 completion -> longBreak
      store.tickPomodoro();
      state = useProductivityStore.getState().pomodoro;
      expect(state.sessionsCompleted).toBe(4);
      expect(state.mode).toBe('longBreak');
      expect(state.durationSeconds).toBe(15 * 60);
    });
  });

  describe('Habit Streaks & Calendar Date Handling', () => {
    it('calculates consecutive habit streaks accurately with timezone-safe dates', () => {
      const today = new Date();
      const d0 = getLocalDateStr(today);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const d1 = getLocalDateStr(yesterday);

      const dayBefore = new Date(today);
      dayBefore.setDate(today.getDate() - 2);
      const d2 = getLocalDateStr(dayBefore);

      // 3-day consecutive streak including today
      expect(calculateHabitStreak([d0, d1, d2], today)).toBe(3);

      // Streak where today is not checked in yet, but yesterday and day before are checked in (grace period active)
      expect(calculateHabitStreak([d1, d2], today)).toBe(2);

      // Broken streak (checked in 2 days ago, but missed yesterday)
      expect(calculateHabitStreak([d2], today)).toBe(0);

      // Empty checkins
      expect(calculateHabitStreak([], today)).toBe(0);
    });
  });

  describe('Full State Persistence & Snapshot Restoration', () => {
    it('restores productivity state cleanly', () => {
      const prodStore = useProductivityStore.getState();
      const mockNotes = [
        { id: 'custom-note-1', title: 'Restored Note', content: 'Sample text', tags: ['backup'], updatedAt: 12345 },
      ];
      const mockTasks = [
        { id: 'custom-task-1', title: 'Restored Task', status: 'today' as const, priority: 'high' as const, createdAt: 12345 },
      ];

      prodStore.restoreProductivityState({ notes: mockNotes, tasks: mockTasks });
      expect(useProductivityStore.getState().notes).toEqual(mockNotes);
      expect(useProductivityStore.getState().tasks).toEqual(mockTasks);
      expect(useProductivityStore.getState().activeNoteId).toBe('custom-note-1');
    });

    it('restores activity & habit state cleanly', () => {
      const actStore = useActivityStore.getState();
      const mockActivities = [
        { id: 'custom-act-1', title: 'Restored Activity', category: 'coding' as const, type: 'online' as const, durationMinutes: 45, timestamp: 12345 },
      ];
      const mockHabits = [
        { id: 'custom-habit-1', name: 'Restored Habit', icon: '🚀', targetPerWeek: 7, completedDates: [getLocalDateStr(new Date())], streak: 0 },
      ];

      actStore.restoreActivityState({ activities: mockActivities, habits: mockHabits });
      expect(useActivityStore.getState().activities).toEqual(mockActivities);
      expect(useActivityStore.getState().habits[0].name).toBe('Restored Habit');
      expect(useActivityStore.getState().habits[0].streak).toBe(1);
    });
  });

  describe('Media & Settings Stores', () => {
    it('controls track switching and settings updates', () => {
      const mediaStore = useMediaStore.getState();
      expect(mediaStore.playlist.length).toBeGreaterThan(0);
      mediaStore.nextTrack();
      expect(useMediaStore.getState().currentTrackIndex).toBe(1);

      const settingsStore = useSettingsStore.getState();
      settingsStore.setThemePreset('cyberpunk');
      expect(useSettingsStore.getState().settings.themePreset).toBe('cyberpunk');
    });
  });
});
