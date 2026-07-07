import type { Billing, Client, Project, Prompt, Task } from '../types/agency'

export function mapClient(row: Record<string, unknown>): Client {
  return {
    id: String(row.id),
    businessName: String(row.business_name ?? ''),
    contactName: String(row.contact_name ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    createdAt: String(row.created_at ?? ''),
  }
}

export function mapProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    projectType: row.project_type as Project['projectType'],
    status: row.status as Project['status'],
    driveFolderUrl: String(row.drive_folder_url ?? ''),
    contractUrl: String(row.contract_url ?? ''),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  }
}

export function mapTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    departmentId: Number(row.department_id) as Task['departmentId'],
    assignee: row.assignee as Task['assignee'],
    status: row.status as Task['status'],
    title: String(row.title ?? ''),
    promptOrSpec: String(row.prompt_or_spec ?? ''),
    notes: String(row.notes ?? ''),
  }
}

export function mapBilling(row: Record<string, unknown>): Billing {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    totalAmount: Number(row.total_amount ?? 0),
    depositPaid: Boolean(row.deposit_paid),
    finalPaid: Boolean(row.final_paid),
    quotationUrl: String(row.quotation_url ?? ''),
    invoiceUrl: String(row.invoice_url ?? ''),
    receiptUrl: String(row.receipt_url ?? ''),
  }
}

export function mapPrompt(row: Record<string, unknown>): Prompt {
  return {
    id: String(row.id),
    agent: row.agent as Prompt['agent'],
    department: Number(row.department),
    promptText: String(row.prompt_text ?? ''),
  }
}

export function taskToRow(task: Partial<Task> & { projectId: string; title: string }) {
  return {
    project_id: task.projectId,
    department_id: task.departmentId ?? 1,
    assignee: task.assignee ?? 'PHEE_SAEN',
    status: task.status ?? 'TODO',
    title: task.title,
    prompt_or_spec: task.promptOrSpec ?? '',
    notes: task.notes ?? '',
  }
}

export function promptToRow(prompt: Partial<Prompt> & { agent: Prompt['agent']; department: number }) {
  return {
    agent: prompt.agent,
    department: prompt.department,
    prompt_text: prompt.promptText ?? '',
  }
}
