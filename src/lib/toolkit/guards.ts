export type GuardKind = 'pro' | 'sens' | 'legal' | 'incentive'

export type GuardHit = {
  type: GuardKind
  msg: { th: string; en: string }
}

export const PRO_ADVICE =
  /(privacy policy|collection notice|breach (response )?plan|employment contract|employment policy|tax (advice|return|report|deduction)|\btax\b|\bgst\b|\bato\b|legal advice|\bcontract\b|terms and conditions|refund policy|\bcompliance\b|นโยบายความเป็นส่วนตัว|นโยบาย|สัญญาจ้าง|สัญญา|ภาษี|กฎหมาย|ทนาย|ข้อกำหนด)/i

export const SENSITIVE =
  /(\btfn\b|tax file|passport|\bvisa\b|\bbsb\b|bank account|card number|credit card|เลขบัญชี|พาสปอร์ต|วีซ่า|\b\d{9,}\b|\b\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{4}\b|diagnos|medical|medication|pregnan|injur|allerg|rash|surgery|สุขภาพ|โรค|กินยา|ทานยา|ยารักษา|ยาประจำ|ผ่าตัด|แพ้|ตั้งครรภ์|บาดเจ็บ)/i

export const LEGALISH = /(sue|lawyer|solicitor|legal action|court|police|ทนาย|ฟ้อง|ตำรวจ)/i

export const INCENTIVE =
  /(cash ?back|\$\s?\d|discount|% ?off|free |reward|prize|win |gift for review|ส่วนลด|แจก|ฟรี|รางวัล|คืนเงิน|แลก)/i

const MESSAGES: Record<GuardKind, { th: string; en: string }> = {
  pro: {
    en: 'This toolkit can’t write or advise on tax, legal, contracts, privacy policies or employment matters. Please speak to a qualified professional, or see official sources such as ato.gov.au, oaic.gov.au or fairwork.gov.au.',
    th: 'เครื่องมือนี้ไม่สามารถเขียนหรือให้คำแนะนำด้านภาษี กฎหมาย สัญญา นโยบายความเป็นส่วนตัว หรือการจ้างงานได้ กรุณาปรึกษาผู้เชี่ยวชาญ หรือดูแหล่งข้อมูลทางการ เช่น ato.gov.au, oaic.gov.au หรือ fairwork.gov.au',
  },
  sens: {
    en: 'This looks like it may contain sensitive personal information (health, ID, or bank details). Please remove it and try again — for your customers’ privacy this toolkit doesn’t process that kind of information.',
    th: 'ข้อความนี้อาจมีข้อมูลส่วนตัวที่ละเอียดอ่อน (สุขภาพ เอกสารประจำตัว หรือข้อมูลบัญชี) กรุณาลบออกแล้วลองใหม่ เพื่อความเป็นส่วนตัวของลูกค้า เครื่องมือนี้จึงไม่ประมวลผลข้อมูลลักษณะนี้',
  },
  legal: {
    en: 'This review mentions a legal or serious matter. We don’t draft a public reply for this. Consider responding privately and getting professional advice first.',
    th: 'รีวิวนี้เกี่ยวข้องกับเรื่องทางกฎหมายหรือเรื่องร้ายแรง เราจึงไม่ร่างคำตอบสาธารณะให้ ควรติดต่อลูกค้าเป็นการส่วนตัวและปรึกษาผู้เชี่ยวชาญก่อน',
  },
  incentive: {
    en: 'Google doesn’t allow offering rewards, discounts or cash back in exchange for reviews, so this poster can’t include that wording. Please remove it.',
    th: 'Google ไม่อนุญาตให้เสนอของรางวัล ส่วนลด หรือเงินคืนเพื่อแลกกับรีวิว จึงไม่สามารถใส่ข้อความแบบนี้ในโปสเตอร์ได้ กรุณาลบออก',
  },
}

export function guard(text: string, opts: { review?: boolean } = {}): GuardHit | null {
  if (PRO_ADVICE.test(text) && !opts.review) return { type: 'pro', msg: MESSAGES.pro }
  if (SENSITIVE.test(text)) return { type: 'sens', msg: MESSAGES.sens }
  if (opts.review && LEGALISH.test(text)) return { type: 'legal', msg: MESSAGES.legal }
  return null
}

export function incentiveHit(text: string): GuardHit | null {
  if (!text.trim()) return null
  if (INCENTIVE.test(text)) return { type: 'incentive', msg: MESSAGES.incentive }
  return null
}
