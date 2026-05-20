// src/types/tour.ts
export type TourStatus = 
  | 'draft' | 'open' | 'confirmed' 
  | 'departed' | 'completed' | 'cancelled';

export type BookingStatus = 
  | 'pending' | 'confirmed' | 'waitlist' | 'cancelled';

export type StaffRole = 'staff' | 'cashier' | 'owner';

export type ATOCategory =
  | 'accommodation' | 'transport' | 'meals_entertainment'
  | 'guide_fees' | 'marketing' | 'office' | 'equipment'
  | 'insurance' | 'visa_fees' | 'other';

export type VisaStatus = 
  | 'unknown' | 'applied' | 'approved' | 'expired' | 'not_required';

export type ClientTier = 'standard' | 'vip' | 'platinum';

export interface Tour {
  id: string;
  trip_code: string;
  destination: string;
  departure_date: string; // ISO
  return_date: string;
  max_pax: number;
  current_pax: number;
  base_price_aud: number;
  status: TourStatus;
  lead_staff_id?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffProfile {
  id: string;
  user_id: string;
  full_name: string;
  nickname?: string;
  role: StaffRole;
  commission_rate_per_pax: number;
  commission_bonus_threshold: number;
  commission_bonus_amount: number;
  bank_bsb?: string;
  bank_account?: string;
  tfn_provided: boolean;
  is_active: boolean;
  created_at: string;
}

export interface CommissionLedger {
  id: string;
  staff_id: string;
  tour_id: string;
  pax_count: number;
  base_commission: number;
  bonus_commission: number;
  total_commission: number;
  status: 'pending' | 'approved' | 'paid';
  paid_at?: string;
  payment_method?: string;
  created_at: string;
}

export interface TourBooking {
  id: string;
  tour_id: string;
  client_id: string;
  staff_id?: string;
  booking_status: BookingStatus;
  amount_paid_aud: number;
  payment_method?: string;
  payment_reference?: string;
  special_requests?: string;
  created_at: string;
  // Joins
  tour?: Tour;
  client?: CRMClient;
}

export interface Expense {
  id: string;
  tour_id?: string;
  staff_id?: string;
  ato_category: ATOCategory;
  ato_deductible: boolean;
  gst_claimable: boolean;
  gst_amount: number;
  amount_aud: number;
  vendor_name?: string;
  receipt_filename?: string;
  receipt_storage_url?: string;
  receipt_uploaded_at?: string;
  expense_date: string;
  notes?: string;
  sync_status: 'local' | 'synced' | 'failed';
  created_at: string;
  // Local only (IndexedDB)
  receipt_blob?: Blob;
}

export interface CRMClient {
  id: string;
  full_name: string;
  preferred_name?: string;
  email?: string;
  phone?: string;
  passport_number?: string;
  nationality?: string;
  date_of_birth?: string;
  oshc_provider?: string;
  oshc_policy_number?: string;
  oshc_expiry?: string;
  oshc_card_url?: string;
  medical_notes_encrypted?: string;
  dietary_requirements?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  waiver_signed_at?: string;
  waiver_ip_address?: string;
  waiver_version: string;
  visa_status: VisaStatus;
  visa_expiry?: string;
  visa_type?: string;
  client_tier: ClientTier;
  created_at: string;
  updated_at: string;
}

export interface PayIDSettlement {
  staff_id: string;
  staff_name: string;
  tour_id: string;
  trip_code: string;
  gross_revenue: number;
  total_expenses: number;
  net_profit: number;
  staff_commission: number;
  owner_net: number;
  gst_collected: number;
  tax_estimate: number;
  settlement_date: string;
}
