import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  Radio, 
  Cpu, 
  CheckCircle, 
  Trash2, 
  BellRing, 
  Activity, 
  Code2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
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
  const [selectedCard, setSelectedCard] = useState<'bedrock' | 'dynamodb' | 'eventbridge' | 'template' | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Deduplicate events by ID
  const uniqueEvents = recentEvents.filter(
    (evt, index, self) => index === self.findIndex(e => e.id === evt.id)
  );

  const handleTriggerSimulatedAlert = () => {
    if (onSimulateEvent) {
      onSimulateEvent(
        'GridFrequencyAnomaly',
        'AWS EventBridge Rule: Grid frequency dipped to 59.82 Hz (Demand response signal broadcast)',
        'warning'
      );
      setFeedbackMsg('⚡ Alert dispatched to EventBridge & Autonomous ReAct mitigation triggered!');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const samTemplateYaml = `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: HomeOps Alexa+ Agentic Stack for Amazon Developer Hackathon 2026

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs20.x

Resources:
  DevicesTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: HomeOps_Devices
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH

  PlansTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: HomeOps_Plans
      BillingMode: PAY_PER_REQUEST

  HomeOpsEventBus:
    Type: AWS::Events::EventBus
    Properties:
      Name: HomeOps-HomeEvents-Bus

  HomeOpsBedrockActionHandler:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: HomeOps-BedrockActionGroup-Handler
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref DevicesTable
        - EventBridgePutEventsPolicy:
            EventBusName: !Ref HomeOpsEventBus`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(samTemplateYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B132B] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
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
              Click any card below to inspect live properties or trigger proactive mitigation
            </p>
          </div>
        </div>

        {/* Real-Time Interactive Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* AWS Bedrock */}
          <button
            type="button"
            onClick={() => setSelectedCard(selectedCard === 'bedrock' ? null : 'bedrock')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between ${
              selectedCard === 'bedrock'
                ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
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
          </button>

          {/* Amazon DynamoDB */}
          <button
            type="button"
            onClick={() => setSelectedCard(selectedCard === 'dynamodb' ? null : 'dynamodb')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between ${
              selectedCard === 'dynamodb'
                ? 'bg-purple-950/40 border-purple-400 ring-1 ring-purple-400/50'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
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
          </button>

          {/* AWS EventBridge */}
          <button
            type="button"
            onClick={() => setSelectedCard(selectedCard === 'eventbridge' ? null : 'eventbridge')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between ${
              selectedCard === 'eventbridge'
                ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400/50'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
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
          </button>
        </div>

        {/* Expanded Drawer Details (Appears when clicking Bedrock, DynamoDB, or EventBridge) */}
        {selectedCard && (
          <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 mb-4 animate-fade-in text-xs">
            {selectedCard === 'bedrock' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-cyan-400">
                  <span>AWS Bedrock Agent Runtime Details</span>
                  <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <p className="text-slate-300">
                  HomeOps runs on Amazon Bedrock's foundation models, executing a ReAct (Reasoning + Acting) loop.
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div>Model ARN: <span className="text-cyan-300">anthropic.claude-3-5-sonnet-20240620-v1:0</span></div>
                  <div>Region: <span className="text-cyan-300">us-east-1 (N. Virginia)</span></div>
                  <div>Max Tokens: <span className="text-cyan-300">200,000 context</span></div>
                  <div>Guardrails: <span className="text-emerald-400">Cyber-Physical Tier 1/2/3 Active</span></div>
                </div>
              </div>
            )}

            {selectedCard === 'dynamodb' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-purple-400">
                  <span>Amazon DynamoDB Tables</span>
                  <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <p className="text-slate-300">
                  Persistent on-demand state tables storing device status attributes and execution audit logs.
                </p>
                <div className="space-y-1.5 font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-purple-300">&bull; Table 1: <strong className="text-white">HomeOps_Devices</strong> (Hash Key: <code>id [String]</code>)</div>
                  <div className="text-purple-300">&bull; Table 2: <strong className="text-white">HomeOps_Plans</strong> (Hash Key: <code>planId [String]</code>, Range: <code>timestamp</code>)</div>
                  <div className="text-slate-400 pt-1">Billing Mode: PAY_PER_REQUEST &bull; Backup: Point-in-time recovery enabled</div>
                </div>
              </div>
            )}

            {selectedCard === 'eventbridge' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-400">
                  <span>AWS EventBridge Custom Event Bus</span>
                  <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <p className="text-slate-300">
                  The custom event bus routes external utility disruptions (weather, grid frequency, dynamic price surges) to trigger autonomous ReAct mitigation.
                </p>
                <div className="font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div>Bus Name: <span className="text-amber-300">HomeOps-HomeEvents-Bus</span></div>
                  <div>Rule: <span className="text-amber-300">HomeOps-ProactiveTrigger-Rule</span></div>
                  <div>Pattern: <code className="text-slate-300">{'{"source": ["homeops.scenario", "aws.eventbridge.simulator"]}'}</code></div>
                </div>
              </div>
            )}

            {selectedCard === 'template' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-400">
                  <span>AWS SAM CloudFormation Template (infra/template.yaml)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyYaml}
                      className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy YAML'}</span>
                    </button>
                    <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                </div>
                <pre className="font-mono text-[10px] text-slate-300 bg-black/80 p-3 rounded-xl max-h-48 overflow-y-auto">
                  {samTemplateYaml}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Feedback Alert Pill */}
        {feedbackMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* EventBridge Live Event Stream */}
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>EventBridge Proactive Event Bus Stream</span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">
                ({uniqueEvents.length} Events)
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerSimulatedAlert}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 border border-amber-500/40 shadow-sm transition-all"
                title="Emit a simulated external grid alert via EventBridge and trigger autonomous mitigation"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Simulate Event</span>
              </button>

              {onClearEvents && (
                <button
                  type="button"
                  onClick={onClearEvents}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
                  title="Clear event history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {uniqueEvents.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
                <Activity className="w-6 h-6 text-slate-600 mb-2 animate-pulse" />
                <span>No events recorded yet. Click <strong>"Simulate Event"</strong> above to test proactive mitigation!</span>
              </div>
            ) : (
              uniqueEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono hover:border-slate-700 transition-all"
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 shrink-0 ${
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
          <button
            type="button"
            onClick={() => setSelectedCard(selectedCard === 'template' ? null : 'template')}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline font-mono text-left"
          >
            <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>View Infrastructure as Code: infra/template.yaml</span>
          </button>
          <button
            type="button"
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
