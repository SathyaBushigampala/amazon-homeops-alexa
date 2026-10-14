import { DeviceState, DeviceStatus } from '../types';

export class DeviceManager {
  private devices: Map<string, DeviceState> = new Map();
  private subscribers: Array<(devices: DeviceState[]) => void> = [];

  constructor() {
    this.initializeDefaultDevices();
    this.startAmbientTelemetryCycle();
  }

  private initializeDefaultDevices(): void {
    const defaultDevices: DeviceState[] = [
      {
        id: 'dev_thermostat_living',
        name: 'Living Room Thermostat',
        category: 'climate',
        room: 'Living Room',
        status: 'online',
        powerDrawWatts: 420,
        lastUpdated: new Date().toISOString(),
        attributes: {
          currentTemperature: 72,
          targetTemperature: 70,
          humidity: 49,
          mode: 'cool',
          fan: 'auto',
          compressorStatus: 'running'
        }
      },
      {
        id: 'dev_thermostat_bedroom',
        name: 'Master Bedroom Thermostat',
        category: 'climate',
        room: 'Master Bedroom',
        status: 'online',
        powerDrawWatts: 380,
        lastUpdated: new Date().toISOString(),
        attributes: {
          currentTemperature: 71,
          targetTemperature: 68,
          humidity: 46,
          mode: 'cool',
          fan: 'auto',
          compressorStatus: 'running'
        }
      },
      {
        id: 'dev_lock_front',
        name: 'Front Door Smart Deadbolt',
        category: 'security',
        room: 'Entryway',
        status: 'online',
        powerDrawWatts: 3,
        lastUpdated: new Date().toISOString(),
        attributes: {
          locked: true,
          doorState: 'closed',
          batteryLevel: 94,
          tamperAlert: false
        }
      },
      {
        id: 'dev_lock_patio',
        name: 'Back Patio Sliding Lock',
        category: 'security',
        room: 'Backyard / Patio',
        status: 'alerting',
        powerDrawWatts: 2,
        lastUpdated: new Date().toISOString(),
        attributes: {
          locked: false,
          doorState: 'ajar',
          batteryLevel: 88,
          tamperAlert: false
        }
      },
      {
        id: 'dev_energy_storage',
        name: 'Solar Inverter & Home Battery',
        category: 'energy',
        room: 'Garage',
        status: 'online',
        powerDrawWatts: -2800, // Negative means generating net surplus!
        lastUpdated: new Date().toISOString(),
        attributes: {
          batteryPercentage: 78,
          capacityKwh: 13.5,
          solarGenerationKw: 3.4,
          householdDrawKw: 1.2,
          gridFeedKw: 1.6,
          tariffTier: 'standard', // 'standard' | 'peak_surge' | 'off_peak'
          centsPerKwh: 14.5
        }
      },
      {
        id: 'dev_air_purifier',
        name: 'HEPA Air Purifier Pro',
        category: 'air_quality',
        room: 'Living Room',
        status: 'online',
        powerDrawWatts: 45,
        lastUpdated: new Date().toISOString(),
        attributes: {
          aqi: 68, // Moderate
          pm25: 22.4,
          fanSpeed: 'medium',
          filterLifePercent: 82,
          autoMode: true
        }
      },
      {
        id: 'dev_security_perimeter',
        name: 'Ring Perimeter Security & Floodlight',
        category: 'security',
        room: 'Exterior Perimeter',
        status: 'online',
        powerDrawWatts: 24,
        lastUpdated: new Date().toISOString(),
        attributes: {
          armedState: 'disarmed', // 'armed_home' | 'armed_away' | 'disarmed'
          motionDetected: false,
          floodlightOn: false,
          sirenActive: false
        }
      },
      {
        id: 'dev_water_main',
        name: 'Smart Water Valve & Leak Sentinel',
        category: 'water',
        room: 'Basement',
        status: 'online',
        powerDrawWatts: 4,
        lastUpdated: new Date().toISOString(),
        attributes: {
          valveOpen: true,
          flowRateGpm: 0.0,
          pipeTempF: 54,
          pressurePsi: 60,
          leakDetected: false
        }
      }
    ];

    defaultDevices.forEach(d => this.devices.set(d.id, d));
  }

  public getAllDevices(): DeviceState[] {
    return Array.from(this.devices.values());
  }

  public getDevice(id: string): DeviceState | undefined {
    return this.devices.get(id);
  }

