import { AgentPlanExecution, DeviceState } from '../types';

export class DynamoService {
  private inMemoryPlanStore: Map<string, AgentPlanExecution> = new Map();
  private inMemoryTelemetryLogs: Array<any> = [];

  public async savePlanExecution(plan: AgentPlanExecution): Promise<boolean> {
    this.inMemoryPlanStore.set(plan.planId, plan);
    this.inMemoryTelemetryLogs.unshift({
      timestamp: new Date().toISOString(),
      planId: plan.planId,
      directive: plan.directive,
      toolsInvokedCount: plan.actionsTaken.length,
      tokensPrompt: plan.awsTelemetry.tokensPrompt,
      tokensCompletion: plan.awsTelemetry.tokensCompletion,
      bedrockLatencyMs: plan.awsTelemetry.bedrockLatencyMs
    });
    // Keep last 50 telemetry records
    if (this.inMemoryTelemetryLogs.length > 50) {
      this.inMemoryTelemetryLogs.pop();
    }
    return true;
  }

  public async getRecentPlans(limit = 10): Promise<AgentPlanExecution[]> {
    return Array.from(this.inMemoryPlanStore.values()).slice(-limit).reverse();
  }

  public async getTelemetryHistory(): Promise<any[]> {
    return [...this.inMemoryTelemetryLogs];
  }
}

export const dynamoService = new DynamoService();
