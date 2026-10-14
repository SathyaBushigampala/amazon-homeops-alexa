# Amazon HomeOps Alexa — Local Setup & Verification Guide

> **Author**: Sathya Bushigampala  
> **Repository**: [https://github.com/SathyaBushigampala/amazon-homeops-alexa](https://github.com/SathyaBushigampala/amazon-homeops-alexa)

---

## 📋 System Prerequisites
- **Node.js**: v20.x or v24.x
- **npm**: v10.x+
- **Python**: 3.10+ (for ReportLab PDF documentation)
- **Modern Web Browser**: Chrome, Edge, or Firefox (with microphone permissions enabled for voice directives)

---

## ⚡ 1-Minute Launch Instructions

### 1. Start the Backend Orchestrator
```bash
cd backend
npm run dev
```
- **REST API**: `http://localhost:4000/api`
- **Health Check**: `http://localhost:4000/api/health`
- **WebSocket Telemetry**: `ws://localhost:4000/ws`

### 2. Start the Interactive Frontend Console
In a second terminal:
```bash
cd frontend
npm run dev
```
- Open your browser at: **`http://localhost:3000`**

---

## 🧪 Validating Features
1. **Interactive Scenarios**: Click *'Peak Tariff Spike'*, *'Freezing Pipe Warning'*, or *'Night Security Vulnerability'* at the top.
2. **Alexa+ Directives**: Speak using the microphone button or click quick voice chips.
3. **AWS Builder Telemetry**: Click the *'AWS Builder'* button in the navbar to inspect live Bedrock latency, DynamoDB writes, and EventBridge streaming alerts.
4. **Interactive Device Overrides**: Click `[+]`, `[-]`, `[Lock Deadbolt]`, `[Turbo Fan]`, or `[Shut Valve]` on any card to test bidirectional WebSocket sync.
