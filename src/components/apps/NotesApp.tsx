import React, { useState } from 'react';
import { Plus, Trash2, Search, FileText, Download, Sparkles } from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';

export const NotesApp: React.FC = () => {
  const { notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNote } =
    useProductivityStore();
  const [searchQuery, setSearchQuery] = useState('');

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExport = (note: typeof activeNote) => {
    if (!note) return;
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full w-full gap-3 text-slate-100">
      {/* Sidebar List */}
      <aside aria-label="Notes sidebar" className="w-56 flex flex-col gap-2.5 border-r border-white/10 pr-3">
        {/* Search & Add */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search notes"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white/10 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="button"
            onClick={() => addNote()}
            aria-label="Create new note"
            className="p-2 min-w-[32px] min-h-[32px] rounded-lg bg-cyan-500/25 hover:bg-cyan-500/35 text-cyan-200 border border-cyan-500/40 transition flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="New Note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Note Items */}
        <div role="list" aria-label="Notes list" className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400/60" />
              <span>No notes match "{searchQuery}"</span>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = note.id === activeNote?.id;
              return (
                <div
                  key={note.id}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveNote(note.id);
                    }
                  }}
                  onClick={() => setActiveNote(note.id)}
                  aria-selected={isSelected}
                  className={`p-2.5 rounded-xl cursor-pointer transition border text-left ${
                    isSelected
                      ? 'bg-cyan-500/25 border-cyan-400/50 text-white shadow-md'
                      : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs truncate max-w-[130px] text-white">
                      {note.title || 'Untitled'}
                    </h4>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        aria-label={`Delete note: ${note.title}`}
                        className="text-slate-400 hover:text-rose-400 p-1 rounded transition focus-visible:ring-1 focus-visible:ring-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300/80 truncate mt-1 leading-tight">
                    {note.content.replace(/[#*`]/g, '') || 'Empty note...'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Editor Main */}
      <main aria-label="Note editor" className="flex-1 flex flex-col gap-2">
        {activeNote ? (
          <>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <input
                type="text"
                aria-label="Note title"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-base font-bold bg-transparent border-none text-white focus:outline-none w-full"
                placeholder="Note title..."
              />
              <button
                type="button"
                onClick={() => handleExport(activeNote)}
                aria-label="Export note as Markdown file"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export</span>
              </button>
            </div>

            <textarea
              aria-label="Note markdown content"
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              placeholder="Write your thoughts, plans, or documentation in markdown format..."
              className="flex-1 w-full bg-transparent resize-none focus:outline-none text-xs leading-relaxed text-slate-100 placeholder-slate-400 font-mono"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <FileText className="w-12 h-12 text-cyan-400/40" />
            <p className="text-xs font-medium">Select a note or create a new one</p>
          </div>
        )}
      </main>
    </div>
  );
};
