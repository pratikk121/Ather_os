import React from 'react';
import { Image, Sparkles, Download } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { useActivityStore } from '../../stores/useActivityStore';

const WALLPAPERS = [
  { id: 'aurora', name: 'Aurora Glass', preview: 'bg-gradient-to-r from-cyan-900 to-indigo-900' },
  { id: 'nebula', name: 'Deep Nebula', preview: 'bg-gradient-to-r from-purple-900 to-slate-900' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', preview: 'bg-gradient-to-r from-rose-900 to-blue-900' },
  { id: 'deepsea', name: 'Abyssal Deep', preview: 'bg-gradient-to-r from-teal-900 to-slate-950' },
  { id: 'minimal', name: 'Obsidian Minimal', preview: 'bg-gradient-to-r from-slate-950 to-zinc-900' },
] as const;

const GLASS_MATERIALS = [
  { id: 'thin', name: 'Thin Crystal', desc: 'Subtle frost, high clarity' },
  { id: 'regular', name: 'Balanced Liquid', desc: 'Convex refraction & specular edge' },
  { id: 'heavy', name: 'Heavy Glass', desc: 'Deep refraction & dark tint' },
  { id: 'frosted', name: 'Matte Satin', desc: 'Maximum diffuse light & saturation' },
] as const;

export const SettingsApp: React.FC = () => {
  const {
    settings,
    setWallpaper,
    setGlassMaterial,
    setChromaticAberration,
    toggleDynamicLighting,
  } = useSettingsStore();

  const { notes, tasks } = useProductivityStore();
  const { activities, habits } = useActivityStore();

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
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
    a.download = `aetheros-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-4 text-slate-100 overflow-y-auto pr-1">
      {/* Wallpapers */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Image className="w-4 h-4 text-cyan-400" />
          <span>Ambient Wallpaper Theme</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                settings.wallpaper === wp.id
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-md'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <div className={`w-full h-8 rounded-lg ${wp.preview} border border-white/10`} />
              <span className="text-[10px] font-medium text-slate-300">{wp.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* QuickLiquid Shaders & Optics */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>QuickLiquid Optics & Shader Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GLASS_MATERIALS.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setGlassMaterial(mat.id)}
              className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                settings.glassMaterial === mat.id
                  ? 'border-indigo-400 bg-indigo-500/20 shadow-md'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <span className="text-xs font-semibold text-white">{mat.name}</span>
              <span className="text-[10px] text-slate-400 leading-tight">{mat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dispersion & Lighting Sliders */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-slate-200">Chromatic Aberration (RGB Edge Dispersion)</span>
            <p className="text-[10px] text-slate-400">Controls prismatic refraction fringing across glass rims</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.02"
              value={settings.chromaticAberration}
              onChange={(e) => setChromaticAberration(Number(e.target.value))}
              className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <span className="text-[10px] font-mono w-8 text-right text-indigo-300">
              {Math.round(settings.chromaticAberration * 100)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <span className="font-medium text-slate-200">Dynamic Specular Rim Lighting</span>
            <p className="text-[10px] text-slate-400">Angle tracks cursor motion across desktop</p>
          </div>
          <button
            onClick={toggleDynamicLighting}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              settings.dynamicLighting
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            {settings.dynamicLighting ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Backup & Data Portability */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-200">Offline-First Backup & Data Portability</h4>
          <p className="text-[10px] text-slate-400">Export your notes, tasks, habits, and timeline as JSON</p>
        </div>
        <button
          onClick={handleExportBackup}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>
    </div>
  );
};
