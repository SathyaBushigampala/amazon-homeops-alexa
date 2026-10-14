import React from 'react';
import { 
  Thermometer, 
  Lock, 
  Unlock, 
  BatteryCharging, 
  Wind, 
  Droplet, 
  Shield, 
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';
import { DeviceState } from '../types';

interface DeviceGridProps {
  devices: DeviceState[];
  onToggleDevice?: (id: string, attribute: string, value: any) => void;
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
          Bi-directional Real-Time Sync
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {devices.map((device) => {
          const Icon = getDeviceIcon(device.category);
          const isAlerting = device.status === 'alerting';

          return (
            <div
              key={device.id}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isAlerting
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
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
                        {device.attributes.mode} • <span className="text-cyan-400">{device.attributes.compressorStatus || 'idle'}</span>
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
                        {device.attributes.tariffTier.toUpperCase()} ({device.attributes.centsPerKwh}¢)
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
                      <span className="text-[10px] text-slate-400 uppercase">Pipe Temp & Pressure</span>
                      <div className={`text-sm font-bold font-mono ${
                        device.attributes.pipeTempF < 34 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                      }`}>
                        {device.attributes.pipeTempF}°F • {device.attributes.pressurePsi} PSI
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

              {/* Power Draw Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Draw: {device.powerDrawWatts < 0 ? `+${Math.abs(device.powerDrawWatts)}W (Surplus)` : `${device.powerDrawWatts}W`}
                </span>
                <span className="text-slate-500">
                  {new Date(device.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
