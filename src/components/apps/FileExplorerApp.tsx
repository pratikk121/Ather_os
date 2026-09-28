import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Music,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { VirtualFile } from '../../types';

export const FileExplorerApp: React.FC = () => {
  const { notes, setActiveNote } = useProductivityStore();
  const { playlist, playTrack } = useMediaStore();
  const { openWindow } = useWindowStore();

  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Synthesize dynamic file tree from stores
  const noteFiles: VirtualFile[] = notes.map((n) => ({
    id: `file-note-${n.id}`,
    name: `${n.title}.md`,
    type: 'note',
    path: 'documents',
    size: `${Math.round(n.content.length / 10)} KB`,
    updatedAt: n.updatedAt,
    content: n.content,
  }));

  const audioFiles: VirtualFile[] = playlist.map((t, idx) => ({
    id: `file-audio-${t.id}`,
    name: `${t.title}.mp3`,
    type: 'audio',
    path: 'audio',
    size: `${Math.round(t.duration * 12)} KB`,
    updatedAt: Date.now() - idx * 86400000,
  }));

  const staticFolders: VirtualFile[] = [
    { id: 'dir-desktop', name: 'Desktop', type: 'folder', path: 'root', updatedAt: Date.now() },
    { id: 'dir-documents', name: 'Documents', type: 'folder', path: 'root', updatedAt: Date.now() },
    { id: 'dir-audio', name: 'Audio & Beats', type: 'folder', path: 'root', updatedAt: Date.now() },
    { id: 'dir-system', name: 'System & Config', type: 'folder', path: 'root', updatedAt: Date.now() },
  ];

  const allFiles: VirtualFile[] = [
    ...staticFolders,
    ...noteFiles,
    ...audioFiles,
    {
      id: 'file-sys-optics',
      name: 'quick-liquid-optics.json',
      type: 'file',
      path: 'system',
      size: '4.2 KB',
      updatedAt: Date.now(),
      content: '{\n  "engine": "QuickLiquid",\n  "refraction": "SVG Displacement",\n  "version": "2.0.0"\n}',
    },
    {
      id: 'file-sys-kernel',
      name: 'pratikos-kernel.sys',
      type: 'file',
      path: 'system',
      size: '12.8 KB',
      updatedAt: Date.now(),
      content: 'PratikOS Kernel Core [Mounted]',
    },
  ];

  const currentItems = allFiles.filter((file) => {
    if (searchQuery.trim()) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return file.path === currentFolder;
  });

  const handleItemDoubleClick = (item: VirtualFile) => {
    if (item.type === 'folder') {
      const folderKey = item.name.toLowerCase().split(' ')[0];
      setCurrentFolder(folderKey);
      setSelectedFile(null);
    } else if (item.type === 'note') {
      const noteId = item.id.replace('file-note-', '');
      setActiveNote(noteId);
      openWindow('notes');
    } else if (item.type === 'audio') {
      const audioIdx = playlist.findIndex((t) => item.id.includes(t.id));
      if (audioIdx >= 0) playTrack(audioIdx);
      openWindow('music');
    }
  };

  return (
    <div className="flex h-full gap-3 text-content-primary select-none">
      {/* Sidebar Navigation */}
      <nav aria-label="Folder navigation" className="w-44 border-r border-border-subtle pr-2 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 text-content-muted font-semibold text-[11px] uppercase tracking-wider">
          <HardDrive className="w-3.5 h-3.5 text-accent-primary" />
          <span>Locations</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentFolder('root');
            setSearchQuery('');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-left ${
            currentFolder === 'root' && !searchQuery
              ? 'bg-accent-soft text-accent-primary font-bold border border-accent-primary/30'
              : 'text-content-secondary hover:bg-surface-interactive'
          }`}
        >
          <Folder className="w-4 h-4 text-accent-primary" />
          <span>Root Drive</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentFolder('documents');
            setSearchQuery('');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-left ${
            currentFolder === 'documents' && !searchQuery
              ? 'bg-accent-soft text-accent-primary font-bold border border-accent-primary/30'
              : 'text-content-secondary hover:bg-surface-interactive'
          }`}
        >
          <FileText className="w-4 h-4 text-accent-secondary" />
          <span>Documents</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentFolder('audio');
            setSearchQuery('');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-left ${
            currentFolder === 'audio' && !searchQuery
              ? 'bg-accent-soft text-accent-primary font-bold border border-accent-primary/30'
              : 'text-content-secondary hover:bg-surface-interactive'
          }`}
        >
          <Music className="w-4 h-4 text-accent-primary" />
          <span>Audio Files</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentFolder('system');
            setSearchQuery('');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-left ${
            currentFolder === 'system' && !searchQuery
              ? 'bg-accent-soft text-accent-primary font-bold border border-accent-primary/30'
              : 'text-content-secondary hover:bg-surface-interactive'
          }`}
        >
          <HardDrive className="w-4 h-4 text-accent-secondary" />
          <span>System Files</span>
        </button>
      </nav>

      {/* Main Files Grid */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {/* Breadcrumbs & Search */}
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-content-secondary">
            {currentFolder !== 'root' && (
              <button
                type="button"
                onClick={() => setCurrentFolder('root')}
                className="p-1 rounded hover:bg-surface-interactive text-content-secondary hover:text-content-primary transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-content-muted font-mono">/aetheros</span>
            <ChevronRight className="w-3.5 h-3.5 text-content-disabled" />
            <span className="font-bold text-content-primary uppercase text-[11px]">{currentFolder}</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-content-muted" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2.5 py-1 text-xs bg-surface-interactive border border-border-subtle rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:border-accent-primary w-44"
            />
          </div>
        </div>

        {/* File Grid */}
        <div role="list" className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-1">
          {currentItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-content-muted">
              Folder is empty
            </div>
          ) : (
            currentItems.map((item) => {
              const isSelected = selectedFile?.id === item.id;
              return (
                <div
                  key={item.id}
                  role="listitem"
                  tabIndex={0}
                  onClick={() => setSelectedFile(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                    isSelected
                      ? 'bg-surface-selected border-accent-primary shadow-md ring-1 ring-accent-primary/40'
                      : 'bg-surface-interactive/40 border-border-subtle hover:bg-surface-interactive hover:border-border-default'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-interactive/60">
                    {item.type === 'folder' ? (
                      <Folder className="w-6 h-6 text-accent-primary" />
                    ) : item.type === 'note' ? (
                      <FileText className="w-6 h-6 text-accent-secondary" />
                    ) : item.type === 'audio' ? (
                      <Music className="w-6 h-6 text-accent-primary" />
                    ) : (
                      <HardDrive className="w-6 h-6 text-content-muted" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-content-primary truncate max-w-full">
                    {item.name}
                  </span>
                  {item.size && (
                    <span className="text-[10px] text-content-muted font-mono">{item.size}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected File Action Bar */}
        {selectedFile && selectedFile.type !== 'folder' && (
          <div className="p-2.5 rounded-xl bg-surface-interactive/40 border border-border-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-content-primary truncate">{selectedFile.name}</span>
              {selectedFile.size && (
                <span className="text-[10px] text-content-muted font-mono">({selectedFile.size})</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleItemDoubleClick(selectedFile)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-soft hover:bg-accent-primary/25 text-accent-primary border border-accent-primary/40 font-semibold transition"
            >
              <span>Launch / View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
