import { documentTemplates, messagePurposes } from '../data/toolkit'
import type { ToolkitProfile } from './toolkitStore'

type MsgId = (typeof messagePurposes)[number]['id']
type DocId = (typeof documentTemplates)[number]['id']

function shop(profile: ToolkitProfile) {
  return profile.name.trim() || 'our shop'
}

export function generateCustomerMessage(purpose: MsgId, profile: ToolkitProfile, extra: string) {
  const name = shop(profile)
  const phone = profile.phone.trim()
  const note = extra.trim()
  const lines: Record<MsgId, string> = {
    confirm: `Hello, this is ${name}. Your appointment is confirmed. Please arrive a few minutes early. If you need to change the time, reply to this message${phone ? ` or call ${phone}` : ''}.`,
    reminder: `Hello from ${name}. Friendly reminder of your appointment. We look forward to seeing you. Reply if you need to reschedule.`,
    thanks: `Thank you for visiting ${name}. We hope you feel relaxed. You are welcome back anytime.`,
    review: `Thank you for visiting ${name}. If you were happy with your treatment, a short Google review would help other guests find us. Thank you.`,
  }
  const extraLine = note ? `\n\nNote from the shop: ${note}` : ''
  return `${lines[purpose]}${extraLine}\n\n(Generated on this device. Copy and send it yourself. No customer list is stored.)`
}

export function generateDocument(id: DocId, profile: ToolkitProfile) {
  const name = shop(profile)
  const address = profile.address.trim() || '[shop address]'
  const bodies: Record<DocId, string> = {
    cancel: `${name} — Cancellation Policy\n\nPlease tell us as soon as you cannot attend. Same-day cancellations may be treated as a missed booking. This template is general information, not legal advice.`,
    booking: `${name} — Booking Terms\n\nBookings are held for the named guest. Please arrive on time. Payment is completed at the shop unless we agree otherwise. This template is not legal advice.`,
    refund: `${name} — Refund Policy\n\nIf a session cannot go ahead because of the shop, we will offer another time. Refunds for completed services are considered case by case. This template is not legal advice.`,
    ack: `${name} — Client Acknowledgement\n\nI have read the shop information provided to me and will tell the therapist about any health concerns before treatment. This template is not legal advice.`,
    photo: `${name} — Photography Terms\n\nPhotos taken for the shop website remain for business use as agreed. Personal images of guests are not used without permission. This template is not legal advice.`,
    privacy: `${name} — Privacy Notice\n\nWe collect only the business details needed to run this shop. This free toolkit does not store customer names, emails or phone numbers. Address: ${address}. This template is not legal advice.`,
    web: `${name} — Website Terms\n\nContent on this preview is for information. Prices and times should be confirmed with the shop. This template is not legal advice.`,
  }
  return bodies[id]
}

export function generateTip(profile: ToolkitProfile, index: number) {
  const name = shop(profile)
  const tips = [
    `Write a one-sentence welcome in English on the homepage so guests know ${name} is open to book.`,
    'Describe each service in one short sentence plus duration and price in AUD.',
    'Ask for a Google review after a completed visit using copy-and-send. Do not save the customer’s number in this toolkit.',
    'Use a clear shopfront photo as the main image, then one photo per service.',
  ]
  return tips[index % tips.length]
}
