/** Square checkout URLs — single source for public site and admin Finance */
export const PAYMENT_LINKS = {
  setupFee: {
    url: 'https://square.link/u/ATWPDx47',
    labelTh: 'ชำระ Setup Fee (ครั้งเดียว)',
    labelEn: 'Pay setup fee (one-time)',
    descriptionTh: 'ค่าติดตั้งครั้งเดียว — ส่งลิงก์นี้เมื่อลูกค้าพร้อมจ่าย setup',
    descriptionEn: 'One-time setup fee',
  },
  monthly: {
    url: 'https://checkout.square.site/merchant/ML9ZAYXN7SZ2M/checkout/4644ZK62Q7OQPPTAZFJBMNZY',
    labelTh: 'ชำระรายเดือน',
    labelEn: 'Pay monthly subscription',
    descriptionTh: 'ค่าบริการรายเดือน — ส่งลิงก์นี้เมื่อลูกค้าเริ่ม subscription',
    descriptionEn: 'Monthly subscription',
  },
} as const

export type PaymentLinkKey = keyof typeof PAYMENT_LINKS
