import {
  billingPatchToRow,
  mapBilling,
  mapClient,
  mapProject,
  mapPrompt,
  mapTask,
  projectPatchToRow,
  promptToRow,
  taskToRow,
} from './agencyMappers'
import { AGENCY_TABLES } from './agencyTables'
import { isValidAssigneeForDepartment, type DepartmentId } from './departmentConfig'
import { supabase } from './supabase'
import { formatSupabaseError } from './supabaseErrors'
import type {
  Billing,
  Client,
  PackageTier,
  Project,
  Prompt,
  PromptAgent,
  ProjectStatus,
  Task,
  TaskStatus,
} from '../types/agency'
import { AGENCY_CONFIG } from './agency-config'
import { computeBillingTotal } from './billingTotals'
import { assertAiAddonAllowed } from './tierRules'

function throwIfError(error: unknown): void {
  if (error) throw new Error(formatSupabaseError(error))
}

const PROJECT_COLUMNS =
  'id, client_id, project_type, package_tier, ai_addon_enabled, byok_key_configured, status, drive_folder_url, contract_url, live_web_url, gallery_url, google_maps_embed_url, google_review_link, facebook_url, line_oa_url, project_spec, created_at, updated_at'

const PROJECT_SELECT = `${PROJECT_COLUMNS}, client:client_id(id, business_name, contact_name, email, phone, created_at)`
const BILLING_SELECT = `*, project:project_id(id, client_id, project_type, package_tier, status, client:client_id(business_name))`

// ——— Clients ———
export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from(AGENCY_TABLES.client)
    .select('*')
    .order('business_name')
  throwIfError(error)
  return (data ?? []).map(mapClient)
}

// ——— Projects ———
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(AGENCY_TABLES.project)
    .select(PROJECT_SELECT)
    .order('updated_at', { ascending: false })
  throwIfError(error)
  return (data ?? []).map(mapProject)
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from(AGENCY_TABLES.project)
    .select(PROJECT_SELECT)
    .eq('id', id)
    .maybeSingle()
  throwIfError(error)
  return data ? mapProject(data) : null
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
  if (patch.aiAddonEnabled !== undefined || patch.packageTier !== undefined) {
    const current = await fetchProjectById(id)
    if (current) {
      assertAiAddonAllowed({
        packageTier: patch.packageTier ?? current.packageTier,
        aiAddonEnabled: patch.aiAddonEnabled ?? current.aiAddonEnabled,
      })
    }
  }
  const { data, error } = await supabase
    .from(AGENCY_TABLES.project)
    .update(projectPatchToRow(patch))
    .eq('id', id)
    .select(PROJECT_SELECT)
    .single()
  throwIfError(error)
  if (!data) throw new Error('Project update returned no data')
  return mapProject(data as Record<string, unknown>)
}

export async function setProjectByokKey(projectId: string, plainKey: string | null): Promise<void> {
  const { error } = await supabase.rpc('set_project_byok_key', {
    p_project_id: projectId,
    p_plain_key: plainKey ?? '',
  })
  throwIfError(error)
}

export async function getProjectByokKey(projectId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('get_project_byok_key', {
    p_project_id: projectId,
  })
  throwIfError(error)
  return data != null && String(data).trim() !== '' ? String(data) : null
}


// ——— Billing ———
export async function fetchBillingRecords(): Promise<Billing[]> {
  const { data, error } = await supabase
    .from(AGENCY_TABLES.billing)
    .select(BILLING_SELECT)
    .order('payment_received_date', { ascending: false, nullsFirst: false })
  throwIfError(error)
  return (data ?? []).map(mapBilling)
}

export async function upsertBillingForProject(
  projectId: string,
  patch: Partial<Billing>,
  packageTier?: Project['packageTier']
): Promise<Billing> {
  let tier = packageTier
  if (!tier) {
    const project = await fetchProjectById(projectId)
    tier = project?.packageTier ?? 'STARTER'
  }

  const merged: Partial<Billing> = { ...patch }
  if (
    patch.basePackageAmountAud !== undefined ||
    patch.photographyFeeAud !== undefined ||
    patch.videoFeeAud !== undefined ||
    patch.aiAddonMonthlyFeeAud !== undefined
  ) {
    const { data: existingBill } = await supabase
      .from(AGENCY_TABLES.billing)
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle()

    const base = patch.basePackageAmountAud ?? Number(existingBill?.base_package_amount_aud ?? 0)
    const photo = patch.photographyFeeAud ?? Number(existingBill?.photography_fee_aud ?? 0)
    const video = patch.videoFeeAud ?? Number(existingBill?.video_fee_aud ?? 0)
    const aiFee =
      patch.aiAddonMonthlyFeeAud !== undefined
        ? patch.aiAddonMonthlyFeeAud
        : existingBill?.ai_addon_monthly_fee_aud != null
          ? Number(existingBill.ai_addon_monthly_fee_aud)
          : null

    const { totalAmountAud, gstAmountAud } = computeBillingTotal(
      {
        basePackageAmountAud: base,
        photographyFeeAud: photo,
        videoFeeAud: video,
        aiAddonMonthlyFeeAud: aiFee,
      },
      tier
    )
    merged.totalAmountAud = totalAmountAud
    merged.gstAmountAud = gstAmountAud
  }

  const { data: existing } = await supabase
    .from(AGENCY_TABLES.billing)
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle()

  if (existing?.id) {
    const { data, error } = await supabase
      .from(AGENCY_TABLES.billing)
      .update(billingPatchToRow(merged))
      .eq('id', existing.id)
      .select(BILLING_SELECT)
      .single()
    throwIfError(error)
    return mapBilling(data)
  }

  const { data, error } = await supabase
    .from(AGENCY_TABLES.billing)
    .insert({
      project_id: projectId,
      base_package_amount_aud: merged.basePackageAmountAud ?? 0,
      photography_fee_aud: merged.photographyFeeAud ?? 0,
      video_fee_aud: merged.videoFeeAud ?? 0,
      ai_addon_monthly_fee_aud: merged.aiAddonMonthlyFeeAud ?? null,
      total_amount_aud: merged.totalAmountAud ?? 0,
      gst_amount_aud: merged.gstAmountAud ?? 0,
      total_amount: merged.totalAmountAud ?? 0,
      deposit_paid: patch.depositPaid ?? false,
      final_paid: patch.finalPaid ?? false,
      quotation_url: patch.quotationUrl ?? '',
      invoice_url: patch.invoiceUrl ?? '',
      receipt_url: patch.receiptUrl ?? '',
      payment_received_date: patch.paymentReceivedDate ?? null,
    })
    .select(BILLING_SELECT)
    .single()
  throwIfError(error)
  return mapBilling(data)
}

