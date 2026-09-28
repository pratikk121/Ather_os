// Window Types
export type WindowId = 'notes' | 'tasks' | 'pomodoro' | 'music' | 'ambient' | 'journal' | 'habits' | 'system' | 'settings';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// Productivity Types
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
}

export type TaskStatus = 'backlog' | 'today' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimateMinutes?: number;
  completedAt?: number;
  createdAt: number;
}

export interface PomodoroState {
  mode: 'work' | 'shortBreak' | 'longBreak';
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  sessionsCompleted: number;
}

// Media Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  url: string;
  duration: number;
}

export interface AmbientTrack {
  id: string;
  name: string;
  type: 'rain' | 'waves' | 'brownNoise' | 'binaural' | 'forest';
  volume: number;
  isPlaying: boolean;
}

// Activity & Analytics Types
export type ActivityCategory = 'productivity' | 'coding' | 'reading' | 'fitness' | 'mindfulness' | 'social' | 'sleep';

export interface ActivityEntry {
  id: string;
  title: string;
  category: ActivityCategory;
  type: 'online' | 'offline';
  durationMinutes: number;
  timestamp: number;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  targetPerWeek: number;
  completedDates: string[]; // ISO date strings 'YYYY-MM-DD'
  streak: number;
}

// System Settings Types
export interface SystemSettings {
  wallpaper: 'nebula' | 'aurora' | 'cyberpunk' | 'deepsea' | 'minimal';
  glassMaterial: 'thin' | 'regular' | 'heavy' | 'frosted';
  chromaticAberration: number;
  dynamicLighting: boolean;
  dropletMerge: boolean;
  companionUrl: string;
  isCompanionConnected: boolean;
}

export interface SystemTelemetry {
  cpuUsage: number;
  memoryUsage: number;
  uptimeSeconds: number;
  batteryLevel?: number;
  isCharging?: boolean;
}
