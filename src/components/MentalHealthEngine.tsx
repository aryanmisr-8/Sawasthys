import React, { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  BookOpen,
  Activity,
  Send,
  AlertCircle,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MentalHealthState, SWOTEntry } from "../types";

const MOOD_TREND_DATA = [
  { day: "Mon", phq9: 8, gad7: 6, moodIndex: 65, stress: 55 },
  { day: "Tue", phq9: 7, gad7: 5, moodIndex: 70, stress: 50 },
  { day: "Wed", phq9: 10, gad7: 8, moodIndex: 58, stress: 72 },
  { day: "Thu", phq9: 6, gad7: 4, moodIndex: 78, stress: 40 },
  { day: "Fri", phq9: 5, gad7: 3, moodIndex: 82, stress: 35 },
  { day: "Sat", phq9: 6, gad7: 4, moodIndex: 80, stress: 38 },
  { day: "Sun", phq9: 6, gad7: 4, moodIndex: 76, stress: 42 },
];

export const MentalHealthEngine: React.FC = () => {
  // Clinical Metric Parameters
  const [phq9Score, setPhq9Score] = useState<number>(6);
  const [gad7Score, setGad7Score] = useState<number>(4);
  const [selectedMood, setSelectedMood] = useState<string>("Anxious");

  // Daily Journal text for NLP evaluation
  const [journalText, setJournalText] = useState<string>(
    "Felt overwhelmed with work deadlines today. Kept worrying that everything might fail or I won't meet expectations. However, I managed to take a 20 minute evening walk and felt slightly calmer."
  );

  const [nlpLoading, setNlpLoading] = useState<boolean>(false);
  const [nlpResult, setNlpResult] = useState<Partial<MentalHealthState> | null>({
    sentimentScore: -0.35,
    primaryEmotions: ["Apprehension", "Fatigue", "Cautious Hope"],
    cognitiveDistortions: ["Catastrophizing", "All-or-Nothing Thinking"],
    mentalHealthRiskLevel: "Moderate",
    depressionIndex: 32,
    anxietyIndex: 48,
    stressLoad: 62,
    resilienceIndex: 68,
    keyTriggers: ["Work Deadlines", "Perfectionist Expectations"],
    clinicalSummary:
      "Linguistic markers indicate transient situational anxiety driven by performance pressure. Presence of catastrophizing distortion, mitigated by healthy coping mechanisms (evening walk).",
    recommendedAction:
      "Practice 4-7-8 diaphragmatic breathing. Break large work tasks into 15-minute micro-goals. Continue daily SWOT reflection.",
  });

  // Daily SWOT Journal state
  const [swotStrengths, setSwotStrengths] = useState(
    "Good self-awareness, active walk habit, supportive family"
  );
  const [swotWeaknesses, setSwotWeaknesses] = useState(
    "Tendency to overthink deadlines, difficulty delegating tasks"
  );
  const [swotOpportunities, setSwotOpportunities] = useState(
    "Join weekend yoga class, practice mindfulness meditation"
  );
  const [swotThreats, setSwotThreats] = useState(
    "Upcoming project review, sleep disruption from late screen time"
  );

  const [swotLoading, setSwotLoading] = useState(false);
  const [swotSynthesis, setSwotSynthesis] = useState<any | null>({
    coreTheme: "Performance Stress Reframing",
    strengthLeverage: "Use your walk habit to anchor daily mindfulness and debrief stressful thoughts.",
    weaknessMitigation: "Set a hard 15-minute timer when reviewing tasks to curb overthinking.",
    opportunityPlan: "Enroll in the yoga session this Saturday to strengthen stress buffering.",
    threatDefense: "Enable sleep-mode on mobile by 10 PM to prevent late screen exposure.",
    cognitiveReframing: "'A busy day is a temporary challenge, not a reflection of my worth.'",
    overallReadinessScore: 74,
  });

  // Execute Server-side NLP analysis via Gemini API
  const handleAnalyzeJournalNlp = async () => {
    if (!journalText.trim()) return;
    setNlpLoading(true);

    try {
      const res = await fetch("/api/gemini/mental-health-nlp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journalText,
          currentMood: selectedMood,
          phq9Score,
          gad7Score,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNlpResult(json.data);
      }
    } catch (err) {
      console.error("NLP Analysis error:", err);
    } finally {
      setNlpLoading(false);
    }
  };

  // Execute SWOT Synthesis via Gemini API
  const handleSynthesizeSwot = async () => {
    setSwotLoading(true);

    try {
      const res = await fetch("/api/gemini/swot-synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strengths: swotStrengths,
          weaknesses: swotWeaknesses,
          opportunities: swotOpportunities,
          threats: swotThreats,
          date: new Date().toLocaleDateString(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSwotSynthesis(json.data);
      }
    } catch (err) {
      console.error("SWOT synthesis error:", err);
    } finally {
      setSwotLoading(false);
    }
  };

  // Helper for PHQ-9 level label
  const getPhq9Label = (score: number) => {
    if (score <= 4) return { label: "Minimal Depression", color: "text-emerald-700" };
    if (score <= 9) return { label: "Mild Depression", color: "text-amber-700" };
    if (score <= 14) return { label: "Moderate Depression", color: "text-orange-700" };
    if (score <= 19) return { label: "Moderately Severe", color: "text-rose-700" };
    return { label: "Severe Depression", color: "text-red-700 font-bold animate-pulse" };
  };

  // Helper for GAD-7 level label
  const getGad7Label = (score: number) => {
    if (score <= 4) return { label: "Minimal Anxiety", color: "text-emerald-700" };
    if (score <= 9) return { label: "Mild Anxiety", color: "text-amber-700" };
    if (score <= 14) return { label: "Moderate Anxiety", color: "text-orange-700" };
    return { label: "Severe Anxiety", color: "text-red-700 font-bold" };
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Core Module: Mental Health Analytics & SWOT Journal
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full">
                Gemini 3.6 Flash NLP + CBT Framework
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Predictive Mental Health & Cognitive SWOT Analyzer
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Combines standardized clinical psychometrics (PHQ-9 & GAD-7) with AI natural language processing to extract cognitive distortions, emotional triggers, and personal SWOT growth strategies.
            </p>
          </div>

          <a
            href="tel:14416"
            className="shrink-0 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            title="Tele-MANAS Government Helpline"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Tele-MANAS Mental Health Helpline: 14416
          </a>
        </div>
      </div>

      {/* Grid: Interactive Clinical Parameter Sliders & Mood Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Clinical Metrics Sliders */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" /> Clinical Metric Parameters
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
              DSM-5 Standard
            </span>
          </div>

          {/* PHQ-9 Depression Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-semibold">PHQ-9 Assessment Score</span>
              <span className={`font-mono font-bold ${getPhq9Label(phq9Score).color}`}>
                {phq9Score}/27 - {getPhq9Label(phq9Score).label}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="27"
              value={phq9Score}
              onChange={(e) => setPhq9Score(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Minimal)</span>
              <span>10 (Moderate)</span>
              <span>27 (Severe)</span>
            </div>
          </div>

          {/* GAD-7 Anxiety Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-semibold">GAD-7 Anxiety Score</span>
              <span className={`font-mono font-bold ${getGad7Label(gad7Score).color}`}>
                {gad7Score}/21 - {getGad7Label(gad7Score).label}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="21"
              value={gad7Score}
              onChange={(e) => setGad7Score(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Minimal)</span>
              <span>8 (Mild)</span>
              <span>21 (Severe)</span>
            </div>
          </div>

          {/* Mood Selector Chips */}
          <div className="space-y-2">
            <span className="text-xs text-slate-700 font-semibold block">Primary Mood Tag</span>
            <div className="flex flex-wrap gap-2">
              {["Exuberant", "Calm", "Anxious", "Fatigued", "Depressed", "Overwhelmed"].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    selectedMood === m
                      ? "bg-purple-600 border-purple-700 text-white font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Recharts Mood & Stress Trend Graph */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> Longitudinal Psychometric Parameter Trend
              </h3>
              <p className="text-xs text-slate-500">7-Day tracking of Mood Index vs Stress Load</p>
            </div>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Positive Trajectory +14%
            </span>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOOD_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", fontSize: "12px", color: "#0f172a" }}
                />
                <Area type="monotone" dataKey="moodIndex" stroke="#059669" fillOpacity={1} fill="url(#colorMood)" name="Mood Index Score" />
                <Area type="monotone" dataKey="stress" stroke="#e11d48" fillOpacity={1} fill="url(#colorStress)" name="Stress Load" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Feature 1: Daily Journal with Server-Side Gemini NLP Engine */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" /> Daily Clinical Journal & NLP Sentiment Model
            </h3>
            <p className="text-xs text-slate-600">
              Type your daily thoughts to automatically extract linguistic mood markers, CBT cognitive distortions, and risk alerts via Gemini AI.
            </p>
          </div>

          <button
            onClick={handleAnalyzeJournalNlp}
            disabled={nlpLoading}
            className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-100" />
            {nlpLoading ? "Analyzing NLP..." : "Run NLP Sentiment Model"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Journal Textarea */}
          <div className="space-y-2">
            <label className="text-xs text-slate-700 font-semibold block">Journal Reflection Input</label>
            <textarea
              rows={6}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Describe your day, emotional feelings, sleep quality, and any troubling thoughts..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-sans"
            ></textarea>
          </div>

          {/* NLP Analysis Output Card */}
          {nlpResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" /> Sentiment Analysis Result
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    nlpResult.mentalHealthRiskLevel === "Low"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {nlpResult.mentalHealthRiskLevel} Risk Level
                </span>
              </div>

              {/* Detected Cognitive Distortions */}
              <div>
                <span className="text-slate-600 block font-semibold text-[11px] mb-1">
                  Detected Cognitive Distortions (CBT Flags):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {nlpResult.cognitiveDistortions?.map((d) => (
                    <span
                      key={d}
                      className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clinical NLP Summary */}
              <div>
                <span className="text-slate-600 block font-semibold text-[11px]">Linguistic Summary:</span>
                <p className="text-slate-800 mt-0.5 leading-relaxed">{nlpResult.clinicalSummary}</p>
              </div>

              {/* Recommended Action */}
              <div className="bg-purple-50 p-2.5 rounded border border-purple-200">
                <strong className="text-purple-900 block text-[11px]">Clinical Coping Action:</strong>
                <p className="text-purple-800 mt-0.5">{nlpResult.recommendedAction}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Feature 2: Daily SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Daily Psychological SWOT Matrix
            </h3>
            <p className="text-xs text-slate-600">
              Reflect on daily Strengths, Weaknesses, Opportunities, and Threats to build cognitive resilience.
            </p>
          </div>

          <button
            onClick={handleSynthesizeSwot}
            disabled={swotLoading}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            {swotLoading ? "Synthesizing..." : "Synthesize SWOT with AI"}
          </button>
        </div>

        {/* 2x2 SWOT Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-slate-50 border border-emerald-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-emerald-800 text-xs uppercase tracking-wider block">
              💪 Strengths (Internal Positive)
            </span>
            <textarea
              rows={3}
              value={swotStrengths}
              onChange={(e) => setSwotStrengths(e.target.value)}
              placeholder="What went well today? What internal strengths did you demonstrate?"
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-50 border border-amber-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-amber-800 text-xs uppercase tracking-wider block">
              ⚠️ Weaknesses (Internal Challenges)
            </span>
            <textarea
              rows={3}
              value={swotWeaknesses}
              onChange={(e) => setSwotWeaknesses(e.target.value)}
              placeholder="Where did you feel stuck or over-stressed?"
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Opportunities */}
          <div className="bg-slate-50 border border-blue-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-blue-800 text-xs uppercase tracking-wider block">
              🚀 Opportunities (External Growth)
            </span>
            <textarea
              rows={3}
              value={swotOpportunities}
              onChange={(e) => setSwotOpportunities(e.target.value)}
              placeholder="What habit, relationship, or exercise can boost your mood tomorrow?"
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Threats */}
          <div className="bg-slate-50 border border-rose-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-rose-800 text-xs uppercase tracking-wider block">
              🛡️ Threats (External Stressors)
            </span>
            <textarea
              rows={3}
              value={swotThreats}
              onChange={(e) => setSwotThreats(e.target.value)}
              placeholder="What external stress factors or deadlines are looming?"
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* AI SWOT Synthesis Card */}
        {swotSynthesis && (
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-xl p-5 space-y-3 text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Therapeutic SWOT Synthesis
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold border border-emerald-300">
                Readiness Score: {swotSynthesis.overallReadinessScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                <strong className="text-emerald-800 block text-[11px]">Strength Strategy:</strong>
                <p className="mt-0.5">{swotSynthesis.strengthLeverage}</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                <strong className="text-amber-800 block text-[11px]">Weakness Management:</strong>
                <p className="mt-0.5">{swotSynthesis.weaknessMitigation}</p>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded border border-purple-200 text-purple-900">
              <strong className="text-purple-800 block text-[11px]">Cognitive Reframing Statement:</strong>
              <p className="italic mt-0.5">{swotSynthesis.cognitiveReframing}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
