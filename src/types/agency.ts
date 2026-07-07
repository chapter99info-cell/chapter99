export interface Client {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  createdAt: string
}

export interface Project {
  id: string
  clientId: string
  projectType: 'DIGITAL_APP' | 'PHOTOGRAPHY' | 'FULL_SERVICE'
  status: 'NEW_BRIEF' | 'IN_PROGRESS' | 'QA_REVIEW' | 'DELIVERED' | 'CANCELLED'
  driveFolderUrl: string
  contractUrl: string
  createdAt: string
  updatedAt: string
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
}

export interface Billing {
  id: string
  projectId: string
  totalAmount: number
  depositPaid: boolean
  finalPaid: boolean
  quotationUrl: string
  invoiceUrl: string
  receiptUrl: string
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
