import React from 'react';
import { X, Github, Code, CheckCircle, Package, Shield } from 'lucide-react';

interface SdkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SdkModal: React.FC<SdkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B132B] border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>@homeops/alexa-plus-sdk</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Open Source Challenge
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Reusable developer SDK for building Alexa+ Agentic skills & device adapters
            </p>
          </div>
        </div>

        {/* Value Proposition Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <Package className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium">Unified Device Adapters</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <Code className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Bedrock Action Schemas</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Cyber-Physical Guardrails</span>
          </div>
        </div>

        {/* Quickstart Code Example */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-cyan-400">example-usage.ts</span>
            <span className="font-mono text-[10px]">TypeScript / Node 20+</span>
          </div>
          <pre className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`import { AlexaPlusAgentClient, AgentToolDefinition } from '@homeops/alexa-plus-sdk';

const client = new AlexaPlusAgentClient({
  endpoint: 'http://localhost:4000/api',
  awsRegion: 'us-east-1'
});

// Register custom smart home action tool
client.registerTool({
  name: 'optimize_energy_draw',
  description: 'Triggers home battery discharge & curtails peak draw',
  parameters: {
    type: 'object',
    properties: {
      mode: { type: 'string', enum: ['battery_peak_shaving', 'eco'] }
    }
  }
});

// Dispatch autonomous directive
const res = await client.sendDirective({
  directiveId: 'dir-101',
  utterance: 'Alexa, electricity rates are high, save me some money.'
});
console.log(res.verbalResponse);`}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            License: Apache-2.0 Open Source
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
