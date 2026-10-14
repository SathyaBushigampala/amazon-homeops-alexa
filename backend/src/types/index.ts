export type DeviceCategory = 
  | 'climate'
  | 'security'
  | 'energy'
  | 'lighting'
  | 'appliance'
  | 'air_quality'
  | 'water';

export type DeviceStatus = 'online' | 'offline' | 'degraded' | 'alerting';

export interface DeviceState {
  id: string;
  name: string;
  category: DeviceCategory;
  room: string;
  status: DeviceStatus;
  powerDrawWatts: number;
  lastUpdated: string;
  attributes: Record<string, any>;
}

export interface AgentStep {
  stepNumber: number;
  thought: string;
  action?: {
    tool: string;
    params: Record<string, any>;
  };
  observation?: string;
  timestamp: string;
  durationMs?: number;
}

export interface AgentPlanExecution {
  planId: string;
  directive: string;
  verbalResponse: string;
  summary: string;
  steps: AgentStep[];
  actionsTaken: Array<{
    tool: string;
    target: string;
    status: 'success' | 'failed' | 'requires_confirmation';
    result: any;
  }>;
  safetyCheck: {
    passed: boolean;
    consequenceScore: number; // 0 to 100
    flaggedReasons: string[];
    userPromptRequired: boolean;
  };
  awsTelemetry: {
    model: string;
    bedrockLatencyMs: number;
    tokensPrompt: number;
    tokensCompletion: number;
    dynamoWrites: number;
    eventBridgeEmits: number;
  };
}

export interface EventBridgeAlert {
  id: string;
  source: string;
  detailType: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  metadata: Record<string, any>;
}
