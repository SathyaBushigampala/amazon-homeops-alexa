import { deviceManager } from '../devices/deviceManager';

export interface ToolExecutionResult {
  tool: string;
  target: string;
  status: 'success' | 'failed' | 'requires_confirmation';
  message: string;
  data?: any;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  isDangerous?: boolean;
  execute: (params: any) => Promise<ToolExecutionResult>;
}

export const agentTools: Record<string, AgentTool> = {
  diagnose_system_anomalies: {
    name: 'diagnose_system_anomalies',
    description: 'Performs a comprehensive diagnostic sweep across smart home telemetry (climate, security, energy, air, plumbing).',
    parameters: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain to isolate (all, climate, security, energy, water, air_quality)',
          enum: ['all', 'climate', 'security', 'energy', 'water', 'air_quality']
        }
      }
    },
    execute: async (params) => {
      const devices = deviceManager.getAllDevices();
      const domain = params.domain || 'all';

      const filtered = domain === 'all' 
        ? devices 
        : devices.filter(d => d.category === domain);

      const anomalies: Array<{ id: string; name: string; issue: string; severity: string }> = [];

      filtered.forEach(dev => {
        if (dev.status === 'alerting') {
          anomalies.push({
            id: dev.id,
            name: dev.name,
            issue: `Device in alerting state with attributes: ${JSON.stringify(dev.attributes)}`,
            severity: 'high'
          });
        }
        if (dev.category === 'security' && dev.attributes.locked === false) {
          anomalies.push({
            id: dev.id,
            name: dev.name,
            issue: `Door/access point is unlocked or ajar (${dev.attributes.doorState})`,
            severity: 'medium'
          });
        }
        if (dev.category === 'water' && dev.attributes.pipeTempF < 34) {
          anomalies.push({
            id: dev.id,
            name: dev.name,
            issue: `Pipe temperature at ${dev.attributes.pipeTempF}°F - immediate freeze risk detected`,
            severity: 'critical'
          });
        }
        if (dev.category === 'energy' && dev.attributes.tariffTier === 'peak_surge') {
          anomalies.push({
            id: dev.id,
            name: dev.name,
            issue: `Utility grid is in Peak Surge ($${dev.attributes.centsPerKwh}¢/kWh)`,
            severity: 'high'
          });
        }
        if (dev.category === 'air_quality' && dev.attributes.aqi > 100) {
          anomalies.push({
            id: dev.id,
            name: dev.name,
            issue: `Indoor Air Quality degraded (AQI ${dev.attributes.aqi})`,
            severity: 'high'
          });
        }
      });

      return {
        tool: 'diagnose_system_anomalies',
        target: domain,
        status: 'success',
        message: `Diagnostics complete. Found ${anomalies.length} anomaly conditions.`,
        data: {
          totalDevicesScanned: filtered.length,
          anomalies
        }
      };
    }
  },

  adjust_climate_zone: {
    name: 'adjust_climate_zone',
    description: 'Adjusts target temperature and operating mode for an HVAC thermostat zone.',
    parameters: {
      type: 'object',
      properties: {
        zoneId: { type: 'string', description: 'Device ID (e.g. dev_thermostat_living, dev_thermostat_bedroom, or all)' },
        targetTemperature: { type: 'number', description: 'Target temperature in Fahrenheit' },
        mode: { type: 'string', enum: ['cool', 'heat', 'eco', 'off'] }
      },
      required: ['zoneId']
    },
    execute: async (params) => {
      const targets = params.zoneId === 'all' 
        ? ['dev_thermostat_living', 'dev_thermostat_bedroom']
        : [params.zoneId];

      targets.forEach(id => {
        if (params.targetTemperature) {
          deviceManager.updateDeviceAttribute(id, 'targetTemperature', params.targetTemperature);
        }
        if (params.mode) {
          deviceManager.updateDeviceAttribute(id, 'mode', params.mode);
        }
        // Adjust power draw according to eco or regular
        if (params.mode === 'eco') {
          deviceManager.setDevicePowerDraw(id, 120);
        } else if (params.mode === 'off') {
          deviceManager.setDevicePowerDraw(id, 5);
        } else {
          deviceManager.setDevicePowerDraw(id, 400);
        }
        deviceManager.setDeviceStatus(id, 'online');
      });

      return {
        tool: 'adjust_climate_zone',
        target: params.zoneId,
        status: 'success',
        message: `Thermostat zone(s) updated to ${params.targetTemperature || 'current'}°F in ${params.mode || 'standard'} mode.`,
        data: { targets, appliedParams: params }
      };
    }
  },

  execute_security_lockdown: {
    name: 'execute_security_lockdown',
    description: 'Secures perimeter deadbolts, arms motion and floodlight security sensors.',
    parameters: {
      type: 'object',
      properties: {
        level: { type: 'string', enum: ['perimeter', 'full'], description: 'Security level to arm' }
      }
    },
    execute: async (params) => {
      // Lock front door
      deviceManager.updateDeviceAttribute('dev_lock_front', 'locked', true);
      deviceManager.setDeviceStatus('dev_lock_front', 'online');

      // Lock back patio
      deviceManager.updateDeviceAttribute('dev_lock_patio', 'locked', true);
      deviceManager.updateDeviceAttribute('dev_lock_patio', 'doorState', 'closed');
      deviceManager.setDeviceStatus('dev_lock_patio', 'online');

      // Arm Ring perimeter
      deviceManager.updateDeviceAttribute('dev_security_perimeter', 'armedState', 'armed_home');
      deviceManager.updateDeviceAttribute('dev_security_perimeter', 'floodlightOn', true);
      deviceManager.setDeviceStatus('dev_security_perimeter', 'online');

      return {
        tool: 'execute_security_lockdown',
        target: 'all_perimeter_access_points',
        status: 'success',
        message: 'Perimeter locks secured and Ring security perimeter armed to Home Armed mode.',
        data: { level: params.level || 'perimeter', securedLocks: ['dev_lock_front', 'dev_lock_patio'] }
      };
    }
  },

  optimize_energy_draw: {
    name: 'optimize_energy_draw',
    description: 'Switches home energy profile to battery discharge / peak shaving to avoid high utility rates.',
    parameters: {
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['battery_peak_shaving', 'eco_curtailment', 'balanced'] }
      }
    },
    execute: async (params) => {
      // Energy storage battery discharge
      deviceManager.updateDeviceAttribute('dev_energy_storage', 'householdDrawKw', 0.4);
      deviceManager.updateDeviceAttribute('dev_energy_storage', 'gridFeedKw', 0.0);
      deviceManager.setDeviceStatus('dev_energy_storage', 'online');

      // Shift HVACs to Eco
      deviceManager.updateDeviceAttribute('dev_thermostat_living', 'mode', 'eco');
      deviceManager.setDevicePowerDraw('dev_thermostat_living', 140);
      deviceManager.updateDeviceAttribute('dev_thermostat_bedroom', 'mode', 'eco');
      deviceManager.setDevicePowerDraw('dev_thermostat_bedroom', 120);

      return {
        tool: 'optimize_energy_draw',
        target: 'grid_and_hvac_draw',
        status: 'success',
        message: 'Dispatched battery peak-shaving and throttled HVAC to Eco mode. Saved estimated 62% in grid power draw.',
        data: { mode: params.mode || 'battery_peak_shaving', estimatedSavingsDollarsPerDay: 4.80 }
      };
    }
  },

  purify_indoor_air: {
    name: 'purify_indoor_air',
    description: 'Ramps up HEPA filtration fan speed and air turnover when air contaminants are detected.',
    parameters: {
      type: 'object',
      properties: {
        fanSpeed: { type: 'string', enum: ['turbo', 'high', 'auto'] }
      }
    },
    execute: async (params) => {
      const speed = params.fanSpeed || 'turbo';
      deviceManager.updateDeviceAttribute('dev_air_purifier', 'fanSpeed', speed);
      deviceManager.updateDeviceAttribute('dev_air_purifier', 'aqi', 32); // Cleansed!
      deviceManager.setDeviceStatus('dev_air_purifier', 'online');
      deviceManager.setDevicePowerDraw('dev_air_purifier', 65);

      return {
        tool: 'purify_indoor_air',
        target: 'dev_air_purifier',
        status: 'success',
        message: `Air purifier fan set to ${speed}. Particulate scrub underway; AQI improving to Good (32).`,
        data: { speed, postAqi: 32 }
      };
    }
  },

  protect_freeze_vulnerability: {
    name: 'protect_freeze_vulnerability',
    description: 'Preheats basement and plumbing zones to avoid freeze damage, checks water main pressure.',
    parameters: {
      type: 'object',
      properties: {
        preheatTempF: { type: 'number', description: 'Safe minimum heating temperature' }
      }
    },
    execute: async (params) => {
      const target = params.preheatTempF || 68;
      deviceManager.updateDeviceAttribute('dev_water_main', 'pipeTempF', 46);
      deviceManager.setDeviceStatus('dev_water_main', 'online');
      deviceManager.updateDeviceAttribute('dev_thermostat_living', 'currentTemperature', 68);
      deviceManager.updateDeviceAttribute('dev_thermostat_living', 'targetTemperature', target);
      deviceManager.updateDeviceAttribute('dev_thermostat_living', 'mode', 'heat');

      return {
        tool: 'protect_freeze_vulnerability',
        target: 'plumbing_and_heating_subsystem',
        status: 'success',
        message: `Basement zone heating engaged to ${target}°F. Pipe temperature raised to 46°F, out of freeze danger zone.`,
        data: { safePipeTempF: 46 }
      };
    }
  }
};
