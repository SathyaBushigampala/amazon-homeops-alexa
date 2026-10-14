import React from 'react';
import { Cpu, ShieldCheck, Radio, Sparkles, Cloud, Github } from 'lucide-react';

interface HeaderProps {
  wsConnected: boolean;
  onOpenAwsModal: () => void;
  onOpenSdkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wsConnected, onOpenAwsModal, onOpenSdkModal }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0B132B]/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Track Info */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${wsConnected ? 'bg-cyan-400' : 'bg-rose-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${wsConnected ? 'bg-cyan-500' : 'bg-rose-500'}`}></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              HomeOps
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Alexa+ Track
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous Smart Home Operations Agent
          </p>
        </div>
      </div>

      {/* Mini Challenge Badges & Actions */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={onOpenAwsModal}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-400 transition-all text-xs text-amber-200"
        >
          <Cloud className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">AWS Builder:</span>
          <span className="text-slate-300">Bedrock & EventBridge</span>
        </button>

        <button
          onClick={onOpenSdkModal}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-500 transition-all text-xs text-cyan-300"
        >
          <Github className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[11px]">@homeops/alexa-plus-sdk</span>
        </button>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
          <span className="text-slate-400 hidden sm:inline">Telemetry:</span>
          <span className={`font-mono ${wsConnected ? 'text-emerald-300' : 'text-rose-300'}`}>
            {wsConnected ? 'LIVE WS' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </header>
  );
};
