export type AssetType   = 'vehicle'|'license'|'insurance'|'other';
export type AlertStatus = 'pending'|'sent'|'acknowledged'|'dismissed';

export interface Customer {
  id: string; full_name: string; preferred_name?: string;
  email?: string; phone?: string; nationality?: string;
  date_of_birth?: string; visa_type?: string; visa_expiry?: string;
  oshc_provider?: string; oshc_number?: string; oshc_expiry?: string;
  insurance_type?: 'oshc'|'travel'|'none';
  marketing_consent: boolean; created_at: string;
}

export interface CustomerMedical {
  id: string; customer_id: string;
  allergies?: string; medications?: string; conditions?: string;
  emergency_contact?: string; blood_type?: string; consent_given_at?: string;
}

export interface WaiverTemplate {
  id: string; version: string; content_en: string; content_th: string;
  content_hash: string; is_current: boolean;
}

export interface Asset {
  id: string; asset_type: AssetType; name: string; identifier?: string;
  expiry_date: string; issuing_body?: string; document_url?: string;
  blocks_trip_creation: boolean; is_active: boolean;
  days_until_expiry?: number; alert_level?: 'ok'|'warning'|'critical'|'expired';
}

export interface OfflineExpense {
  offline_id: string; tour_id?: string; category: string;
  amount_aud: number; photo_blob?: Blob; notes?: string;
  recorded_at: string; synced: boolean;
}
