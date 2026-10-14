# HomeOps 🌐 Autonomous Smart Home Operations Agent for Alexa+

> **Build, Ship, Shape: Amazon Developer Hackathon 2026**  
> **Track**: Alexa+ Track  
> **Mini Challenges**: AWS Builder Challenge & Open Source Mini Challenge  
> **Built With**: Amazon Alexa+, AWS Bedrock (Claude 3.5 Sonnet / Amazon Nova), Amazon DynamoDB, AWS EventBridge, TypeScript, React 18 & Vite.

[![Alexa+ Track](https://img.shields.io/badge/Track-Alexa%2B-00CAFF?style=for-the-badge&logo=amazon-alexa&logoColor=white)](https://amazonappdev2026.devpost.com)
[![AWS Builder](https://img.shields.io/badge/AWS%20Builder-Bedrock%20%7C%20DynamoDB%20%7C%20EventBridge-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Open Source SDK](https://img.shields.io/badge/Open%20Source-%40homeops%2Falexa--plus--sdk-22C55E?style=for-the-badge&logo=github&logoColor=white)](./sdk)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](./LICENSE)

---

## 🌟 Overview

**HomeOps** is an autonomous, agentic smart home operations system designed for next-generation **Amazon Alexa+**. Moving past legacy slot-filling voice commands, HomeOps utilizes **AWS Bedrock** and a multi-step **ReAct (Reasoning + Acting)** loop to orchestrate complex, interdependent home subsystems:

- 🌡️ **Dual-Zone Climate & HVAC**: Dynamic compressor modulation, zone preheating, and peak curtailment.
- 🔒 **Perimeter Physical Security**: Smart deadbolts, patio ajar sensors, and Ring outdoor floodlight coordination.
- ⚡ **Solar & Battery Peak Shaving**: Autonomous battery discharge when utility tariffs enter peak surge pricing.
- 💨 **HEPA Indoor Air Purification**: Autonomous air scrubbing when AQI or VOC spikes occur.
- 🚰 **Plumbing & Freeze Mitigation**: Proactive thermal circulation to safeguard pipes against sub-freezing bursts.
- 🛡️ **Cyber-Physical Safety Guardrails**: Deterministic consequence gating ensuring high-impact physical actions require voice confirmation.

---

## 🏗️ Architecture

```
                                 ┌─────────────────────────┐
                                 │   🗣️ Alexa+ Directive   │
                                 │  "Save me peak energy"  │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                             ┌─────────────────────────────────┐
                             │ 🛡️ Alexa+ Safety Guardrail Gate  │
                             └────────────────┬────────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                       ┌─────────┤ 🧠 AWS Bedrock Engine   ├─────────┐
                       │         │  (Claude 3.5 / Nova)    │         │
                       │         └─────────────────────────┘         │
                       ▼                                             ▼
          ┌─────────────────────────┐                   ┌─────────────────────────┐
          │ 📋 Multi-Step ReAct Plan│                   │ ⚡ AWS EventBridge Bus   │
          │  Thought -> Tool Action │                   │  Proactive Event Alerts │
          └────────────┬────────────┘                   └─────────────────────────┘
                       │
       ┌───────────────┼───────────────┬───────────────┐
       ▼               ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ ❄️ HVAC Zone │ │ 🔒 Deadbolt │ │ ⚡ Battery  │ │ 💨 Purifier │
│ Thermostats │ │ Perimeter   │ │ Storage     │ │ Pro (HEPA)  │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
       │               │               │               │
       └───────────────┴───────┬───────┴───────────────┘
                               ▼
                ┌─────────────────────────────┐
                │ 🗄️ Amazon DynamoDB          │
                │ Devices & Audit State Store │
                └─────────────────────────────┘
```

---

## 🚀 Quickstart: Run Locally in Under 2 Minutes

### 1. Prerequisites
- **Node.js** v20+ or v24+
- **npm** v10+

### 2. Clone & Install
```bash
git clone https://github.com/your-username/amazon-homeops-alexa.git
cd amazon-homeops-alexa

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Start the Backend Orchestrator (Port 4000)
```bash
cd backend
npm run dev
```
*The backend starts the REST API on `http://localhost:4000` and the real-time WebSocket on `ws://localhost:4000/ws`.*

### 4. Start the Interactive Alexa+ Web Console (Port 3000)
```bash
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Interactive Hackathon Demo Scenarios

Within the console, use the **Interactive Test Scenarios** bar at the top to test real-world situations:

1. **⚡ Peak Tariff Spike ($0.48/kWh)**:
   - *Directive*: `"Alexa, electricity rates are high, save me some money"`
   - *Autonomous Action*: Reads tariff spike &rarr; shifts home to battery discharge &rarr; sets HVAC compressors to Eco mode &rarr; saves 62% in grid power draw.

2. **🌙 Night Security Vulnerability**:
   - *Directive*: `"Alexa, prepare the house for bedtime"`
   - *Autonomous Action*: Sweeps perimeter &rarr; detects ajar patio sliding door &rarr; locks all deadbolts &rarr; arms Ring floodlights &rarr; lowers bedroom temperature to 68°F.

3. **❄️ Freezing Pipe Warning**:
   - *Directive*: `"Alexa, freeze alert incoming, protect my water pipes"`
   - *Autonomous Action*: Detects 31°F basement sensor &rarr; triggers zone heating to 68°F &rarr; circulates thermal buffer to prevent burst pipes.

4. **💨 Smoke & Air Quality Purge**:
   - *Directive*: `"Alexa, I smell smoke in the living room"`
   - *Autonomous Action*: Detects elevated AQI (184) &rarr; engages HEPA filter in Turbo mode &rarr; restores clean indoor air (AQI 32).

---

## 🏆 Hackathon Tracks & Challenges Alignment

| Challenge | Implementation Detail | Directory |
| :--- | :--- | :--- |
| **Alexa+ Track** | Autonomous ReAct agent with natural multi-step execution, spoken synthesis, and Echo Show interface. | [`backend/src/aws/bedrockOrchestrator.ts`](./backend/src/aws/bedrockOrchestrator.ts) |
| **AWS Builder** | CloudFormation SAM template, AWS Bedrock agent runtime, DynamoDB state tables, EventBridge custom bus. | [`infra/template.yaml`](./infra/template.yaml) |
| **Open Source** | Reusable `@homeops/alexa-plus-sdk` with device adapters, safety guardrail evaluators, and schemas. | [`sdk/`](./sdk) |

---

## 📁 Repository Structure

```
amazon-homeops-alexa/
├── backend/                        # Node.js + Express + WebSocket backend orchestrator
│   ├── src/
│   │   ├── agent/tools.ts          # Alexa+ tool registry (climate, locks, battery, air, plumbing)
│   │   ├── aws/bedrockOrchestrator.ts # ReAct agent engine with Claude 3.5 Sonnet / Nova
│   │   ├── aws/dynamoService.ts    # DynamoDB persistence service
│   │   ├── aws/eventBridgeService.ts # EventBridge proactive event bus
│   │   ├── devices/deviceManager.ts# Virtual physical device mesh & scenario engine
│   │   └── server.ts               # Express & WebSocket server
│   └── package.json
├── frontend/                       # Interactive Next-Gen Alexa+ & Echo Show 15 Web Console
│   ├── src/
│   │   ├── components/AlexaConsole.tsx   # Echo Show interface with Web Speech synthesis
│   │   ├── components/ReActStream.tsx    # Step-by-step Thought-Action-Observation visualizer
│   │   ├── components/DeviceGrid.tsx     # Physical smart home nodes with live telemetry
│   │   ├── components/ScenarioBar.tsx    # One-click disruption injection bar
│   │   ├── components/AwsTelemetryModal.tsx # AWS Builder cloud telemetry modal
│   │   └── components/SdkModal.tsx       # Open-source SDK documentation modal
│   └── package.json
├── sdk/                            # Open Source @homeops/alexa-plus-sdk
│   ├── src/
│   │   ├── types.ts                # Strongly typed agentic tool and directive schemas
│   │   ├── deviceAdapter.ts        # Pluggable device adapters (Thermostats, Locks, Batteries)
│   │   └── agent.ts                # Safety guardrails and client bindings
│   ├── package.json
│   └── README.md
├── infra/                          # AWS CloudFormation / SAM Infrastructure
│   ├── template.yaml               # AWS SAM Serverless Application template
│   └── openapi-schema.json         # Bedrock Agent Action Group OpenAPI 3.0 schema
├── docs/
│   ├── ARCHITECTURE.md             # System architecture & Mermaid diagrams
│   ├── PRODUCT_FEEDBACK.md         # In-depth Alexa+ developer experience feedback for Amazon
│   ├── DEMO_VIDEO_SCRIPT.md        # Under 3-minute video recording script
│   └── SUBMISSION.md               # Devpost submission pitch & details
└── README.md                       # This document
```

---

## 📜 Deliverables Checklist
- [x] **Working Project Demo**: Fully operational locally via `npm run dev` with live WebSocket & voice synthesis.
- [x] **Public Code Repository**: Complete source code, zero secrets, Apache 2.0 license.
- [x] **Demo Video Script**: Under 3-minute presentation script in [`docs/DEMO_VIDEO_SCRIPT.md`](./docs/DEMO_VIDEO_SCRIPT.md).
- [x] **Product Feedback**: Actionable feedback for the Amazon developer team in [`docs/PRODUCT_FEEDBACK.md`](./docs/PRODUCT_FEEDBACK.md).

---

## 📄 License
Licensed under the [Apache License, Version 2.0](./LICENSE).
