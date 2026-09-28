import { describe, it, expect } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { useWindowStore } from '../src/stores/useWindowStore';

describe('AetherOS End-to-End Desktop Integration', () => {
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
});
