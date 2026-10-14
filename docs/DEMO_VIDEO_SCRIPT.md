# HomeOps: Under 3-Minute Hackathon Demo Video Script

> **Track**: Alexa+ Track & AWS Builder Mini Challenge  
> **Duration**: 2 minutes 45 seconds  
> **Format**: Screencast with voiceover demonstration of the interactive Alexa+ console & live device mesh

---

## ⏱️ Video Timeline & Scene Breakdown

### Scene 1: The Problem with Legacy Smart Homes (0:00 - 0:30)
- **Visual**: Show traditional smart home dashboard crowded with 20 disconnected toggles, or split screen of frustrating single-turn Alexa commands ("Alexa, turn on A", "Alexa, set B to 70", "Alexa, check lock C").
- **Voiceover**: 
  > *"Smart homes today aren't really smart—they're just remotely controlled. When your electricity rate spikes or a freeze alert strikes, you're left juggling five different apps and barking repetitive single-turn voice commands. Introducing **HomeOps**: an autonomous operations agent built for **Amazon Alexa+** powered by **AWS Bedrock**."*

---

### Scene 2: System Architecture & The ReAct Engine (0:30 - 1:00)
- **Visual**: Pan across the HomeOps interactive web console. Show the **Alexa+ Echo Show interface**, the **Live Smart Device Mesh** (thermostats, solar battery, locks, water main, air quality sensor), and the **AWS Builder Telemetry panel**.
- **Voiceover**: 
  > *"HomeOps leverages a ReAct multi-step autonomous planning engine. Utilizing Bedrock's Claude 3.5 Sonnet and AWS Lambda Action Groups, Alexa+ can perceive the physical state of your entire residence, formulate multi-step mitigation strategies, and safely execute them with physical cyber-safety guardrails."*

---

### Scene 3: Live Demo 1 - High Tariff Peak Shaving (1:00 - 1:40)
- **Visual**: 
  1. Click **Scenario: Utility Peak Rate Surge ($0.48/kWh)**.
  2. Speak or trigger voice directive: *"Alexa, electricity rates are high, save me some money."*
  3. Watch the **ReAct Live Thought Stream**:
     - *Thought 1*: Diagnosing current household draw (1.2kW) and tariff surge tier.
     - *Action 1*: `diagnose_system_anomalies(domain: 'energy')`
     - *Thought 2*: Safe to switch battery reserve into peak-shaving and HVAC to Eco.
     - *Action 2*: `optimize_energy_draw(mode: 'battery_peak_shaving')`
  4. Notice the **Live Device Grid**: The battery immediately supplies household load, and HVAC draw drops.
  5. Hear the Alexa+ spoken response: *"I have engaged battery discharge to buffer peak rates and adjusted climate to Eco mode, saving you 62% on grid power right now."*
- **Voiceover**: 
  > *"Watch as Alexa+ reasons autonomously. Instead of asking what temperature to change, it inspects grid rates, commands the home battery to discharge, throttles HVAC compressors, and confirms immediate savings—all in one conversational turn."*

---

### Scene 4: Live Demo 2 - Bedtime Lockdown & Cold Snap Protection (1:40 - 2:20)
- **Visual**:
  1. Click **Scenario: Nighttime / Unlocked Patio Door**.
  2. Trigger directive: *"Alexa, prepare the house for bedtime."*
  3. Watch the agent detect the ajar patio sliding door, lock the deadbolts, arm Ring perimeter floodlights, and set master bedroom heating to 68°F.
  4. Click **AWS Builder Telemetry**: Show real-time DynamoDB writes, EventBridge bus notifications, and Bedrock token metrics.
- **Voiceover**: 
  > *"In our second scenario, the resident simply says 'Prepare the house for bedtime'. HomeOps sweeps all perimeter sensors, locks the sliding patio door, arms the outdoor Ring perimeter, and sets bedroom climate zones. Every action is audited to Amazon DynamoDB and broadcasted through AWS EventBridge."*

---

### Scene 5: Open-Source SDK & Conclusion (2:20 - 2:45)
- **Visual**: Display the `@homeops/alexa-plus-sdk` code repository, npm package structure, and GitHub README with open-source device adapters.
- **Voiceover**: 
  > *"To empower the entire developer community, we've open-sourced `@homeops/alexa-plus-sdk`—providing plug-and-play device adapters, safety guardrails, and Bedrock action schemas. With Alexa+ and AWS, our homes finally think, protect, and operate autonomously. Thank you!"*

---

## 🎬 Tips for Recording
1. Use OBS Studio or QuickTime / Windows Game Bar (`Win + G`) to record at 1080p 60fps.
2. Ensure clear microphone audio with noise cancellation.
3. Keep mouse movements smooth and deliberate when highlighting the live ReAct thought stream.
