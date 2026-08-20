import type { Addon, Client, IncomeReceipt, InvoiceTotals, PaymentMethod } from '../types'

export const GST_RATE = 0.1
export const SURCHARGE: Record<PaymentMethod, number> = {
  bank: 0,
  card: 0.02,
  afterpay: 0.05,
}

export function money(n: number): string {
  const rounded = Math.round(n * 100) / 100
  const formatted = Math.abs(rounded).toLocaleString('en-AU', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return (rounded < 0 ? '-$' : '$') + formatted
}

export function gstSplit(inclusive: number): { subtotal: number; gst: number; total: number } {
  const subtotal = inclusive / 1.1
  const gst = inclusive - subtotal
  return { subtotal, gst, total: inclusive }
}

export function standardBase(client: Client, packages: { id: string; price: number }[]): number {
  if (client.packageId) {
    const p = packages.find((x) => x.id === client.packageId)
    if (p) return p.price
  }
  return client.fixedPrice ?? 0
}

export function addonUnitPrice(client: Pick<Client, 'addonPrices'>, addon: { id: string; price: number }): number {
  const ov = client.addonPrices?.[addon.id]
  if (ov != null && Number.isFinite(Number(ov))) return Number(ov)
  return addon.price
}

export function formatAddonLine(name: string, price: number): string {
  if (price === 0) return `${name} (ของแถม / Complimentary)`
  return `${name} (+AUD ${money(price)})`
}

export function invoiceTotals(
  client: Client,
  packages: { id: string; price: number }[],
  addons: Addon[],
  method: PaymentMethod = client.payment.method,
): InvoiceTotals {
  const std = standardBase(client, packages)
  const base = client.customPrice != null ? client.customPrice : std
  const selected = addons.filter((a) => client.addonIds.includes(a.id))
  const priced = selected.map((a) => ({ id: a.id, name: a.name, price: addonUnitPrice(client, a) }))
  const addonsTotal = priced.reduce((s, a) => s + a.price, 0)
  const gstInclusive = base + addonsTotal
  const { subtotal, gst } = gstSplit(gstInclusive)
  const surchargeRate = SURCHARGE[method]
  const surcharge = gstInclusive * surchargeRate
  return {
    base,
    standardBase: std,
    discountDelta: base - std,
    addons: priced,
    addonsTotal,
    gstInclusive,
    subtotal,
    gst,
    surchargeRate,
    surcharge,
    totalToPay: gstInclusive + surcharge,
  }
}

export function suggestedDeposit(total: number): number {
  return Math.round(total * 0.2)
}

export function incomeReceipt(client: Client, packages: { id: string; price: number }[], addons: Addon[]): IncomeReceipt {
  const due = invoiceTotals(client, packages, addons).gstInclusive
  if (client.status === 'paid' || client.deposit >= due - 0.5) return 'full'
  if (client.deposit > 0) return 'deposit_only'
  return 'none'
}
