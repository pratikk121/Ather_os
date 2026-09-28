import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotesApp } from './NotesApp';
import { TasksApp } from './TasksApp';
import { FocusTimerApp } from './FocusTimerApp';

describe('Productivity Suite', () => {
  it('renders NotesApp and handles note selection', () => {
    render(<NotesApp />);
    expect(screen.getByPlaceholderText(/Search notes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Welcome to AetherOS/i).length).toBeGreaterThan(0);
  });

  it('renders TasksApp and adds a new task', () => {
    render(<TasksApp />);
    expect(screen.getByText(/Today’s Focus/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/New task/i);
    fireEvent.change(input, { target: { value: 'Write unit tests' } });
    fireEvent.click(screen.getByText(/Add/i));
    expect(screen.getByText(/Write unit tests/i)).toBeInTheDocument();
  });

  it('renders FocusTimerApp and toggles timer state', () => {
    render(<FocusTimerApp />);
    expect(screen.getByText(/Flow \(25m\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Flow/i)).toBeInTheDocument();
  });
});
