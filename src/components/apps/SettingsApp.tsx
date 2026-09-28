import React, { useState } from 'react';
import {
  Palette,
  Image,
  Sparkles,
  Layers,
  Download,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { useActivityStore } from '../../stores/useActivityStore';
import { ThemePreset, AccentColor, WallpaperTheme, GlassMaterial } from '../../types';

interface ThemePresetItem {
  id: ThemePreset;
  name: string;
  desc: string;
  badge: string;
  colorPreview: string;
}

const THEME_PRESETS: ThemePresetItem[] = [
  {
    id: 'monochrome',
    name: 'Obsidian Noir',
    desc: 'Pure pitch black, smoked glass, zinc & silver specular rims',
    badge: 'Monochrome',
    colorPreview: 'from-black via-zinc-800 to-zinc-950 border-white/40',
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Neon',
    desc: 'Electric cyan, magenta & vibrant purple bioluminescence',
    badge: 'Vibrant',
    colorPreview: 'from-cyan-500 via-purple-600 to-rose-500 border-cyan-400',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    desc: 'Organic mint, deep moss & calm emerald liquid glass',
    badge: 'Nature',
    colorPreview: 'from-emerald-400 via-teal-600 to-slate-900 border-emerald-400',
  },
  {
    id: 'solar',
    name: 'Solar Amber',
    desc: 'Warm golden sunset, amber glow & carbon textures',
    badge: 'Warmth',
    colorPreview: 'from-amber-400 via-orange-600 to-zinc-950 border-amber-400',
  },
  {
    id: 'arctic',
    name: 'Arctic Crystal',
    desc: 'Ultra-clear ice frost, crisp sky reflections & blue highlights',
    badge: 'Clarity',
    colorPreview: 'from-sky-300 via-blue-500 to-slate-900 border-sky-300',
  },
  {
    id: 'nebula',
    name: 'Deep Nebula',
    desc: 'Cosmic stellar dust, deep astronomical indigo & violet ripples',
    badge: 'Cosmic',
    colorPreview: 'from-purple-500 via-indigo-600 to-zinc-950 border-purple-400',
  },
];

const ACCENT_COLORS: { id: AccentColor; name: string; bgClass: string; ringClass: string }[] = [
  { id: 'silver', name: 'Titanium Silver', bgClass: 'bg-zinc-200', ringClass: 'ring-zinc-300' },
  { id: 'cyan', name: 'Electric Cyan', bgClass: 'bg-cyan-400', ringClass: 'ring-cyan-400' },
  { id: 'emerald', name: 'Biolum Emerald', bgClass: 'bg-emerald-400', ringClass: 'ring-emerald-400' },
  { id: 'amber', name: 'Solar Amber', bgClass: 'bg-amber-400', ringClass: 'ring-amber-400' },
  { id: 'purple', name: 'Cosmic Purple', bgClass: 'bg-purple-400', ringClass: 'ring-purple-400' },
  { id: 'rose', name: 'Neon Rose', bgClass: 'bg-rose-400', ringClass: 'ring-rose-400' },
];

const WALLPAPERS: { id: WallpaperTheme; name: string; tag: string; preview: string }[] = [
  { id: 'obsidian', name: 'Pitch Obsidian', tag: 'Monochrome', preview: 'bg-gradient-to-br from-black via-zinc-950 to-neutral-950' },
  { id: 'monochrome', name: 'Monochrome Matrix', tag: 'Monochrome', preview: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-black' },
  { id: 'silver', name: 'Platinum Ash', tag: 'Monochrome', preview: 'bg-gradient-to-br from-zinc-900 via-neutral-950 to-black' },
  { id: 'carbon', name: 'Carbon Fiber', tag: 'Monochrome', preview: 'bg-gradient-to-br from-black via-zinc-950 to-zinc-900' },
  { id: 'graphite', name: 'Graphite Smoke', tag: 'Monochrome', preview: 'bg-gradient-to-br from-zinc-950 via-neutral-900 to-black' },
  { id: 'aurora', name: 'Aurora Glass', tag: 'Chromatic', preview: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950' },
  { id: 'nebula', name: 'Deep Nebula', tag: 'Chromatic', preview: 'bg-gradient-to-br from-purple-950 via-slate-950 to-cyan-950' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', tag: 'Chromatic', preview: 'bg-gradient-to-br from-slate-950 via-rose-950 to-blue-950' },
  { id: 'deepsea', name: 'Abyssal Deep', tag: 'Chromatic', preview: 'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950' },
  { id: 'minimal', name: 'Minimal Void', tag: 'Monochrome', preview: 'bg-gradient-to-br from-black to-zinc-950' },
];

const GLASS_MATERIALS: { id: GlassMaterial; name: string; desc: string }[] = [
  { id: 'thin', name: 'Thin Crystal', desc: 'Minimal diffusion, high background clarity' },
  { id: 'regular', name: 'Balanced Liquid', desc: 'Convex refraction & dynamic specular rim' },
  { id: 'heavy', name: 'Heavy Smoked', desc: 'Deep noir tint & maximum contrast' },
  { id: 'frosted', name: 'Matte Satin', desc: 'Diffuse frosted dispersion & high saturation' },
];

export const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'themes' | 'wallpapers' | 'optics' | 'dock' | 'backup'>('themes');

  const {
    settings,
    setThemePreset,
    setAccentColor,
    setWallpaper,
    setGlassMaterial,
    setChromaticAberration,
    setDockAutoHide,
    setDockMagnification,
    toggleDesktopIcons,
    toggleDynamicLighting,
    toggleAudioReactiveEnv,
    resetToDefaults,
  } = useSettingsStore();

  const { notes, tasks } = useProductivityStore();
  const { activities, habits } = useActivityStore();

  const handleExportBackup = () => {
    const backupData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      settings,
      notes,
      tasks,
      activities,
      habits,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aetheros-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-3 text-zinc-100 select-none">
      {/* Navigation Sub-Header Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('themes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'themes'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme Styles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallpapers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'wallpapers'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Wallpapers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('optics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'optics'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optics & Glass</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dock')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dock'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dock & Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'backup'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Portability</span>
          </button>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          title="Reset to Factory Defaults"
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
        {/* TAB 1: THEMES & AESTHETICS */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">Curated Aesthetic Presets</h3>
              <p className="text-[11px] text-zinc-400">
                Choose between monochromatic noir, vibrant cyberpunk, organic emerald, or cosmic void.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEME_PRESETS.map((t) => {
                const isSelected = settings.themePreset === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemePreset(t.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition relative overflow-hidden group ${
                      isSelected
                        ? 'border-white bg-white/15 shadow-xl ring-1 ring-white/30'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.colorPreview} border shadow-md flex items-center justify-center`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/50 text-zinc-300 border border-white/10">
                        {t.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs">{t.name}</h4>
                      <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Accent Color Palette */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <h4 className="font-semibold text-white">Custom Accent Highlight</h4>
              <p className="text-[10px] text-zinc-400">
                Fine-tune the interactive specular highlight hue across system elements.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {ACCENT_COLORS.map((acc) => {
                  const isSelected = settings.accentColor === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setAccentColor(acc.id)}
                      title={acc.name}
                      className={`w-7 h-7 rounded-full ${acc.bgClass} flex items-center justify-center transition-transform ${
                        isSelected ? `ring-4 ${acc.ringClass} scale-110 shadow-lg` : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WALLPAPERS */}
        {activeTab === 'wallpapers' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">Environmental Wallpapers</h3>
              <p className="text-[11px] text-zinc-400">
                Select your ambient atmospheric backdrop.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {WALLPAPERS.map((wp) => {
                const isSelected = settings.wallpaper === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => setWallpaper(wp.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition text-left ${
                      isSelected
                        ? 'border-white bg-white/20 shadow-lg ring-1 ring-white/40'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-full h-14 rounded-lg ${wp.preview} border border-white/15 shadow-inner relative flex items-center justify-center`}>
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                    </div>
                    <div className="w-full">
                      <span className="text-[11px] font-semibold text-white block truncate">{wp.name}</span>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase">{wp.tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: QUICKLIQUID OPTICS & GLASS */}
        {activeTab === 'optics' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">QuickLiquid Shader & Optics Engine</h3>
              <p className="text-[11px] text-zinc-400">
                Physical glass refraction materials, dispersion, and cursor-reactive lighting.
              </p>
            </div>

            {/* Glass Material Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GLASS_MATERIALS.map((mat) => {
                const isSelected = settings.glassMaterial === mat.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setGlassMaterial(mat.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                      isSelected
                        ? 'border-white bg-white/20 shadow-lg ring-1 ring-white/30'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <span className="font-bold text-white text-xs">{mat.name}</span>
                    <span className="text-[10px] text-zinc-400 leading-tight">{mat.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Dispersion and dynamic lighting */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Prismatic Dispersion (Chromatic Aberration)</span>
                  <p className="text-[10px] text-zinc-400">Refraction spectrum fringing along window edges</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.02"
                    value={settings.chromaticAberration}
                    onChange={(e) => setChromaticAberration(Number(e.target.value))}
                    className="w-28 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <span className="text-[11px] font-mono w-10 text-right text-white font-bold">
                    {Math.round(settings.chromaticAberration * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                <div>
                  <span className="font-semibold text-white">Cursor-Tracking Specular Light</span>
                  <p className="text-[10px] text-zinc-400">Dynamically tracks pointer position to calculate rim reflection angles</p>
                </div>
                <button
                  type="button"
                  onClick={toggleDynamicLighting}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    settings.dynamicLighting
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {settings.dynamicLighting ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                <div>
                  <span className="font-semibold text-white">Audio-Reactive Environmental Waves</span>
                  <p className="text-[10px] text-zinc-400">Subtle background light ripple when audio engine is playing</p>
                </div>
                <button
                  type="button"
                  onClick={toggleAudioReactiveEnv}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    settings.audioReactiveEnv
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {settings.audioReactiveEnv ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCK & DESKTOP */}
        {activeTab === 'dock' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">Dock & Workspace Behavior</h3>
              <p className="text-[11px] text-zinc-400">
                Customize dock magnification, auto-hide mechanics, and desktop icon display.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              {/* Dock Auto-Hide Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Dock Auto-Hide Behavior</span>
                  <p className="text-[10px] text-zinc-400">
                    Smart auto-hide dips the dock when interacting with windows; hovering brings it up instantly.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setDockAutoHide('smart')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      settings.dockAutoHide === 'smart'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Smart Auto-Hide
                  </button>
                  <button
                    type="button"
                    onClick={() => setDockAutoHide('never')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      settings.dockAutoHide === 'never'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Always Visible
                  </button>
                </div>
              </div>

              {/* Magnification Scale */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                <div>
                  <span className="font-semibold text-white">Dock Fisheye Magnification</span>
                  <p className="text-[10px] text-zinc-400">Controls scale factor when hovering over dock icons</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1.0"
                    max="1.6"
                    step="0.05"
                    value={settings.dockMagnification || 1.35}
                    onChange={(e) => setDockMagnification(Number(e.target.value))}
                    className="w-28 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <span className="text-[11px] font-mono w-10 text-right text-white font-bold">
                    {(settings.dockMagnification || 1.35).toFixed(2)}x
                  </span>
                </div>
              </div>

              {/* Desktop Shortcuts Toggle */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                <div>
                  <span className="font-semibold text-white">Desktop Shortcut Icons</span>
                  <p className="text-[10px] text-zinc-400">Toggle display of physical shortcuts on the desktop canvas</p>
                </div>
                <button
                  type="button"
                  onClick={toggleDesktopIcons}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    settings.showDesktopIcons
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {settings.showDesktopIcons ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{settings.showDesktopIcons ? 'Shown' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PORTABILITY & BACKUP */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm">System Portability & Data Export</h3>
              <p className="text-[11px] text-zinc-400">
                AetherOS is 100% offline-first. Your entire OS state, notes, tasks, habits, and themes can be exported at any time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">Export Complete Environment Snapshot</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Downloads a JSON file containing all user data and personalized configurations.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export Snapshot</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
