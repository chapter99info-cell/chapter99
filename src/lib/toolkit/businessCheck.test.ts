import { describe, expect, it } from 'vitest'
import { scoreBusinessCheck } from './businessCheck'

describe('scoreBusinessCheck', () => {
  it('scores a perfect 16 as strong', () => {
    const r = scoreBusinessCheck([2, 2, 2, 2, 2, 2, 2, 2])
    expect(r.score).toBe(16)
    expect(r.pct).toBe(100)
    expect(r.cat).toBe('s')
    expect(r.gaps).toHaveLength(0)
    expect(r.topSteps).toHaveLength(1)
  })

  it('picks the weakest three gaps first', () => {
    const r = scoreBusinessCheck([2, 0, 1, 2, 0, 2, 1, 2])
    expect(r.score).toBe(10)
    expect(r.cat).toBe('o')
    expect(r.topSteps).toHaveLength(3)
    expect(r.gaps.map((g) => g.k)).toEqual(['web', 'svc', 'pay', 'con'])
  })

  it('flags needs attention below 8', () => {
    const r = scoreBusinessCheck([0, 0, 0, 1, 0, 0, 1, 0])
    expect(r.score).toBe(2)
    expect(r.cat).toBe('n')
  })
})
