/** Chapter99 Agency Management System — domain types */

export type AmsRole = 'admin' | 'staff'

export type ProjectStatus =
  | 'capturing'
  | 'editing'
  | 'ready_for_review'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid' | 'refunded'

export type LeadSource = 'facebook' | 'other'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'converted_client'
  | 'converted_staff'
  | 'rejected'

export const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'converted_client',
  'converted_staff',
  'rejected',
]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  converted_client: '→ Client',
  converted_staff: '→ Staff',
  rejected: 'Rejected',
}

export interface AmsLead {
  id: string
  source: LeadSource
  name: string
  fb_profile_url: string | null
  fb_psid: string | null
  contact_note: string | null
  status: LeadStatus
  converted_client_id: string | null
  converted_staff_id: string | null
  created_at: string
}

export type ServiceType =
  | 'photography'
  | 'videography'
  | 'editing'
  | 'real_estate'
  | 'wedding'
  | 'event'
  | 'corporate'
  | 'other'

export type ClientType = 'business' | 'individual'

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  'capturing',
  'editing',
  'ready_for_review',
  'completed',
]

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  capturing: 'Capturing',
  editing: 'Editing',
  ready_for_review: 'Ready for Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  deposit_paid: 'Deposit paid',
  paid: 'Paid',
  refunded: 'Refunded',
}

export function progressPercent(status: ProjectStatus): number {
  switch (status) {
    case 'capturing':
      return 25
    case 'editing':
      return 50
    case 'ready_for_review':
      return 75
    case 'completed':
      return 100
    default:
      return 0
  }
}

export interface StaffProfile {
  id: string
  full_name: string
  display_name: string | null
  email: string | null
  phone: string | null
  line_user_id: string | null
  role: AmsRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AmsClient {
  id: string
  client_type: ClientType
  business_name: string | null
  contact_name: string
  email: string | null
  phone: string | null
  line_user_id: string | null
  address: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AmsProject {
  id: string
  public_token: string
  title: string
  service_type: ServiceType
  status: ProjectStatus
  payment_status: PaymentStatus
  deposit_amount_cents: number
  total_amount_cents: number | null
  deliver_on_deposit: boolean
  deadline: string | null
  brief: string | null
  internal_notes: string | null
  client_id: string
  staff_id: string | null
  created_by: string | null
  ready_for_review_at: string | null
  completed_at: string | null
  qc_escalated_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectAdminOverview extends AmsProject {
  client_contact_name: string
  client_business_name: string | null
  client_email: string | null
  staff_name: string | null
  staff_email: string | null
  is_overdue: boolean
  needs_qc_escalation: boolean
}

export interface Deliverable {
  id: string
  project_id: string
  link: string
  link_domain: string | null
  version: number
  notes: string | null
  uploaded_by: string | null
  uploaded_at: string
}

export interface Payment {
  id: string
  project_id: string
  amount_cents: number
  currency: string
  status: PaymentStatus
  method: string | null
  reference: string | null
  notes: string | null
  paid_at: string | null
  recorded_by: string | null
  created_at: string
  updated_at: string
}

export interface ProjectTracking {
  title: string
  service_type: ServiceType
  status: ProjectStatus
  deadline: string | null
  payment_status: PaymentStatus
  progress_pct: number
  deliverable_link: string | null
  deliverable_version: number | null
  deliverable_uploaded_at: string | null
  is_overdue: boolean
  updated_at: string
}
