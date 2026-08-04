import { jsPDF as JsPDFCtor } from 'jspdf'
import {
  CHAPTER99_SELLER,
  JOB_TYPE_LABELS,
  type AgencyInvoiceKind,
  type ClientJobType,
} from '../types/clientJobs'
import { formatAud } from './agencyGst'

export interface AgencyInvoicePdfInput {
  invoiceNumber: string
  kind: AgencyInvoiceKind
  clientName: string
  jobType: ClientJobType
  amountExGst: number
  gst: number
  total: number
  issuedAt: Date
  notes?: string | null
}

export async function buildAgencyInvoicePdf(
  input: AgencyInvoicePdfInput
): Promise<Blob> {
  const doc = new JsPDFCtor({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('TAX INVOICE', 14, y)
  doc.setFontSize(11)
  doc.text(input.invoiceNumber, pageW - 14, y, { align: 'right' })
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(CHAPTER99_SELLER.sellerLine, 14, y)
  y += 4
  doc.text(`ABN: ${CHAPTER99_SELLER.abn}`, 14, y)
  y += 4
  doc.text(CHAPTER99_SELLER.address, 14, y)
  y += 4
  doc.text(CHAPTER99_SELLER.email, 14, y)
  y += 8

  const issued = input.issuedAt.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  doc.text(`Invoice date: ${issued}`, 14, y)
  y += 4
  doc.text(
    `Type: ${input.kind === 'deposit' ? 'Deposit invoice' : 'Final invoice'}`,
    14,
    y
  )
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.text('Bill to', 14, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.text(input.clientName, 14, y)
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.text('Description', 14, y)
  doc.text('Amount', pageW - 14, y, { align: 'right' })
  y += 2
  doc.setDrawColor(200)
  doc.line(14, y, pageW - 14, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  const desc =
    input.kind === 'deposit'
      ? `Deposit — ${JOB_TYPE_LABELS[input.jobType]}`
      : `Services — ${JOB_TYPE_LABELS[input.jobType]}`
  doc.text(desc, 14, y)
  doc.text(formatAud(input.amountExGst), pageW - 14, y, { align: 'right' })
  y += 8

  if (input.notes?.trim()) {
    doc.setFontSize(8)
    doc.setTextColor(100)
    const lines = doc.splitTextToSize(input.notes.trim(), pageW - 28)
    doc.text(lines, 14, y)
    y += lines.length * 4 + 4
    doc.setTextColor(0)
    doc.setFontSize(9)
  }

  doc.setDrawColor(200)
  doc.line(14, y, pageW - 14, y)
  y += 7

  doc.text('Amount (ex GST)', 14, y)
  doc.text(formatAud(input.amountExGst), pageW - 14, y, { align: 'right' })
  y += 5
  doc.text('GST (10%)', 14, y)
  doc.text(formatAud(input.gst), pageW - 14, y, { align: 'right' })
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.text('Total (incl. GST)', 14, y)
  doc.text(formatAud(input.total), pageW - 14, y, { align: 'right' })
  y += 14

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(110)
  doc.text(
    'Amounts shown are raw figures for record-keeping. This document does not constitute tax advice.',
    14,
    y,
    { maxWidth: pageW - 28 }
  )

  return doc.output('blob')
}
