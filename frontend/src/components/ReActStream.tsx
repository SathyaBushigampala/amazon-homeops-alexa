import React from 'react';
import { Brain, Wrench, Eye, ShieldCheck, Zap, Clock, Terminal } from 'lucide-react';
import { AgentPlanExecution } from '../types';

interface ReActStreamProps {
  plan: AgentPlanExecution | null;
  isLoading: boolean;
}

export const ReActStream: React.FC<ReActStreamProps> = ({ plan, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 mt-5">
        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Brain className="w-5 h-5 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Bedrock Autonomous ReAct Engine Active
          </h3>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/30 animate-pulse flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-xs text-slate-300">
              Formulating multi-step tool execution plan and inspecting physical smart home constraints...
            </div>
          </div>
          <div className="h-10 bg-slate-800/40 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-800/20 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-6 mt-5 text-center">
        <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          ReAct Thought Stream Awaiting Directives
        </h4>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
          When you dispatch an Alexa+ instruction, Bedrock's step-by-step reasoning (Thought &rarr; Action &rarr; Observation) will render here in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 mt-5">
      {/* Stream Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold tracking-tight text-white">
            ReAct Autonomous Execution Trace
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
            {plan.planId}
          </span>
        </div>

        {/* AWS Latency & Safety */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
            <Clock className="w-3 h-3" />
            <span>{plan.awsTelemetry.bedrockLatencyMs}ms</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
            <ShieldCheck className="w-3 h-3" />
            <span>Safety: PASS (Score {plan.safetyCheck.consequenceScore}/100)</span>
          </div>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-3.5">
        {plan.steps.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all"
          >
            {/* Step Number & Thought */}
            <div className="flex items-start gap-2.5 mb-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold font-mono flex items-center justify-center mt-0.5">
                {s.stepNumber}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-0.5">
                  <Brain className="w-3 h-3" />
                  <span>Agent Thought:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {s.thought}
                </p>
              </div>
            </div>

            {/* Action Tool Call */}
            {s.action && (
              <div className="ml-7 mb-2 p-2 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-2">
                <Wrench className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-mono text-blue-300 font-semibold">
                    Tool Invoked: <span className="text-white underline">{s.action.tool}</span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-400 mt-1 overflow-x-auto bg-black/40 p-1.5 rounded">
                    {JSON.stringify(s.action.params, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Observation Result */}
            {s.observation && (
              <div className="ml-7 p-2 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start gap-2">
                <Eye className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Physical Observation:
                  </div>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    {s.observation}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Bottom Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span>
          Plan Summary: <strong className="text-slate-200">{plan.summary}</strong>
        </span>
        <span className="font-mono text-slate-500">
          Bedrock Tokens: ~{plan.awsTelemetry.tokensPrompt + plan.awsTelemetry.tokensCompletion}
        </span>
      </div>
    </div>
  );
};
