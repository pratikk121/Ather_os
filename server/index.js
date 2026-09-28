import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import { db } from './db.js';
import { getSystemTelemetry } from './telemetry.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Enable CORS for local Vite dev server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health / Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', name: 'AetherOS Companion Server', time: Date.now() });
});

// Database Sync Endpoints
app.get('/api/data/:key', (req, res) => {
  const data = db.get(req.params.key);
  res.json({ key: req.params.key, data });
});

app.post('/api/data/:key', (req, res) => {
  db.set(req.params.key, req.body);
  res.json({ success: true, key: req.params.key });
});

// Telemetry Snapshot
app.get('/api/telemetry', (req, res) => {
  res.json(getSystemTelemetry());
});

const server = http.createServer(app);

// WebSocket Server for live Telemetry broadcast
const wss = new WebSocketServer({ server, path: '/telemetry' });

wss.on('connection', (ws) => {
  // Send immediate telemetry
  ws.send(JSON.stringify({ type: 'telemetry', payload: getSystemTelemetry() }));

  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'telemetry', payload: getSystemTelemetry() }));
    }
  }, 2000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`🌌 AetherOS Companion Server listening on http://localhost:${PORT}`);
});
