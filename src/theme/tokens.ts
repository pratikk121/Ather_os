import { ThemePreset, AccentColor } from '../types';

export interface ThemeTokens {
  id: ThemePreset;
  name: string;
  desc: string;
  badge: string;
  colorPreview: string;

  // Surface tokens
  surfaceBase: string;
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  surfaceOverlay: string;
  surfaceInteractive: string;
  surfaceSelected: string;

  // Text / Content tokens
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  textInverse: string;

  // Border tokens
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;

  // Accent tokens
  accentPrimary: string;
  accentSecondary: string;
  accentSoft: string;
  accentContrast: string;

  // Focus & Selection tokens
  focusRing: string;
  selectionBg: string;

  // Status tokens
  statusSuccess: string;
  statusWarning: string;
  statusError: string;
  statusInfo: string;

  // Glass Material tokens
  glassBg: string;
  glassBorder: string;
  glassHighlight: string;
  glassShadow: string;

  // Ambient fluid glow spheres
  ambientGlow1: string;
  ambientGlow2: string;
  ambientGlow3: string;

  // Chromatic refraction rim tint
  rimTint: string;
}

export const ACCENT_COLOR_DEFINITIONS: Record<
  AccentColor,
  {
    primary: string;
    secondary: string;
    soft: string;
    contrast: string;
    ring: string;
    selection: string;
    rim: string;
  }
> = {
  silver: {
    primary: '#f4f4f5',
    secondary: '#a1a1aa',
    soft: 'rgba(255, 255, 255, 0.14)',
    contrast: '#09090b',
    ring: 'rgba(255, 255, 255, 0.85)',
    selection: 'rgba(255, 255, 255, 0.22)',
    rim: 'rgba(255, 255, 255, 0.25)',
  },
  cyan: {
    primary: '#06b6d4',
    secondary: '#38bdf8',
    soft: 'rgba(6, 182, 212, 0.18)',
    contrast: '#030712',
    ring: '#06b6d4',
    selection: 'rgba(6, 182, 212, 0.32)',
    rim: 'rgba(34, 211, 238, 0.40)',
  },
  emerald: {
    primary: '#10b981',
    secondary: '#14b8a6',
    soft: 'rgba(16, 185, 129, 0.18)',
    contrast: '#022c22',
    ring: '#10b981',
    selection: 'rgba(16, 185, 129, 0.32)',
    rim: 'rgba(52, 211, 153, 0.40)',
  },
  amber: {
    primary: '#f59e0b',
    secondary: '#f97316',
    soft: 'rgba(245, 158, 11, 0.18)',
    contrast: '#451a03',
    ring: '#f59e0b',
    selection: 'rgba(245, 158, 11, 0.32)',
    rim: 'rgba(251, 191, 36, 0.40)',
  },
  purple: {
    primary: '#a855f7',
    secondary: '#6366f1',
    soft: 'rgba(168, 85, 247, 0.18)',
    contrast: '#ffffff',
    ring: '#a855f7',
    selection: 'rgba(168, 85, 247, 0.32)',
    rim: 'rgba(192, 132, 252, 0.40)',
  },
  rose: {
    primary: '#f43f5e',
    secondary: '#ec4899',
    soft: 'rgba(244, 63, 94, 0.18)',
    contrast: '#ffffff',
    ring: '#f43f5e',
    selection: 'rgba(244, 63, 94, 0.32)',
    rim: 'rgba(251, 113, 133, 0.40)',
  },
};

