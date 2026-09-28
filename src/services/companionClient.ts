import { useActivityStore } from '../stores/useActivityStore';
import { useSettingsStore } from '../stores/useSettingsStore';

class CompanionClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  public connect(url: string = 'ws://localhost:3001/telemetry') {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
    }

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        useSettingsStore.getState().setCompanionConnected(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'telemetry') {
            useActivityStore.getState().updateTelemetry(data.payload);
          }
        } catch {}
      };

      this.ws.onclose = () => {
        useSettingsStore.getState().setCompanionConnected(false);
        this.scheduleReconnect(url);
      };

      this.ws.onerror = () => {
        useSettingsStore.getState().setCompanionConnected(false);
      };
    } catch {
      this.scheduleReconnect(url);
    }
  }

  private scheduleReconnect(url: string) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect(url);
    }, 5000);
  }
}

export const companionClient = new CompanionClient();
