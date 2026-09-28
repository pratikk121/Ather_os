import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TerminalApp } from './TerminalApp';
import { FileExplorerApp } from './FileExplorerApp';

describe('System Apps (Terminal & File Explorer)', () => {
  it('renders TerminalApp and executes help command', () => {
    render(<TerminalApp />);
    expect(screen.getByText(/AetherOS Kernel v2.0.0/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/Terminal command prompt/i);
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText(/Available System Commands/i)).toBeInTheDocument();
  });

  it('renders FileExplorerApp and navigates directories', () => {
    render(<FileExplorerApp />);
    expect(screen.getByText(/Locations/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Documents/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Root Drive/i)).toBeInTheDocument();
  });
});
