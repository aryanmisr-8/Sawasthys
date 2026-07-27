import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    system: "SwasthyaSamvid SaMD CDS",
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint 1: Prescription OCR Parsing using Gemini 3.6 Flash
app.post("/api/gemini/parse-prescription", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the server. Please check Settings > Secrets.",
      });
    }

    const prompt = `You are an expert Clinical Pharmacologist and SaMD (Software as a Medical Device) prescription digitizer specialized in Indian doctor handwriting and Indian pharmaceuticals (Brand names like Dolo-650, Augmentin, Pantocid, Glycomet, Pan-D, Telma, etc., and generics).
Analyze this handwritten or printed prescription image and extract the contents into structured JSON.
Return JSON strictly adhering to this schema:
{
  "doctorName": "String or Unknown",
  "regNumber": "String or Unknown (e.g. MCI/12345)",
  "patientName": "String or Unknown",
  "date": "String (YYYY-MM-DD or as written)",
  "clinicHospital": "String or Unknown",
  "diagnosis": "String or Unknown",
  "medications": [
    {
      "brandName": "String (e.g. Augmentin 625mg)",
      "genericName": "String (e.g. Amoxicillin + Clavulanic Acid)",
      "dosage": "String (e.g. 625mg)",
      "frequency": "String (e.g. 1-0-1 or Twice daily)",
      "timing": "String (e.g. After Food / Khana khane ke baad)",
      "duration": "String (e.g. 5 days)",
      "cdscoSchedule": "String (e.g. Schedule H / Schedule H1 / OTC)",
      "potentialSideEffects": ["Array of strings"],
      "confidenceScore": 0.95
    }
  ],
  "clinicalNotes": "String (Special precautions or dietary advice written by doctor)"
}`;

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Prescription OCR Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process prescription image with Gemini API.",
    });
  }
});

// Endpoint 2: Mental Health NLP Sentiment & Parameter Assessment
app.post("/api/gemini/mental-health-nlp", async (req, res) => {
  try {
    const { journalText, currentMood, phq9Score, gad7Score } = req.body;
    if (!journalText) {
      return res.status(400).json({ error: "journalText is required for NLP analysis." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is missing." });
    }

    const prompt = `You are a clinical NLP model trained on psychiatric assessment standards (DSM-5, ICD-11, PHQ-9, GAD-7) and cognitive behavioral therapy (CBT).
Analyze the following patient daily journal text in the Indian context:
"${journalText}"

Current Self-Reported Mood: ${currentMood || "Not specified"}
PHQ-9 Assessment Score: ${phq9Score ?? "N/A"}
GAD-7 Assessment Score: ${gad7Score ?? "N/A"}

Perform linguistic sentiment analysis, cognitive distortion identification, and clinical mental risk profiling. Return structured JSON:
{
  "sentimentScore": Number (-1.0 to +1.0),
  "primaryEmotions": ["Array of top 3 detected emotions"],
  "cognitiveDistortions": ["Array of identified CBT distortions e.g. Catastrophizing, All-or-Nothing, Overgeneralization, Emotional Reasoning"],
  "mentalHealthRiskLevel": "Low" | "Moderate" | "High" | "Critical",
  "depressionIndex": Number (0 to 100),
  "anxietyIndex": Number (0 to 100),
  "stressLoad": Number (0 to 100),
  "resilienceIndex": Number (0 to 100),
  "keyTriggersDetected": ["Array of identified situational or emotional triggers"],
  "clinicalSummary": "2-3 concise sentences summarizing the user's emotional state and NLP flags",
  "recommendedAction": "Actionable coping mechanism or guidance (e.g., ground exercise, 14416 Tele-MANAS helpline, consultation recommendation)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Mental Health NLP Error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze mental health journal." });
  }
});

// Endpoint 3: Daily SWOT Journal AI Synthesis
app.post("/api/gemini/swot-synthesis", async (req, res) => {
  try {
    const { strengths, weaknesses, opportunities, threats, date } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is missing." });
    }

    const prompt = `You are a cognitive behavioral therapist and clinical psychologist.
Synthesize the user's daily personal SWOT journal entries (${date || "Today"}):
- Strengths: ${strengths || "None noted"}
- Weaknesses: ${weaknesses || "None noted"}
- Opportunities: ${opportunities || "None noted"}
- Threats: ${threats || "None noted"}

Provide a therapeutic synthesis with action items in structured JSON:
{
  "coreTheme": "Short title describing today's psychological state",
  "strengthLeverage": "How the user can leverage identified strengths to mitigate threats",
  "weaknessMitigation": "1 practical step to reframe or manage weaknesses",
  "opportunityPlan": "1 realistic step to seize opportunities",
  "threatDefense": "Protective boundaries or stress-buffer strategy",
  "cognitiveReframing": "Positive reframing statement for negative thoughts",
  "overallReadinessScore": Number (0 to 100)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("SWOT Synthesis Error:", error);
    return res.status(500).json({ error: error.message || "Failed to synthesize SWOT analysis." });
  }
});

// Endpoint 4: Deep AI Drug Interaction Clinical Reasoning
app.post("/api/gemini/drug-interaction-reasoning", async (req, res) => {
  try {
    const { medicines } = req.body;
    if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
      return res.status(400).json({ error: "At least two medicines are required for interaction analysis." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is missing." });
    }

    const prompt = `You are a Senior Clinical Pharmacologist at AIIMS New Delhi working on SaMD (Software as a Medical Device) Clinical Decision Support.
Evaluate potential drug-drug interactions, side-effect overlapping, and CDSCO regulatory warnings for this list of medicines prescribed in India:
Medications: ${JSON.stringify(medicines)}

Analyse based on pharmacology literature from global medical research universities (Johns Hopkins, Oxford, AIIMS, CDSCO registry).
Return structured JSON:
{
  "interactionPairs": [
    {
      "drugA": "Name of Drug A",
      "drugB": "Name of Drug B",
      "severity": "Critical" | "Moderate" | "Mild",
      "mechanism": "Biochemical or pharmacodynamic mechanism (e.g., CYP3A4 inhibition, additive QT prolongation, dual antiplatelet effect)",
      "clinicalEffect": "Expected physical reaction or clinical hazard",
      "management": "Actionable doctor recommendation (e.g., switch to alternative, monitor INR, space dosage by 4 hours)",
      "evidenceSource": "e.g. AIIMS Clinical Guidelines / Johns Hopkins Medical Pharmacology / CDSCO Advisory"
    }
  ],
  "cumulativeOrganLoad": {
    "hepaticRisk": "Low" | "Moderate" | "High",
    "renalRisk": "Low" | "Moderate" | "High",
    "cardiacRisk": "Low" | "Moderate" | "High",
    "cnsDepressionRisk": "Low" | "Moderate" | "High"
  },
  "overallPolypharmacyRiskScore": Number (0 to 100),
  "janAushadhiGenericAlternatives": [
    {
      "brandPrescribed": "Brand name",
      "genericName": "Generic molecule name",
      "estimatedCostSavings": "e.g., Save ~70% via PMBJP Jan Aushadhi Kendras"
    }
  ],
  "medicalReviewerSummary": "Professional summary for healthcare practitioner review"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Drug Interaction Reasoning Error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze drug interactions." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SwasthyaSamvid SaMD Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
