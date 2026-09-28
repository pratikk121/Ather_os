# 🌌 AetherOS: Liquid Glass Personal Life-Hub & Activity Command Center

> An ambient web desktop and command center uniting **Productivity**, **Media & Soundscapes**, and **Life Analytics (Online & Offline Activity Tracking)**, rendered with Apple-style refractive liquid glass optics powered by [`quick-liquid`](https://github.com/amarnath3003/quickLiquid).

---

## ✨ Features Overview

### 1. 🪟 Fluid Glass Window Manager & Desktop Environment
- **Refractive Liquid Dock**: MacOS/iOS style glass dock with cursor fisheye magnification, running process indicators, and liquid droplet merge physics.
- **Dynamic Specular Lighting**: Real-time cursor tracking casts realistic specular highlights across glass bevels and borders.
- **Chromatic Aberration & Refraction**: SVG backdrop displacement shaders with adjustable RGB edge dispersion (Thin Crystal, Balanced Liquid, Heavy Glass, Matte Satin).
- **Universal Spotlight Command Bar (`Cmd+K` / `Ctrl+K`)**: Instant fuzzy search to launch apps, open markdown notes, trigger soundscapes, and execute quick tasks.

### 2. 📝 Productivity Hub (FocusDesk)
- **Glass Notepad**: Live markdown scratchpad with tags, search, and one-click `.md` file export.
- **Kanban Task Matrix**: Status boards (Backlog, Today's Focus, In Progress, Completed) with priority indicators and time estimates.
- **Flow Droplet Timer**: Pomodoro focus timer with liquid arc progress fill and squish animations.

### 3. 🎵 Media & Soundscape Hub (AetherPlayer)
- **Audio Stream Player**: Music playback with queue management, live audio waveform visualizer refracted through glass, and animated spinning vinyl artwork.
- **Ambient Soundscape Generator**: Procedural multi-track Web Audio synthesizers (Rain on Glass, Ocean Waves, Warm Brown Noise, 432Hz Alpha Binaural Waves, Misty Forest) with independent glass mixer sliders.

### 4. 📊 Life Analytics & Activity Journal (LifeMetrics)
- **Online & Offline Activity Journal**: Track both digital work (coding, deep work) and offline activities (workout, reading, mindfulness, sleep).
- **28-Day Glass Contribution Matrix**: Interactive visual heatmap displaying daily focus minutes and frequency.
- **Habit Streaks & Progress Rings**: 7-day checklist with streak tracking and completion metrics.

### 5. ⚡ Local Companion Backend (Node.js + WebSockets)
- Real-time hardware telemetry streaming (CPU load, RAM utilization, Uptime).
- Persistent storage sync and offline-first IndexedDB resilience.
- Data export & portability (full JSON backup/restore).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd D:\aetheros
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Start the Local Companion Backend
To stream real-time local hardware telemetry and persistent backend sync:
```bash
npm run server
```
The companion server runs on `http://localhost:3001` with WebSocket telemetry broadcast on `ws://localhost:3001/telemetry`.

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## 🏗️ Architecture & Project Structure

```
D:\aetheros/
├── src/
│   ├── components/
│   │   ├── apps/
│   │   │   ├── ActivityJournalApp.tsx   # Online & offline activity logger
│   │   │   ├── AmbientSoundApp.tsx      # Multi-track procedural audio mixer
│   │   │   ├── FocusTimerApp.tsx        # Liquid droplet Pomodoro timer
│   │   │   ├── HabitTrackerApp.tsx       # 7-day habit streaks & rings
│   │   │   ├── MusicPlayerApp.tsx       # AetherPlayer audio queue
│   │   │   ├── NotesApp.tsx             # Markdown scratchpad & docs
│   │   │   ├── SettingsApp.tsx          # Shaders, wallpapers & backup
│   │   │   ├── SystemMonitorApp.tsx     # Hardware CPU & RAM gauges
│   │   │   └── TasksApp.tsx             # Kanban task matrix
│   │   ├── audio/
│   │   │   └── AudioVisualizer.tsx      # Canvas spectrum visualizer
│   │   ├── charts/
│   │   │   ├── GlassHeatmap.tsx         # 28-day activity matrix
│   │   │   └── GlassStreakRings.tsx     # Habit progress circular rings
│   │   ├── desktop/
│   │   │   ├── CommandPalette.tsx       # Spotlight launcher (Cmd+K)
│   │   │   ├── DesktopCanvas.tsx        # Dynamic wallpapers & workspace
│   │   │   ├── LiquidDock.tsx           # Refractive dock with fisheye
│   │   │   ├── TopBar.tsx               # Status clock & search trigger
│   │   │   └── WindowFrame.tsx          # Draggable, resizable glass frame
│   │   └── glass/
│   │       └── LiquidSurface.tsx        # QuickLiquid shader wrapper & fallback
│   ├── services/
│   │   ├── audioEngine.ts               # Web Audio API procedural synthesizers
│   │   └── companionClient.ts          # WebSocket telemetry client
│   ├── stores/
│   │   ├── useActivityStore.ts          # Activity & habit state
│   │   ├── useMediaStore.ts             # Music & ambient state
│   │   ├── useProductivityStore.ts      # Notes, tasks & pomodoro
│   │   ├── useSettingsStore.ts          # Wallpaper & glass physics presets
│   │   └── useWindowStore.ts            # Window manager (z-index, positions)
│   ├── types/
│   │   └── index.ts                     # Core TypeScript definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                        # Glass backdrop-filter utilities
├── server/
│   ├── db.js                            # Local persistent JSON / SQLite store
│   ├── index.js                         # Express + WebSocket companion server
│   └── telemetry.js                     # CPU & RAM telemetry sampler
└── tests/
    ├── e2e.test.tsx                     # Full desktop integration tests
    └── server.test.js                   # Backend & telemetry tests
```

---

## 📱 Mobile / Android Roadmap
Because AetherOS is built with responsive modular React components, clean Zustand stores, and offline-first IndexedDB:
1. **Capacitor / React Native Bridge**: The existing UI can be packaged directly for Android using `@capacitor/core` or `@capacitor/android`.
2. **Native Sensor Hooks**: Android health APIs (Step counter, Screen time, Notifications) can feed into `useActivityStore`.
3. **Android Glass Surface**: Hardware accelerated shaders using GLSL or Skia for native Android liquid glass views.
