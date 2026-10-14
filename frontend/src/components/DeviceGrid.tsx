import React from 'react';
import { 
  Thermometer, 
  Lock, 
  Unlock, 
  BatteryCharging, 
  Wind, 
  Droplet, 
  Shield, 
  Zap,
  Activity,
  Plus,
  Minus,
  Power
} from 'lucide-react';
import { DeviceState } from '../types';

interface DeviceGridProps {
  devices: DeviceState[];
  onToggleDevice: (id: string, attribute: string, value: any) => void;
}

export const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, onToggleDevice }) => {
  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'climate': return Thermometer;
      case 'security': return Shield;
      case 'energy': return BatteryCharging;
      case 'air_quality': return Wind;
      case 'water': return Droplet;
      default: return Activity;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ONLINE</span>;
      case 'alerting':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">ALERTING</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">DEGRADED</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold tracking-tight text-white">
            Smart Home Physical Device Mesh
          </h2>
          <span className="text-xs text-slate-500 font-mono">({devices.length} Nodes)</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Bi-directional Real-Time Sync &amp; Actuation
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {devices.map((device) => {
          const Icon = getDeviceIcon(device.category);
          const isAlerting = device.status === 'alerting';

          return (
            <div
              key={device.id}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isAlerting
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${
                      isAlerting 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{device.name}</h4>
                      <span className="text-[11px] text-slate-400">{device.room}</span>
                    </div>
                  </div>
                  {getStatusBadge(device.status)}
                </div>

                {/* Attributes & Dynamic Telemetry Body */}
                <div className="space-y-2 text-xs">
                  {/* Climate Specific */}
                  {device.category === 'climate' && (
                    <div className="grid grid-cols-2 gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Target / Current</span>
                        <div className="text-sm font-bold font-mono text-cyan-300">
                          {device.attributes.targetTemperature}°F <span className="text-xs text-slate-400 font-normal">({device.attributes.currentTemperature}°F)</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Mode / Compressor</span>
                        <div className="text-xs font-semibold uppercase text-slate-200 mt-0.5">
                          {device.attributes.mode} &bull; <span className="text-cyan-400">{device.attributes.compressorStatus || 'idle'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Specific */}
                  {device.category === 'security' && (
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      {device.attributes.doorState !== undefined ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {device.attributes.locked ? (
                              <Lock className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Unlock className="w-4 h-4 text-rose-400 animate-bounce" />
                            )}
                            <span className="font-semibold text-slate-200">
                              {device.attributes.locked ? 'Locked' : 'UNLOCKED'}
                            </span>
                          </div>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            device.attributes.doorState === 'ajar' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            Door: {device.attributes.doorState}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">
                            Mode: <strong className="text-cyan-300">{device.attributes.armedState}</strong>
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Floodlight: {device.attributes.floodlightOn ? '💡 Active' : 'Off'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Energy Storage Specific */}
                  {device.category === 'energy' && (
                    <div className="grid grid-cols-2 gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Battery Reserve</span>
                        <div className="text-sm font-bold font-mono text-emerald-300">
                          {device.attributes.batteryPercentage}% <span className="text-xs text-slate-400 font-normal">({device.attributes.capacityKwh}kWh)</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Utility Tariff</span>
                        <div className={`text-xs font-mono font-bold mt-0.5 ${
                          device.attributes.tariffTier === 'peak_surge' ? 'text-amber-400' : 'text-slate-300'
                        }`}>
                          {device.attributes.tariffTier?.toUpperCase()} ({device.attributes.centsPerKwh}¢)
                        </div>
                      </div>
                      <div className="col-span-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between font-mono">
                        <span>Solar: +{device.attributes.solarGenerationKw}kW</span>
                        <span>Home Draw: {device.attributes.householdDrawKw}kW</span>
                      </div>
                    </div>
                  )}

                  {/* Air Quality Specific */}
                  {device.category === 'air_quality' && (
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">AQI Index</span>
                        <div className={`text-base font-bold font-mono ${
                          device.attributes.aqi > 100 ? 'text-rose-400' : 'text-emerald-300'
                        }`}>
                          {device.attributes.aqi} {device.attributes.aqi > 100 ? '(UNHEALTHY)' : '(GOOD)'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase">HEPA Fan Speed</span>
                        <div className="text-xs font-semibold text-cyan-300 uppercase">
                          {device.attributes.fanSpeed}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Water Specific */}
                  {device.category === 'water' && (
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Pipe Temp &amp; Pressure</span>
                        <div className={`text-sm font-bold font-mono ${
                          device.attributes.pipeTempF < 34 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                        }`}>
                          {device.attributes.pipeTempF}°F &bull; {device.attributes.pressurePsi} PSI
                        </div>
                      </div>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        device.attributes.valveOpen ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {device.attributes.valveOpen ? 'Valve Open' : 'VALVE SHUT'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Device Controls Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
                {device.category === 'climate' && (
                  <>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleDevice(device.id, 'targetTemperature', Number(device.attributes.targetTemperature) - 1)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Lower target temperature"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onToggleDevice(device.id, 'targetTemperature', Number(device.attributes.targetTemperature) + 1)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Increase target temperature"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onToggleDevice(device.id, 'mode', device.attributes.mode === 'eco' ? 'cool' : 'eco')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold uppercase border transition-all ${
                        device.attributes.mode === 'eco'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {device.attributes.mode === 'eco' ? '🌱 Eco Active' : 'Switch Eco'}
                    </button>
                  </>
                )}

                {device.category === 'security' && device.attributes.doorState !== undefined && (
                  <>
                    <button
                      onClick={() => onToggleDevice(device.id, 'locked', !device.attributes.locked)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase border transition-all flex items-center gap-1 ${
                        device.attributes.locked
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {device.attributes.locked ? 'Unlock' : 'Lock Deadbolt'}
                    </button>
                    <button
                      onClick={() => onToggleDevice(device.id, 'doorState', device.attributes.doorState === 'ajar' ? 'closed' : 'ajar')}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
                    >
                      Toggle Ajar
                    </button>
                  </>
                )}

                {device.category === 'security' && device.attributes.armedState !== undefined && (
                  <>
                    <button
                      onClick={() => onToggleDevice(device.id, 'armedState', device.attributes.armedState === 'armed_home' ? 'disarmed' : 'armed_home')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase border transition-all ${
                        device.attributes.armedState === 'armed_home'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {device.attributes.armedState === 'armed_home' ? '🛡️ Armed' : 'Disarmed'}
                    </button>
                    <button
                      onClick={() => onToggleDevice(device.id, 'floodlightOn', !device.attributes.floodlightOn)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                        device.attributes.floodlightOn
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {device.attributes.floodlightOn ? '💡 Light On' : 'Light Off'}
                    </button>
                  </>
                )}

                {device.category === 'energy' && (
                  <button
                    onClick={() => onToggleDevice(device.id, 'tariffTier', device.attributes.tariffTier === 'peak_surge' ? 'standard' : 'peak_surge')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase border transition-all ${
                      device.attributes.tariffTier === 'peak_surge'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {device.attributes.tariffTier === 'peak_surge' ? '⚡ Peak Surge Tier' : 'Standard Rate'}
                  </button>
                )}

                {device.category === 'air_quality' && (
                  <button
                    onClick={() => onToggleDevice(device.id, 'fanSpeed', device.attributes.fanSpeed === 'turbo' ? 'auto' : 'turbo')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase border transition-all ${
                      device.attributes.fanSpeed === 'turbo'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {device.attributes.fanSpeed === 'turbo' ? '🌪️ Turbo Fan' : 'Auto Fan'}
                  </button>
                )}

                {device.category === 'water' && (
                  <button
                    onClick={() => onToggleDevice(device.id, 'valveOpen', !device.attributes.valveOpen)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase border transition-all flex items-center gap-1 ${
                      device.attributes.valveOpen
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <Power className="w-2.5 h-2.5" />
                    {device.attributes.valveOpen ? 'Shut Valve' : 'Open Valve'}
                  </button>
                )}

                {/* Power Draw Indicator */}
                <div className="text-[10px] font-mono text-slate-400 ml-auto flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{device.powerDrawWatts < 0 ? `+${Math.abs(device.powerDrawWatts)}W` : `${device.powerDrawWatts}W`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
