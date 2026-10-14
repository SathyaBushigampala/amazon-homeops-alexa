/**
 * Open-Source Amazon Alexa+ HomeOps SDK
 * Definitions for Agentic Skills, Tool Calling, Safety Guardrails, and Device Adapters.
 */

export type DeviceCategory = 
  | 'climate'
  | 'security'
  | 'energy'
  | 'lighting'
  | 'appliance'
  | 'air_quality'
  | 'sensor';

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

export interface AgentToolParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, AgentToolParameter>;
    required?: string[];
  };
  dangerous?: boolean;
  requiresUserConfirmation?: boolean;
}

export interface AgentToolExecution<T = any> {
  toolName: string;
  arguments: Record<string, any>;
  execute: (args: Record<string, any>, context: AgentContext) => Promise<T>;
}

export interface AgentContext {
  userId: string;
  homeId: string;
  sessionId: string;
  timestamp: string;
  deviceRegistry: Record<string, DeviceState>;
  securityClearance: 'guest' | 'resident' | 'admin';
}

export interface SafetyCheckRequest {
  toolName: string;
  proposedArguments: Record<string, any>;
  targetDeviceIds?: string[];
  potentialImpact: 'low' | 'moderate' | 'high' | 'critical';
}

export interface SafetyCheckResponse {
  approved: boolean;
  reason?: string;
  requiresUserPrompt?: boolean;
  suggestedPromptText?: string;
}

export interface AlexaDirectivePayload {
  directiveId: string;
  utterance: string;
  intent?: string;
  context?: Record<string, any>;
}

export interface AgentThoughtStep {
  stepNumber: number;
  thought: string;
  action?: {
    tool: string;
    params: Record<string, any>;
  };
  observation?: string;
  timestamp: string;
}

export interface AlexaAgentResponse {
  planId: string;
  summary: string;
  verbalResponse: string;
  steps: AgentThoughtStep[];
  actionsTaken: Array<{
    tool: string;
    target: string;
    status: 'success' | 'failed' | 'requires_confirmation';
    result: any;
  }>;
  suggestedFollowUp?: string[];
  metrics: {
    durationMs: number;
    tokensUsed: number;
    toolsInvoked: number;
  };
}
