import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { getSystemTelemetry } from './telemetry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

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

// Serve production frontend from dist if available, or companion landing dashboard
if (fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'))) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/telemetry')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AetherOS Companion Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 2.5rem; max-width: 520px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
          h1 { color: #fff; margin-bottom: 0.5rem; font-size: 1.4rem; font-weight: 700; }
          p { color: #a1a1aa; font-size: 0.9rem; line-height: 1.6; }
          code { background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.85rem; font-family: monospace; color: #fff; }
          .badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); font-weight: 600; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 999px; margin-bottom: 1.2rem; }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399; }
          .btn { display: inline-block; margin-top: 1rem; background: #fff; color: #000; font-weight: 700; font-size: 0.85rem; padding: 0.6rem 1.2rem; border-radius: 10px; text-decoration: none; transition: opacity 0.2s; }
          .btn:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> Companion Server Active</div>
          <h1>🌌 AetherOS Hardware & Sync Server</h1>
          <p>The companion backend is streaming real-time hardware telemetry and sync services.</p>
          <p>For the live interactive desktop UI with hot-reloading:<br/>Run <code>npm run dev</code> and open <a href="http://localhost:5173" style="color: #38bdf8; text-decoration: underline;">http://localhost:5173</a></p>
          <p>Or build production static files:<br/>Run <code>npm run build</code></p>
        </div>
      </body>
      </html>
    `);
  });
}

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