// ——— Tasks ———
export async function fetchTasks(projectId?: string): Promise<Task[]> {
  let query = supabase.from(AGENCY_TABLES.task).select('*').order('created_at', { ascending: false })
  if (projectId) query = query.eq('project_id', projectId)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []).map(mapTask)
}

export async function createTask(
  input: Omit<Task, 'id'> & { departmentId: DepartmentId }
): Promise<Task> {
  if (!isValidAssigneeForDepartment(input.departmentId, input.assignee)) {
    throw new Error(`Assignee ${input.assignee} is not valid for department ${input.departmentId}`)
  }
  const { data, error } = await supabase
    .from(AGENCY_TABLES.task)
    .insert(taskToRow(input))
    .select()
    .single()
  throwIfError(error)
  return mapTask(data)
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase.from(AGENCY_TABLES.task).update({ status }).eq('id', id)
  throwIfError(error)
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (patch.title !== undefined) row.title = patch.title
  if (patch.status !== undefined) row.status = patch.status
  if (patch.assignee !== undefined) row.assignee = patch.assignee
  if (patch.promptOrSpec !== undefined) row.prompt_or_spec = patch.promptOrSpec
  if (patch.notes !== undefined) row.notes = patch.notes
  if (patch.departmentId !== undefined) row.department_id = patch.departmentId
  const { error } = await supabase.from(AGENCY_TABLES.task).update(row).eq('id', id)
  throwIfError(error)
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from(AGENCY_TABLES.task).delete().eq('id', id)
  throwIfError(error)
}

// ——— Prompts ———
export async function fetchPrompts(agent?: PromptAgent): Promise<Prompt[]> {
  let query = supabase.from(AGENCY_TABLES.prompts).select('*').order('department')
  if (agent) query = query.eq('agent', agent)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []).map(mapPrompt)
}

export async function savePrompt(prompt: Omit<Prompt, 'id'> & { id?: string }): Promise<Prompt> {
  if (prompt.id) {
    const { data, error } = await supabase
      .from(AGENCY_TABLES.prompts)
      .update(promptToRow(prompt))
      .eq('id', prompt.id)
      .select()
      .single()
    throwIfError(error)
    return mapPrompt(data)
  }
  const { data, error } = await supabase
    .from(AGENCY_TABLES.prompts)
    .insert(promptToRow(prompt))
    .select()
    .single()
  throwIfError(error)
  return mapPrompt(data)
}

export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabase.from(AGENCY_TABLES.prompts).delete().eq('id', id)
  throwIfError(error)
}

export async function ensureDefaultProject(): Promise<string> {
  const { data: existing, error: existingErr } = await supabase
    .from(AGENCY_TABLES.project)
    .select('id')
    .limit(1)
  if (existingErr) throwIfError(existingErr)
  if (existing?.[0]?.id) return String(existing[0].id)

  const { data: client, error: clientErr } = await supabase
    .from(AGENCY_TABLES.client)
    .insert({
      business_name: 'Internal',
      contact_name: 'Phee Saen',
      email: AGENCY_CONFIG.contact.email,
      phone: '',
    })
    .select()
    .single()
  if (clientErr) throwIfError(clientErr)

  const { data: project, error: projErr } = await supabase
    .from(AGENCY_TABLES.project)
    .insert({
      client_id: client.id,
      project_type: 'FULL_SERVICE',
      status: 'IN_PROGRESS',
      drive_folder_url: '',
      contract_url: '',
    })
    .select()
    .single()
  if (projErr) throwIfError(projErr)
  return String(project.id)
}

export const PACKAGE_TIER_OPTIONS: PackageTier[] = ['STARTER', 'PROFESSIONAL', 'ULTIMATE']

export const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
  'NEW_BRIEF',
  'IN_PROGRESS',
  'QA_REVIEW',
  'DELIVERED',
  'CANCELLED',
]
