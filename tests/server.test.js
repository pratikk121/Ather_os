import { describe, it, expect } from 'vitest';
import { db } from '../server/db.js';
import { getSystemTelemetry } from '../server/telemetry.js';

describe('AetherOS Companion Server Core', () => {
  it('stores and retrieves data from local database store', () => {
    db.set('test_key', [{ id: 1, name: 'Sample' }]);
    const retrieved = db.get('test_key');
    expect(retrieved).toEqual([{ id: 1, name: 'Sample' }]);
  });

  it('generates system telemetry with cpu and memory metrics', () => {
    const telemetry = getSystemTelemetry();
    expect(telemetry.cpuUsage).toBeGreaterThanOrEqual(0);
    expect(telemetry.memoryUsage).toBeGreaterThanOrEqual(0);
    expect(telemetry.uptimeSeconds).toBeGreaterThan(0);
  });
});