export const THEME_PRESETS_DEF: Record<ThemePreset, ThemeTokens> = {
  monochrome: {
    id: 'monochrome',
    name: 'Obsidian Noir',
    desc: 'Pure pitch black, smoked glass, zinc & silver specular rims',
    badge: 'Monochrome',
    colorPreview: 'from-black via-zinc-800 to-zinc-950 border-white/40',

    surfaceBase: '#09090b',
    surfacePrimary: 'rgba(18, 18, 22, 0.88)',
    surfaceSecondary: 'rgba(24, 24, 28, 0.70)',
    surfaceElevated: 'rgba(32, 32, 38, 0.90)',
    surfaceOverlay: 'rgba(5, 5, 7, 0.82)',
    surfaceInteractive: 'rgba(255, 255, 255, 0.08)',
    surfaceSelected: 'rgba(255, 255, 255, 0.18)',

    textPrimary: '#ffffff',
    textSecondary: '#d4d4d8',
    textMuted: '#a1a1aa',
    textDisabled: '#52525b',
    textInverse: '#09090b',

    borderSubtle: 'rgba(255, 255, 255, 0.10)',
    borderDefault: 'rgba(255, 255, 255, 0.18)',
    borderStrong: 'rgba(255, 255, 255, 0.35)',

    accentPrimary: '#f4f4f5',
    accentSecondary: '#a1a1aa',
    accentSoft: 'rgba(255, 255, 255, 0.14)',
    accentContrast: '#09090b',

    focusRing: 'rgba(255, 255, 255, 0.85)',
    selectionBg: 'rgba(255, 255, 255, 0.22)',

    statusSuccess: '#22c55e',
    statusWarning: '#f59e0b',
    statusError: '#ef4444',
    statusInfo: '#38bdf8',

    glassBg: 'rgba(12, 12, 16, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.16)',
    glassHighlight: 'rgba(255, 255, 255, 0.25)',
    glassShadow: 'rgba(0, 0, 0, 0.75)',

    ambientGlow1: 'rgba(255, 255, 255, 0.08)',
    ambientGlow2: 'rgba(161, 161, 170, 0.06)',
    ambientGlow3: 'rgba(255, 255, 255, 0.04)',

    rimTint: 'rgba(255, 255, 255, 0.25)',
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyber Neon',
    desc: 'Electric cyan, magenta & vibrant purple bioluminescence',
    badge: 'Vibrant',
    colorPreview: 'from-cyan-500 via-purple-600 to-rose-500 border-cyan-400',

    surfaceBase: '#050814',
    surfacePrimary: 'rgba(10, 15, 30, 0.85)',
    surfaceSecondary: 'rgba(16, 24, 46, 0.70)',
    surfaceElevated: 'rgba(22, 34, 64, 0.90)',
    surfaceOverlay: 'rgba(4, 7, 20, 0.82)',
    surfaceInteractive: 'rgba(6, 182, 212, 0.14)',
    surfaceSelected: 'rgba(236, 72, 153, 0.22)',

    textPrimary: '#f0fdfa',
    textSecondary: '#a5f3fc',
    textMuted: '#67e8f9',
    textDisabled: '#334155',
    textInverse: '#030712',

    borderSubtle: 'rgba(6, 182, 212, 0.18)',
    borderDefault: 'rgba(6, 182, 212, 0.32)',
    borderStrong: 'rgba(236, 72, 153, 0.55)',

    accentPrimary: '#06b6d4',
    accentSecondary: '#ec4899',
    accentSoft: 'rgba(6, 182, 212, 0.18)',
    accentContrast: '#ffffff',

    focusRing: '#06b6d4',
    selectionBg: 'rgba(6, 182, 212, 0.32)',

    statusSuccess: '#10b981',
    statusWarning: '#f59e0b',
    statusError: '#f43f5e',
    statusInfo: '#06b6d4',

    glassBg: 'rgba(8, 14, 32, 0.84)',
    glassBorder: 'rgba(6, 182, 212, 0.28)',
    glassHighlight: 'rgba(236, 72, 153, 0.35)',
    glassShadow: 'rgba(2, 6, 23, 0.85)',

    ambientGlow1: 'rgba(6, 182, 212, 0.24)',
    ambientGlow2: 'rgba(236, 72, 153, 0.20)',
    ambientGlow3: 'rgba(147, 51, 234, 0.22)',

    rimTint: 'rgba(34, 211, 238, 0.40)',
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    desc: 'Organic mint, deep moss & calm emerald liquid glass',
    badge: 'Nature',
    colorPreview: 'from-emerald-400 via-teal-600 to-slate-900 border-emerald-400',

    surfaceBase: '#021a12',
    surfacePrimary: 'rgba(4, 28, 20, 0.85)',
    surfaceSecondary: 'rgba(6, 42, 30, 0.70)',
    surfaceElevated: 'rgba(10, 56, 40, 0.90)',
    surfaceOverlay: 'rgba(2, 18, 12, 0.82)',
    surfaceInteractive: 'rgba(16, 185, 129, 0.14)',
    surfaceSelected: 'rgba(16, 185, 129, 0.25)',

    textPrimary: '#ecfdf5',
    textSecondary: '#a7f3d0',
    textMuted: '#6ee7b7',
    textDisabled: '#134e48',
    textInverse: '#022c22',

    borderSubtle: 'rgba(16, 185, 129, 0.18)',
    borderDefault: 'rgba(16, 185, 129, 0.32)',
    borderStrong: 'rgba(52, 211, 153, 0.55)',

    accentPrimary: '#10b981',
    accentSecondary: '#14b8a6',
    accentSoft: 'rgba(16, 185, 129, 0.18)',
    accentContrast: '#022c22',

    focusRing: '#10b981',
    selectionBg: 'rgba(16, 185, 129, 0.32)',

    statusSuccess: '#10b981',
    statusWarning: '#f59e0b',
    statusError: '#f43f5e',
    statusInfo: '#14b8a6',

    glassBg: 'rgba(4, 30, 22, 0.84)',
    glassBorder: 'rgba(16, 185, 129, 0.26)',
    glassHighlight: 'rgba(52, 211, 153, 0.38)',
    glassShadow: 'rgba(2, 16, 11, 0.85)',

    ambientGlow1: 'rgba(16, 185, 129, 0.24)',
    ambientGlow2: 'rgba(20, 184, 166, 0.20)',
    ambientGlow3: 'rgba(34, 197, 94, 0.18)',

    rimTint: 'rgba(52, 211, 153, 0.40)',
  },

  solar: {
    id: 'solar',
    name: 'Solar Amber',
    desc: 'Warm golden sunset, amber glow & carbon textures',
    badge: 'Warmth',
    colorPreview: 'from-amber-400 via-orange-600 to-zinc-950 border-amber-400',

    surfaceBase: '#180e03',
    surfacePrimary: 'rgba(30, 18, 6, 0.85)',
    surfaceSecondary: 'rgba(44, 26, 9, 0.70)',
    surfaceElevated: 'rgba(60, 34, 12, 0.90)',
    surfaceOverlay: 'rgba(20, 11, 3, 0.82)',
    surfaceInteractive: 'rgba(245, 158, 11, 0.14)',
    surfaceSelected: 'rgba(245, 158, 11, 0.25)',

    textPrimary: '#fffbeb',
    textSecondary: '#fde68a',
    textMuted: '#fcd34d',
    textDisabled: '#78350f',
    textInverse: '#451a03',

    borderSubtle: 'rgba(245, 158, 11, 0.18)',
    borderDefault: 'rgba(245, 158, 11, 0.32)',
    borderStrong: 'rgba(251, 191, 36, 0.55)',

    accentPrimary: '#f59e0b',
    accentSecondary: '#f97316',
    accentSoft: 'rgba(245, 158, 11, 0.18)',
    accentContrast: '#451a03',

    focusRing: '#f59e0b',
    selectionBg: 'rgba(245, 158, 11, 0.32)',

    statusSuccess: '#22c55e',
    statusWarning: '#f59e0b',
    statusError: '#ef4444',
    statusInfo: '#38bdf8',

    glassBg: 'rgba(32, 19, 7, 0.84)',
    glassBorder: 'rgba(245, 158, 11, 0.26)',
    glassHighlight: 'rgba(251, 191, 36, 0.38)',
    glassShadow: 'rgba(16, 9, 3, 0.85)',

    ambientGlow1: 'rgba(245, 158, 11, 0.24)',
    ambientGlow2: 'rgba(249, 115, 22, 0.20)',
    ambientGlow3: 'rgba(225, 29, 72, 0.18)',

    rimTint: 'rgba(251, 191, 36, 0.40)',
  },

  arctic: {
    id: 'arctic',
    name: 'Arctic Crystal',
    desc: 'Ultra-clear ice frost, crisp sky reflections & blue highlights',
    badge: 'Clarity',
    colorPreview: 'from-sky-300 via-blue-500 to-slate-900 border-sky-300',

    surfaceBase: '#04101e',
    surfacePrimary: 'rgba(8, 26, 46, 0.85)',
    surfaceSecondary: 'rgba(14, 40, 68, 0.70)',
    surfaceElevated: 'rgba(20, 56, 92, 0.90)',
    surfaceOverlay: 'rgba(4, 16, 30, 0.82)',
    surfaceInteractive: 'rgba(56, 189, 248, 0.14)',
    surfaceSelected: 'rgba(56, 189, 248, 0.25)',

    textPrimary: '#f0f9ff',
    textSecondary: '#bae6fd',
    textMuted: '#7dd3fc',
    textDisabled: '#1e3a5f',
    textInverse: '#082f49',

    borderSubtle: 'rgba(56, 189, 248, 0.18)',
    borderDefault: 'rgba(56, 189, 248, 0.32)',
    borderStrong: 'rgba(125, 211, 252, 0.55)',

    accentPrimary: '#38bdf8',
    accentSecondary: '#06b6d4',
    accentSoft: 'rgba(56, 189, 248, 0.18)',
    accentContrast: '#082f49',

    focusRing: '#38bdf8',
    selectionBg: 'rgba(56, 189, 248, 0.32)',

    statusSuccess: '#10b981',
    statusWarning: '#f59e0b',
    statusError: '#f43f5e',
    statusInfo: '#38bdf8',

    glassBg: 'rgba(10, 30, 52, 0.84)',
    glassBorder: 'rgba(56, 189, 248, 0.26)',
    glassHighlight: 'rgba(186, 230, 253, 0.38)',
    glassShadow: 'rgba(3, 12, 24, 0.85)',

    ambientGlow1: 'rgba(56, 189, 248, 0.24)',
    ambientGlow2: 'rgba(59, 130, 246, 0.20)',
    ambientGlow3: 'rgba(103, 232, 249, 0.18)',

    rimTint: 'rgba(125, 211, 252, 0.40)',
  },

  nebula: {
    id: 'nebula',
    name: 'Deep Nebula',
    desc: 'Cosmic stellar dust, deep astronomical indigo & violet ripples',
    badge: 'Cosmic',
    colorPreview: 'from-purple-500 via-indigo-600 to-zinc-950 border-purple-400',

    surfaceBase: '#0d071e',
    surfacePrimary: 'rgba(22, 12, 46, 0.85)',
    surfaceSecondary: 'rgba(34, 18, 70, 0.70)',
    surfaceElevated: 'rgba(48, 24, 94, 0.90)',
    surfaceOverlay: 'rgba(13, 7, 28, 0.82)',
    surfaceInteractive: 'rgba(168, 85, 247, 0.14)',
    surfaceSelected: 'rgba(168, 85, 247, 0.25)',

    textPrimary: '#faf5ff',
    textSecondary: '#e9d5ff',
    textMuted: '#d8b4fe',
    textDisabled: '#4c1d95',
    textInverse: '#2e1065',

    borderSubtle: 'rgba(168, 85, 247, 0.18)',
    borderDefault: 'rgba(168, 85, 247, 0.32)',
    borderStrong: 'rgba(192, 132, 252, 0.55)',

    accentPrimary: '#a855f7',
    accentSecondary: '#6366f1',
    accentSoft: 'rgba(168, 85, 247, 0.18)',
    accentContrast: '#ffffff',

    focusRing: '#a855f7',
    selectionBg: 'rgba(168, 85, 247, 0.32)',

    statusSuccess: '#10b981',
    statusWarning: '#f59e0b',
    statusError: '#f43f5e',
    statusInfo: '#818cf8',

    glassBg: 'rgba(24, 13, 50, 0.84)',
    glassBorder: 'rgba(168, 85, 247, 0.26)',
    glassHighlight: 'rgba(216, 180, 254, 0.38)',
    glassShadow: 'rgba(9, 4, 20, 0.85)',

    ambientGlow1: 'rgba(168, 85, 247, 0.24)',
    ambientGlow2: 'rgba(99, 102, 241, 0.22)',
    ambientGlow3: 'rgba(217, 70, 239, 0.20)',

    rimTint: 'rgba(192, 132, 252, 0.40)',
  },

  custom: {
    id: 'custom',
    name: 'Custom User Theme',
    desc: 'Individually tailored surface, optics, and accent colors',
    badge: 'Custom',
    colorPreview: 'from-zinc-700 to-zinc-900 border-white/30',

    surfaceBase: '#09090b',
    surfacePrimary: 'rgba(18, 18, 22, 0.88)',
    surfaceSecondary: 'rgba(24, 24, 28, 0.70)',
    surfaceElevated: 'rgba(32, 32, 38, 0.90)',
    surfaceOverlay: 'rgba(5, 5, 7, 0.82)',
    surfaceInteractive: 'rgba(255, 255, 255, 0.08)',
    surfaceSelected: 'rgba(255, 255, 255, 0.18)',

    textPrimary: '#ffffff',
    textSecondary: '#d4d4d8',
    textMuted: '#a1a1aa',
    textDisabled: '#52525b',
    textInverse: '#09090b',

    borderSubtle: 'rgba(255, 255, 255, 0.10)',
    borderDefault: 'rgba(255, 255, 255, 0.18)',
    borderStrong: 'rgba(255, 255, 255, 0.35)',

    accentPrimary: '#f4f4f5',
    accentSecondary: '#a1a1aa',
    accentSoft: 'rgba(255, 255, 255, 0.14)',
    accentContrast: '#09090b',

    focusRing: 'rgba(255, 255, 255, 0.85)',
    selectionBg: 'rgba(255, 255, 255, 0.22)',

    statusSuccess: '#22c55e',
    statusWarning: '#f59e0b',
    statusError: '#ef4444',
    statusInfo: '#38bdf8',

    glassBg: 'rgba(12, 12, 16, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.16)',
    glassHighlight: 'rgba(255, 255, 255, 0.25)',
    glassShadow: 'rgba(0, 0, 0, 0.75)',

    ambientGlow1: 'rgba(255, 255, 255, 0.08)',
    ambientGlow2: 'rgba(161, 161, 170, 0.06)',
    ambientGlow3: 'rgba(255, 255, 255, 0.04)',

    rimTint: 'rgba(255, 255, 255, 0.25)',
  },
};

