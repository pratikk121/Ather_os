import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommandPalette } from './CommandPalette';
import { useSettingsStore } from '../../stores/useSettingsStore';

describe('CommandPalette', () => {
  beforeEach(() => {
    useSettingsStore.getState().setCommandPaletteOpen(true);
  });

  it('renders command search when open and filters items', () => {
    render(<CommandPalette />);
    expect(screen.getByPlaceholderText(/Search apps, notes, commands/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Focus Notes/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Search apps, notes, commands/i);
    fireEvent.change(input, { target: { value: 'AetherPlayer' } });
    expect(screen.getByText(/Open AetherPlayer/i)).toBeInTheDocument();
    expect(screen.queryByText(/Open Habit Streaks/i)).not.toBeInTheDocument();
  });
});
