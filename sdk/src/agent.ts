import { 
  AgentContext, 
  AgentToolDefinition, 
  AlexaDirectivePayload, 
  AlexaAgentResponse,
  SafetyCheckRequest,
  SafetyCheckResponse
} from './types';

export class AlexaPlusSafetyGuardrail {
  private static DANGEROUS_ACTIONS = ['unlock', 'turn_off_security', 'factory_reset', 'override_breaker'];

  public static evaluateAction(req: SafetyCheckRequest): SafetyCheckResponse {
    const isDangerous = this.DANGEROUS_ACTIONS.includes(req.toolName) || req.potentialImpact === 'critical';

    if (isDangerous) {
      return {
        approved: false,
        requiresUserPrompt: true,
        reason: `Executing '${req.toolName}' is classified as high-risk and requires spoken authorization.`,
        suggestedPromptText: `I can execute ${req.toolName}, but I need your voice confirmation to proceed. Should I continue?`
      };
    }

    return {
      approved: true,
      requiresUserPrompt: false
    };
  }
}

export interface AlexaPlusAgentConfig {
  endpoint?: string;
  enableBedrockFallback?: boolean;
  awsRegion?: string;
}

export class AlexaPlusAgentClient {
  private config: AlexaPlusAgentConfig;
  private tools: Map<string, AgentToolDefinition> = new Map();

  constructor(config: AlexaPlusAgentConfig = {}) {
    this.config = {
      endpoint: 'http://localhost:4000/api',
      enableBedrockFallback: true,
      awsRegion: 'us-east-1',
      ...config
    };
  }

  public registerTool(tool: AgentToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public getTools(): AgentToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async sendDirective(payload: AlexaDirectivePayload): Promise<AlexaAgentResponse> {
    const res = await fetch(`${this.config.endpoint}/alexa/directive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Failed to process Alexa directive: ${res.statusText}`);
    }

    return (await res.json()) as AlexaAgentResponse;
  }
}
