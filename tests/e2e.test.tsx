import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { useWindowStore } from '../src/stores/useWindowStore';

describe('AetherOS End-to-End Desktop Integration', () => {
  beforeEach(() => {
    // Reset window state to default with only 'notes' open
    act(() => {
      const store = useWindowStore.getState();
      Object.keys(store.windows).forEach((key) => {
        const winId = key as keyof typeof store.windows;
        if (winId === 'notes') {
          useWindowStore.setState((s) => ({
            windows: {
              ...s.windows,
              notes: { ...s.windows.notes, isOpen: true, isMinimized: false, isMaximized: false, zIndex: 11 },
            },
            activeWindowId: 'notes',
          }));
        } else {
          useWindowStore.setState((s) => ({
            windows: {
              ...s.windows,
              [winId]: { ...s.windows[winId], isOpen: false, isMinimized: false, isMaximized: false },
            },
          }));
        }
      });
    });
  });

  it('launches apps from the dock and manages multiple windows', () => {
    render(<App />);

    // Check top status bar
    expect(screen.getByText(/Search & Launch/i)).toBeInTheDocument();

    // Check default open window Notes
    expect(screen.getAllByText(/Focus Notes/i).length).toBeGreaterThan(0);

    // Launch Tasks App via store wrapped in act
    act(() => {
      useWindowStore.getState().openWindow('tasks');
    });
    expect(screen.getAllByText(/Task Matrix/i).length).toBeGreaterThan(0);

    // Launch AetherPlayer
    act(() => {
      useWindowStore.getState().openWindow('music');
    });
    expect(screen.getAllByText(/AetherPlayer/i).length).toBeGreaterThan(0);
  });

  it('minimizes and restores windows without crashing or blanking the desktop', () => {
    render(<App />);

    // Initially Focus Notes is open
    expect(screen.getByLabelText(/Minimize Focus Notes/i)).toBeInTheDocument();

    // Click minimize button on Focus Notes
    act(() => {
      fireEvent.click(screen.getByLabelText(/Minimize Focus Notes/i));
    });

    // Window body should be minimized, but desktop canvas, centerpiece, and dock must remain visible
    expect(screen.getByText(/All windows minimized/i)).toBeInTheDocument();
    expect(screen.getByText(/Search & Launch/i)).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: /Application Dock/i })).toBeInTheDocument();

    // The minimized quick tray should show the restore button
    const restoreBtn = screen.getByTitle(/Click to restore Focus Notes/i);
    expect(restoreBtn).toBeInTheDocument();

    // Click restore
    act(() => {
      fireEvent.click(restoreBtn);
    });

    // Notes should be restored
    expect(screen.getByLabelText(/Minimize Focus Notes/i)).toBeInTheDocument();
    expect(screen.queryByText(/All windows minimized/i)).not.toBeInTheDocument();
  });

  it('handles multi-window minimize and focus transfer lifecycle', () => {
    render(<App />);

    // Open multiple windows
    act(() => {
      useWindowStore.getState().openWindow('terminal');
      useWindowStore.getState().openWindow('tasks');
    });

    expect(useWindowStore.getState().activeWindowId).toBe('tasks');

    // Minimize tasks; focus should shift to terminal
    act(() => {
      fireEvent.click(screen.getByLabelText(/Minimize Task Matrix/i));
    });
    expect(useWindowStore.getState().activeWindowId).toBe('terminal');

    // Minimize terminal; focus should shift to notes
    act(() => {
      fireEvent.click(screen.getByLabelText(/Minimize Aether Kernel Terminal/i));
    });
    expect(useWindowStore.getState().activeWindowId).toBe('notes');

    // Minimize notes; all are minimized, activeWindowId becomes null, centerpiece appears
    act(() => {
      fireEvent.click(screen.getByLabelText(/Minimize Focus Notes/i));
    });
    expect(useWindowStore.getState().activeWindowId).toBeNull();
    expect(screen.getByText(/All windows minimized/i)).toBeInTheDocument();
  });
});
