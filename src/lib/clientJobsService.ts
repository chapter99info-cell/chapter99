import { supabase } from './supabase'
import type {
  ClientJob,
  ClientJobInsert,
  ClientJobStatus,
  ClientJobUpdate,
} from '../types/clientJobs'

function mapRow(row: Record<string, unknown>): ClientJob {
  return {
    id: String(row.id),
    client_name: String(row.client_name ?? ''),
    client_email: (row.client_email as string | null) ?? null,
    job_type: row.job_type as ClientJob['job_type'],
    status: row.status as ClientJobStatus,
    deposit_amount:
      row.deposit_amount == null ? null : Number(row.deposit_amount),
    deposit_paid_at: (row.deposit_paid_at as string | null) ?? null,
    total_amount: row.total_amount == null ? null : Number(row.total_amount),
    delivered_at: (row.delivered_at as string | null) ?? null,
    deadline: (row.deadline as string | null) ?? null,
    square_payment_link: (row.square_payment_link as string | null) ?? null,
    deliverable_link: (row.deliverable_link as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

export async function fetchClientJobs(): Promise<ClientJob[]> {
  const { data, error } = await supabase
    .from('client_jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[clientJobs] fetch failed', error.message)
    throw new Error(error.message)
  }
  return (data ?? []).map((r) => mapRow(r as Record<string, unknown>))
}

export async function createClientJob(
  input: ClientJobInsert
): Promise<ClientJob> {
  const payload = {
    client_name: input.client_name.trim(),
    client_email: input.client_email?.trim() || null,
    job_type: input.job_type,
    status: input.status ?? 'received',
    deposit_amount: input.deposit_amount,
    deposit_paid_at: input.deposit_paid_at,
    total_amount: input.total_amount,
    deadline: input.deadline,
    square_payment_link: input.square_payment_link?.trim() || null,
    deliverable_link: input.deliverable_link?.trim() || null,
    notes: input.notes?.trim() || null,
  }

  const { data, error } = await supabase
    .from('client_jobs')
    .insert(payload)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Insert failed')
  }
  return mapRow(data as Record<string, unknown>)
}

export async function updateClientJob(
  id: string,
  patch: ClientJobUpdate
): Promise<ClientJob> {
  const { data, error } = await supabase
    .from('client_jobs')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Update failed')
  }
  return mapRow(data as Record<string, unknown>)
}

export async function updateClientJobStatus(
  id: string,
  status: ClientJobStatus
): Promise<ClientJob> {
  const patch: ClientJobUpdate = { status }
  if (status === 'delivered') {
    patch.delivered_at = new Date().toISOString()
  }
  return updateClientJob(id, patch)
}

export async function triggerAgencyInvoice(
  jobId: string,
  reason: 'deposit' | 'final'
): Promise<{ ok: boolean; invoiceNumber?: string; error?: string }> {
  try {
    const res = await fetch('/api/agency-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, reason }),
    })
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean
      invoiceNumber?: string
      skipped?: boolean
      error?: string
    }
    if (!res.ok || body.ok === false) {
      return { ok: false, error: body.error ?? res.statusText }
    }
    return { ok: true, invoiceNumber: body.invoiceNumber }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

export async function fetchAgencyInvoicesInRange(
  startIso: string,
  endIso: string
) {
  const { data, error } = await supabase
    .from('agency_invoices')
    .select('*')
    .gte('issued_at', startIso)
    .lte('issued_at', endIso)
    .order('issued_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
