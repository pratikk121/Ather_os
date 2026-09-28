import { create } from 'zustand';
import { Track, AmbientTrack } from '../types';

interface MediaStoreState {
  // Music Player
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  // Ambient Sounds
  ambientTracks: AmbientTrack[];

  // Music actions
  playTrack: (index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  addTrack: (track: Omit<Track, 'id'>) => void;

  // Ambient actions
  toggleAmbientTrack: (id: string) => void;
  setAmbientVolume: (id: string, volume: number) => void;
  stopAllAmbient: () => void;
}

const DEFAULT_PLAYLIST: Track[] = [
  {
    id: 'track-1',
    title: 'Neon Horizon (Synthesized Drift)',
    artist: 'Aether Wave',
    duration: 184,
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
  {
    id: 'track-2',
    title: 'Liquid Aurora (Deep Chill)',
    artist: 'Prismatics',
    duration: 210,
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
  },
  {
    id: 'track-3',
    title: 'Flow State (Binaural Focus)',
    artist: 'NeuroWave',
    duration: 195,
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3',
  },
];

const DEFAULT_AMBIENT: AmbientTrack[] = [
  { id: 'ambient-rain', name: 'Gentle Rain on Glass', type: 'rain', volume: 0.5, isPlaying: false },
  { id: 'ambient-waves', name: 'Deep Ocean Waves', type: 'waves', volume: 0.4, isPlaying: false },
  { id: 'ambient-brown', name: 'Warm Brown Noise', type: 'brownNoise', volume: 0.3, isPlaying: false },
  { id: 'ambient-binaural', name: '432Hz Alpha Waves', type: 'binaural', volume: 0.4, isPlaying: false },
  { id: 'ambient-forest', name: 'Misty Pine Forest', type: 'forest', volume: 0.4, isPlaying: false },
];

export const useMediaStore = create<MediaStoreState>((set, get) => ({
  playlist: DEFAULT_PLAYLIST,
  currentTrackIndex: 0,
  isPlaying: false,
  volume: 0.75,
  currentTime: 0,
  duration: 184,
  ambientTracks: DEFAULT_AMBIENT,

  playTrack: (index) => {
    set({
      currentTrackIndex: index,
      isPlaying: true,
      currentTime: 0,
      duration: get().playlist[index]?.duration || 180,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  nextTrack: () => {
    const { playlist, currentTrackIndex } = get();
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    set({
      currentTrackIndex: nextIndex,
      currentTime: 0,
      duration: playlist[nextIndex]?.duration || 180,
    });
  },

  prevTrack: () => {
    const { playlist, currentTrackIndex } = get();
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    set({
      currentTrackIndex: prevIndex,
      currentTime: 0,
      duration: playlist[prevIndex]?.duration || 180,
    });
  },

  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),

  addTrack: (track) => {
    const id = `track-${Date.now()}`;
    set((state) => ({ playlist: [...state.playlist, { ...track, id }] }));
  },

  toggleAmbientTrack: (id) => {
    set((state) => ({
      ambientTracks: state.ambientTracks.map((t) =>
        t.id === id ? { ...t, isPlaying: !t.isPlaying } : t
      ),
    }));
  },

  setAmbientVolume: (id, volume) => {
    set((state) => ({
      ambientTracks: state.ambientTracks.map((t) =>
        t.id === id ? { ...t, volume } : t
      ),
    }));
  },

  stopAllAmbient: () => {
    set((state) => ({
      ambientTracks: state.ambientTracks.map((t) => ({ ...t, isPlaying: false })),
    }));
  },
}));
