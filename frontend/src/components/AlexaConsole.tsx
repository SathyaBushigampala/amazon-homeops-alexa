import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AgentPlanExecution } from '../types';

interface AlexaConsoleProps {
  onSendDirective: (text: string) => void;
  isLoading: boolean;
  latestPlan: AgentPlanExecution | null;
}

export const AlexaConsole: React.FC<AlexaConsoleProps> = ({
  onSendDirective,
  isLoading,
  latestPlan
}) => {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const quickDirectives = [
    { text: "Alexa, prepare the house for bedtime", tag: "Night Mode" },
    { text: "Alexa, electricity rates are high, save me some money", tag: "Peak Shaving" },
    { text: "Alexa, freeze alert incoming, protect my water pipes", tag: "Freeze Guard" },
    { text: "Alexa, I smell smoke in the living room", tag: "Air Purge" },
    { text: "Alexa, do a full system diagnostic", tag: "Diagnostics" }
  ];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  const handleStartListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your directive.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Automatically dispatch if detected
        if (transcript.trim()) {
          onSendDirective(transcript.trim());
          setInputText('');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendDirective(inputText.trim());
    setInputText('');
  };

  const handleSpeakAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-[#0B132B]/90 border border-cyan-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background ambient glow effect */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Multimodal Screen Header */}
      <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          {/* Alexa+ Acoustic Ring */}
          <div className="relative flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full border-2 transition-all duration-700 flex items-center justify-center ${
              isListening
                ? 'border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.9)] animate-pulse'
                : isLoading 
                ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,202,255,0.9)] animate-spin' 
                : 'border-cyan-500/60 shadow-[0_0_12px_rgba(0,202,255,0.4)]'
            }`}>
              <div className={`w-4 h-4 rounded-full ${
                isListening 
                  ? 'bg-rose-500 animate-ping' 
                  : 'bg-gradient-to-tr from-cyan-400 to-blue-500'
              }`} />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Alexa+ Multimodal Agent</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Next-Gen
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isListening ? '🎙️ Listening to your voice now...' : isLoading ? 'Reasoning with AWS Bedrock...' : 'Listening for natural directives'}
            </p>
          </div>
        </div>

        {/* Safety Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Guardrails:</span>
          <span className="text-cyan-300 font-mono">Active</span>
        </div>
      </div>

      {/* Spoken Response Presentation Bubble */}
      <div className="mb-4 bg-slate-950/70 border border-cyan-500/20 rounded-2xl p-4 min-h-[110px] flex flex-col justify-between relative">
        {latestPlan ? (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Spoken Alexa+ Response
              </span>
              <button
                onClick={() => handleSpeakAloud(latestPlan.verbalResponse)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isSpeaking
                    ? 'bg-cyan-500 text-black border-cyan-400 animate-pulse shadow-md shadow-cyan-400/50'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-cyan-300 hover:border-cyan-500/40'
                }`}
                title="Play voice output via SpeechSynthesis"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              "{latestPlan.verbalResponse}"
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-4 text-center">
            <Activity className="w-6 h-6 text-cyan-500/50 mb-2 animate-pulse-slow" />
            <p className="text-xs text-slate-400">
              Speak using the microphone or pick a quick suggestion below to start autonomous smart home orchestration.
            </p>
          </div>
        )}

        {latestPlan && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate max-w-[220px]">
              Directive: <span className="text-slate-300 italic">"{latestPlan.directive}"</span>
            </span>
            <span className="font-mono text-cyan-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {latestPlan.actionsTaken.length} Actions Executed
            </span>
          </div>
        )}
      </div>

      {/* Voice Directive Quick Suggestions */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Suggested Alexa+ Spoken Commands:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickDirectives.map((d, idx) => (
            <button
              key={idx}
              onClick={() => onSendDirective(d.text)}
              disabled={isLoading || isListening}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition-all text-left flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400">
                {d.tag}
              </span>
              <span className="truncate max-w-[200px]">{d.text.replace("Alexa, ", "")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Directive Input Bar with Voice Recognition Button */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : "Speak or type a directive (e.g. 'Alexa, bedtime mode')..."}
          disabled={isLoading || isListening}
          className={`w-full bg-slate-950/80 border rounded-2xl pl-11 pr-24 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all ${
            isListening 
              ? 'border-rose-500 ring-2 ring-rose-500/40' 
              : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
          }`}
        />
        
        {/* Real microphone button */}
        <button
          type="button"
          onClick={handleStartListening}
          disabled={isLoading}
          title={speechSupported ? "Click to speak via microphone" : "Speech recognition not supported"}
          className={`absolute left-2.5 p-1.5 rounded-xl transition-all ${
            isListening 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-900'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || isListening}
          className="absolute right-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <span>Send</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
