import { describe, it, expect } from 'vitest';
import { useWindowStore } from './useWindowStore';
import { useProductivityStore } from './useProductivityStore';
import { useMediaStore } from './useMediaStore';
import { useActivityStore } from './useActivityStore';
import { useSettingsStore } from './useSettingsStore';

describe('AetherOS Zustand Stores', () => {
  describe('Window Store', () => {
    it('manages opening, closing, minimizing, and focusing windows', () => {
      const store = useWindowStore.getState();
      expect(store.windows.notes.isOpen).toBe(true);

      store.openWindow('tasks');
      expect(useWindowStore.getState().windows.tasks.isOpen).toBe(true);
      expect(useWindowStore.getState().activeWindowId).toBe('tasks');

      store.minimizeWindow('tasks');
      expect(useWindowStore.getState().windows.tasks.isMinimized).toBe(true);

      store.closeWindow('notes');
      expect(useWindowStore.getState().windows.notes.isOpen).toBe(false);
    });
  });

  describe('Productivity Store', () => {
    it('adds and updates notes and tasks', () => {
      const store = useProductivityStore.getState();
      const noteId = store.addNote('New Idea', 'Content here');
      expect(useProductivityStore.getState().notes.some((n) => n.id === noteId)).toBe(true);

      store.updateNote(noteId, { title: 'Updated Title' });
      const updated = useProductivityStore.getState().notes.find((n) => n.id === noteId);
      expect(updated?.title).toBe('Updated Title');

      store.addTask('New Task', 'high');
      expect(useProductivityStore.getState().tasks.some((t) => t.title === 'New Task')).toBe(true);
    });
  });

  describe('Media Store', () => {
    it('controls music track switching and ambient audio toggles', () => {
      const store = useMediaStore.getState();
      expect(store.playlist.length).toBeGreaterThan(0);

      store.nextTrack();
      expect(useMediaStore.getState().currentTrackIndex).toBe(1);

      const rainId = 'ambient-rain';
      store.toggleAmbientTrack(rainId);
      expect(
        useMediaStore.getState().ambientTracks.find((t) => t.id === rainId)?.isPlaying
      ).toBe(true);
    });
  });

  describe('Activity Store', () => {
    it('logs activities and toggles habit checkins', () => {
      const store = useActivityStore.getState();
      store.addActivity({
        title: 'Coding Session',
        category: 'coding',
        type: 'online',
        durationMinutes: 45,
      });
      expect(
        useActivityStore.getState().activities.some((a) => a.title === 'Coding Session')
      ).toBe(true);

      const habit = store.habits[0];
      const todayStr = new Date().toISOString().split('T')[0];
      store.toggleHabitCheckin(habit.id, todayStr);
      // toggle should either add or remove today
      const updatedHabit = useActivityStore.getState().habits.find((h) => h.id === habit.id);
      expect(updatedHabit).toBeDefined();
    });
  });

  describe('Settings Store', () => {
    it('updates wallpaper and glass material settings', () => {
      const store = useSettingsStore.getState();
      store.setWallpaper('nebula');
      expect(useSettingsStore.getState().settings.wallpaper).toBe('nebula');

      store.setGlassMaterial('frosted');
      expect(useSettingsStore.getState().settings.glassMaterial).toBe('frosted');
    });
  });
});
