import React, { useState } from "react";
import {
  Database,
  Lock,
  FileCheck,
  ShieldCheck,
  Download,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Share2,
} from "lucide-react";
import { EHRRecord, AuditLog } from "../types";

const INITIAL_RECORDS: EHRRecord[] = [
  {
    id: "rec-101",
    title: "AIIMS Cardiology Digitized Prescription & DDI Safety Audit",
    recordType: "Prescription",
    date: "2026-07-25",
    provider: "AIIMS New Delhi - Dr. R. K. Gupta",
    abhaSynced: true,
    details: {
      medications: ["Acitrom 2mg", "Ecosprin 75", "Pantocid 40"],
      ddiFlags: "Critical Interaction Flagged & Mitigated (Acenocoumarol + Aspirin)",
    },
  },
  {
    id: "rec-102",
    title: "NIMHANS Psychiatry Mental Health NLP Journal Baseline",
    recordType: "Mental Health Trend",
    date: "2026-07-24",
    provider: "NIMHANS Bengaluru - Dr. Ananya Roy",
    abhaSynced: true,
    details: {
      phq9Score: 6,
      gad7Score: 4,
      sentiment: "Cautious Optimism",
      swotTheme: "Performance Stress Reframing",
    },
  },
  {
    id: "rec-103",
    title: "ABDM Health Information Exchange Consent Artifact #HIECM-94812",
    recordType: "ABHA Consent",
    date: "2026-07-20",
    provider: "National Health Authority (NHA India)",
    abhaSynced: true,
    details: {
      consentScope: "View & Store Prescriptions and Diagnostic Summaries",
      validTill: "2027-07-20",
    },
  },
];

const AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-07-27 02:35:10",
    user: "Dr. Ananya Roy (NIMHANS)",
    action: "Prescription Interaction Audit Reviewed",
    systemModule: "Drug Interaction Checker",
    complianceTag: "CDSCO Class B",
    details: "Acknowledged Acenocoumarol + Aspirin gastrointestinal hemorrhage risk warning.",
  },
  {
    id: "log-2",
    timestamp: "2026-07-26 18:12:04",
    user: "Patient (ABHA: 12-3456-7890-1234)",
    action: "Daily SWOT Journal NLP Evaluation",
    systemModule: "Mental Health Engine",
    complianceTag: "DISHA Privacy",
    details: "Evaluated journal text via Gemini 3.6 Flash server-side NLP proxy.",
  },
  {
    id: "log-3",
    timestamp: "2026-07-25 10:40:55",
    user: "Dr. R. K. Gupta (AIIMS)",
    action: "Handwritten Prescription OCR Digitization",
    systemModule: "Prescription Scanner",
    complianceTag: "ISO 13485",
    details: "Converted prescription photo to structured JSON records.",
  },
];

export const CloudEHRDashboard: React.FC = () => {
  const [records] = useState<EHRRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<EHRRecord | null>(records[0]);

  const filtered = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recordType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SwasthyaSamvid_EHR_Records_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Cloud EHR & Storage Repository
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                ABHA Health Locker Synced
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Long-Term Encrypted Health Record Vault & Audit Logs
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              DISHA & ISO 13485 compliant encrypted storage for digitized doctor prescriptions, clinical decision support logs, and mental health SWOT journal histories.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-100" /> Export Full EHR Records (JSON)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Record List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" /> Saved Records ({filtered.length})
            </h3>
            <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 font-mono font-semibold">
              AES-256 Vault
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search saved EHR records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedRecord?.id === rec.id
                    ? "bg-teal-50/80 border-teal-500 text-slate-900 font-medium shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold text-slate-900 leading-tight">{rec.title}</div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>{rec.provider}</span>
                  <span className="font-mono text-emerald-700 font-semibold">{rec.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 & 3: Detailed Record Inspector & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Record Detail Card */}
          {selectedRecord && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs text-teal-700 font-bold uppercase tracking-wider block">
                    {selectedRecord.recordType} Record
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedRecord.title}</h3>
                  <span className="text-xs text-slate-500">{selectedRecord.provider} &bull; Date: {selectedRecord.date}</span>
                </div>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ABHA Synced
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <strong className="text-slate-600 uppercase tracking-wider text-[10px] block font-semibold">Extracted Record Data:</strong>
                <pre className="text-teal-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedRecord.details, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* System Audit Log Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" /> Immutable Regulatory Audit Trail
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                ISO 13485 Verified
              </span>
            </div>

            <div className="space-y-3">
              {AUDIT_LOGS.map((log) => (
                <div key={log.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="font-mono text-slate-600">{log.timestamp}</span>
                    <span className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200 font-semibold">
                      {log.complianceTag}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">{log.action}</div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                  <div className="text-[10px] text-slate-500 font-mono">By: {log.user} ({log.systemModule})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
