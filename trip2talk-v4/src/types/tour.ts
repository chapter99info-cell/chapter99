export type TourStatus     = 'draft'|'open'|'full'|'completed'|'cancelled';
export type BookingStatus  = 'pending'|'confirmed'|'paid'|'waitlist'|'cancelled';
export type PaymentMethod  = 'payid'|'cash'|'card'|'bank_transfer';
export type VisaType       = 'tourist'|'student'|'working_holiday'|'permanent'|'citizen'|'new_zealand'|'other';
export type ExpenseCategory = 'fuel'|'lodge'|'meals'|'equipment'|'marketing'|'other';
export type PinRole        = 'public'|'staff'|'cashier'|'owner'|'superadmin';

export interface Tour {
  id: string; tour_code: string; title: string; description?: string;
  departure_date: string; return_date?: string; meeting_location?: string;
  max_capacity: number; current_bookings: number; base_price: number;
  status: TourStatus; requires_oshc: boolean; safety_brief_sent: boolean;
  lead_staff_id?: string; created_at: string; updated_at: string;
  seats_remaining?: number; availability_badge?: 'available'|'low'|'full';
}

export interface Booking {
  id: string; booking_ref: string; tour_id: string; customer_id?: string;
  acquired_by_staff?: string; billing_payid?: string;
  total_price: number; deposit_paid: number; balance_due: number;
  commission_amount?: number; commission_paid: boolean;
  status: BookingStatus; payment_method?: PaymentMethod;
  oshc_number?: string; insurance_doc_url?: string;
  waiver_signed: boolean; waiver_signed_at?: string;
  contract_pdf_url?: string; created_at: string; updated_at: string;
}

export interface Installment {
  id: string; booking_id: string; due_date: string;
  amount_due: number; amount_paid: number; paid_at?: string; is_deposit: boolean;
}

export interface Staff {
  id: string; full_name: string; preferred_name?: string;
  pin_role: PinRole; payid_email?: string; payid_phone?: string;
  commission_rate: number; visa_type?: VisaType; visa_expiry?: string; is_active: boolean;
}

export interface TourSettlement {
  tour_id: string; tour_code: string; title: string; departure_date: string;
  total_bookings: number; total_collected: number;
  total_commissions_due: number; net_settlement_owner: number;
  lead_staff_name?: string; staff_payid?: string;
}

export interface Expense {
  id: string; tour_id?: string; category: ExpenseCategory;
  amount_aud: number; receipt_url?: string; receipt_filename?: string;
  notes?: string; synced_to_drive: boolean; synced_to_sheets: boolean;
  offline_id?: string; recorded_at: string;
}
