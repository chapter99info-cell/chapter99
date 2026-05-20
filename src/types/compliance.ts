import type { AppRole, ISODate, ISODateTime, UUID } from "./tour";

export type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | Json[] | { [key: string]: Json };

export type CustomerStatus = "lead" | "confirmed" | "vip" | "inactive" | "blocked";
export type PrivacyAction = "collect" | "view" | "update" | "export" | "delete" | "waiver_accept";
export type AssetKind = "vehicle" | "vessel" | "venue" | "equipment";
export type AlertSeverity = "info" | "warning" | "critical";
export type ExpenseStatus = "draft" | "submitted" | "approved" | "rejected" | "reimbursed";

export interface AccessLog {
  id: UUID;
  app_user_id: UUID | null;
  role: AppRole | null;
  success: boolean;
  pin_fingerprint: string;
  device_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  reason: string | null;
  created_at: ISODateTime;
}

export interface Customer {
  id: UUID;
  external_ref: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  country_code: string | null;
  preferred_language: string;
  status: CustomerStatus;
  marketing_consent: boolean;
  privacy_notice_accepted_at: ISODateTime | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface CustomerContact {
  id: UUID;
  customer_id: UUID;
  kind: string;
  value: string;
  is_primary: boolean;
  created_at: ISODateTime;
}

export interface EncryptedMedicalRecord {
  id: UUID;
  customer_id: UUID;
  encrypted_payload: string;
  key_id: string;
  recorded_by_staff_id: UUID | null;
  redaction_due_on: ISODate | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface OshcWaiverLog {
  id: UUID;
  customer_id: UUID;
  booking_id: UUID | null;
  accepted: boolean;
  accepted_at: ISODateTime | null;
  declined_reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: ISODateTime;
}

export interface PrivacyAuditLog {
  id: UUID;
  customer_id: UUID | null;
  app_user_id: UUID | null;
  action: PrivacyAction;
  purpose: string;
  privacy_act_basis: string;
  metadata: Json;
  created_at: ISODateTime;
}

export interface AppAlert {
  id: UUID;
  severity: AlertSeverity;
  title: string;
  body: string;
  related_table: string | null;
  related_id: UUID | null;
  resolved_at: ISODateTime | null;
  created_at: ISODateTime;
}

export interface Asset {
  id: UUID;
  name: string;
  kind: AssetKind;
  registration_number: string | null;
  da_reference: string | null;
  da_expires_on: ISODate | null;
  registration_expires_on: ISODate | null;
  insurance_expires_on: ISODate | null;
  is_active: boolean;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface AssetDocument {
  id: UUID;
  asset_id: UUID;
  document_type: string;
  storage_path: string;
  issued_on: ISODate | null;
  expires_on: ISODate | null;
  uploaded_by_staff_id: UUID | null;
  created_at: ISODateTime;
}

export interface TripAsset {
  id: UUID;
  departure_id: UUID;
  asset_id: UUID;
  assigned_by_staff_id: UUID | null;
  created_at: ISODateTime;
}

export interface SafetyBrief {
  id: UUID;
  departure_id: UUID;
  due_at: ISODateTime;
  completed_at: ISODateTime | null;
  completed_by_staff_id: UUID | null;
  brief_template: string;
  notes: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Expense {
  id: UUID;
  offline_id: string | null;
  staff_id: UUID | null;
  booking_id: UUID | null;
  departure_id: UUID | null;
  category: string;
  amount: number;
  currency: string;
  incurred_at: ISODateTime;
  merchant: string | null;
  notes: string | null;
  status: ExpenseStatus;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ExpenseAttachment {
  id: UUID;
  expense_id: UUID;
  storage_path: string;
  mime_type: string | null;
  captured_at: ISODateTime;
}
