import { describe, expect, it } from 'vitest'
import { INCENTIVE, LEGALISH, PRO_ADVICE, SENSITIVE, guard, incentiveHit } from './guards'

describe('PRO_ADVICE', () => {
  it('blocks tax and legal requests', () => {
    expect(PRO_ADVICE.test('Please write tax advice for my shop')).toBe(true)
    expect(PRO_ADVICE.test('draft a privacy policy')).toBe(true)
    expect(PRO_ADVICE.test('ทำสัญญาจ้างพนักงาน')).toBe(true)
    expect(guard('I need GST legal advice')?.type).toBe('pro')
  })
  it('does not treat a booking confirm as professional advice', () => {
    expect(guard('Please confirm the booking on Friday')?.type).toBeUndefined()
  })
})

describe('SENSITIVE', () => {
  it('does not trigger on อยาก / อยากจอง', () => {
    expect(SENSITIVE.test('อยาก')).toBe(false)
    expect(SENSITIVE.test('อยากจอง')).toBe(false)
    expect(guard('อยากจองคิววันศุกร์')).toBeNull()
  })
  it('blocks health and ID terms including Thai compounds', () => {
    expect(SENSITIVE.test('กินยาประจำ')).toBe(true)
    expect(SENSITIVE.test('ทานยา')).toBe(true)
    expect(SENSITIVE.test('passport number')).toBe(true)
    expect(guard('ลูกค้ากินยาประจำ')?.type).toBe('sens')
  })
})

describe('LEGALISH', () => {
  it('blocks serious legal review wording only in review mode', () => {
    expect(LEGALISH.test('I will sue and call a lawyer')).toBe(true)
    expect(guard('I will sue', { review: true })?.type).toBe('legal')
    expect(guard('I will sue')?.type).not.toBe('legal')
  })
})

describe('INCENTIVE', () => {
  it('blocks review-for-reward wording', () => {
    expect(INCENTIVE.test('10% off for a review')).toBe(true)
    expect(INCENTIVE.test('ฟรีถ้ามาเขียนรีวิว')).toBe(true)
    expect(incentiveHit('Leave a review for a free gift')?.type).toBe('incentive')
    expect(incentiveHit('Your feedback helps us grow')).toBeNull()
  })
})
