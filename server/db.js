import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

// Simple, zero-dependency persistent JSON store for local sync
export class LocalStore {
  constructor() {
    this.data = {
      activities: [],
      habits: [],
      notes: [],
      tasks: [],
      settings: {},
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading DB file, initializing empty store:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  get(key) {
    return this.data[key] || [];
  }

  set(key, val) {
    this.data[key] = val;
    this.save();
  }
}

export const db = new LocalStore();
