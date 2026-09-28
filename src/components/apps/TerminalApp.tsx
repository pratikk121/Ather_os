import React, { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '../../stores/useWindowStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { WindowId } from '../../types';

interface CommandLog {
  id: string;
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

export const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: '',
      output: (
        <div className="text-content-secondary space-y-1">
          <p className="text-accent-primary font-bold">🌌 AetherOS Kernel v2.0.0 [Physical Glass Engine]</p>
          <p className="text-xs text-content-muted">Lineage: PratikOS v1.0.0 &bull; QuickLiquid Optics &bull; Local-First</p>
          <p className="text-xs text-content-muted">Type <span className="text-accent-primary font-semibold">'help'</span> for a list of available physical commands.</p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { openWindow, closeWindow } = useWindowStore();
  const { settings, setThemePreset, setWallpaper, setGlassMaterial, setChromaticAberration } = useSettingsStore();
  const { togglePlay, nextTrack, prevTrack, isPlaying } = useMediaStore();
  const { notes, addNote } = useProductivityStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: string | React.ReactNode = '';
    let isError = false;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-accent-primary font-bold">Available System Commands:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-content-secondary">
              <div><span className="text-accent-primary font-mono">open &lt;app&gt;</span> - Launch window (notes, tasks, music, files, etc.)</div>
              <div><span className="text-accent-primary font-mono">close &lt;app&gt;</span> - Close window</div>
              <div><span className="text-accent-primary font-mono">theme &lt;name&gt;</span> - monochrome, cyberpunk, emerald, solar, arctic, nebula</div>
              <div><span className="text-accent-primary font-mono">wallpaper &lt;name&gt;</span> - obsidian, aurora, nebula, cyberpunk, deepsea, minimal</div>
              <div><span className="text-accent-primary font-mono">glass &lt;preset&gt;</span> - thin, regular, heavy, frosted</div>
              <div><span className="text-accent-primary font-mono">dispersion &lt;val&gt;</span> - Set chromatic aberration (0.0 - 0.5)</div>
              <div><span className="text-accent-primary font-mono">audio &lt;action&gt;</span> - play, pause, next, prev</div>
              <div><span className="text-accent-primary font-mono">note &lt;title&gt;</span> - Quick capture a new markdown note</div>
              <div><span className="text-accent-primary font-mono">ls</span> - List directory contents and documents</div>
              <div><span className="text-accent-primary font-mono">top</span> - View CPU, memory, and telemetry snapshot</div>
              <div><span className="text-accent-primary font-mono">clear</span> - Clear terminal buffer</div>
              <div><span className="text-accent-primary font-mono">whoami / version</span> - Kernel information</div>
            </div>
          </div>
        );
        break;

      case 'clear':
        setLogs([]);
        return;

      case 'open':
        if (!args[0]) {
          output = 'Usage: open <notes|tasks|pomodoro|music|ambient|journal|habits|system|settings|files>';
          isError = true;
        } else {
          const appName = args[0].toLowerCase() as WindowId;
          openWindow(appName);
          output = `✨ Launched window: [${appName}]`;
        }
        break;

      case 'close':
        if (!args[0]) {
          output = 'Usage: close <app-id>';
          isError = true;
        } else {
          closeWindow(args[0].toLowerCase() as WindowId);
          output = `Closed window: [${args[0]}]`;
        }
        break;

      case 'theme':
        if (!args[0]) {
          output = `Current theme preset: ${settings.themePreset}. Available: monochrome, cyberpunk, emerald, solar, arctic, nebula`;
        } else {
          const t = args[0].toLowerCase();
          if (['monochrome', 'cyberpunk', 'emerald', 'solar', 'arctic', 'nebula'].includes(t)) {
            setThemePreset(t as any);
            output = `Active theme material shifted to [${t}].`;
          } else {
            output = `Unknown theme preset: ${t}`;
            isError = true;
          }
        }
        break;

      case 'wallpaper':
        if (!args[0]) {
          output = `Current wallpaper: ${settings.wallpaper}. Available: obsidian, monochrome, silver, carbon, aurora, nebula, cyberpunk, deepsea, minimal`;
        } else {
          const w = args[0].toLowerCase();
          if (['obsidian', 'monochrome', 'silver', 'carbon', 'aurora', 'nebula', 'cyberpunk', 'deepsea', 'minimal'].includes(w)) {
            setWallpaper(w as any);
            output = `Wallpaper shifted to [${w}].`;
          } else {
            output = `Unknown wallpaper: ${w}`;
            isError = true;
          }
        }
        break;

      case 'glass':
        if (!args[0]) {
          output = `Current glass material: ${settings.glassMaterial}. Available: thin, regular, heavy, frosted`;
        } else {
          const m = args[0].toLowerCase();
          if (['thin', 'regular', 'heavy', 'frosted'].includes(m)) {
            setGlassMaterial(m as any);
            output = `Glass refraction material updated to [${m}].`;
          } else {
            output = `Unknown glass preset: ${m}`;
            isError = true;
          }
        }
        break;

      case 'dispersion':
        if (!args[0]) {
          output = `Chromatic aberration: ${settings.chromaticAberration}`;
        } else {
          const num = parseFloat(args[0]);
          if (!isNaN(num) && num >= 0 && num <= 0.5) {
            setChromaticAberration(num);
            output = `Chromatic dispersion scale set to ${num * 100}%`;
          } else {
            output = 'Invalid dispersion value. Provide a number between 0.0 and 0.5';
            isError = true;
          }
        }
        break;

      case 'audio':
        if (args[0] === 'play' || args[0] === 'pause') {
          togglePlay();
          output = isPlaying ? 'Audio paused' : 'Audio playing';
        } else if (args[0] === 'next') {
          nextTrack();
          output = 'Skipped to next track';
        } else if (args[0] === 'prev') {
          prevTrack();
          output = 'Returned to previous track';
        } else {
          output = 'Usage: audio <play|pause|next|prev>';
          isError = true;
        }
        break;

      case 'note':
        const noteTitle = args.join(' ') || 'Terminal Note';
        addNote(noteTitle, '# Created from AetherOS Kernel\n\n- Captured via terminal shell.');
        openWindow('notes');
        output = `Created and opened note: "${noteTitle}"`;
        break;

      case 'ls':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-content-muted">Directory listing for /aetheros/root:</p>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <span className="text-accent-primary">📁 desktop/</span>
              <span className="text-accent-primary">📁 documents/</span>
              <span className="text-accent-primary">📁 audio/</span>
              <span className="text-status-success">📄 focus-matrix.md</span>
              <span className="text-status-success">📄 optics-spec.md</span>
              <span className="text-accent-secondary">🎵 lofi-flow.mp3</span>
            </div>
            <p className="text-[11px] text-content-muted mt-1">Total {notes.length} note files mounted in IndexedDB.</p>
          </div>
        );
        break;

      case 'top':
        output = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-accent-primary font-bold">System Telemetry Snapshot</p>
            <p>Platform: {navigator.platform} &bull; UserAgent: {navigator.userAgent.slice(0, 40)}...</p>
            <p>Active Windows: {useWindowStore.getState().activeWindowId || 'None'}</p>
            <p>Companion Bridge: {settings.isCompanionConnected ? '🟢 CONNECTED (Port 3001)' : '🟡 OFFLINE (IndexedDB Mode)'}</p>
          </div>
        );
        break;

      case 'whoami':
        output = 'pratikk121 (AetherOS Operator / Architect)';
        break;

      case 'date':
        output = new Date().toUTCString();
        break;

      case 'version':
        output = 'AetherOS v2.0.0 (Core: QuickLiquid Refractive Engine + PratikOS Kernel Lineage)';
        break;

      default:
        output = `Command not recognized: "${cmd}". Type 'help' for system instructions.`;
        isError = true;
        break;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output,
        isError,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx] || '');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-surface-base/90 rounded-xl font-mono text-xs text-content-primary p-3 overflow-hidden cursor-text border border-border-subtle shadow-inner"
    >
      {/* Logs Output */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {logs.map((log) => (
          <div key={log.id} className="space-y-1 leading-relaxed">
            {log.command && (
              <div className="flex items-center space-x-2 text-content-muted">
                <span className="text-accent-primary font-bold">pratik@aether:~$</span>
                <span className="text-content-primary font-semibold">{log.command}</span>
              </div>
            )}
            <div className={log.isError ? 'text-status-error' : 'text-content-secondary'}>{log.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Input Prompt */}
      <div className="flex items-center space-x-2 border-t border-border-subtle pt-2 mt-2">
        <span className="text-accent-primary font-bold">pratik@aether:~$</span>
        <input
          ref={inputRef}
          type="text"
          aria-label="Terminal command prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-content-primary focus:outline-none font-mono text-xs placeholder-content-muted"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  );
};
