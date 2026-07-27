import React from "react";
import {
  ShieldAlert,
  Pill,
  BrainCircuit,
  FileText,
  MapPin,
  Database,
  BookOpen,
} from "lucide-react";

export type NavTab =
  | "cds"
  | "drug-interaction"
  | "mental-health"
  | "prescription-ocr"
  | "doctors"
  | "ehr-storage"
  | "documentation";

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  criticalAlertsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  criticalAlertsCount,
}) => {
  const tabs = [
    {
      id: "cds" as NavTab,
      label: "Clinical Decision Support",
      icon: ShieldAlert,
      badge: null,
    },
    {
      id: "drug-interaction" as NavTab,
      label: "Drug Interactions & Side Effects",
      icon: Pill,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} Alert` : null,
      badgeColor: "bg-red-500 text-white",
    },
    {
      id: "mental-health" as NavTab,
      label: "Mental Health ML & SWOT Journal",
      icon: BrainCircuit,
      badge: "ML + NLP",
      badgeColor: "bg-purple-600 text-white",
    },
    {
      id: "prescription-ocr" as NavTab,
      label: "Prescription OCR Digitizer",
      icon: FileText,
      badge: "Gemini 3.6",
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      id: "doctors" as NavTab,
      label: "Nearby Doctors Directory",
      icon: MapPin,
      badge: "India",
      badgeColor: "bg-blue-600 text-white",
    },
    {
      id: "ehr-storage" as NavTab,
      label: "Cloud EHR & Storage",
      icon: Database,
      badge: "ABHA Sync",
      badgeColor: "bg-teal-700 text-white",
    },
    {
      id: "documentation" as NavTab,
      label: "Technical Whitepaper",
      icon: BookOpen,
      badge: "Doc",
      badgeColor: "bg-slate-700 text-white",
    },
  ];

  return (
    <nav className="bg-white/95 border-b border-slate-200 backdrop-blur sticky top-[73px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 py-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : tab.badgeColor || "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
