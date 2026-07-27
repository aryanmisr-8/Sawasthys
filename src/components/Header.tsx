import React from "react";
import { ShieldCheck, Activity, PhoneCall, FileCode, Lock, AlertCircle } from "lucide-react";
import { PatientVitals } from "../types";

interface HeaderProps {
  vitals: PatientVitals;
  abhaId: string;
  onOpenDoc: () => void;
}

export const Header: React.FC<HeaderProps> = ({ vitals, abhaId, onOpenDoc }) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-sm">
      {/* Top Banner: SaMD & ABDM Regulatory Framing */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> CDSCO SaMD Class B Compliant
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
              <Lock className="w-3 h-3" /> ABDM / ABHA ID: {abhaId}
            </span>
            <span className="hidden md:inline-flex text-slate-400">
              DISHA & ISO 13485 Standards Ready
            </span>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <a
              href="tel:14416"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-semibold"
              title="Tele-MANAS National Mental Health Helpline India"
            >
              <PhoneCall className="w-3 h-3 text-amber-400 animate-pulse" /> Tele-MANAS: 14416
            </a>
            <button
              onClick={onOpenDoc}
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.5 rounded text-xs transition-colors font-medium shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5" /> Tech Presentation Doc
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm text-white">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                SwasthyaSamvid <span className="text-blue-600 font-mono text-sm">SaMD</span>
              </h1>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded uppercase font-semibold border border-slate-200">
                IN
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Clinical Decision Support System & Mental Health Analytics
            </p>
          </div>
        </div>

        {/* Real-time Patient Vitals Ticker */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Patient Vitals:</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-emerald-700" title="Heart Rate">
              HR: <strong className="text-slate-900">{vitals.heartRate}</strong> bpm
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sky-700" title="Blood Pressure">
              BP: <strong className="text-slate-900">{vitals.bpSystolic}/{vitals.bpDiastolic}</strong> mmHg
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-700" title="Oxygen Saturation">
              SpO2: <strong className="text-slate-900">{vitals.spo2}%</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-700" title="Blood Glucose">
              Glucose: <strong className="text-slate-900">{vitals.bloodGlucose}</strong> mg/dL
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
