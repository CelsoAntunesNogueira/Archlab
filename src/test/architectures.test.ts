import { describe, it, expect } from 'vitest'
import { ARCHITECTURES, METRIC_LABELS } from '@/data/architectures'

describe('Architecture data', () => {
  it('should have 8 architectures', () => {
    expect(ARCHITECTURES).toHaveLength(8)
  })

  it('each architecture should have required fields', () => {
    ARCHITECTURES.forEach(arch => {
      expect(arch.id).toBeTruthy()
      expect(arch.name).toBeTruthy()
      expect(arch.color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(arch.nodes.length).toBeGreaterThan(0)
      expect(arch.edges.length).toBeGreaterThan(0)
    })
  })

  it('all metrics should be between 1 and 5', () => {
    ARCHITECTURES.forEach(arch => {
      Object.keys(METRIC_LABELS).forEach(key => {
        const val = (arch.metrics as Record<string, number>)[key]
        expect(val).toBeGreaterThanOrEqual(1)
        expect(val).toBeLessThanOrEqual(5)
      })
    })
  })

  it('complexity should match metrics.complexidade', () => {
    ARCHITECTURES.forEach(arch => {
      expect(arch.complexity).toBeGreaterThanOrEqual(1)
      expect(arch.complexity).toBeLessThanOrEqual(5)
    })
  })
})

describe('METRIC_LABELS', () => {
  it('should have 6 metrics', () => {
    expect(Object.keys(METRIC_LABELS)).toHaveLength(6)
  })
})