export const getThemeTokens = (preset: ThemePreset, accentColor?: AccentColor): ThemeTokens => {
  const baseTokens = THEME_PRESETS_DEF[preset] || THEME_PRESETS_DEF.monochrome;
  if (!accentColor || !ACCENT_COLOR_DEFINITIONS[accentColor]) {
    return baseTokens;
  }

  // If user has a selected accent color override or is on custom theme, inject the accent palette
  const accent = ACCENT_COLOR_DEFINITIONS[accentColor];
  return {
    ...baseTokens,
    accentPrimary: accent.primary,
    accentSecondary: accent.secondary,
    accentSoft: accent.soft,
    accentContrast: accent.contrast,
    focusRing: accent.ring,
    selectionBg: accent.selection,
    rimTint: accent.rim,
  };
};

export const applyThemeToElement = (
  element: HTMLElement,
  preset: ThemePreset,
  accentColor?: AccentColor
) => {
  const tokens = getThemeTokens(preset, accentColor);
  element.setAttribute('data-theme', preset);
  element.style.setProperty('--theme-color-scheme', 'dark');

  // Set CSS Custom Properties on the element
  element.style.setProperty('--aether-surface-base', tokens.surfaceBase);
  element.style.setProperty('--aether-surface-primary', tokens.surfacePrimary);
  element.style.setProperty('--aether-surface-secondary', tokens.surfaceSecondary);
  element.style.setProperty('--aether-surface-elevated', tokens.surfaceElevated);
  element.style.setProperty('--aether-surface-overlay', tokens.surfaceOverlay);
  element.style.setProperty('--aether-surface-interactive', tokens.surfaceInteractive);
  element.style.setProperty('--aether-surface-selected', tokens.surfaceSelected);

  element.style.setProperty('--aether-text-primary', tokens.textPrimary);
  element.style.setProperty('--aether-text-secondary', tokens.textSecondary);
  element.style.setProperty('--aether-text-muted', tokens.textMuted);
  element.style.setProperty('--aether-text-disabled', tokens.textDisabled);
  element.style.setProperty('--aether-text-inverse', tokens.textInverse);

  element.style.setProperty('--aether-border-subtle', tokens.borderSubtle);
  element.style.setProperty('--aether-border-default', tokens.borderDefault);
  element.style.setProperty('--aether-border-strong', tokens.borderStrong);

  element.style.setProperty('--aether-accent-primary', tokens.accentPrimary);
  element.style.setProperty('--aether-accent-secondary', tokens.accentSecondary);
  element.style.setProperty('--aether-accent-soft', tokens.accentSoft);
  element.style.setProperty('--aether-accent-contrast', tokens.accentContrast);

  element.style.setProperty('--aether-focus-ring', tokens.focusRing);
  element.style.setProperty('--aether-selection-bg', tokens.selectionBg);

  element.style.setProperty('--aether-status-success', tokens.statusSuccess);
  element.style.setProperty('--aether-status-warning', tokens.statusWarning);
  element.style.setProperty('--aether-status-error', tokens.statusError);
  element.style.setProperty('--aether-status-info', tokens.statusInfo);

  element.style.setProperty('--aether-glass-bg', tokens.glassBg);
  element.style.setProperty('--aether-glass-border', tokens.glassBorder);
  element.style.setProperty('--aether-glass-highlight', tokens.glassHighlight);
  element.style.setProperty('--aether-glass-shadow', tokens.glassShadow);

  element.style.setProperty('--aether-ambient-glow-1', tokens.ambientGlow1);
  element.style.setProperty('--aether-ambient-glow-2', tokens.ambientGlow2);
  element.style.setProperty('--aether-ambient-glow-3', tokens.ambientGlow3);

  element.style.setProperty('--aether-rim-tint', tokens.rimTint);
};
