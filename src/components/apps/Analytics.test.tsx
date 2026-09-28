import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityJournalApp } from './ActivityJournalApp';
import { HabitTrackerApp } from './HabitTrackerApp';
import { SystemMonitorApp } from './SystemMonitorApp';

describe('Analytics & LifeMetrics Suite', () => {
  it('renders ActivityJournalApp and logs new activity', () => {
    render(<ActivityJournalApp />);
    expect(screen.getByText(/28-Day Activity Matrix/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/What did you work on or do/i);
    fireEvent.change(input, { target: { value: 'Reading React Docs' } });
    fireEvent.click(screen.getByText(/^Log$/i));
    expect(screen.getByText(/Reading React Docs/i)).toBeInTheDocument();
  });

  it('renders HabitTrackerApp and displays streak rings', () => {
    render(<HabitTrackerApp />);
    expect(screen.getAllByText(/Morning Meditation & Breathwork/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/New habit/i)).toBeInTheDocument();
  });

  it('renders SystemMonitorApp and displays gauges', () => {
    render(<SystemMonitorApp />);
    expect(screen.getByText(/CPU Load/i)).toBeInTheDocument();
    expect(screen.getByText(/RAM Used/i)).toBeInTheDocument();
  });
});
