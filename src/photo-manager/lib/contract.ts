import type { Addon, CatalogPackage, Client } from '../types'
import { TYPE_LABEL_EN } from '../data/catalog'
import { formatClientDate, formatThaiDate } from './dates'
import { formatAddonLine, invoiceTotals, money, suggestedDeposit } from './money'

export type ContractTerm = { n: number; title: string; body: string }

export type ContractView = {
  title: string
  clientName: string
  eventType: string
  dateLabel: string
  location: string
  packageLine: string
  priceLines: string[]
  addonLines: string[]
  totalFee: string
  subtotal: string
  gst: string
  deposit: string
  balance: string
  terms: ContractTerm[]
  closing: string
  signClient: string
  signStudio: string
}

const TERMS: ContractTerm[] = [
  {
    n: 1,
    title: 'ENTIRE AGREEMENT',
    body: 'Supersedes all prior verbal or written agreements. Changes must be in writing and signed by both parties.',
  },
  {
    n: 2,
    title: 'BOOKINGS',
    body: 'The date is reserved only after the non-refundable deposit is received.',
  },
  {
    n: 3,
    title: 'CANCELLATION',
    body: 'If the Client cancels before the event, the deposit is forfeit. If Chapter99 cannot attend for any reason, all monies paid will be refunded.',
  },
  {
    n: 4,
    title: 'PRE-EVENT CONSULTATION',
    body: 'A planning call/session will be scheduled at least 2 weeks before the event to confirm timing and locations.',
  },
  {
    n: 5,
    title: 'EVENT GUIDE',
    body: 'The Client should nominate someone to help identify key people for photos on the day.',
  },
  {
    n: 6,
    title: 'COPYRIGHT',
    body: 'All images remain the copyright of Chapter99 Photography. The Client receives a personal-use license; commercial/resale use requires written permission.',
  },
  {
    n: 7,
    title: 'MODEL RELEASE',
    body: 'Chapter99 may use selected images for portfolio, marketing, and promotional purposes unless the Client opts out in writing.',
  },
  {
    n: 8,
    title: 'EXCLUSIVITY',
    body: 'Chapter99 acts as the sole professional photographer for the event; guest photography is welcome during non-formal moments only. Guest flash photography is not permitted during the ceremony or formal portraits.',
  },
  {
    n: 9,
    title: 'COMPLETION SCHEDULE',
    body: 'Editing takes approximately 6–8 weeks from the event date.',
  },
  {
    n: 10,
    title: 'FINAL DELIVERY',
    body: 'Final gallery and files delivered within 8–10 weeks of the event via online gallery and USB.',
  },
  {
    n: 11,
    title: 'PAYMENT METHOD',
    body: 'Bank transfer / PayID (no surcharge). Card (+2%) and Afterpay (+5%) amounts are shown on the invoice if those methods are used. Full bank details provided on the invoice.',
  },
  {
    n: 12,
    title: 'LIMIT OF LIABILITY',
    body: 'In the unlikely event Chapter99 cannot fulfil this contract, liability is limited to a refund of monies paid.',
  },
  {
    n: 13,
    title: 'IMAGE MANIPULATION',
    body: 'Up to 10 images may receive extended retouching at no extra cost; further requests billed separately.',
  },
]

function hasComparableStandard(standardBase: number): boolean {
  return Number.isFinite(standardBase) && standardBase > 0
}

export function buildContract(
  client: Client,
  packages: CatalogPackage[],
  addons: Addon[],
  opts?: { clientFacing?: boolean },
): ContractView {
  const t = invoiceTotals(client, packages, addons)
  const pkg = packages.find((p) => p.id === client.packageId)
  const deposit = client.deposit > 0 ? client.deposit : suggestedDeposit(t.gstInclusive)
  const balance = Math.max(0, t.gstInclusive - deposit)
  const clientFacing = opts?.clientFacing === true
  const dateLabel = clientFacing ? formatClientDate(client.dateISO) : client.date || formatThaiDate(client.dateISO)
  const eventType = clientFacing ? (TYPE_LABEL_EN[client.type] ?? client.typeLabel) : client.typeLabel

  const priceLines: string[] = []
  if (client.customPrice != null && hasComparableStandard(t.standardBase)) {
    priceLines.push(`Standard package price: ${money(t.standardBase)}`)
    priceLines.push(
      `Negotiated / custom price: ${money(t.base)} (${t.discountDelta < 0 ? 'discount' : 'markup'} ${money(Math.abs(t.discountDelta))})`,
    )
  }

  return {
    title: 'CHAPTER99 PHOTOGRAPHY — CONTRACT AGREEMENT',
    clientName: client.name,
    eventType,
    dateLabel,
    location: client.location,
    packageLine: pkg ? `${pkg.name} — ${pkg.blurb.join(', ')}` : 'Fixed-rate / custom session',
    priceLines,
    addonLines: t.addons.length ? t.addons.map((a) => formatAddonLine(a.name, a.price)) : ['None'],
    totalFee: money(t.gstInclusive),
    subtotal: money(t.subtotal),
    gst: money(t.gst),
    deposit: money(deposit),
    balance: money(balance),
    terms: TERMS,
    closing: 'By confirming below, both parties agree to the full terms of this agreement (complete version provided separately).',
    signClient: 'Client confirmation: typed name on this page',
    signStudio: 'Chapter99 Photography (Saen)',
  }
}

export function contractText(client: Client, packages: CatalogPackage[], addons: Addon[]): string {
  const c = buildContract(client, packages, addons, { clientFacing: false })
  const priceBlock = c.priceLines.length ? `${c.priceLines.join('\n')}\n` : ''
  return `${c.title}

CLIENT: ${c.clientName}
EVENT TYPE: ${c.eventType}
DATE: ${c.dateLabel}
LOCATION: ${c.location}
PACKAGE: ${c.packageLine}

INVESTMENT (AUD, GST-inclusive)
${priceBlock}Add-ons:
${c.addonLines.map((l) => `  - ${l}`).join('\n')}
Total fee (inc. GST 10%): ${c.totalFee}
  Subtotal (ex GST): ${c.subtotal}
  GST 10%: ${c.gst}
Non-refundable deposit (due on signing): ${c.deposit}
Balance remaining (due on or before event date): ${c.balance}

TERMS & CONDITIONS (summary of full agreement)
${c.terms.map((term) => `${term.n}. ${term.title} — ${term.body}`).join('\n')}

${c.closing}

Client signature: ______________________   Date: __________
Chapter99 Photography (Saen) signature: ______________________   Date: __________`
}
