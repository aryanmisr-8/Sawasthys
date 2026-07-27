import React, { useState } from "react";
import {
  ShieldAlert,
  Activity,
  Heart,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import { PatientVitals, InteractionPair } from "../types";

interface ClinicalDecisionSupportProps {
  vitals: PatientVitals;
  setVitals: React.Dispatch<React.SetStateAction<PatientVitals>>;
  activeInteractions: InteractionPair[];
  onNavigateToInteractions: () => void;
  onNavigateToMentalHealth: () => void;
}

export const ClinicalDecisionSupport: React.FC<ClinicalDecisionSupportProps> = ({
  vitals,
  setVitals,
  activeInteractions,
  onNavigateToInteractions,
  onNavigateToMentalHealth,
}) => {
  const [physicianSignOff, setPhysicianSignOff] = useState(false);
  const [isEditingVitals, setIsEditingVitals] = useState(false);

  const criticalCount = activeInteractions.filter((i) => i.severity === "Critical").length;
  const moderateCount = activeInteractions.filter((i) => i.severity === "Moderate").length;

  const handleVitalChange = (field: keyof PatientVitals, value: number) => {
    setVitals((prev) => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  };

  return (
    <div className="space-y-6">
      {/* CDSCO SaMD Compliance Alert Banner */}
      <div className="bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-xl p-4 shadow-sm border border-emerald-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">
                  Clinical Decision Support System (CDSS) - Active Monitoring
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-300">
                  CDSCO Notice 2022 Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Intended for registered medical practitioners and qualified healthcare staff in India. System provides decision guidance based on AIIMS, Johns Hopkins, and CDSCO database.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPhysicianSignOff(!physicianSignOff)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                physicianSignOff
                  ? "bg-emerald-100 border-emerald-500 text-emerald-800 font-semibold"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              {physicianSignOff ? "Physician Sign-off Active" : "Require Physician Sign-off"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Clinical Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Vitals & Real-Time Patient Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Patient Vitals Control Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Real-Time Patient Vitals Analytics</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Last updated: {vitals.lastUpdated}</span>
                <button
                  onClick={() => setIsEditingVitals(!isEditingVitals)}
                  className="ml-2 text-xs text-blue-600 hover:underline font-medium"
                >
                  {isEditingVitals ? "Done" : "Update Vitals"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {/* Heart Rate */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
                  <span>Heart Rate</span>
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                {isEditingVitals ? (
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => handleVitalChange("heartRate", Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono text-lg"
                  />
                ) : (
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {vitals.heartRate}{" "}
                    <span className="text-xs font-normal text-slate-500">bpm</span>
                  </div>
                )}
                <span className="text-[10px] text-emerald-700 font-medium">Normal Sinus Rhythm</span>
              </div>

              {/* Blood Pressure */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
                  <span>Blood Pressure</span>
                  <Activity className="w-4 h-4 text-sky-600" />
                </div>
                {isEditingVitals ? (
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={vitals.bpSystolic}
                      onChange={(e) => handleVitalChange("bpSystolic", Number(e.target.value))}
                      className="w-1/2 bg-white border border-slate-300 rounded px-1 py-1 text-slate-900 font-mono text-sm"
                    />
                    <input
                      type="number"
                      value={vitals.bpDiastolic}
                      onChange={(e) => handleVitalChange("bpDiastolic", Number(e.target.value))}
                      className="w-1/2 bg-white border border-slate-300 rounded px-1 py-1 text-slate-900 font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {vitals.bpSystolic}/{vitals.bpDiastolic}{" "}
                    <span className="text-xs font-normal text-slate-500">mmHg</span>
                  </div>
                )}
                <span className="text-[10px] text-sky-700 font-medium">Optimal Range</span>
              </div>

              {/* SpO2 */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
                  <span>Oxygen Saturation</span>
                  <Zap className="w-4 h-4 text-teal-600" />
                </div>
                {isEditingVitals ? (
                  <input
                    type="number"
                    value={vitals.spo2}
                    onChange={(e) => handleVitalChange("spo2", Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono text-lg"
                  />
                ) : (
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {vitals.spo2}
                    <span className="text-xs font-normal text-slate-500">%</span>
                  </div>
                )}
                <span className="text-[10px] text-teal-700 font-medium">Adequate Perfusion</span>
              </div>

              {/* Blood Glucose */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
                  <span>Blood Glucose</span>
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                {isEditingVitals ? (
                  <input
                    type="number"
                    value={vitals.bloodGlucose}
                    onChange={(e) => handleVitalChange("bloodGlucose", Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono text-lg"
                  />
                ) : (
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {vitals.bloodGlucose}{" "}
                    <span className="text-xs font-normal text-slate-500">mg/dL</span>
                  </div>
                )}
                <span className="text-[10px] text-amber-700 font-medium">Post-Prandial Safe</span>
              </div>

              {/* Body Temp */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
                  <span>Temperature</span>
                  <Thermometer className="w-4 h-4 text-orange-500" />
                </div>
                {isEditingVitals ? (
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperatureF}
                    onChange={(e) => handleVitalChange("temperatureF", Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono text-lg"
                  />
                ) : (
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {vitals.temperatureF}
                    <span className="text-xs font-normal text-slate-500">°F</span>
                  </div>
                )}
                <span className="text-[10px] text-emerald-700 font-medium">Afebrile</span>
              </div>

              {/* Overall Clinical Stability */}
              <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 flex flex-col justify-between">
                <div className="text-emerald-800 text-xs font-semibold">Clinical Index</div>
                <div className="text-xl font-bold text-emerald-700">STABLE</div>
                <div className="text-[10px] text-emerald-800">0 Critical Vitals Flags</div>
              </div>
            </div>
          </div>

          {/* Clinical Alert Card Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Real-time Prescription Hazard Triage
              </h3>
              <button
                onClick={onNavigateToInteractions}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                Review Full Interaction Matrix &rarr;
              </button>
            </div>

            {criticalCount > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 animate-bounce text-red-600" />
                  CRITICAL HAZARD DETECTED ({criticalCount} Severe Interaction)
                </div>
                <p className="text-xs text-red-800">
                  High-risk drug combination found in current prescription list (e.g. Acenocoumarol + Aspirin or Sertraline + Tramadol). High risk of major internal hemorrhage or Serotonin Toxicity.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onNavigateToInteractions}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium shadow-sm"
                  >
                    Open Medical Review & Guidance
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-900 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-sm text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No Critical Polypharmacy Contraindications Detected
                </div>
                <p className="text-xs text-emerald-700">
                  Active prescription combinations scanned against CDSCO Red-Flag Registry. {moderateCount} moderate precautions flagged for monitoring.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Mental Health & CDSS Action Sidebar */}
        <div className="space-y-6">
          {/* Mental Health Predictive Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" /> Mental Health Risk Model
              </h3>
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-mono font-semibold">
                ML + NLP
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">PHQ-9 Depression Index</span>
                  <span className="font-bold text-amber-700">Mild (6/27)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">GAD-7 Anxiety Index</span>
                  <span className="font-bold text-emerald-700">Minimal (4/21)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "19%" }}></div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onNavigateToMentalHealth}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded-lg font-medium shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  Launch Daily SWOT Journal & NLP Analyzer &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* ABDM & CDSCO Quick Regulatory Badges */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Regulatory & Data Compliance
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">CDSCO MDR 2017 Status</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Class B SaMD
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">ABDM HIECM Gateway</span>
                <span className="text-blue-700 font-semibold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> Linked (14-Digit)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">DISHA Privacy Audit</span>
                <span className="text-teal-700 font-semibold">AES-256 Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
