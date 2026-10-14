import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ScenarioBar } from './components/ScenarioBar';
import { AlexaConsole } from './components/AlexaConsole';
import { ReActStream } from './components/ReActStream';
import { DeviceGrid } from './components/DeviceGrid';
import { AwsTelemetryModal } from './components/AwsTelemetryModal';
import { SdkModal } from './components/SdkModal';
import { DeviceState, AgentPlanExecution, EventBridgeAlert } from './types';

export const App: React.FC = () => {
  const [devices, setDevices] = useState<DeviceState[]>([]);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestPlan, setLatestPlan] = useState<AgentPlanExecution | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventBridgeAlert[]>([]);
  const [isAwsModalOpen, setIsAwsModalOpen] = useState<boolean>(false);
  const [isSdkModalOpen, setIsSdkModalOpen] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);

  // Initialize data and WebSocket
  useEffect(() => {
    // Initial fetch via HTTP
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error('Failed to fetch devices:', err));

    // Connect WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const connectWs = () => {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'INIT_STATE') {
            if (msg.data.devices) setDevices(msg.data.devices);
            if (msg.data.recentEvents) setRecentEvents(msg.data.recentEvents);
          } else if (msg.type === 'DEVICES_UPDATED') {
            setDevices(msg.data);
          } else if (msg.type === 'EVENTBRIDGE_ALERT') {
            setRecentEvents(prev => {
              if (prev.some(e => e.id === msg.data.id)) return prev;
              return [msg.data, ...prev.slice(0, 25)];
            });
          } else if (msg.type === 'DIRECTIVE_STARTING') {
            setIsLoading(true);
          } else if (msg.type === 'DIRECTIVE_COMPLETED') {
            setLatestPlan(msg.data);
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        setTimeout(connectWs, 3000); // Reconnect
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWs();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // Send voice directive to Alexa+ backend
  const handleSendDirective = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/alexa/directive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utterance: text })
      });
      const data = await res.json();
      setLatestPlan(data);
    } catch (err) {
      console.error('Failed to send directive:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger test scenario
  const handleTriggerScenario = async (scenarioId: string) => {
    setIsLoading(true);
    try {
      await fetch('/api/scenarios/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });
    } catch (err) {
      console.error('Failed to trigger scenario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle/Update device attributes directly
  const handleToggleDevice = async (id: string, attribute: string, value: any) => {
    try {
      await fetch(`/api/devices/${id}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attribute, value })
      });
    } catch (err) {
      console.error('Failed to toggle device:', err);
    }
  };

  // Clear EventBridge log
  const handleClearEvents = async () => {
    try {
      await fetch('/api/events/clear', { method: 'POST' });
      setRecentEvents([]);
    } catch (err) {
      console.error('Failed to clear events:', err);
    }
  };

  // Simulate incoming ambient event
  const handleSimulateEvent = async (detailType: string, message: string, severity: 'info' | 'warning' | 'critical') => {
    try {
      await fetch('/api/events/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detailType, message, severity })
      });
    } catch (err) {
      console.error('Failed to simulate event:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        wsConnected={wsConnected}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
        onOpenSdkModal={() => setIsSdkModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* Interactive Scenario Bar */}
        <ScenarioBar
          onTriggerScenario={handleTriggerScenario}
          isLoading={isLoading}
        />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Alexa+ Multimodal Console & ReAct Stream (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <AlexaConsole
              onSendDirective={handleSendDirective}
              isLoading={isLoading}
              latestPlan={latestPlan}
            />

            <ReActStream
              plan={latestPlan}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Physical Smart Home Device Mesh (7 cols) */}
          <div className="lg:col-span-7">
            <DeviceGrid devices={devices} onToggleDevice={handleToggleDevice} />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          HomeOps &bull; Built for Amazon Developer Hackathon 2026 &bull; Alexa+ Track &bull; Powered by AWS Bedrock & DynamoDB &bull; Open-Source Apache-2.0
        </p>
      </footer>

      {/* Modals */}
      <AwsTelemetryModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
        recentEvents={recentEvents}
        latestPlan={latestPlan}
        onClearEvents={handleClearEvents}
        onSimulateEvent={handleSimulateEvent}
      />

      <SdkModal
        isOpen={isSdkModalOpen}
        onClose={() => setIsSdkModalOpen(false)}
      />
    </div>
  );
};
