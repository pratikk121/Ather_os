import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SystemSettings, ThemePreset, AccentColor, WallpaperTheme, GlassMaterial } from '../types';

interface SettingsStoreState {
  settings: SystemSettings;
  isCommandPaletteOpen: boolean;
  lightPosition: { x: number; y: number };

  setThemePreset: (preset: ThemePreset) => void;
  setAccentColor: (accentColor: AccentColor) => void;
  setWallpaper: (wallpaper: WallpaperTheme) => void;
  setGlassMaterial: (material: GlassMaterial) => void;
  setChromaticAberration: (val: number) => void;
  setDockAutoHide: (mode: 'smart' | 'never') => void;
  setDockMagnification: (scale: number) => void;
  toggleDesktopIcons: () => void;
  toggleDynamicLighting: () => void;
  toggleDropletMerge: () => void;
  toggleAudioReactiveEnv: () => void;
  setCompanionConnected: (connected: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setLightPosition: (pos: { x: number; y: number }) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  wallpaper: 'cyberpunk',
  themePreset: 'cyberpunk',
  accentColor: 'cyan',
  glassMaterial: 'regular',
  chromaticAberration: 0.25,
  dynamicLighting: true,
  audioReactiveEnv: true,
  dropletMerge: true,
  dockAutoHide: 'smart',
  dockMagnification: 1.35,
  showDesktopIcons: true,
  companionUrl: 'http://localhost:3001',
  isCompanionConnected: false,
};

export const THEME_PRESET_CONFIGS: Record<
  ThemePreset,
  Partial<SystemSettings>
> = {
  monochrome: {
    themePreset: 'monochrome',
    wallpaper: 'obsidian',
    accentColor: 'silver',
    glassMaterial: 'heavy',
    chromaticAberration: 0.12,
    dynamicLighting: true,
  },
  cyberpunk: {
    themePreset: 'cyberpunk',
    wallpaper: 'cyberpunk',
    accentColor: 'cyan',
    glassMaterial: 'frosted',
    chromaticAberration: 0.35,
    dynamicLighting: true,
  },
  emerald: {
    themePreset: 'emerald',
    wallpaper: 'aurora',
    accentColor: 'emerald',
    glassMaterial: 'thin',
    chromaticAberration: 0.22,
    dynamicLighting: true,
  },
  solar: {
    themePreset: 'solar',
    wallpaper: 'carbon',
    accentColor: 'amber',
    glassMaterial: 'heavy',
    chromaticAberration: 0.25,
    dynamicLighting: true,
  },
  arctic: {
    themePreset: 'arctic',
    wallpaper: 'silver',
    accentColor: 'cyan',
    glassMaterial: 'thin',
    chromaticAberration: 0.3,
    dynamicLighting: true,
  },
  nebula: {
    themePreset: 'nebula',
    wallpaper: 'nebula',
    accentColor: 'purple',
    glassMaterial: 'frosted',
    chromaticAberration: 0.28,
    dynamicLighting: true,
  },
  custom: {
    themePreset: 'custom',
  },
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isCommandPaletteOpen: false,
      lightPosition: { x: 50, y: 50 },

      setThemePreset: (preset) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...(THEME_PRESET_CONFIGS[preset] || {}),
            themePreset: preset,
          },
        })),

      setAccentColor: (accentColor) =>
        set((state) => ({
          settings: { ...state.settings, accentColor, themePreset: 'custom' },
        })),

      setWallpaper: (wallpaper) =>
        set((state) => ({
          settings: { ...state.settings, wallpaper, themePreset: 'custom' },
        })),

      setGlassMaterial: (glassMaterial) =>
        set((state) => ({
          settings: { ...state.settings, glassMaterial, themePreset: 'custom' },
        })),

      setChromaticAberration: (chromaticAberration) =>
        set((state) => ({ settings: { ...state.settings, chromaticAberration } })),

      setDockAutoHide: (dockAutoHide) =>
        set((state) => ({ settings: { ...state.settings, dockAutoHide } })),

      setDockMagnification: (dockMagnification) =>
        set((state) => ({ settings: { ...state.settings, dockMagnification } })),

      toggleDesktopIcons: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            showDesktopIcons: !state.settings.showDesktopIcons,
          },
        })),

      toggleDynamicLighting: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            dynamicLighting: !state.settings.dynamicLighting,
          },
        })),

      toggleDropletMerge: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            dropletMerge: !state.settings.dropletMerge,
          },
        })),

      toggleAudioReactiveEnv: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            audioReactiveEnv: !state.settings.audioReactiveEnv,
          },
        })),

      setCompanionConnected: (isCompanionConnected) =>
        set((state) => ({
          settings: { ...state.settings, isCompanionConnected },
        })),

      setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

      setLightPosition: (lightPosition) => set({ lightPosition }),

      resetToDefaults: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'aetheros-settings-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
