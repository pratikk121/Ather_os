import React, { useEffect, useRef } from 'react';
import {
  Terminal,
  FileText,
  Folder,
  Image,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useWindowStore } from '../../stores/useWindowStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { LiquidSurface } from '../glass/LiquidSurface';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, isOpen, onClose }) => {
  const { openWindow } = useWindowStore();
  const { settings, setWallpaper, setGlassMaterial, toggleDynamicLighting } = useSettingsStore();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Clamp position to viewport
  const menuX = Math.min(x, window.innerWidth - 220);
  const menuY = Math.min(y, window.innerHeight - 300);

  const cycleWallpaper = () => {
    const wallpapers: typeof settings.wallpaper[] = ['obsidian', 'monochrome', 'silver', 'carbon', 'aurora', 'nebula', 'cyberpunk', 'deepsea', 'minimal'];
    const nextIdx = (wallpapers.indexOf(settings.wallpaper) + 1) % wallpapers.length;
    setWallpaper(wallpapers[nextIdx]);
    onClose();
  };

  const cycleGlass = () => {
    const materials: typeof settings.glassMaterial[] = ['thin', 'regular', 'heavy', 'frosted'];
    const nextIdx = (materials.indexOf(settings.glassMaterial) + 1) % materials.length;
    setGlassMaterial(materials[nextIdx]);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Desktop Context Menu"
      style={{ left: `${menuX}px`, top: `${menuY}px` }}
      className="fixed z-[99] w-52 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <LiquidSurface
        material="heavy"
        borderRadius={16}
        className="p-1.5 shadow-2xl border border-border-default bg-surface-primary/95 text-xs text-content-primary"
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            openWindow('terminal');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <Terminal className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
          <span>Launch Terminal</span>
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            openWindow('files');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <Folder className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
          <span>Open File Explorer</span>
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            openWindow('notes');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <FileText className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
          <span>New Note</span>
        </button>

        <div className="h-px bg-border-subtle my-1" />

        <button
          type="button"
          role="menuitem"
          onClick={cycleWallpaper}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
            <span>Next Wallpaper</span>
          </div>
          <span className="text-[10px] text-content-muted uppercase font-mono">{settings.wallpaper}</span>
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={cycleGlass}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
            <span>Glass Preset</span>
          </div>
          <span className="text-[10px] text-content-muted uppercase font-mono">{settings.glassMaterial}</span>
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            toggleDynamicLighting();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
            <span>Cursor Light</span>
          </div>
          <span className="text-[10px] text-accent-primary font-bold font-mono">
            {settings.dynamicLighting ? 'ON' : 'OFF'}
          </span>
        </button>

        <div className="h-px bg-border-subtle my-1" />

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            openWindow('settings');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition text-left group"
        >
          <Sliders className="w-4 h-4 text-content-muted group-hover:text-accent-primary" />
          <span>System Settings</span>
        </button>
      </LiquidSurface>
    </div>
  );
};
