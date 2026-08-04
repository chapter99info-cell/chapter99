/** Chapter99 Solutions internal client jobs (Agency Hub /admin/jobs) */

export type ClientJobType = 'photography' | 'video' | 'web' | 'other_service'

export type ClientJobStatus =
  | 'received'
  | 'in_progress'
  | 'review'
  | 'delivered'
  | 'paid'

export type AgencyInvoiceKind = 'deposit' | 'final'

export interface ClientJob {
  id: string
  client_name: string
  client_email: string | null
  job_type: ClientJobType
  status: ClientJobStatus
  deposit_amount: number | null
  deposit_paid_at: string | null
  total_amount: number | null
  delivered_at: string | null
  deadline: string | null
  square_payment_link: string | null
  deliverable_link: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ClientJobInsert = Omit<
  ClientJob,
  'id' | 'created_at' | 'updated_at' | 'delivered_at'
> & {
  delivered_at?: string | null
}

export type ClientJobUpdate = Partial<Omit<ClientJob, 'id' | 'created_at'>>

export interface AgencyInvoice {
  id: string
  invoice_number: string
  client_job_id: string
  kind: AgencyInvoiceKind
  client_name: string
  client_email: string | null
  job_type: ClientJobType
  amount_ex_gst: number
  gst: number
  total: number
  issued_at: string
  email_sent: boolean
  pdf_url: string | null
  created_at: string
}

export const JOB_STATUS_COLUMNS: {
  id: ClientJobStatus
  labelTh: string
  labelEn: string
}[] = [
  { id: 'received', labelTh: 'รับงาน', labelEn: 'Received' },
  { id: 'in_progress', labelTh: 'กำลังทำ', labelEn: 'In progress' },
  { id: 'review', labelTh: 'รอตรวจ', labelEn: 'Review' },
  { id: 'delivered', labelTh: 'ส่งมอบแล้ว', labelEn: 'Delivered' },
  { id: 'paid', labelTh: 'ชำระครบ', labelEn: 'Paid' },
]

export const JOB_TYPE_LABELS: Record<ClientJobType, string> = {
  photography: 'Photography',
  video: 'Video',
  web: 'Web Front+Back',
  other_service: 'Other Services',
}

/**
 * ABN 81 951 461 769 — Saard Saenmuang (sole trader,
 * GST registered 14 Dec 2018). Registered business name 'chapter99' active from
 * 16 Jul 2026. Used for Trip2Talk and Chapter99 Solutions invoicing.
 */
export const CHAPTER99_SELLER = {
  legalName: 'Chapter99 Solutions',
  tradingAs: 'Chapter99',
  /** Display line for invoices */
  sellerLine: 'Chapter99 Solutions, Trading as Chapter99',
  abn: '81 951 461 769',
  address: 'Sydney, NSW, Australia',
  email: 'chapter99solutions@gmail.com',
} as const
