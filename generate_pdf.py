import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages after cover)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "HomeOps: Alexa+ Autonomous Smart Home Agent — New User Guide")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 30, footer_text)
        self.drawString(54, 30, "Amazon Developer Hackathon 2026 • Alexa+ Track & AWS Builder")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 40, letter[0] - 54, 40)
        
        self.restoreState()

def build_pdf(filename="HOMEOPS_USER_GUIDE.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom palette
    navy = colors.HexColor("#0B132B")
    cyan = colors.HexColor("#0088B8")
    dark_slate = colors.HexColor("#1A202C")
    light_slate = colors.HexColor("#4A5568")
    card_bg = colors.HexColor("#F7FAFC")
    border_color = colors.HexColor("#CBD5E0")
    tag_bg = colors.HexColor("#E6FFFA")
    tag_text = colors.HexColor("#234E52")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=navy,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=cyan,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=navy,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=cyan,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=dark_slate,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1A365D")
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#2C5282")
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("HomeOps User & Evaluation Guide", title_style))
    story.append(Paragraph("Autonomous Smart Home Operations Agent for Amazon Alexa+ & AWS Bedrock", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=cyan, spaceBefore=0, spaceAfter=14))

    # Executive Overview
    story.append(Paragraph("1. Executive Overview", h1_style))
    overview_text = (
        "Welcome to <b>HomeOps</b>, built for the <b>Build, Ship, Shape: Amazon Developer Hackathon 2026</b> "
        "(Alexa+ Track, AWS Builder Challenge, and Open Source Mini Challenge). HomeOps is a next-generation "
        "autonomous smart home operations agent. Unlike traditional voice assistants that require rigid, single-turn "
        "commands ('Alexa, turn on the porch light'), HomeOps uses a multi-step <b>ReAct (Reasoning + Acting)</b> "
        "framework powered by <b>AWS Bedrock</b> to orchestrate interdependent home subsystems (HVAC, solar storage, "
        "smart deadbolts, HEPA filtration, and freeze-sensitive plumbing) based on high-level human directives."
    )
    story.append(Paragraph(overview_text, body_style))

    # Architecture Highlights Table
    arch_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology / Service</b>", body_style), Paragraph("<b>Key Role in HomeOps</b>", body_style)],
        [Paragraph("<b>Alexa+ Agent</b>", body_style), Paragraph("AWS Bedrock (Claude 3.5 / Nova)", body_style), Paragraph("Multi-step ReAct reasoning, tool selection & voice synthesis", body_style)],
        [Paragraph("<b>Smart Mesh</b>", body_style), Paragraph("Virtual Physical Node Bus", body_style), Paragraph("Real-time telemetry, compressor power draw, sensor simulation", body_style)],
        [Paragraph("<b>Cloud State</b>", body_style), Paragraph("Amazon DynamoDB", body_style), Paragraph("Audit logging, state persistence, plan history storage", body_style)],
        [Paragraph("<b>Proactive Bus</b>", body_style), Paragraph("AWS EventBridge", body_style), Paragraph("Ambient trigger ingestion (tariff spikes, freeze warnings)", body_style)],
        [Paragraph("<b>Open Source SDK</b>", body_style), Paragraph("<code>@homeops/alexa-plus-sdk</code>", body_style), Paragraph("Reusable TypeScript device adapters and safety guardrails", body_style)],
    ]
    t_arch = Table(arch_data, colWidths=[110, 150, 244])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDF2F7")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 12))

    # Getting Started
    story.append(Paragraph("2. Quickstart: Launching the App in Under 2 Minutes", h1_style))
    story.append(Paragraph("Both backend and frontend services can run simultaneously on your local machine:", body_style))

    quickstart_code = (
        "<b>Terminal 1 (Backend API & WebSocket Server):</b><br/>"
        "&nbsp;&nbsp;<code>cd backend</code><br/>"
        "&nbsp;&nbsp;<code>npm run dev</code> &nbsp;&nbsp;&nbsp;&nbsp;<i>(Runs on http://localhost:4000)</i><br/><br/>"
        "<b>Terminal 2 (Interactive Alexa+ Web Console):</b><br/>"
        "&nbsp;&nbsp;<code>cd frontend</code><br/>"
        "&nbsp;&nbsp;<code>npm run dev</code> &nbsp;&nbsp;&nbsp;&nbsp;<i>(Runs on http://localhost:3000)</i>"
    )
    t_code = Table([[Paragraph(quickstart_code, code_style)]], colWidths=[504])
    t_code.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), card_bg),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_code)
    story.append(Spacer(1, 10))
    story.append(Paragraph("Open your web browser and navigate to: <b><u>http://localhost:3000</u></b>", body_style))

    story.append(Spacer(1, 10))

    # User Interface Tour
    story.append(Paragraph("3. Visual Tour of the HomeOps Interface", h1_style))
    story.append(Paragraph("The web console is divided into three functional areas:", body_style))
    story.append(Paragraph("• <b>Top Navigation & Scenario Bar:</b> Contains quick status indicators (AWS Builder, Open Source SDK, Live WebSocket) and the 4 interactive scenario injection buttons.", bullet_style))
    story.append(Paragraph("• <b>Left Column — Alexa+ Multimodal Console & ReAct Stream:</b> Echo Show 15 simulation featuring the pulsing Alexa cyan acoustic ring, speech-to-text mic input, speech synthesis audio playback, and live ReAct step-by-step reasoning logs.", bullet_style))
    story.append(Paragraph("• <b>Right Column — Smart Home Device Mesh:</b> Live tiles representing the 8 home subsystems: Living Room Thermostat, Master Bedroom Thermostat, Front Door Smart Deadbolt, Back Patio Sliding Lock, Solar & Battery Reserve, HEPA Air Purifier Pro, Water Main Sentinel, and Ring Perimeter Floodlight.", bullet_style))

    story.append(Spacer(1, 10))

    # Step-by-Step Scenario Walkthrough
    story.append(Paragraph("4. Step-by-Step Evaluation Scenarios", h1_style))
    story.append(Paragraph("Use these 4 pre-configured test scenarios to evaluate how HomeOps reasons autonomously:", body_style))

    scenarios = [
        ("Scenario A: Bedtime Security Lockdown",
         "Click <b>'Night Security Vulnerability'</b> in the top bar (sets patio door ajar).",
         "Speak or click: <i>'Alexa, prepare the house for bedtime'</i>.",
         "Agent sweeps perimeter &rarr; locks front deadbolt &rarr; locks sliding patio door &rarr; arms Ring floodlights &rarr; lowers bedroom temperature to 68°F. Spoken confirmation confirms full night mode."),
        
        ("Scenario B: Utility Peak Tariff Shaving",
         "Click <b>'Peak Tariff Spike ($0.48/kWh)'</b> in the top bar.",
         "Speak or click: <i>'Alexa, electricity rates are high, save me some money'</i>.",
         "Agent reads tariff surge &rarr; engages battery discharge to buffer house load &rarr; sets HVAC compressors to Eco mode &rarr; cuts grid power draw by 62%."),
        
        ("Scenario C: Cold Snap Freeze Protection",
         "Click <b>'Freezing Pipe Warning (Basement 31°F)'</b> in the top bar.",
         "Speak or click: <i>'Alexa, freeze alert incoming, protect my water pipes'</i>.",
         "Agent scans water line sensors &rarr; detects 31°F risk &rarr; boosts zone heating to 68°F &rarr; safely raises pipe temperature to 46°F to prevent pipe burst."),
        
        ("Scenario D: Smoke & Air Quality Purge",
         "Click <b>'Smoke / Poor Air Quality'</b> in the top bar (simulates AQI 184).",
         "Speak or click: <i>'Alexa, I smell smoke in the living room'</i>.",
         "Agent detects dangerous particulate spike &rarr; sets HEPA filter to Turbo speed &rarr; rapidly cleans air back to safe levels (AQI 32).")
    ]

    for title, setup, trigger, result in scenarios:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(f"1. <b>Setup:</b> {setup}", bullet_style))
        story.append(Paragraph(f"2. <b>Trigger:</b> {trigger}", bullet_style))
        story.append(Paragraph(f"3. <b>Autonomous Result:</b> {result}", bullet_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # Interactive Manual Controls
    story.append(Paragraph("5. Interactive Manual Actuation (Bidirectional Sync)", h1_style))
    story.append(Paragraph(
        "Every device tile in the mesh includes interactive manual controls to test two-way synchronization. "
        "When an action is taken manually, changes are instantly transmitted via WebSockets to all connected clients:",
        body_style
    ))

    controls_data = [
        [Paragraph("<b>Subsystem</b>", body_style), Paragraph("<b>Interactive Controls Available</b>", body_style), Paragraph("<b>Physics & Telemetry Effect</b>", body_style)],
        [Paragraph("<b>Thermostats</b>", body_style), Paragraph("<code>[+]</code> / <code>[-]</code> temp dials, <code>[Switch Eco]</code>", body_style), Paragraph("Updates target temp; Eco drops draw from 410W to 130W", body_style)],
        [Paragraph("<b>Smart Locks</b>", body_style), Paragraph("<code>[Lock Deadbolt]</code>, <code>[Toggle Ajar]</code>", body_style), Paragraph("Toggles locked state; ajar/unlocked triggers security alert", body_style)],
        [Paragraph("<b>Energy Storage</b>", body_style), Paragraph("<code>[Peak Surge Tier]</code> toggle", body_style), Paragraph("Switches pricing tier between standard and peak surge rate", body_style)],
        [Paragraph("<b>Air Purifier</b>", body_style), Paragraph("<code>[Turbo Fan]</code> / <code>[Auto Fan]</code>", body_style), Paragraph("Turbo increases fan RPM, clears airborne particulate", body_style)],
        [Paragraph("<b>Water Main</b>", body_style), Paragraph("<code>[Shut Valve]</code> / <code>[Open Valve]</code>", body_style), Paragraph("Controls water isolation valve; prevents catastrophic leaks", body_style)],
        [Paragraph("<b>Ring Security</b>", body_style), Paragraph("<code>[Armed]</code>, <code>[💡 Light On]</code> toggle", body_style), Paragraph("Toggles exterior perimeter motion sensors and floodlights", body_style)],
    ]
    t_ctrl = Table(controls_data, colWidths=[100, 190, 214])
    t_ctrl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDF2F7")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_ctrl)
    story.append(Spacer(1, 14))

    # Speech Synthesis & Microphone
    story.append(Paragraph("6. Voice Microphone & Audio Synthesis", h1_style))
    story.append(Paragraph(
        "• <b>Real Microphone Input:</b> Click the microphone icon in the left search bar. Speak into your computer's "
        "microphone using natural language (e.g., <i>'Alexa, set temperature to 69 degrees'</i>). HomeOps uses the Web "
        "Speech Recognition API to transcribe your speech and dispatch the directive automatically.<br/>"
        "• <b>Audio Voice Output:</b> Whenever Alexa+ replies, click the speaker icon (🔊) in the spoken response bubble "
        "to hear Alexa's voice synthesized aloud via the browser's SpeechSynthesis engine.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # AWS Builder & Open Source SDK Reference
    story.append(Paragraph("7. AWS Builder Cloud Stack & Open Source SDK", h1_style))
    story.append(Paragraph(
        "• <b>AWS CloudFormation / SAM Template:</b> Located at <code>infra/template.yaml</code>, defining the AWS Bedrock "
        "agent role, Lambda Action Group dispatchers, DynamoDB tables (<code>HomeOps_Devices</code>, <code>HomeOps_Plans</code>), "
        "and custom EventBridge bus (<code>HomeOps-HomeEvents-Bus</code>).<br/>"
        "• <b>Open-Source SDK:</b> Located at <code>sdk/</code>, published as <code>@homeops/alexa-plus-sdk</code> under "
        "Apache-2.0. Contains plug-and-play smart device adapters, deterministic cyber-physical guardrails, and Bedrock "
        "action group schemas.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Troubleshooting & FAQ Table
    story.append(Paragraph("8. Troubleshooting & FAQ", h1_style))
    faq_data = [
        [Paragraph("<b>Question / Issue</b>", body_style), Paragraph("<b>Explanation & Solution</b>", body_style)],
        [Paragraph("Browser asks for microphone permission?", body_style), Paragraph("Click 'Allow' when clicking the microphone button so the Web Speech API can capture your audio.", body_style)],
        [Paragraph("What if AWS credentials are not set?", body_style), Paragraph("HomeOps has an intelligent built-in autonomous ReAct emulation engine with real telemetry so all features work 100% offline out-of-the-box.", body_style)],
        [Paragraph("How to reset the simulation?", body_style), Paragraph("Click the <b>'Reset System'</b> button in the top right of the scenario bar to restore all devices to normal baseline.", body_style)],
    ]
    t_faq = Table(faq_data, colWidths=[180, 324])
    t_faq.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDF2F7")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_faq)
    story.append(Spacer(1, 14))

    # Document Footer / Contact
    callout_text = (
        "<b>Submission Notice:</b> Prepared for the Amazon Developer Hackathon 2026.<br/>"
        "All source code is licensed under Apache-2.0. Video demo script is located in <code>docs/DEMO_VIDEO_SCRIPT.md</code>, "
        "and developer platform feedback is in <code>docs/PRODUCT_FEEDBACK.md</code>."
    )
    t_callout = Table([[Paragraph(callout_text, callout_style)]], colWidths=[504])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EBF8FF")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#3182CE")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_callout)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    build_pdf("HOMEOPS_USER_GUIDE.pdf")
