import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MusicPlayerApp } from './MusicPlayerApp';
import { AmbientSoundApp } from './AmbientSoundApp';

describe('Media Suite', () => {
  it('renders MusicPlayerApp with playlist and controls', () => {
    render(<MusicPlayerApp />);
    expect(screen.getByText(/Queue/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Neon Horizon/i).length).toBeGreaterThan(0);
  });

  it('renders AmbientSoundApp and toggles sound tracks', () => {
    render(<AmbientSoundApp />);
    expect(screen.getByText(/Gentle Rain on Glass/i)).toBeInTheDocument();
    const turnOnButtons = screen.getAllByText(/Turn On/i);
    expect(turnOnButtons.length).toBeGreaterThan(0);
    fireEvent.click(turnOnButtons[0]);
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });
});
