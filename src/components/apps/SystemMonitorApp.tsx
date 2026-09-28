import React, { useEffect } from 'react';
import { Cpu, HardDrive, Wifi, WifiOff, Clock } from 'lucide-react';
import { useActivityStore } from '../../stores/useActivityStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { companionClient } from '../../services/companionClient';

export const SystemMonitorApp: React.FC = () => {
  const { telemetry } = useActivityStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    companionClient.connect();
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Backend Status Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between transition ${
          settings.isCompanionConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {settings.isCompanionConnected ? (
            <Wifi className="w-4 h-4 text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-400" />
          )}
          <div>
            <h4 className="text-xs font-semibold">
              {settings.isCompanionConnected ? 'Local Companion Online' : 'Companion Disconnected'}
            </h4>
            <p className="text-[10px] opacity-80">
              {settings.isCompanionConnected
                ? 'Streaming real-time CPU & memory telemetry'
                : 'Run "npm run server" in terminal to unlock local hardware telemetry'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30">
          :3001
        </span>
      </div>

      {/* Metrics Gauges */}
      <div className="grid grid-cols-2 gap-3">
        {/* CPU Gauge */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
              <Cpu className="w-4 h-4" />
              <span>CPU Load</span>
            </div>
            <span className="text-sm font-mono font-bold text-white">
              {telemetry.cpuUsage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, telemetry.cpuUsage)}%` }}
            />
          </div>
        </div>

        {/* Memory Gauge */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
              <HardDrive className="w-4 h-4" />
              <span>RAM Used</span>
            </div>
            <span className="text-sm font-mono font-bold text-white">
              {telemetry.memoryUsage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, telemetry.memoryUsage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* System Stats Footer */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>System Uptime</span>
        </div>
        <span className="font-mono text-cyan-300">
          {formatUptime(telemetry.uptimeSeconds)}
        </span>
      </div>
    </div>
  );
};
