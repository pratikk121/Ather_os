import React, { useState } from 'react';
import { Plus, Trash2, Search, FileText, Download } from 'lucide-react';
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
      <div className="w-52 flex flex-col gap-2 border-r border-white/10 pr-3">
        {/* Search & Add */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={() => addNote()}
            className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition"
            title="New Note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Note Items */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredNotes.map((note) => {
            const isSelected = note.id === activeNote?.id;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={`p-2.5 rounded-xl cursor-pointer transition border text-left ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-white shadow-sm'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-xs truncate max-w-[120px]">
                    {note.title || 'Untitled'}
                  </h4>
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {note.content.replace(/[#*`]/g, '') || 'Empty note...'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 flex flex-col gap-2">
        {activeNote ? (
          <>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-base font-bold bg-transparent border-none text-white focus:outline-none w-full"
                placeholder="Note title..."
              />
              <button
                onClick={() => handleExport(activeNote)}
                className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Export</span>
              </button>
            </div>

            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              placeholder="Write in markdown format..."
              className="flex-1 w-full bg-transparent resize-none focus:outline-none text-xs leading-relaxed text-slate-200 placeholder-slate-500 font-mono"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileText className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-xs">No note selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
