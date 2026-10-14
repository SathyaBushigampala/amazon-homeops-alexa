import React from 'react';
import { Zap, Snowflake, Moon, Wind, RotateCcw, Flame } from 'lucide-react';

interface ScenarioBarProps {
  onTriggerScenario: (scenarioId: string) => void;
  isLoading: boolean;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({ onTriggerScenario, isLoading }) => {
  const scenarios = [
    {
      id: 'peak_tariff_spike',
      label: 'Peak Tariff Spike',
      detail: '$0.48/kWh Grid Surge',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300 hover:border-amber-400'
    },
    {
      id: 'freeze_warning',
      label: 'Freezing Pipe Warning',
      detail: 'Basement Temp 31°F',
      icon: Snowflake,
      color: 'from-blue-500/20 to-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
    },
    {
      id: 'security_unlocked_night',
      label: 'Night Security Vulnerability',
      detail: 'Patio Door Left Ajar',
      icon: Moon,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/40 text-indigo-300 hover:border-indigo-400'
    },
    {
      id: 'smoke_air_alert',
      label: 'Smoke / Poor Air Quality',
      detail: 'AQI Spiked to 184',
      icon: Wind,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-300 hover:border-rose-400'
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 mb-6">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Interactive Test Scenarios
          </span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            Inject real-world disruptions to test autonomous Alexa+ response
          </span>
        </div>
        <button
          onClick={() => onTriggerScenario('reset_normal')}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset System</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {scenarios.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onTriggerScenario(s.id)}
              disabled={isLoading}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border bg-gradient-to-br text-left transition-all hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${s.color}`}
            >
              <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate leading-tight">{s.label}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.detail}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
