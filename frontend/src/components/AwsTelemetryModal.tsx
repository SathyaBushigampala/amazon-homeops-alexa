import React, { useState } from 'react';
import { X, Cloud, Database, Radio, Cpu, CheckCircle, Trash2, BellRing, Activity } from 'lucide-react';
import { EventBridgeAlert, AgentPlanExecution } from '../types';

interface AwsTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentEvents: EventBridgeAlert[];
  latestPlan?: AgentPlanExecution | null;
  onClearEvents?: () => void;
  onSimulateEvent?: (detailType: string, message: string, severity: 'info' | 'warning' | 'critical') => void;
}

export const AwsTelemetryModal: React.FC<AwsTelemetryModalProps> = ({
  isOpen,
  onClose,
  recentEvents,
  latestPlan,
  onClearEvents,
  onSimulateEvent
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  if (!isOpen) return null;

  // Deduplicate events by ID
  const uniqueEvents = recentEvents.filter(
    (evt, index, self) => index === self.findIndex(e => e.id === evt.id)
  );

  const filteredEvents = filterSeverity === 'all' 
    ? uniqueEvents 
    : uniqueEvents.filter(e => e.severity === filterSeverity);

  const handleTriggerSimulatedAlert = () => {
    if (onSimulateEvent) {
      onSimulateEvent(
        'GridFrequencyAnomaly',
        'AWS EventBridge Rule: Grid frequency dipped to 59.82 Hz (Demand response signal broadcast)',
        'warning'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B132B] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                AWS Builder Cloud Architecture
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Hackathon Track
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live telemetry and orchestration across AWS serverless services
            </p>
          </div>
        </div>

        {/* Real-Time Architecture & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {/* AWS Bedrock */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>AWS Bedrock</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                  HEALTHY
                </span>
              </div>
              <div className="text-xs text-white font-mono font-medium truncate">
                anthropic.claude-3-5-sonnet
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span>Latency:</span>
              <span className="text-cyan-300 font-bold">{latestPlan?.awsTelemetry.bedrockLatencyMs || 175}ms</span>
            </div>
          </div>

          {/* Amazon DynamoDB */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                  <Database className="w-4 h-4" />
                  <span>Amazon DynamoDB</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">
                  ON-DEMAND
                </span>
              </div>
              <div className="text-xs text-white font-mono font-medium truncate">
                HomeOps_Devices &amp; Plans
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span>State Writes:</span>
              <span className="text-purple-300 font-bold">{Math.max(16, uniqueEvents.length * 2)} ops</span>
            </div>
          </div>

          {/* AWS EventBridge */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Radio className="w-4 h-4" />
                  <span>AWS EventBridge</span>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                  CONNECTED
                </span>
              </div>
              <div className="text-xs text-white font-mono font-medium truncate">
                HomeOps-HomeEvents-Bus
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span>Total Events:</span>
              <span className="text-amber-300 font-bold">{uniqueEvents.length} Recent</span>
            </div>
          </div>
        </div>

        {/* EventBridge Live Event Stream */}
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>EventBridge Proactive Event Bus Stream</span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">
                ({filteredEvents.length} Events)
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerSimulatedAlert}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                title="Emit a simulated external grid alert via EventBridge"
              >
                <BellRing className="w-3 h-3 text-amber-400" />
                <span>Simulate Event</span>
              </button>

              {onClearEvents && (
                <button
                  onClick={onClearEvents}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
                  title="Clear event history"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredEvents.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
                <Activity className="w-6 h-6 text-slate-600 mb-2 animate-pulse" />
                <span>No external events recorded yet. Click "Simulate Event" or trigger a scenario above.</span>
              </div>
            ) : (
              filteredEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono hover:border-slate-700 transition-all"
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                    evt.severity === 'critical' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : evt.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {evt.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-200 font-sans font-medium text-xs leading-tight">
                      {evt.message}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Source: {evt.source} &bull; {evt.detailType}</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAM Template Quick Info */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Infrastructure as Code: <code className="text-cyan-300 font-mono">infra/template.yaml</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
