import React, { useState } from "react";
import {
  Pill,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  BookOpen,
  Sparkles,
  IndianRupee,
  ShieldAlert,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Drug, InteractionPair, SeverityLevel } from "../types";
import { SAMPLE_MEDICINES, KNOWN_DRUG_INTERACTIONS } from "../data/medicineDatabase";

interface DrugInteractionCheckerProps {
  activeInteractions: InteractionPair[];
  setActiveInteractions: React.Dispatch<React.SetStateAction<InteractionPair[]>>;
}

export const DrugInteractionChecker: React.FC<DrugInteractionCheckerProps> = ({
  activeInteractions,
  setActiveInteractions,
}) => {
  // Selected drugs list for interaction analysis
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([
    SAMPLE_MEDICINES[2], // Acitrom (Acenocoumarol)
    SAMPLE_MEDICINES[3], // Ecosprin (Aspirin)
    SAMPLE_MEDICINES[4], // Sertima (Sertraline)
    SAMPLE_MEDICINES[5], // Ultracet (Tramadol)
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SeverityLevel | "All">("All");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>("int-1");

  // Add drug to polypharmacy list
  const handleAddDrug = (drug: Drug) => {
    if (!selectedDrugs.find((d) => d.id === drug.id)) {
      const updated = [...selectedDrugs, drug];
      setSelectedDrugs(updated);
      recalculateInteractions(updated);
    }
  };

  // Remove drug
  const handleRemoveDrug = (drugId: string) => {
    const updated = selectedDrugs.filter((d) => d.id !== drugId);
    setSelectedDrugs(updated);
    recalculateInteractions(updated);
  };

  // Filter interaction pairs based on selected drugs
  const recalculateInteractions = (drugs: Drug[]) => {
    const drugNames = drugs.flatMap((d) => [d.brandName.toLowerCase(), d.genericName.toLowerCase()]);
    const filtered = KNOWN_DRUG_INTERACTIONS.filter((pair) => {
      const matchA = drugNames.some((name) => pair.drugA.toLowerCase().includes(name));
      const matchB = drugNames.some((name) => pair.drugB.toLowerCase().includes(name));
      return matchA && matchB;
    });
    setActiveInteractions(filtered.length > 0 ? filtered : KNOWN_DRUG_INTERACTIONS);
  };

  // Call server-side Gemini endpoint for Deep AI Drug Interaction Reasoning
  const handleRunAiReasoning = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/gemini/drug-interaction-reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicines: selectedDrugs.map((d) => ({
            brandName: d.brandName,
            genericName: d.genericName,
            category: d.category,
            schedule: d.cdscoSchedule,
          })),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAiAnalysisResult(json.data);
      }
    } catch (err) {
      console.error("AI Drug interaction error:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Search filtered drugs
  const filteredSearchDrugs = SAMPLE_MEDICINES.filter(
    (m) =>
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter active interactions by severity category
  const filteredInteractions = activeInteractions.filter((pair) => {
    if (selectedCategory === "All") return true;
    return pair.severity === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Medical Professional Review Section
              </span>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full">
                Global University Research Evidence
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Polypharmacy Drug-Drug Interaction & Side Effects Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Screening Indian brand formulations and global generic molecules categorized by severity level (Critical, Moderate, Mild) with CDSCO schedules and PMBJP Jan Aushadhi generic alternatives.
            </p>
          </div>

          <button
            onClick={handleRunAiReasoning}
            disabled={isLoadingAi}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            {isLoadingAi ? "Analyzing via Gemini AI..." : "Run AI Clinical Deep Scan"}
          </button>
        </div>
      </div>

      {/* Selected Prescribed Medications Rack */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" /> Active Polypharmacy Regimen ({selectedDrugs.length} Medicines)
          </h3>
          <span className="text-xs text-slate-500">Add or remove medications below to update interactions</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedDrugs.map((drug) => (
            <div
              key={drug.id}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-xs flex items-center gap-3 shadow-xs"
            >
              <div>
                <div className="font-bold text-slate-900">{drug.brandName}</div>
                <div className="text-slate-500 text-[11px] font-mono">{drug.genericName}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                    {drug.cdscoSchedule}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">₹{drug.priceINR}</span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveDrug(drug.id)}
                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-200 transition-colors"
                title="Remove medication"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Add Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Indian generic/brand medicines (e.g., Augmentin, Dolo, Metformin, Pantocid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {searchQuery && (
            <div className="mt-2 bg-white border border-slate-200 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1 shadow-sm">
              {filteredSearchDrugs.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    handleAddDrug(m);
                    setSearchQuery("");
                  }}
                  className="p-2 hover:bg-slate-50 rounded cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900">{m.brandName}</span>
                    <span className="text-slate-500 ml-2">({m.genericName})</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Deep Scan Result Card (if generated) */}
      {aiAnalysisResult && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <h3 className="font-bold text-slate-900 text-base">Gemini 3.6 Flash AI Clinical Polypharmacy Report</h3>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full font-mono font-bold">
              Polypharmacy Score: {aiAnalysisResult.overallPolypharmacyRiskScore || 45}/100
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {aiAnalysisResult.medicalReviewerSummary}
          </p>

          {/* Organ Risk Load Bar */}
          {aiAnalysisResult.cumulativeOrganLoad && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                <span className="text-slate-500 block">Hepatic Burden</span>
                <span className="font-bold text-amber-600">{aiAnalysisResult.cumulativeOrganLoad.hepaticRisk}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                <span className="text-slate-500 block">Renal Stress</span>
                <span className="font-bold text-emerald-600">{aiAnalysisResult.cumulativeOrganLoad.renalRisk}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                <span className="text-slate-500 block">Cardiac QT Risk</span>
                <span className="font-bold text-rose-600">{aiAnalysisResult.cumulativeOrganLoad.cardiacRisk}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                <span className="text-slate-500 block">CNS Depression</span>
                <span className="font-bold text-purple-600">{aiAnalysisResult.cumulativeOrganLoad.cnsDepressionRisk}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Section: Categorized Drug Interactions by Severity for Medical Review */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" /> Interactions Categorized by Severity Level
            </h3>
            <p className="text-xs text-slate-600">
              Filtered for medical professional review with mechanistic rationale and management guidelines
            </p>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-xs">
            {(["All", "Critical", "Moderate", "Mild"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interaction Cards List */}
        <div className="space-y-4">
          {filteredInteractions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs shadow-xs">
              No drug interactions found under the "{selectedCategory}" severity category for the selected medications.
            </div>
          ) : (
            filteredInteractions.map((pair) => {
              const isExpanded = expandedCardId === pair.id;
              const isCritical = pair.severity === "Critical";
              const isModerate = pair.severity === "Moderate";

              return (
                <div
                  key={pair.id}
                  className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${
                    isCritical
                      ? "border-red-300 hover:border-red-400"
                      : isModerate
                      ? "border-amber-300 hover:border-amber-400"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedCardId(isExpanded ? null : pair.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-4 bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                            isCritical
                              ? "bg-red-100 text-red-800 border-red-200"
                              : isModerate
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                          }`}
                        >
                          {pair.severity} Hazard
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{pair.cdscoCategory}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 pt-1">
                        {pair.drugA} <span className="text-slate-500 font-normal">interacts with</span> {pair.drugB}
                      </h4>
                      <p className="text-xs text-slate-700">{pair.clinicalEffect}</p>
                    </div>

                    <button className="text-slate-500 hover:text-slate-900 p-1 rounded bg-white border border-slate-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-200 space-y-4 bg-white text-xs text-slate-700">
                      <div>
                        <span className="font-bold text-emerald-800 uppercase text-[10px] block mb-1">
                          Pharmacodynamic / Biochemical Mechanism
                        </span>
                        <p className="bg-slate-50 p-3 rounded border border-slate-200">{pair.mechanism}</p>
                      </div>

                      <div>
                        <span className="font-bold text-amber-800 uppercase text-[10px] block mb-1">
                          Clinical Management & Practitioner Guidance
                        </span>
                        <p className="bg-amber-50/50 p-3 rounded border border-amber-200 font-medium text-slate-800">
                          {pair.management}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 pt-1 text-[11px]">
                        <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>
                          <strong>Evidence Citation:</strong> {pair.evidenceSource}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Side Effects & PMBJP Jan Aushadhi Cost Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medicine Side Effect Database Lookup */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-600" /> Comprehensive Side Effect Database (Indian Formulary)
          </h3>
          <p className="text-xs text-slate-600">
            Categorized adverse reactions (Common, Severe, Rare) for prescriptions in India
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {selectedDrugs.map((drug) => (
              <div key={drug.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">{drug.brandName} ({drug.genericName})</span>
                  <span className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {drug.category}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>
                    <strong className="text-slate-600">Common: </strong>
                    <span className="text-slate-800">{drug.commonSideEffects.join(", ")}</span>
                  </div>
                  <div>
                    <strong className="text-red-700">Severe: </strong>
                    <span className="text-red-700 font-medium">{drug.severeSideEffects.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PMBJP Jan Aushadhi Savings Engine */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-600" /> PMBJP Jan Aushadhi Generic Cost Savings
            </h3>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
              Govt. of India Initiative
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Switch from expensive branded formulations to verified Jan Aushadhi generics at nearby PMBJP Kendras.
          </p>

          <div className="space-y-3">
            {selectedDrugs.map((drug) => {
              const savings = drug.priceINR - drug.janAushadhiPriceINR;
              const savingsPercent = Math.round((savings / drug.priceINR) * 100);

              return (
                <div key={drug.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{drug.brandName}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{drug.genericName}</div>
                    <div className="text-slate-600 text-[10px] mt-1">
                      Branded: <span className="line-through">₹{drug.priceINR}</span> &rarr;{" "}
                      <strong className="text-emerald-700">Jan Aushadhi: ₹{drug.janAushadhiPriceINR}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs border border-emerald-300">
                      Save {savingsPercent}%
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">₹{savings} saved / strip</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
