export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;
export type CurrencyCode = "AUD" | string;

export type AppRole = "owner" | "guide" | "operations" | "sales" | "safety";
export type StaffStatus = "active" | "inactive" | "contractor";
export type DepartureStatus =
  | "scheduled"
  | "confirmed"
  | "sold_out"
  | "blocked"
  | "cancelled"
  | "completed";
export type BookingStatus = "pending" | "deposit_paid" | "paid" | "cancelled" | "checked_in";
export type InstallmentStatus = "scheduled" | "due" | "paid" | "overdue" | "waived";

export interface AppUser {
  id: UUID;
  display_name: string;
  role: AppRole;
  pin_hash: string;
  is_active: boolean;
  payid: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Staff {
  id: UUID;
  app_user_id: UUID | null;
  legal_name: string;
  display_name: string;
  role: AppRole;
  status: StaffStatus;
  payid: string | null;
  commission_rate: number;
  visa_badge: string | null;
  visa_expires_on: ISODate | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Tour {
  id: UUID;
  title: string;
  slug: string;
  description: string | null;
  gallery_urls: string[];
  capacity: number;
  low_stock_threshold: number;
  base_price: number;
  currency: CurrencyCode;
  duration_minutes: number;
  meeting_point: string | null;
  is_active: boolean;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface TourDeparture {
  id: UUID;
  tour_id: UUID;
  guide_staff_id: UUID | null;
  starts_at: ISODateTime;
  ends_at: ISODateTime;
  status: DepartureStatus;
  capacity_override: number | null;
  internal_notes: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Booking {
  id: UUID;
  booking_number: string;
  tour_id: UUID;
  departure_id: UUID | null;
  customer_id: UUID | null;
  status: BookingStatus;
  seats: number;
  gross_amount: number;
  discount_amount: number;
  paid_amount: number;
  currency: CurrencyCode;
  booked_by_staff_id: UUID | null;
  source: string;
  notes: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Installment {
  id: UUID;
  booking_id: UUID;
  sequence_number: number;
  due_on: ISODate;
  amount: number;
  paid_at: ISODateTime | null;
  method: string | null;
  payid_reference: string | null;
  status: InstallmentStatus;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface StaffCommission {
  id: UUID;
  booking_id: UUID;
  staff_id: UUID;
  rate: number;
  amount: number;
  status: string;
  paid_at: ISODateTime | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface BookingSettlement {
  booking_id: UUID;
  booking_number: string;
  tour_title: string;
  starts_at: ISODateTime | null;
  booking_status: BookingStatus;
  gross_amount: number;
  discount_amount: number;
  net_amount: number;
  installment_paid: number;
  commission_accrued: number;
  owner_settlement_due: number;
  payid_targets: string[];
}
