import React, { useState } from "react";
import { Header } from "./components/Header";
import { Navigation, NavTab } from "./components/Navigation";
import { ClinicalDecisionSupport } from "./components/ClinicalDecisionSupport";
import { DrugInteractionChecker } from "./components/DrugInteractionChecker";
import { MentalHealthEngine } from "./components/MentalHealthEngine";
import { PrescriptionScanner } from "./components/PrescriptionScanner";
import { NearbyDoctors } from "./components/NearbyDoctors";
import { CloudEHRDashboard } from "./components/CloudEHRDashboard";
import { ProjectDocumentationModal } from "./components/ProjectDocumentationModal";
import { PatientVitals, InteractionPair } from "./types";
import { KNOWN_DRUG_INTERACTIONS } from "./data/medicineDatabase";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("cds");

  // Global Patient Vitals State
  const [vitals, setVitals] = useState<PatientVitals>({
    heartRate: 76,
    bpSystolic: 120,
    bpDiastolic: 80,
    spo2: 98,
    bloodGlucose: 104,
    temperatureF: 98.6,
    lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  // Global Active Interactions
  const [activeInteractions, setActiveInteractions] = useState<InteractionPair[]>(KNOWN_DRUG_INTERACTIONS);

  // Technical Whitepaper Presentation Modal
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);

  const criticalAlertsCount = activeInteractions.filter((i) => i.severity === "Critical").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        vitals={vitals}
        abhaId="12-3456-7890-1234"
        onOpenDoc={() => setIsDocModalOpen(true)}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalAlertsCount={criticalAlertsCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === "cds" && (
          <ClinicalDecisionSupport
            vitals={vitals}
            setVitals={setVitals}
            activeInteractions={activeInteractions}
            onNavigateToInteractions={() => setActiveTab("drug-interaction")}
            onNavigateToMentalHealth={() => setActiveTab("mental-health")}
          />
        )}

        {activeTab === "drug-interaction" && (
          <DrugInteractionChecker
            activeInteractions={activeInteractions}
            setActiveInteractions={setActiveInteractions}
          />
        )}

        {activeTab === "mental-health" && <MentalHealthEngine />}

        {activeTab === "prescription-ocr" && <PrescriptionScanner />}

        {activeTab === "doctors" && <NearbyDoctors />}

        {activeTab === "ehr-storage" && <CloudEHRDashboard />}

        {activeTab === "documentation" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Project Detail Documentation File & Whitepaper</h2>
              <p className="text-xs text-slate-600 max-w-2xl mx-auto">
                Includes core concepts, functional blueprint, ASCII architecture diagrams, feature-rich technical roadmap, market differentiation matrix, and clinical ROI analysis.
              </p>
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs shadow-sm transition-colors"
              >
                Launch Presentation Whitepaper Viewer
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">
              SwasthyaSamvid SaMD - Clinical Decision Support Platform
            </p>
            <p className="text-[11px] text-slate-500">
              CDSCO MDR 2017 Class B Regulatory Alignment &bull; ABDM / ABHA ID Enabled &bull; DISHA Encrypted
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              Project Details Doc (.md)
            </button>
            <a href="tel:14416" className="text-amber-700 font-bold hover:underline">
              Tele-MANAS: 14416
            </a>
          </div>
        </div>
      </footer>

      {/* Project Details Modal */}
      <ProjectDocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </div>
  );
}
