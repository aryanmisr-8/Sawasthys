export type SeverityLevel = "Critical" | "Moderate" | "Mild";

export type CDSCOSchedule = "Schedule H" | "Schedule H1" | "Schedule X" | "OTC" | "Nutraceutical";

export interface Drug {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  cdscoSchedule: CDSCOSchedule;
  priceINR: number;
  janAushadhiPriceINR: number;
  category: string;
  commonSideEffects: string[];
  severeSideEffects: string[];
  rareSideEffects: string[];
  contraindications: string[];
  mechanism: string;
  universityCitations: string[];
}

export interface InteractionPair {
  id: string;
  drugA: string;
  drugB: string;
  severity: SeverityLevel;
  mechanism: string;
  clinicalEffect: string;
  management: string;
  evidenceSource: string;
  cdscoCategory: string;
}

export interface PrescriptionItem {
  brandName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  cdscoSchedule: CDSCOSchedule;
  potentialSideEffects: string[];
  confidenceScore: number;
}

export interface Prescription {
  id: string;
  doctorName: string;
  regNumber: string;
  patientName: string;
  date: string;
  clinicHospital: string;
  diagnosis: string;
  medications: PrescriptionItem[];
  status: "Digitized" | "Pending Review" | "Verified";
  rawImageUrl?: string;
  clinicalNotes?: string;
}

export interface MentalHealthState {
  id: string;
  date: string;
  journalText: string;
  mood: "Exuberant" | "Calm" | "Anxious" | "Fatigued" | "Depressed" | "Overwhelmed" | "Irritable";
  phq9Score: number;
  gad7Score: number;
  sentimentScore: number; // -1.0 to 1.0
  primaryEmotions: string[];
  cognitiveDistortions: string[];
  mentalHealthRiskLevel: "Low" | "Moderate" | "High" | "Critical";
  depressionIndex: number; // 0 - 100
  anxietyIndex: number; // 0 - 100
  stressLoad: number; // 0 - 100
  resilienceIndex: number; // 0 - 100
  keyTriggers: string[];
  clinicalSummary: string;
  recommendedAction: string;
}

export interface SWOTSynthesis {
  coreTheme: string;
  strengthLeverage: string;
  weaknessMitigation: string;
  opportunityPlan: string;
  threatDefense: string;
  cognitiveReframing: string;
  overallReadinessScore: number;
}

export interface SWOTEntry {
  id: string;
  date: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  aiSynthesis?: SWOTSynthesis;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  hospital: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  phone: string;
  abhaConnected: boolean;
  consultationFeeINR: number;
  experienceYears: number;
  rating: number;
  availability: string;
  address: string;
}

export interface EHRRecord {
  id: string;
  title: string;
  recordType: "Prescription" | "Lab Result" | "CDS Intervention Log" | "Mental Health Trend" | "ABHA Consent";
  date: string;
  provider: string;
  documentUrl?: string;
  details: Record<string, any>;
  abhaSynced: boolean;
}

export interface PatientVitals {
  heartRate: number; // bpm
  bpSystolic: number; // mmHg
  bpDiastolic: number; // mmHg
  spo2: number; // %
  bloodGlucose: number; // mg/dL
  temperatureF: number; // °F
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  systemModule: string;
  complianceTag: string;
  details: string;
}
