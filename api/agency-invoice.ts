import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { requireAdminPin } from './_utils/adminAuth'
import { splitGstInclusive } from '../src/lib/agencyGst'
import { buildAgencyInvoicePdf } from '../src/lib/agencyInvoicePdf'
import {
  CHAPTER99_SELLER,
  JOB_TYPE_LABELS,
  type AgencyInvoiceKind,
  type ClientJobType,
} from '../src/types/clientJobs'

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function amountForKind(
  kind: AgencyInvoiceKind,
  deposit: number | null,
  total: number | null
): number | null {
  if (kind === 'deposit') {
    return deposit != null && deposit > 0 ? Number(deposit) : null
  }
  return total != null && total > 0 ? Number(total) : null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin, x-admin-pin-token')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  if (!(await requireAdminPin(req, res))) return

  const { jobId, reason } = (req.body ?? {}) as {
    jobId?: string
    reason?: AgencyInvoiceKind
  }

  if (!jobId || (reason !== 'deposit' && reason !== 'final')) {
    return res.status(400).json({
      ok: false,
      error: 'jobId and reason (deposit|final) required',
    })
  }

  let sb
  try {
    sb = supabaseAdmin()
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  const { data: job, error: jobErr } = await sb
    .from('client_jobs')
    .select('*')
    .eq('id', jobId)
    .maybeSingle()

  if (jobErr || !job) {
    return res.status(404).json({ ok: false, error: jobErr?.message ?? 'Job not found' })
  }

  if (reason === 'deposit' && !job.deposit_paid_at) {
    return res.status(400).json({
      ok: false,
      error: 'deposit_paid_at must be set before issuing a deposit invoice',
    })
  }
  if (reason === 'final' && job.status !== 'paid') {
    return res.status(400).json({
      ok: false,
      error: "status must be 'paid' before issuing a final invoice",
    })
  }

  const { data: existing } = await sb
    .from('agency_invoices')
    .select('id, invoice_number')
    .eq('client_job_id', jobId)
    .eq('kind', reason)
    .maybeSingle()

  if (existing) {
    return res.status(200).json({
      ok: true,
      skipped: true,
      invoiceNumber: existing.invoice_number,
    })
  }

  const amountIncl = amountForKind(
    reason,
    job.deposit_amount == null ? null : Number(job.deposit_amount),
    job.total_amount == null ? null : Number(job.total_amount)
  )
  if (amountIncl == null) {
    return res.status(400).json({
      ok: false,
      error: reason === 'deposit' ? 'deposit_amount missing' : 'total_amount missing',
    })
  }

  const { amountExGst, gst, total } = splitGstInclusive(amountIncl)

  const { data: numRow, error: numErr } = await sb.rpc('next_agency_invoice_number')
  if (numErr || !numRow) {
    return res.status(500).json({
      ok: false,
      error: numErr?.message ?? 'Failed to allocate invoice number',
    })
  }
  const invoiceNumber = String(numRow)
  const issuedAt = new Date()

  const pdfBlob = await buildAgencyInvoicePdf({
    invoiceNumber,
    kind: reason,
    clientName: String(job.client_name),
    jobType: job.job_type as ClientJobType,
    amountExGst,
    gst,
    total,
    issuedAt,
    notes: job.notes,
  })
  const pdfBytes = Buffer.from(await pdfBlob.arrayBuffer())

  const { data: invoice, error: invErr } = await sb
    .from('agency_invoices')
    .insert({
      invoice_number: invoiceNumber,
      client_job_id: jobId,
      kind: reason,
      client_name: job.client_name,
      client_email: job.client_email,
      job_type: job.job_type,
      amount_ex_gst: amountExGst,
      gst,
      total,
      issued_at: issuedAt.toISOString(),
      email_sent: false,
      pdf_url: null,
    })
    .select('*')
    .single()

  if (invErr || !invoice) {
    return res.status(500).json({
      ok: false,
      error: invErr?.message ?? 'Insert invoice failed',
    })
  }

  let emailSent = false
  const to = String(job.client_email ?? '').trim()
  if (to && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const kindLabel = reason === 'deposit' ? 'Deposit' : 'Tax'
      const jobLabel =
        JOB_TYPE_LABELS[job.job_type as ClientJobType] ?? String(job.job_type)

      await resend.emails.send({
        from: 'Chapter99 Solutions <onboarding@resend.dev>',
        to,
        subject: `${kindLabel} Invoice ${invoiceNumber} — ${CHAPTER99_SELLER.sellerLine}`,
        html: `
          <p>Hello ${job.client_name},</p>
          <p>Please find your ${kindLabel.toLowerCase()} invoice <strong>${invoiceNumber}</strong> for ${jobLabel}.</p>
          <ul>
            <li>Amount (ex GST): $${amountExGst.toFixed(2)}</li>
            <li>GST (10%): $${gst.toFixed(2)}</li>
            <li>Total (incl. GST): $${total.toFixed(2)}</li>
          </ul>
          <p>${CHAPTER99_SELLER.sellerLine}<br/>ABN ${CHAPTER99_SELLER.abn}</p>
          <p style="color:#888;font-size:12px">This email contains raw invoice figures only and does not constitute tax advice.</p>
        `,
        attachments: [
          {
            filename: `${invoiceNumber}.pdf`,
            content: pdfBytes,
          },
        ],
      })
      emailSent = true
      await sb
        .from('agency_invoices')
        .update({ email_sent: true })
        .eq('id', invoice.id)
    } catch (err) {
      console.error('[agency-invoice] email failed', err)
    }
  }

  return res.status(200).json({
    ok: true,
    invoiceNumber,
    emailSent,
  })
}
