/** GST helpers for Chapter99 agency invoices (raw figures only — no tax advice) */

/** Treat AUD amounts as GST-inclusive (AU consumer pricing). GST = 1/11. */
export function splitGstInclusive(totalInclGst: number): {
  amountExGst: number
  gst: number
  total: number
} {
  const total = Math.round(totalInclGst * 100) / 100
  const gst = Math.round((total / 11) * 100) / 100
  const amountExGst = Math.round((total - gst) * 100) / 100
  return { amountExGst, gst, total }
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount)
}
