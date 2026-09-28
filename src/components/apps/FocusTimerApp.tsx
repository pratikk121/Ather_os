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
    <div className="flex flex-col items-center justify-between h-full py-2 text-slate-100">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
        <button
          onClick={() => setPomodoroMode('work')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            pomodoro.mode === 'work'
              ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Flow (25m)
        </button>
        <button
          onClick={() => setPomodoroMode('shortBreak')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            pomodoro.mode === 'shortBreak'
              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Break (5m)
        </button>
        <button
          onClick={() => setPomodoroMode('longBreak')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            pomodoro.mode === 'longBreak'
              ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Rest (15m)
        </button>
      </div>

      {/* Circular Liquid Glass Droplet Timer */}
      <div className="relative w-44 h-44 my-4 flex items-center justify-center">
        {/* Outer Glass Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/15 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl" />

        {/* SVG Progress Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="80"
            className="stroke-white/5"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r="80"
            className={`transition-all duration-1000 stroke-current ${
              pomodoro.mode === 'work' ? 'text-cyan-400' : 'text-emerald-400'
            }`}
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 80}
            strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Liquid Center Display */}
        <div className="flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">
            {timeDisplay}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-cyan-300/80 mt-1">
            {pomodoro.mode === 'work' ? 'Focusing' : 'Recharging'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => resetPomodoro()}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition shadow-lg ${
            pomodoro.isRunning
              ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 hover:bg-amber-500/40'
              : 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/40'
          }`}
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

        <div className="flex items-center gap-1 text-xs text-slate-400 px-3 py-2 rounded-full bg-white/5 border border-white/10">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>{pomodoro.sessionsCompleted}</span>
        </div>
      </div>
    </div>
  );
};
