import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { deviceManager } from './devices/deviceManager';
import { bedrockOrchestrator } from './aws/bedrockOrchestrator';
import { dynamoService } from './aws/dynamoService';
import { eventBridgeService } from './aws/eventBridgeService';
import { agentTools } from './agent/tools';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

// Broadcast to all active WebSocket clients
function broadcast(type: string, data: any) {
  const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Subscribe deviceManager changes to WebSocket broadcast
deviceManager.subscribe((devices) => {
  broadcast('DEVICES_UPDATED', devices);
});

// Subscribe eventBridge alerts to WebSocket broadcast
eventBridgeService.onEvent((event) => {
  broadcast('EVENTBRIDGE_ALERT', event);
});

wss.on('connection', (ws) => {
  // Immediately send initial device state and recent events
  ws.send(JSON.stringify({
    type: 'INIT_STATE',
    data: {
      devices: deviceManager.getAllDevices(),
      recentEvents: eventBridgeService.getRecentEvents()
    }
  }));
});

// ---------------- REST API ENDPOINTS ---------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    track: 'Alexa+ HomeOps Autonomous Agent',
    miniChallenges: ['AWS Builder', 'Open Source SDK'],
    timestamp: new Date().toISOString()
  });
});

// Device endpoints
app.get('/api/devices', (req, res) => {
  res.json(deviceManager.getAllDevices());
});

app.post('/api/devices/:id/command', async (req, res) => {
  const { id } = req.params;
  const { attribute, value } = req.body;
  const updated = deviceManager.updateDeviceAttribute(id, attribute, value);
  if (!updated) {
    return res.status(404).json({ error: 'Device not found' });
  }
  res.json(updated);
});

// Alexa+ Directive execution endpoint
app.post('/api/alexa/directive', async (req, res) => {
  try {
    const { utterance, context } = req.body;
    if (!utterance) {
      return res.status(400).json({ error: 'Utterance is required' });
    }

    // Broadcast directive received
    broadcast('DIRECTIVE_STARTING', { utterance });

    const plan = await bedrockOrchestrator.executeDirective(utterance, context);

    // Broadcast plan executed
    broadcast('DIRECTIVE_COMPLETED', plan);

    res.json(plan);
  } catch (err: any) {
    console.error('Error executing directive:', err);
    res.status(500).json({ error: err.message || 'Failed to execute directive' });
  }
});

// Scenarios trigger endpoint
app.post('/api/scenarios/trigger', async (req, res) => {
  const { scenarioId } = req.body;
  if (!scenarioId) {
    return res.status(400).json({ error: 'scenarioId is required' });
  }

  const result = deviceManager.applyScenario(scenarioId);

  // Emit event in EventBridge
  await eventBridgeService.emitEvent(
    'homeops.scenario',
    'ScenarioTriggered',
    `Triggered smart home scenario: ${scenarioId}`,
    scenarioId === 'reset_normal' ? 'info' : 'warning',
    { scenarioId, affectedDevices: result.affectedDevices }
  );

  res.json(result);
});

// History endpoint
app.get('/api/history', async (req, res) => {
  const plans = await dynamoService.getRecentPlans(20);
  res.json(plans);
});

// Telemetry & AWS metrics
app.get('/api/aws/telemetry', async (req, res) => {
  const logs = await dynamoService.getTelemetryHistory();
  res.json({
    activeModel: process.env.AWS_BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    region: process.env.AWS_REGION || 'us-east-1',
    dynamoTableDevices: process.env.AWS_DYNAMODB_TABLE_DEVICES || 'HomeOps_Devices',
    dynamoTableEvents: process.env.AWS_DYNAMODB_TABLE_EVENTS || 'HomeOps_Events',
    eventBridgeBus: process.env.AWS_EVENTBRIDGE_BUS_NAME || 'HomeOps-HomeEvents-Bus',
    recentLogs: logs
  });
});

// Available tools
app.get('/api/tools', (req, res) => {
  const tools = Object.values(agentTools).map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters
  }));
  res.json(tools);
});

httpServer.listen(PORT, () => {
  console.log(`[HomeOps Backend] Server running on http://localhost:${PORT}`);
  console.log(`[HomeOps Backend] WebSocket live at ws://localhost:${PORT}/ws`);
  console.log(`[HomeOps Backend] Alexa+ Autonomous Agent & AWS Builder integration ready.`);
});
