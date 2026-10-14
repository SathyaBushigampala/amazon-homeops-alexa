import React from 'react';
import { X, Cloud, Database, Radio, Cpu, Layers, CheckCircle } from 'lucide-react';
import { EventBridgeAlert } from '../types';

interface AwsTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentEvents: EventBridgeAlert[];
}

export const AwsTelemetryModal: React.FC<AwsTelemetryModalProps> = ({
  isOpen,
  onClose,
  recentEvents
}) => {
  if (!isOpen) return null;

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
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>AWS Builder Cloud Architecture</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Hackathon Track
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live telemetry and orchestration across AWS serverless services
            </p>
          </div>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1.5">
              <Cpu className="w-4 h-4" />
              <span>AWS Bedrock</span>
            </div>
            <div className="text-xs text-white font-mono font-medium">anthropic.claude-3-5-sonnet</div>
            <p className="text-[10px] text-slate-400 mt-1">Multi-step autonomous ReAct agent loop</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1.5">
              <Database className="w-4 h-4" />
              <span>Amazon DynamoDB</span>
            </div>
            <div className="text-xs text-white font-mono font-medium">HomeOps_Devices & Plans</div>
            <p className="text-[10px] text-slate-400 mt-1">Pay-per-request audit state store</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
              <Radio className="w-4 h-4" />
              <span>AWS EventBridge</span>
            </div>
            <div className="text-xs text-white font-mono font-medium">HomeOps-HomeEvents-Bus</div>
            <p className="text-[10px] text-slate-400 mt-1">Proactive ambient disruption router</p>
          </div>
        </div>

        {/* EventBridge Live Event Stream */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>EventBridge Proactive Event Bus Stream</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">({recentEvents.length} Recent)</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {recentEvents.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                No external events recorded yet. Trigger a scenario above to emit an EventBridge event.
              </div>
            ) : (
              recentEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono"
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
            Infrastructure as Code: <code className="text-cyan-300">infra/template.yaml</code>
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