  public updateDeviceAttribute(id: string, attribute: string, value: any): DeviceState | null {
    const dev = this.devices.get(id);
    if (!dev) return null;

    dev.attributes[attribute] = value;
    dev.lastUpdated = new Date().toISOString();

    // Auto-normalize status and power draw based on realistic physics
    if (dev.category === 'security') {
      if (dev.attributes.locked === true && (dev.attributes.doorState === 'closed' || dev.attributes.doorState === undefined)) {
        dev.status = 'online';
      } else if (dev.attributes.locked === false || dev.attributes.doorState === 'ajar') {
        dev.status = 'alerting';
      }
    }

    if (dev.category === 'climate') {
      if (attribute === 'mode') {
        if (value === 'eco') dev.powerDrawWatts = 130;
        else if (value === 'off') dev.powerDrawWatts = 5;
        else dev.powerDrawWatts = 410;
      }
    }

    if (dev.category === 'air_quality') {
      if (attribute === 'aqi') {
        dev.status = value > 100 ? 'alerting' : 'online';
      }
      if (attribute === 'fanSpeed' && value === 'turbo') {
        dev.powerDrawWatts = 65;
        dev.attributes.aqi = Math.min(dev.attributes.aqi, 35);
        dev.status = 'online';
      }
    }

    if (dev.category === 'water') {
      if (attribute === 'pipeTempF') {
        dev.status = value < 34 ? 'alerting' : 'online';
      }
    }

    this.notifySubscribers();
    return dev;
  }

  public setDeviceStatus(id: string, status: DeviceStatus): DeviceState | null {
    const dev = this.devices.get(id);
    if (!dev) return null;

    dev.status = status;
    dev.lastUpdated = new Date().toISOString();
    this.notifySubscribers();
    return dev;
  }

  public setDevicePowerDraw(id: string, watts: number): void {
    const dev = this.devices.get(id);
    if (dev) {
      dev.powerDrawWatts = watts;
      dev.lastUpdated = new Date().toISOString();
      this.notifySubscribers();
    }
  }

  public subscribe(cb: (devices: DeviceState[]) => void): () => void {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notifySubscribers(): void {
    const list = this.getAllDevices();
    this.subscribers.forEach(cb => cb(list));
  }

  public applyScenario(scenarioId: string): { scenario: string; affectedDevices: string[] } {
    const affected: string[] = [];

    switch (scenarioId) {
      case 'peak_tariff_spike':
        this.updateDeviceAttribute('dev_energy_storage', 'tariffTier', 'peak_surge');
        this.updateDeviceAttribute('dev_energy_storage', 'centsPerKwh', 48.2);
        affected.push('dev_energy_storage');
        break;

      case 'security_unlocked_night':
        this.updateDeviceAttribute('dev_lock_patio', 'locked', false);
        this.updateDeviceAttribute('dev_lock_patio', 'doorState', 'ajar');
        this.setDeviceStatus('dev_lock_patio', 'alerting');
        affected.push('dev_lock_patio');
        break;

      case 'freeze_warning':
        this.updateDeviceAttribute('dev_water_main', 'pipeTempF', 31);
        this.setDeviceStatus('dev_water_main', 'alerting');
        this.updateDeviceAttribute('dev_thermostat_living', 'currentTemperature', 58);
        affected.push('dev_water_main', 'dev_thermostat_living');
        break;

      case 'smoke_air_alert':
        this.updateDeviceAttribute('dev_air_purifier', 'aqi', 184); // Unhealthy
        this.setDeviceStatus('dev_air_purifier', 'alerting');
        affected.push('dev_air_purifier');
        break;

      case 'reset_normal':
        this.initializeDefaultDevices();
        break;
    }

    this.notifySubscribers();
    return { scenario: scenarioId, affectedDevices: affected };
  }

  private startAmbientTelemetryCycle(): void {
    // Slight fluctuations every 8 seconds for realistic dashboard telemetry
    setInterval(() => {
      const solar = this.devices.get('dev_energy_storage');
      if (solar) {
        const drift = (Math.random() - 0.5) * 0.1;
        const currentGen = Math.max(0, Number((solar.attributes.solarGenerationKw + drift).toFixed(2)));
        solar.attributes.solarGenerationKw = currentGen;
        solar.lastUpdated = new Date().toISOString();
      }
      this.notifySubscribers();
    }, 8000);
  }
}

export const deviceManager = new DeviceManager();
