export interface Client {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  createdAt: string
}

export type ProjectType = 'DIGITAL_APP' | 'PHOTOGRAPHY' | 'FULL_SERVICE' | 'VIDEO'
export type ProjectStatus = 'NEW_BRIEF' | 'IN_PROGRESS' | 'QA_REVIEW' | 'DELIVERED' | 'CANCELLED'

export interface Project {
  id: string
  clientId: string
  projectType: ProjectType
  status: ProjectStatus
  driveFolderUrl: string
  contractUrl: string
  liveWebUrl: string | null
  galleryUrl: string | null
  googleMapsEmbedUrl: string | null
  googleReviewLink: string | null
  facebookUrl: string | null
  lineOaUrl: string | null
  projectSpec: string | null
  createdAt: string
  updatedAt: string
  /** Populated when joined with client */
  client?: Client
}

export interface Task {
  id: string
  projectId: string
  departmentId: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  assignee: 'CLAUDE' | 'GEMINI' | 'CURSOR' | 'PHEE_SAEN'
  status: 'TODO' | 'DOING' | 'IN_REVIEW' | 'DONE'
  title: string
  promptOrSpec: string
  notes: string
  /** Populated when tasks are fetched with project join */
  project?: TaskProjectSummary
}

/** Minimal project fields joined onto task cards */
export interface TaskProjectSummary {
  id: string
  status: ProjectStatus
  liveWebUrl: string | null
  galleryUrl: string | null
  client?: Pick<Client, 'businessName'>
}

export interface Billing {
  id: string
  projectId: string
  totalAmount: number
  totalAmountAud: number
  gstAmountAud: number
  paymentReceivedDate: string | null
  depositPaid: boolean
  finalPaid: boolean
  quotationUrl: string
  invoiceUrl: string
  receiptUrl: string
  /** Populated when joined */
  project?: Project
  client?: Client
}

export interface Prompt {
  id: string
  agent: 'CLAUDE' | 'GEMINI' | 'CURSOR'
  department: number
  promptText: string
}

export type TaskAssignee = Task['assignee']
export type TaskStatus = Task['status']
export type PromptAgent = Prompt['agent']

/** Fields exposed on the public client portal (no secrets) */
export interface ProjectPortalView {
  id: string
  businessName: string
  brandName: string
  liveWebUrl: string | null
  galleryUrl: string | null
  googleReviewLink: string | null
  googleMapsEmbedUrl: string | null
  facebookUrl: string | null
  lineOaUrl: string | null
}
