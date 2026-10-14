# @homeops/alexa-plus-sdk 🌐

**The Open-Source Developer SDK for Amazon Alexa+ Agentic Skills & Autonomous Home Operations.**

Built for the **Build, Ship, Shape: Amazon Developer Hackathon 2026** (Alexa+ Track & Open Source Mini Challenge).

---

## 🌟 Overview

The `@homeops/alexa-plus-sdk` provides the foundational building blocks for creating next-generation **Agentic Alexa+ Skills**. It shifts Alexa from reactive command-matching ("turn on the light") to **autonomous ReAct planning, multi-device orchestration, and proactive home diagnostics** backed by AWS Bedrock.

### Key Capabilities:
- 🧠 **Agentic Tool Definition Schema**: Declarative tool registry compatible with AWS Bedrock Actions & Claude 3.5 Sonnet / Amazon Nova.
- 🛡️ **Safety Guardrails System**: Deterministic checks and human-in-the-loop voice confirmation for high-consequence operations (door locks, breaker overrides, safety alarms).
- 🔌 **Unified Smart Device Adapters**: Extensible device classes (Thermostats, Locks, Energy Storage, Lighting, Sensors) with telemetry, health states, and power draw tracking.
- ⚡ **Local Emulation & Cloud-Ready**: Test autonomous agentic directives locally or deploy to AWS Lambda & Bedrock.

---

## 🚀 Quickstart

### 1. Installation
```bash
npm install @homeops/alexa-plus-sdk
```

### 2. Define a Custom Agent Tool
```typescript
import { AgentToolDefinition, AlexaPlusAgentClient } from '@homeops/alexa-plus-sdk';

const client = new AlexaPlusAgentClient({
  endpoint: 'http://localhost:4000/api',
  enableBedrockFallback: true
});

const heatPumpOptimizeTool: AgentToolDefinition = {
  name: 'optimize_heat_pump',
  description: 'Adjusts heat pump modulation and buffer tank storage to balance comfort and dynamic utility pricing.',
  parameters: {
    type: 'object',
    properties: {
      zone: { type: 'string', description: 'Target room or climate zone' },
      targetCop: { type: 'number', description: 'Desired Coefficient of Performance target' }
    },
    required: ['zone']
  },
  dangerous: false
};

client.registerTool(heatPumpOptimizeTool);
```

### 3. Dispatch an Autonomous Directive
```typescript
const response = await client.sendDirective({
  directiveId: 'req-9842',
  utterance: 'Alexa, it feels stuffy upstairs and my electricity rate just went into peak hours. Take care of it.'
});

console.log('Spoken Answer:', response.verbalResponse);
console.log('Agent Steps Taken:', response.steps);
console.log('Actions Executed:', response.actionsTaken);
```

---

## 📜 License
Apache-2.0 © Amazon Developer Hackathon Contributors
