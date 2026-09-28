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
    <div className="flex flex-col h-full gap-3 text-content-primary">
      {/* Backend Status Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between transition ${
          settings.isCompanionConnected
            ? 'bg-status-success/15 border-status-success/40 text-status-success'
            : 'bg-status-warning/15 border-status-warning/40 text-status-warning'
        }`}
      >
        <div className="flex items-center gap-2">
          {settings.isCompanionConnected ? (
            <Wifi className="w-4 h-4 text-status-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-status-warning" />
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
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-base/50 border border-border-subtle">
          :3001
        </span>
      </div>

      {/* Metrics Gauges */}
      <div className="grid grid-cols-2 gap-3">
        {/* CPU Gauge */}
        <div className="p-3 rounded-2xl bg-surface-interactive/40 border border-border-subtle flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-accent-primary text-xs font-semibold">
              <Cpu className="w-4 h-4" />
              <span>CPU Load</span>
            </div>
            <span className="text-sm font-mono font-bold text-content-primary">
              {telemetry.cpuUsage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-interactive overflow-hidden">
            <div
              className="h-full bg-accent-primary transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, telemetry.cpuUsage)}%` }}
            />
          </div>
        </div>

        {/* Memory Gauge */}
        <div className="p-3 rounded-2xl bg-surface-interactive/40 border border-border-subtle flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-accent-secondary text-xs font-semibold">
            <HardDrive className="w-4 h-4" />
            <span>RAM Used</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-interactive overflow-hidden">
            <div
              className="h-full bg-accent-secondary transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, telemetry.memoryUsage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* System Stats Footer */}
      <div className="p-3 rounded-xl bg-surface-interactive/40 border border-border-subtle flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-content-secondary">
          <Clock className="w-4 h-4 text-accent-primary" />
          <span>System Uptime</span>
        </div>
        <span className="font-mono text-accent-primary">
          {formatUptime(telemetry.uptimeSeconds)}
        </span>
      </div>
    </div>
  );
};
