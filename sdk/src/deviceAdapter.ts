import { DeviceCategory, DeviceState, DeviceStatus } from './types';

export abstract class SmartDeviceAdapter {
  protected state: DeviceState;

  constructor(id: string, name: string, category: DeviceCategory, room: string, initialAttributes: Record<string, any> = {}) {
    this.state = {
      id,
      name,
      category,
      room,
      status: 'online',
      powerDrawWatts: 15,
      lastUpdated: new Date().toISOString(),
      attributes: initialAttributes
    };
  }

  public getState(): DeviceState {
    return { ...this.state };
  }

  public updateAttribute(key: string, value: any): DeviceState {
    this.state.attributes[key] = value;
    this.state.lastUpdated = new Date().toISOString();
    return this.getState();
  }

  public setStatus(status: DeviceStatus): void {
    this.state.status = status;
    this.state.lastUpdated = new Date().toISOString();
  }

  public setPowerDraw(watts: number): void {
    this.state.powerDrawWatts = Math.max(0, watts);
    this.state.lastUpdated = new Date().toISOString();
  }

  public abstract executeCommand(command: string, params: Record<string, any>): Promise<any>;
}

export class ThermostatAdapter extends SmartDeviceAdapter {
  constructor(id: string, name: string, room: string, currentTemp = 72, targetTemp = 70) {
    super(id, name, 'climate', room, {
      currentTemperature: currentTemp,
      targetTemperature: targetTemp,
      mode: 'cool', // 'cool' | 'heat' | 'eco' | 'off'
      fanSpeed: 'auto',
      humidity: 48,
      isEmergencyHeat: false
    });
    this.state.powerDrawWatts = 420; // Active HVAC compressor
  }

  public async executeCommand(command: string, params: Record<string, any>): Promise<any> {
    switch (command) {
      case 'set_temperature':
        const newTarget = Number(params.temperature);
        this.updateAttribute('targetTemperature', newTarget);
        if (newTarget > this.state.attributes.currentTemperature) {
          this.updateAttribute('mode', 'heat');
          this.setPowerDraw(600);
        } else {
          this.updateAttribute('mode', 'cool');
          this.setPowerDraw(450);
        }
        return { success: true, targetTemperature: newTarget, mode: this.state.attributes.mode };

      case 'set_mode':
        this.updateAttribute('mode', params.mode);
        if (params.mode === 'eco') {
          this.setPowerDraw(120);
        } else if (params.mode === 'off') {
          this.setPowerDraw(5);
        }
        return { success: true, mode: params.mode };

      case 'diagnostics':
        return {
          refrigerantPressure: 'normal',
          filterLifeRemainingPercent: 68,
          compressorRuntimeHours: 1240,
          airflowRateCfm: 820
        };

      default:
        throw new Error(`Unknown thermostat command: ${command}`);
    }
  }
}

export class SmartLockAdapter extends SmartDeviceAdapter {
  constructor(id: string, name: string, room: string) {
    super(id, name, 'security', room, {
      locked: true,
      doorState: 'closed', // 'closed' | 'ajar' | 'open'
      batteryLevel: 94,
      autoLockDelaySeconds: 30,
      failedAttempts: 0
    });
    this.state.powerDrawWatts = 2;
  }

  public async executeCommand(command: string, params: Record<string, any>): Promise<any> {
    switch (command) {
      case 'lock':
        this.updateAttribute('locked', true);
        return { success: true, locked: true };

      case 'unlock':
        this.updateAttribute('locked', false);
        return { success: true, locked: false };

      case 'set_door_state':
        this.updateAttribute('doorState', params.doorState);
        return { success: true, doorState: params.doorState };

      default:
        throw new Error(`Unknown lock command: ${command}`);
    }
  }
}

export class EnergyStorageAdapter extends SmartDeviceAdapter {
  constructor(id: string, name: string, room: string) {
    super(id, name, 'energy', room, {
      batteryPercentage: 82,
      capacityKwh: 13.5,
      currentChargeRateKw: 2.4, // Solar charging
      gridExportKw: 0.8,
      gridImportKw: 0.0,
      gridStatus: 'connected',
      offGridMode: false
    });
    this.state.powerDrawWatts = 0;
  }

  public async executeCommand(command: string, params: Record<string, any>): Promise<any> {
    switch (command) {
      case 'set_peak_shaving':
        this.updateAttribute('batteryDischargeTargetKw', params.dischargeKw || 3.0);
        return { success: true, mode: 'peak_shaving_active' };

      case 'enable_backup_reserve':
        this.updateAttribute('offGridMode', true);
        return { success: true, offGridMode: true };

      default:
        throw new Error(`Unknown energy storage command: ${command}`);
    }
  }
}
