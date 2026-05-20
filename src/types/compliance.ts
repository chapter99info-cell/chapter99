// src/types/compliance.ts
export interface WaiverData {
  version: string;
  signed_at: string;
  ip_address: string;
  client_id: string;
  full_name: string;
  // Bilingual checkbox states
  en_terms_accepted: boolean;
  th_terms_accepted: boolean;
  medical_disclosure_accepted: boolean;
  oshc_confirmed: boolean;
  emergency_contact_confirmed: boolean;
  // Signature
  signature_data_url?: string; // base64 canvas signature
}

export interface OSHCValidation {
  policy_number: string;
  provider: string;
  expiry_date: string;
  is_valid: boolean;
  covers_trip: boolean;
  trip_departure: string;
  trip_return: string;
  validation_timestamp: string;
  warnings: string[];
}

export interface SafetyBriefing {
  tour_id: string;
  briefing_date: string;
  triggered_at: string; // 24h before departure
  clients_with_medical: ClientMedicalSummary[];
  dietary_requirements: string[];
  total_pax: number;
}

export interface ClientMedicalSummary {
  client_id: string;
  preferred_name: string;
  medical_flags: string[]; // decrypted for briefing
  dietary_requirements?: string;
  emergency_contact: string;
  emergency_phone: string;
  oshc_valid: boolean;
}

export interface ATOExpenseRecord {
  financial_year: string; // e.g. "2024-25"
  total_income: number;
  total_expenses: number;
  gst_collected: number;
  gst_paid: number;
  net_gst: number;
  taxable_income: number;
  estimated_tax: number; // simplified 25% flat
  deductible_expenses_by_category: Record<string, number>;
}
