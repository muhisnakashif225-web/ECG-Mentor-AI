import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily or safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Route: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ECG Mentor AI" });
});

// API Route: AI ECG Parameter Interpretation Assistant
app.post("/api/analyze-ecg", async (req, res) => {
  try {
    const { heartRate, rhythm, pWavePresent, qrsWidth, stChanges, axisDeviation, notes } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are a world-class cardiologist and electrophysiology professor analyzing an ECG parameter set for medical education and decision support.

INPUT PARAMETERS:
- Heart Rate: ${heartRate || "Unspecified"} bpm
- Rhythm: ${rhythm || "Unspecified"}
- P-Waves Present: ${pWavePresent || "Unspecified"}
- QRS Duration/Width: ${qrsWidth || "Unspecified"}
- ST-Segment Changes: ${stChanges || "None"}
- Cardiac Axis: ${axisDeviation || "Normal"}
- Clinical Notes / Context: ${notes || "None provided"}

TASK: Provide a comprehensive, high-yield structured medical report in valid JSON format only (no markdown wrapping).
JSON schema:
{
  "primaryDiagnosis": "Short exact medical diagnosis name",
  "urgencyLevel": "Critical" | "High" | "Moderate" | "Low",
  "differentialDiagnoses": ["Diff 1", "Diff 2", "Diff 3"],
  "keyFindings": {
    "rateAndRhythm": "Detailed breakdown of rate and rhythm",
    "intervals": "PR, QRS, and QTc interval analysis",
    "stTChanges": "Detailed description of ST elevation, depression, or T-wave morph",
    "axisAnalysis": "Axis deviation explanation"
  },
  "nextSteps": [
    "Immediate action 1",
    "Diagnostic lab/imaging 2",
    "Therapeutic/Consultation step 3"
  ],
  "clinicalPearls": [
    "High-yield medical student / board pearl 1",
    "Clinical pearl 2"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are Dr. ECG Mentor, an expert cardiology professor. Return structured medical analysis strictly in JSON format.",
        },
      });

      if (response.text) {
        const cleanText = response.text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
        const data = JSON.parse(cleanText);
        return res.json({ success: true, data, source: "gemini" });
      }
    }

    // Fallback: Rule-based Medical Diagnostic Engine if Gemini is unavailable or missing API key
    const fallbackData = generateRuleBasedEcgAnalysis({
      heartRate,
      rhythm,
      pWavePresent,
      qrsWidth,
      stChanges,
      axisDeviation,
      notes,
    });

    return res.json({ success: true, data: fallbackData, source: "rule-engine" });
  } catch (error: any) {
    console.error("Error analyzing ECG:", error);
    // Provide smart fallback report on error
    const fallbackData = generateRuleBasedEcgAnalysis(req.body);
    return res.json({ success: true, data: fallbackData, source: "rule-engine-fallback", error: error?.message });
  }
});

