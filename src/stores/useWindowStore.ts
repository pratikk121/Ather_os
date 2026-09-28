import { create } from 'zustand';
import { WindowId, WindowState } from '../types';

interface WindowStoreState {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  highestZIndex: number;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, pos: { x: number; y: number }) => void;
  updateSize: (id: WindowId, size: { width: number; height: number }) => void;
}

const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  files: {
    id: 'files',
    title: 'Aether Files',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 70, y: 70 },
    size: { width: 620, height: 440 },
  },
  terminal: {
    id: 'terminal',
    title: 'Aether Kernel Terminal',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 120, y: 110 },
    size: { width: 580, height: 380 },
  },
  notes: {
    id: 'notes',
    title: 'Focus Notes',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 90, y: 80 },
    size: { width: 560, height: 440 },
  },
  tasks: {
    id: 'tasks',
    title: 'Task Matrix',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 150, y: 100 },
    size: { width: 700, height: 480 },
  },
  pomodoro: {
    id: 'pomodoro',
    title: 'Flow Droplet',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 13,
    position: { x: 320, y: 140 },
    size: { width: 340, height: 380 },
  },
  music: {
    id: 'music',
    title: 'AetherPlayer',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 14,
    position: { x: 230, y: 120 },
    size: { width: 480, height: 460 },
  },
  ambient: {
    id: 'ambient',
    title: 'Ambient Soundscapes',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 15,
    position: { x: 270, y: 130 },
    size: { width: 450, height: 420 },
  },
  journal: {
    id: 'journal',
    title: 'Life Journal',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 16,
    position: { x: 190, y: 90 },
    size: { width: 620, height: 460 },
  },
  habits: {
    id: 'habits',
    title: 'Habit Streaks',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 17,
    position: { x: 210, y: 110 },
    size: { width: 540, height: 440 },
  },
  system: {
    id: 'system',
    title: 'System Telemetry',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 18,
    position: { x: 330, y: 130 },
    size: { width: 430, height: 360 },
  },
  settings: {
    id: 'settings',
    title: 'Glass Customizer',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 19,
    position: { x: 250, y: 100 },
    size: { width: 500, height: 420 },
  },
};

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: INITIAL_WINDOWS,
  activeWindowId: 'notes',
  highestZIndex: 25,

  openWindow: (id) => {
    const nextZ = get().highestZIndex + 1;
    set((state) => ({
      highestZIndex: nextZ,
      activeWindowId: id,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      },
    }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          isMaximized: false,
        },
      },
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: true,
        },
      },
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: !state.windows[id].isMaximized,
        },
      },
    }));
  },

  focusWindow: (id) => {
    const nextZ = get().highestZIndex + 1;
    set((state) => ({
      highestZIndex: nextZ,
      activeWindowId: id,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      },
    }));
  },

  updatePosition: (id, pos) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: pos,
        },
      },
    }));
  },

  updateSize: (id, size) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size,
        },
      },
    }));
  },
}));
