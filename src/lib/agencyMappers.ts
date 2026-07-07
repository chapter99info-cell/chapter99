import type { Billing, Client, PackageTier, Project, Prompt, Task } from '../types/agency'

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
  const clientRow = row.client as Record<string, unknown> | Record<string, unknown>[] | null | undefined
  const client = Array.isArray(clientRow) ? clientRow[0] : clientRow

  return {
    id: String(row.id),
    clientId: String(row.client_id),
    projectType: row.project_type as Project['projectType'],
    packageTier: (row.package_tier as PackageTier) ?? 'STARTER',
    aiAddonEnabled: Boolean(row.ai_addon_enabled),
    byokKeyConfigured: Boolean(row.byok_key_configured),
    status: row.status as Project['status'],
    driveFolderUrl: String(row.drive_folder_url ?? ''),
    contractUrl: String(row.contract_url ?? ''),
    liveWebUrl: row.live_web_url != null ? String(row.live_web_url) : null,
    galleryUrl: row.gallery_url != null ? String(row.gallery_url) : null,
    googleMapsEmbedUrl: row.google_maps_embed_url != null ? String(row.google_maps_embed_url) : null,
    googleReviewLink: row.google_review_link != null ? String(row.google_review_link) : null,
    facebookUrl: row.facebook_url != null ? String(row.facebook_url) : null,
    lineOaUrl: row.line_oa_url != null ? String(row.line_oa_url) : null,
    projectSpec: row.project_spec != null ? String(row.project_spec) : null,
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
    client: client ? mapClient(client) : undefined,
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
  const projectRow = row.project as Record<string, unknown> | Record<string, unknown>[] | null | undefined
  const project = Array.isArray(projectRow) ? projectRow[0] : projectRow
  const clientFromProject = project?.client as Record<string, unknown> | Record<string, unknown>[] | undefined
  const client = Array.isArray(clientFromProject) ? clientFromProject[0] : clientFromProject

  return {
    id: String(row.id),
    projectId: String(row.project_id),
    basePackageAmountAud: Number(row.base_package_amount_aud ?? 0),
    photographyFeeAud: Number(row.photography_fee_aud ?? 0),
    videoFeeAud: Number(row.video_fee_aud ?? 0),
    aiAddonMonthlyFeeAud:
      row.ai_addon_monthly_fee_aud != null ? Number(row.ai_addon_monthly_fee_aud) : null,
    totalAmount: Number(row.total_amount ?? row.total_amount_aud ?? 0),
    totalAmountAud: Number(row.total_amount_aud ?? row.total_amount ?? 0),
    gstAmountAud: Number(row.gst_amount_aud ?? 0),
    paymentReceivedDate: row.payment_received_date != null ? String(row.payment_received_date) : null,
    depositPaid: Boolean(row.deposit_paid),
    finalPaid: Boolean(row.final_paid),
    quotationUrl: String(row.quotation_url ?? ''),
    invoiceUrl: String(row.invoice_url ?? ''),
    receiptUrl: String(row.receipt_url ?? ''),
    project: project ? mapProject(project) : undefined,
    client: client ? mapClient(client) : project?.client ? mapClient(project.client as Record<string, unknown>) : undefined,
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

export function projectPatchToRow(patch: Partial<Project>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (patch.status !== undefined) row.status = patch.status
  if (patch.projectType !== undefined) row.project_type = patch.projectType
  if (patch.packageTier !== undefined) row.package_tier = patch.packageTier
  if (patch.aiAddonEnabled !== undefined) row.ai_addon_enabled = patch.aiAddonEnabled
  if (patch.driveFolderUrl !== undefined) row.drive_folder_url = patch.driveFolderUrl
  if (patch.contractUrl !== undefined) row.contract_url = patch.contractUrl
  if (patch.liveWebUrl !== undefined) row.live_web_url = patch.liveWebUrl
  if (patch.galleryUrl !== undefined) row.gallery_url = patch.galleryUrl
  if (patch.googleMapsEmbedUrl !== undefined) row.google_maps_embed_url = patch.googleMapsEmbedUrl
  if (patch.googleReviewLink !== undefined) row.google_review_link = patch.googleReviewLink
  if (patch.facebookUrl !== undefined) row.facebook_url = patch.facebookUrl
  if (patch.lineOaUrl !== undefined) row.line_oa_url = patch.lineOaUrl
  if (patch.projectSpec !== undefined) row.project_spec = patch.projectSpec
  return row
}

export function billingPatchToRow(patch: Partial<Billing>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (patch.basePackageAmountAud !== undefined) row.base_package_amount_aud = patch.basePackageAmountAud
  if (patch.photographyFeeAud !== undefined) row.photography_fee_aud = patch.photographyFeeAud
  if (patch.videoFeeAud !== undefined) row.video_fee_aud = patch.videoFeeAud
  if (patch.aiAddonMonthlyFeeAud !== undefined) {
    row.ai_addon_monthly_fee_aud = patch.aiAddonMonthlyFeeAud
  }
  if (patch.totalAmountAud !== undefined) {
    row.total_amount_aud = patch.totalAmountAud
    row.gst_amount_aud = Math.round(patch.totalAmountAud * 0.1 * 100) / 100
    row.total_amount = patch.totalAmountAud
  }
  if (patch.gstAmountAud !== undefined) row.gst_amount_aud = patch.gstAmountAud
  if (patch.paymentReceivedDate !== undefined) row.payment_received_date = patch.paymentReceivedDate || null
  if (patch.depositPaid !== undefined) row.deposit_paid = patch.depositPaid
  if (patch.finalPaid !== undefined) row.final_paid = patch.finalPaid
  if (patch.quotationUrl !== undefined) row.quotation_url = patch.quotationUrl
  if (patch.invoiceUrl !== undefined) row.invoice_url = patch.invoiceUrl
  if (patch.receiptUrl !== undefined) row.receipt_url = patch.receiptUrl
  return row
}
