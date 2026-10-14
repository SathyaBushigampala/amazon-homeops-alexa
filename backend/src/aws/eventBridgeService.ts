import { EventBridgeAlert } from '../types';

export class EventBridgeService {
  private recentEvents: EventBridgeAlert[] = [];
  private listeners: Array<(event: EventBridgeAlert) => void> = [];

  public async emitEvent(
    source: string, 
    detailType: string, 
    message: string, 
    severity: 'info' | 'warning' | 'critical' = 'info',
    metadata: Record<string, any> = {}
  ): Promise<EventBridgeAlert> {
    const alert: EventBridgeAlert = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source,
      detailType,
      severity,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.recentEvents.unshift(alert);
    if (this.recentEvents.length > 30) {
      this.recentEvents.pop();
    }

    // Notify registered proactive agent handlers
    this.listeners.forEach(fn => fn(alert));
    return alert;
  }

  public getRecentEvents(): EventBridgeAlert[] {
    return [...this.recentEvents];
  }

  public onEvent(callback: (event: EventBridgeAlert) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}

export const eventBridgeService = new EventBridgeService();
