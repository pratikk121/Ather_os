import React, { useState } from 'react';
import { Plus, Trash2, Search, Download, Sparkles } from 'lucide-react';
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
    <div className="flex h-full w-full gap-3 text-content-primary">
      {/* Sidebar List */}
      <aside aria-label="Notes sidebar" className="w-56 flex flex-col gap-2.5 border-r border-border-subtle pr-3">
        {/* Search & Add */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-content-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search notes"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-surface-interactive border border-border-subtle rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:border-accent-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => addNote()}
            aria-label="Create new note"
            className="p-2 min-w-[32px] min-h-[32px] rounded-lg bg-accent-soft hover:bg-accent-primary/25 text-accent-primary border border-accent-primary/40 transition flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-primary"
            title="New Note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Note Items */}
        <div role="list" aria-label="Notes list" className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-xs text-content-muted flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-primary/60" />
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
                      ? 'bg-surface-selected border-accent-primary/60 text-content-primary shadow-md'
                      : 'bg-surface-interactive/40 border-border-subtle hover:bg-surface-interactive text-content-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs truncate max-w-[130px] text-content-primary">
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
                        className="text-content-muted hover:text-status-error p-1 rounded transition focus-visible:ring-1 focus-visible:ring-status-error"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-content-muted truncate mt-1 leading-tight">
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
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <input
                type="text"
                aria-label="Note title"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-base font-bold bg-transparent border-none text-content-primary focus:outline-none w-full"
                placeholder="Note title..."
              />
              <button
                type="button"
                onClick={() => handleExport(activeNote)}
                aria-label="Export note as Markdown file"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-surface-interactive hover:bg-surface-selected text-content-secondary hover:text-content-primary border border-border-subtle transition focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <Download className="w-3.5 h-3.5 text-accent-primary" />
                <span>Export</span>
              </button>
            </div>

            <textarea
              aria-label="Note markdown content"
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 w-full bg-surface-interactive/30 border border-border-subtle rounded-xl p-3 text-xs text-content-primary placeholder-content-muted focus:outline-none focus:border-accent-primary resize-none font-mono leading-relaxed"
              placeholder="Write your note with markdown support..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-content-muted">
            Select or create a note
          </div>
        )}
      </main>
    </div>
  );
};
