import { create } from 'zustand';
import { SystemSettings } from '../types';

interface SettingsStoreState {
  settings: SystemSettings;
  isCommandPaletteOpen: boolean;
  lightPosition: { x: number; y: number };

  setWallpaper: (wallpaper: SystemSettings['wallpaper']) => void;
  setGlassMaterial: (material: SystemSettings['glassMaterial']) => void;
  setChromaticAberration: (val: number) => void;
  toggleDynamicLighting: () => void;
  toggleDropletMerge: () => void;
  setCompanionConnected: (connected: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setLightPosition: (pos: { x: number; y: number }) => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  wallpaper: 'aurora',
  glassMaterial: 'regular',
  chromaticAberration: 0.22,
  dynamicLighting: true,
  dropletMerge: true,
  companionUrl: 'http://localhost:3001',
  isCompanionConnected: false,
};

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  settings: DEFAULT_SETTINGS,
  isCommandPaletteOpen: false,
  lightPosition: { x: 50, y: 50 },

  setWallpaper: (wallpaper) =>
    set((state) => ({ settings: { ...state.settings, wallpaper } })),

  setGlassMaterial: (glassMaterial) =>
    set((state) => ({ settings: { ...state.settings, glassMaterial } })),

  setChromaticAberration: (chromaticAberration) =>
    set((state) => ({ settings: { ...state.settings, chromaticAberration } })),

  toggleDynamicLighting: () =>
    set((state) => ({
      settings: { ...state.settings, dynamicLighting: !state.settings.dynamicLighting },
    })),

  toggleDropletMerge: () =>
    set((state) => ({
      settings: { ...state.settings, dropletMerge: !state.settings.dropletMerge },
    })),

  setCompanionConnected: (isCompanionConnected) =>
    set((state) => ({
      settings: { ...state.settings, isCompanionConnected },
    })),

  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  setLightPosition: (lightPosition) => set({ lightPosition }),
}));
