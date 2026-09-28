import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('AetherOS Root App', () => {
  it('renders desktop shell with AetherOS topbar and liquid dock', () => {
    render(<App />);
    expect(screen.getAllByText(/AetherOS/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Search & Launch/i)).toBeInTheDocument();
  });
});
