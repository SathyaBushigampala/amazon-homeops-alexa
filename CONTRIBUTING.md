# Contributing to Amazon HomeOps Alexa

Thank you for your interest in contributing to **Amazon HomeOps Alexa** and the `@homeops/alexa-plus-sdk` open-source ecosystem!

---

## 🛠️ Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SathyaBushigampala/amazon-homeops-alexa.git
   cd amazon-homeops-alexa
   ```

2. **Install all dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../sdk && npm install
   ```

3. **Build the packages:**
   ```bash
   npm run build:all
   ```

4. **Start the local dev servers:**
   - Backend API & WebSocket: `npm run dev:backend` (Port 4000)
   - Frontend Echo Show Console: `npm run dev:frontend` (Port 3000)

---

## 🔌 Adding a Custom Smart Device Adapter

All device adapters inherit from `SmartDeviceAdapter` in `sdk/src/deviceAdapter.ts`.

Example:
```typescript
import { SmartDeviceAdapter } from '@homeops/alexa-plus-sdk';

export class SmartBlindsAdapter extends SmartDeviceAdapter {
  constructor(id: string, name: string, room: string) {
    super(id, name, 'sensor', room, { positionPercent: 100, motorState: 'idle' });
  }

  public async executeCommand(command: string, params: Record<string, any>): Promise<any> {
    if (command === 'set_position') {
      this.updateAttribute('positionPercent', params.position);
      return { success: true, position: params.position };
    }
    throw new Error(`Unknown command ${command}`);
  }
}
```

---

## 📜 Pull Request Guidelines
- Follow TypeScript strict type-checking.
- Ensure all builds pass (`npm run build` in backend, frontend, and sdk).
- Adhere to the Apache-2.0 License.

**Author**: Sathya Bushigampala &bull; [GitHub Profile](https://github.com/SathyaBushigampala)