// API Route: AI Chatbot (Dr. ECG Mentor)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const ai = getGeminiClient();

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    if (ai) {
      const formattedContents = messages.map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const systemInstruction = `You are Dr. ECG Mentor, a renowned Cardiology Fellow and Clinical Electrophysiology Professor. 
Your goal is to guide medical students, residents, and healthcare professionals in mastering ECG interpretation.
Maintain a warm, encouragement-filled, highly educational tone.
Use bullet points, bold key terms, clear normal vs abnormal interval thresholds (PR 120-200ms, QRS <120ms, QTc <440ms/460ms), and practical clinical pearls.
Always break down complex wave anomalies step-by-step. Include emergency red flags when discussing life-threatening arrhythmias or STEMIs.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ success: true, reply: response.text || "I am analyzing that ECG pattern. Could you provide a bit more clinical context?" });
    }

    // Fallback response generator if Gemini key isn't provided
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    const reply = getFallbackChatReply(lastUserMessage);
    return res.json({ success: true, reply, source: "offline-mentor" });
  } catch (error: any) {
    console.error("Error in chat endpoint:", error);
    return res.json({
      success: true,
      reply: "I encountered a brief connection issue, but here is a clinical summary: ECG analysis always follows a systematic approach: 1. Rate & Rhythm, 2. Axis, 3. Intervals (PR, QRS, QT), 4. Hypertrophy/Ischemia. Feel free to re-ask your question!",
    });
  }
});

// Fallback rule-based ECG Engine
function generateRuleBasedEcgAnalysis(input: any) {
  const { heartRate = 75, rhythm = "Sinus", pWavePresent = "Present", qrsWidth = "Normal (<120ms)", stChanges = "None", axisDeviation = "Normal (0 to +90°)", notes = "" } = input;

  const hrNum = parseInt(heartRate) || 75;
  const isElevatedST = String(stChanges).toLowerCase().includes("elevation") || notes.toLowerCase().includes("stemi");
  const isWideQRS = String(qrsWidth).toLowerCase().includes("prolonged") || String(qrsWidth).toLowerCase().includes("wide") || notes.toLowerCase().includes("lbbb") || notes.toLowerCase().includes("rbbb");
  const isAFib = String(rhythm).toLowerCase().includes("irregular") || String(pWavePresent).toLowerCase().includes("absent") || notes.toLowerCase().includes("afib");

  if (isElevatedST) {
    return {
      primaryDiagnosis: "Acute ST-Elevation Myocardial Infarction (STEMI)",
      urgencyLevel: "Critical",
      differentialDiagnoses: ["Acute Coronary Syndrome (STEMI)", "Acute Pericarditis", "Takotsubo Cardiomyopathy", "Benign Early Repolarization (BER)"],
      keyFindings: {
        rateAndRhythm: `${hrNum} bpm, ${rhythm || "Sinus"} rhythm with acute ischemic repolarization changes.`,
        intervals: `QRS Duration: ${qrsWidth}. QTc should be monitored for ischemia-induced prolongation.`,
        stTChanges: `Convex / Tombstone ST-elevation detected in anatomical lead grouping (${stChanges}). Reciprocal ST depression likely present.`,
        axisAnalysis: `Axis: ${axisDeviation}.`,
      },
      nextSteps: [
        "ACTIVATE STEMI CODE IMMEDIATELY: Prepare for emergent Percutaneous Coronary Intervention (PCI) within 90 minutes (or thrombolytics within 30 min if PCI unavailable).",
        "Administer dual antiplatelet therapy (Aspirin 325 mg chewed + P2Y12 inhibitor) and sublingual Nitroglycerin unless inferior RV involvement.",
        "ObtainSTAT serial cardiac troponins, comprehensive metabolic panel, and 12-lead right-sided / posterior leads if inferior/posterior STEMI suspected.",
        "Continuous cardiac telemetry and emergency defibrillator at bedside.",
      ],
      clinicalPearls: [
        "Remember: ST elevation in leads II, III, aVF indicates Inferior STEMI (RCA occlusion). Always obtain V4R to rule out Right Ventricular Infarction prior to giving nitroglycerin!",
        "Reciprocal ST depression in I and aVL is the hallmark confirmation of Inferior STEMI.",
      ],
    };
  }

  if (isAFib) {
    return {
      primaryDiagnosis: hrNum > 100 ? "Atrial Fibrillation with Rapid Ventricular Response (RVR)" : "Atrial Fibrillation (Controlled Rate)",
      urgencyLevel: hrNum > 110 ? "High" : "Moderate",
      differentialDiagnoses: ["Atrial Fibrillation", "Atrial Flutter with Variable Block", "Multifocal Atrial Tachycardia (MAT)"],
      keyFindings: {
        rateAndRhythm: `Irregularly irregular ventricular rhythm at ${hrNum} bpm. Absolute absence of distinct P waves with chaotic baseline fibrillatory waves.`,
        intervals: "Variable R-R intervals. PR interval is unmeasurable due to absent P waves. QRS morphology is narrow unless aberrant conduction exists.",
        stTChanges: "Non-specific ST-T wave changes secondary to rapid ventricular rate.",
        axisAnalysis: `Axis: ${axisDeviation}.`,
      },
      nextSteps: [
        `Assess hemodynamic stability (BP, mental status, chest pain). If unstable with RVR, perform immediate Synchronized Cardioversion.`,
        "If hemodynamically stable, initiate rate control therapy (IV Beta-blocker e.g., Metoprolol, or Diltiazem).",
        "Calculate CHA2DS2-VASc score to determine stroke risk and indication for oral anticoagulation (DOAC / Warfarin).",
        "Check TSH, serum electrolytes (K+, Mg++), echocardiogram to evaluate atrial size and ejection fraction.",
      ],
      clinicalPearls: [
        "Classically described as 'irregularly irregular' rhythm with no discrete P waves.",
        "If AFib duration > 48 hours, cardioversion requires transesophageal echocardiogram (TEE) to rule out LA appendage thrombus, or 3-4 weeks of therapeutic anticoagulation.",
      ],
    };
  }

  if (isWideQRS && hrNum > 120) {
    return {
      primaryDiagnosis: "Monomorphic Ventricular Tachycardia (VT)",
      urgencyLevel: "Critical",
      differentialDiagnoses: ["Ventricular Tachycardia", "SVT with Aberrancy (BBB)", "WPW with Antidromic AVRT"],
      keyFindings: {
        rateAndRhythm: `Fast, regular wide-complex tachycardia at ${hrNum} bpm.`,
        intervals: `Wide QRS complex (>120ms). AV dissociation or capture/fusion beats may be present.`,
        stTChanges: "Secondary T-wave changes discordant with main QRS direction.",
        axisAnalysis: "Extreme axis deviation ('Northwest axis') strongly supports VT.",
      },
      nextSteps: [
        "If pulse is ABSENT: Immediate CPR & Defibrillation (ACLS Cardiac Arrest algorithm).",
        "If pulse present but UNSTABLE: Immediate Synchronized Cardioversion.",
        "If STABLE with pulse: Consider IV Amiodarone (150 mg over 10 min) or Procainamide. Consult Cardiology urgently.",
      ],
      clinicalPearls: [
        "Rule of thumb in Emergency Medicine: Assume wide-complex tachycardia is Ventricular Tachycardia until proven otherwise!",
      ],
    };
  }

  return {
    primaryDiagnosis: hrNum < 60 ? "Sinus Bradycardia" : hrNum > 100 ? "Sinus Tachycardia" : "Normal Sinus Rhythm (NSR)",
    urgencyLevel: hrNum < 50 || hrNum > 120 ? "Moderate" : "Low",
    differentialDiagnoses: [
      hrNum < 60 ? "Sinus Bradycardia / Sick Sinus Syndrome" : hrNum > 100 ? "Sinus Tachycardia secondary to anxiety, fever, dehydration" : "Normal Sinus Rhythm",
      "Physiological variant",
    ],
    keyFindings: {
      rateAndRhythm: `${hrNum} bpm, regular ${rhythm} rhythm with upright P waves in lead II.`,
      intervals: `Normal PR interval (120-200ms), QRS width: ${qrsWidth}, Normal QTc (<440ms).`,
      stTChanges: `Isoelectric ST segments with normal upright T waves in most leads. (${stChanges})`,
      axisAnalysis: `Normal Cardiac Axis: ${axisDeviation}.`,
    },
    nextSteps: [
      "Correlate findings with patient's clinical history, symptoms, and vital signs.",
      "If asymptomatic, reassure patient and document baseline 12-lead ECG.",
      "If symptomatic (e.g., lightheadedness or palpitations), consider 24-48 hour Holter monitoring.",
    ],
    clinicalPearls: [
      "Normal Sinus Rhythm criteria: Rate 60-100 bpm, regular rhythm, identical P wave preceding every QRS complex, PR interval 120-200 ms, upright P wave in leads I, II, aVF.",
    ],
  };
}

function getFallbackChatReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("afib") || lower.includes("flutter")) {
    return `### Differentiating Atrial Fibrillation (AFib) vs. Atrial Flutter (A-Flutter)

**Atrial Fibrillation:**
- **Rhythm:** Irregularly irregular ventricular response.
- **P Waves:** Absent. Replaced by chaotic baseline fibrillatory (*f*) waves (~350–600 bpm atrial rate).
- **Clinical Focus:** Thromboembolism risk (CHA₂DS₂-VASc score) & Rate vs. Rhythm control.

**Atrial Flutter:**
- **Rhythm:** Usually regular (e.g., 2:1 conduction giving ventricular rate ~150 bpm).
- **P Waves:** Classic **"sawtooth"** Flutter (*F*) waves, best seen in inferior leads (II, III, aVF). Atrial rate ~300 bpm.
- **Key Pearl:** Typical A-Flutter is a macro-reentrant circuit around the tricuspid valve isthmus (Cavotricuspid Isthmus) and responds extremely well to Radiofrequency Ablation!`;
  }

  if (lower.includes("peaked") || lower.includes("hyperkalemia") || lower.includes("potassium")) {
    return `### Hyperkalemia ECG Progression on ECG

Hyperkalemia (Elevated K⁺ > 5.5 mEq/L) causes predictable, sequential ECG abnormalities as serum K⁺ rises:

1. **Serum K⁺ 5.5 – 6.5 mEq/L:** Tall, narrow, **Peaked T Waves** (symmetrical, "tent-like") best seen in precordial leads V2–V4.
2. **Serum K⁺ 6.5 – 7.0 mEq/L:** **PR Interval Prolongation** and flattening/loss of P waves.
3. **Serum K⁺ 7.0 – 8.0 mEq/L:** **QRS Widening**, slurred conduction.
4. **Serum K⁺ > 8.0 mEq/L:** QRS merges with T wave creating a classical **Sine Wave pattern** → IMPENDING Cardiac Arrest / PEA / VFib!

⚡ **Immediate Treatment:**
- **IV Calcium Gluconate / Chloride** (Membrane stabilization - acts in 1-3 min).
- **Insulin (10U IV) + D50W** & Nebulized Albuterol (Shifts K⁺ intracellularly).
- **Sodium Zirconium Cyclosilicate (Lokelma)** or Hemodialysis for removal.`;
  }

  if (lower.includes("axis") || lower.includes("calculate")) {
    return `### Quick 2-Lead Method for Calculating Cardiac Axis

Look at **Lead I** and **Lead aVF**:

1. **Normal Axis (0° to +90°):**
   - Lead I: **Upright (Positive)** ⬆️
   - Lead aVF: **Upright (Positive)** ⬆️
   - *Mnemonic: Both thumbs up = Normal!*

2. **Left Axis Deviation (LAD) (-30° to -90°):**
   - Lead I: **Upright (Positive)** ⬆️
   - Lead aVF: **Downward (Negative)** ⬇️
   - Lead II: Downward (Negative) for pathological LAD.
   - *Mnemonic: Leaving each other (Thumbs pointing away) = Left Axis!*

3. **Right Axis Deviation (RAD) (+90° to +180°):**
   - Lead I: **Downward (Negative)** ⬇️
   - Lead aVF: **Upright (Positive)** ⬆️
   - *Mnemonic: Reaching towards each other = Right Axis!*

4. **Extreme / Northwest Axis (-90° to 180°):**
   - Lead I: **Negative** ⬇️
   - Lead aVF: **Negative** ⬇️
   - *Mnemonic: Both thumbs down = Extreme Axis (VT or severe right strain).*`;
  }

  return `### Hello! I am Dr. ECG Mentor 🩺

I am ready to help you analyze ECG tracings, clarify rhythm concepts, or run through clinical cases!

**Suggested Topics to Explore:**
1. **STEMI Localization:** Learn lead groupings for Anterior, Inferior, Lateral, and Posterior MIs.
2. **Sgarbossa Criteria:** Diagnosing acute MI in the presence of Left Bundle Branch Block (LBBB).
3. **AV Block Ladder:** 1st Degree, Mobitz I (Wenckebach), Mobitz II, and 3rd Degree Complete Heart Block.
4. **Brugada Syndrome:** Coved ST elevation in V1-V3 with right bundle branch pattern.

What clinical question or scenario would you like to explore today?`;
}

// Vite middleware for dev / static serve for prod
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[ECG Mentor AI] Dev Server listening on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ECG Mentor AI] Production Server running on http://0.0.0.0:${PORT}`);
  });
}
