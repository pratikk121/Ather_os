import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FileText,
  CheckSquare,
  Timer,
  Music,
  Waves,
  BookOpen,
  Flame,
  Activity,
  Sliders,
  Sparkles,
  Terminal,
  Folder,
  X,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { LiquidSurface } from '../glass/LiquidSurface';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useSettingsStore();
  const { openWindow } = useWindowStore();
  const { notes, addNote } = useProductivityStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const appActions: { id: string; title: string; subtitle: string; icon: any; action: () => void }[] = [
    {
      id: 'app-files',
      title: 'Open Aether Files',
      subtitle: 'Browse documents, notes, audio, and system files',
      icon: Folder,
      action: () => openWindow('files'),
    },
    {
      id: 'app-terminal',
      title: 'Open Kernel Terminal',
      subtitle: 'Execute shell commands, themes, and telemetry',
      icon: Terminal,
      action: () => openWindow('terminal'),
    },
    {
      id: 'app-notes',
      title: 'Open Focus Notes',
      subtitle: 'Markdown scratchpad and documentation',
      icon: FileText,
      action: () => openWindow('notes'),
    },
    {
      id: 'app-tasks',
      title: 'Open Task Matrix',
      subtitle: 'Kanban board for daily priorities',
      icon: CheckSquare,
      action: () => openWindow('tasks'),
    },
    {
      id: 'app-pomodoro',
      title: 'Open Flow Timer',
      subtitle: 'Pomodoro focus intervals',
      icon: Timer,
      action: () => openWindow('pomodoro'),
    },
    {
      id: 'app-music',
      title: 'Open AetherPlayer',
      subtitle: 'Music player & spectrum visualizer',
      icon: Music,
      action: () => openWindow('music'),
    },
    {
      id: 'app-ambient',
      title: 'Open Ambient Soundscapes',
      subtitle: 'Multi-track generative audio mixer',
      icon: Waves,
      action: () => openWindow('ambient'),
    },
    {
      id: 'app-journal',
      title: 'Open Life Journal',
      subtitle: 'Log online & offline activity',
      icon: BookOpen,
      action: () => openWindow('journal'),
    },
    {
      id: 'app-habits',
      title: 'Open Habit Streaks',
      subtitle: 'Track physical and mental habits',
      icon: Flame,
      action: () => openWindow('habits'),
    },
    {
      id: 'app-system',
      title: 'Open System Telemetry',
      subtitle: 'Hardware CPU, RAM, and sync status',
      icon: Activity,
      action: () => openWindow('system'),
    },
    {
      id: 'app-settings',
      title: 'Open Personalization & Theme Studio',
      subtitle: 'Customize themes, wallpapers, glass materials, and dock physics',
      icon: Sliders,
      action: () => openWindow('settings'),
    },
    {
      id: 'theme-monochrome',
      title: 'Switch Theme: Obsidian Noir (Monochrome)',
      subtitle: 'Pure pitch black smoked glass & silver specular rims',
      icon: Sparkles,
      action: () => useSettingsStore.getState().setThemePreset('monochrome'),
    },
    {
      id: 'theme-cyberpunk',
      title: 'Switch Theme: Cyber Neon',
      subtitle: 'Electric cyan, magenta & vibrant purple bioluminescence',
      icon: Sparkles,
      action: () => useSettingsStore.getState().setThemePreset('cyberpunk'),
    },
    {
      id: 'theme-emerald',
      title: 'Switch Theme: Emerald Forest',
      subtitle: 'Organic mint & calm emerald liquid glass',
      icon: Sparkles,
      action: () => useSettingsStore.getState().setThemePreset('emerald'),
    },
    {
      id: 'theme-solar',
      title: 'Switch Theme: Solar Amber',
      subtitle: 'Warm golden sunset & amber glow',
      icon: Sparkles,
      action: () => useSettingsStore.getState().setThemePreset('solar'),
    },
    {
      id: 'theme-arctic',
      title: 'Switch Theme: Arctic Crystal',
      subtitle: 'Ultra-clear ice frost & sky reflections',
      icon: Sparkles,
      action: () => useSettingsStore.getState().setThemePreset('arctic'),
    },
    {
      id: 'theme-nebula',
      title: 'Switch Theme: Deep Nebula',
      subtitle: 'Cosmic stellar dust & deep astronomical indigo',
      icon: Sparkles,
      action: () => useSettingsStore.getState().setThemePreset('nebula'),
    },
    {
      id: 'act-new-note',
      title: 'Quick Action: Create New Note',
      subtitle: 'Add a new blank markdown note',
      icon: FileText,
      action: () => {
        addNote('Quick Capture Note');
        openWindow('notes');
      },
    },
  ];

  // Also include matching notes
  const noteActions = notes.map((n) => ({
    id: `note-${n.id}`,
    title: `Note: ${n.title}`,
    subtitle: n.content.slice(0, 50) || 'Empty note',
    icon: FileText,
    action: () => {
      useProductivityStore.getState().setActiveNote(n.id);
      openWindow('notes');
    },
  }));

  const allItems = [...appActions, ...noteActions];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: (typeof allItems)[0]) => {
    item.action();
    setCommandPaletteOpen(false);
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-150"
      >
        <LiquidSurface
          material="frosted"
          borderRadius={20}
          className="p-3 shadow-2xl border border-white/20 bg-black/85"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
            <Search className="w-5 h-5 text-white" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search apps, notes, commands..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownList}
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto space-y-1 p-1 mt-2">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No matching results found for "{query}"
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-white/15 border border-white/30 text-white'
                        : 'hover:bg-white/5 text-zinc-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-white/5 text-zinc-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold">{item.title}</h4>
                        <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-white/10">
                        ↵ Return
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </LiquidSurface>
      </div>
    </div>
  );
};
