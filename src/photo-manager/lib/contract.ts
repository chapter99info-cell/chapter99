import type { Addon, CatalogPackage, Client } from '../types'
import { invoiceTotals, money, suggestedDeposit } from './money'

export function contractText(client: Client, packages: CatalogPackage[], addons: Addon[]): string {
  const t = invoiceTotals(client, packages, addons)
  const pkg = packages.find((p) => p.id === client.packageId)
  const deposit = client.deposit > 0 ? client.deposit : suggestedDeposit(t.gstInclusive)
  const balance = Math.max(0, t.gstInclusive - deposit)
  const discountLine =
    client.customPrice != null
      ? `Standard package price: ${money(t.standardBase)}
Negotiated / custom price: ${money(t.base)} (${t.discountDelta < 0 ? 'discount' : 'markup'} ${money(Math.abs(t.discountDelta))})`
      : `Package / session price: ${money(t.base)}`
  const addonLines = t.addons.length
    ? t.addons.map((a) => `  - ${a.name}: ${money(a.price)}`).join('\n')
    : '  - None'

  return `CHAPTER99 PHOTOGRAPHY — CONTRACT AGREEMENT

CLIENT: ${client.name}
EVENT TYPE: ${client.typeLabel}
DATE: ${client.date}
LOCATION: ${client.location}
${pkg ? `PACKAGE: ${pkg.name} — ${pkg.blurb.join(', ')}` : 'SERVICE: fixed-rate session'}

INVESTMENT (AUD, GST-inclusive)
${discountLine}
Add-ons:
${addonLines}
Total fee (inc. GST 10%): ${money(t.gstInclusive)}
  Subtotal (ex GST): ${money(t.subtotal)}
  GST 10%: ${money(t.gst)}
Non-refundable deposit (due on signing): ${money(deposit)}
Balance remaining (due on or before event date): ${money(balance)}

TERMS & CONDITIONS (summary of full agreement)
1. ENTIRE AGREEMENT — supersedes all prior verbal or written agreements. Changes must be in writing and signed by both parties.
2. BOOKINGS — the date is reserved only after the non-refundable deposit is received.
3. CANCELLATION — if the Client cancels before the event, the deposit is forfeit. If Chapter99 cannot attend for any reason, all monies paid will be refunded.
4. PRE-EVENT CONSULTATION — a planning call/session will be scheduled at least 2 weeks before the event to confirm timing and locations.
5. EVENT GUIDE — the Client should nominate someone to help identify key people for photos on the day.
6. COPYRIGHT — all images remain the copyright of Chapter99 Photography. The Client receives a personal-use license; commercial/resale use requires written permission.
7. MODEL RELEASE — Chapter99 may use selected images for portfolio, marketing, and promotional purposes unless the Client opts out in writing.
8. EXCLUSIVITY — Chapter99 acts as the sole professional photographer for the event; guest photography is welcome during non-formal moments only. Guest flash photography is not permitted during the ceremony or formal portraits.
9. COMPLETION SCHEDULE — editing takes approximately 6-8 weeks from the event date.
10. FINAL DELIVERY — final gallery and files delivered within 8-10 weeks of the event via online gallery and USB.
11. PAYMENT METHOD — bank transfer / PayID (no surcharge). Card (+2%) and Afterpay (+5%) amounts are shown on the invoice if those methods are used. Full bank details provided on the invoice.
12. LIMIT OF LIABILITY — in the unlikely event Chapter99 cannot fulfil this contract, liability is limited to a refund of monies paid.
13. IMAGE MANIPULATION — up to 10 images may receive extended retouching at no extra cost; further requests billed separately.

By signing below, both parties agree to the full terms of this agreement (complete version provided separately).

Client signature: ______________________   Date: __________
Chapter99 Photography (Saen) signature: ______________________   Date: __________`
}
