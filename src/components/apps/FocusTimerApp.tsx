import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';

export const FocusTimerApp: React.FC = () => {
  const { pomodoro, setPomodoroMode, setPomodoroRunning, tickPomodoro, resetPomodoro } =
    useProductivityStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        tickPomodoro();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isRunning, tickPomodoro]);

  const progress =
    ((pomodoro.durationSeconds - pomodoro.remainingSeconds) / pomodoro.durationSeconds) * 100;

  const minutes = Math.floor(pomodoro.remainingSeconds / 60);
  const seconds = pomodoro.remainingSeconds % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-between h-full py-2 text-content-primary">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-interactive/60 border border-border-subtle">
        <button
          onClick={() => setPomodoroMode('work')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
            pomodoro.mode === 'work'
              ? 'bg-accent-soft text-accent-primary border border-accent-primary/40 shadow-sm'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          Flow (25m)
        </button>
        <button
          onClick={() => setPomodoroMode('shortBreak')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
            pomodoro.mode === 'shortBreak'
              ? 'bg-accent-soft text-accent-primary border border-accent-primary/40 shadow-sm'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          Break (5m)
        </button>
        <button
          onClick={() => setPomodoroMode('longBreak')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
            pomodoro.mode === 'longBreak'
              ? 'bg-accent-soft text-accent-primary border border-accent-primary/40 shadow-sm'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          Rest (15m)
        </button>
      </div>

      {/* Circular Liquid Glass Droplet Timer */}
      <div className="relative w-44 h-44 my-4 flex items-center justify-center">
        {/* Outer Glass Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border-default shadow-[0_0_30px_var(--aether-accent-soft)] backdrop-blur-xl" />

        {/* SVG Progress Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="80"
            className="stroke-surface-interactive"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r="80"
            className="transition-all duration-1000 stroke-current text-accent-primary"
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 80}
            strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Liquid Center Display */}
        <div className="flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-content-primary drop-shadow-md">
            {timeDisplay}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-accent-primary mt-1">
            {pomodoro.mode === 'work' ? 'Focusing' : 'Recharging'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => resetPomodoro()}
          className="p-2.5 rounded-full bg-surface-interactive hover:bg-surface-selected text-content-secondary border border-border-subtle transition"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition shadow-lg bg-accent-soft hover:bg-accent-primary/25 text-accent-primary border border-accent-primary/40"
        >
          {pomodoro.isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Flow</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1 text-xs text-content-muted px-3 py-2 rounded-full bg-surface-interactive border border-border-subtle">
          <Flame className="w-3.5 h-3.5 text-accent-primary" />
          <span>{pomodoro.sessionsCompleted}</span>
        </div>
      </div>
    </div>
  );
};
