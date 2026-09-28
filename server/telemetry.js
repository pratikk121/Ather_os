import os from 'os';

let lastCpuInfo = os.cpus();

function getCpuUsage() {
  const cpus = os.cpus();
  let idleDifference = 0;
  let totalDifference = 0;

  for (let i = 0; i < cpus.length; i++) {
    const prev = lastCpuInfo[i]?.times || { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 };
    const curr = cpus[i].times;

    const prevTotal = prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
    const currTotal = curr.user + curr.nice + curr.sys + curr.idle + curr.irq;

    totalDifference += currTotal - prevTotal;
    idleDifference += curr.idle - prev.idle;
  }

  lastCpuInfo = cpus;

  if (totalDifference === 0) return 15;
  const usage = 100 - Math.floor((idleDifference / totalDifference) * 100);
  return Math.max(0, Math.min(100, usage));
}

export function getSystemTelemetry() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

  return {
    cpuUsage: getCpuUsage(),
    memoryUsage: usedMemPercent,
    uptimeSeconds: Math.floor(os.uptime()),
    platform: os.platform(),
    arch: os.arch(),
  };
}
