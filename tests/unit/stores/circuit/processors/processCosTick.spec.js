import { describe, it, expect } from 'vitest'
import processCosTick from '../../../../../src/stores/circuit/processors/processCosTick'

describe('processCosTick', () => {
  it('returns undefined for null input', () => {
    const component = { inputs: { SIGNAL_IN: null } }
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    const component = { inputs: { SIGNAL_IN: undefined } }
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for empty string input', () => {
    const component = { inputs: { SIGNAL_IN: '' } }
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })

  it('calculates cosine in radians by default', () => {
    const component = { inputs: { SIGNAL_IN: 0 } }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('calculates cosine in radians when useRadians is true', () => {
    const component = {
      inputs: { SIGNAL_IN: 0 },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('calculates cosine in degrees when useRadians is false', () => {
    const component = {
      inputs: { SIGNAL_IN: 90 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles cosine of 0 radians', () => {
    const component = {
      inputs: { SIGNAL_IN: 0 },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles cosine of π/2 radians', () => {
    const component = {
      inputs: { SIGNAL_IN: Math.PI / 2 },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles cosine of π radians', () => {
    const component = {
      inputs: { SIGNAL_IN: Math.PI },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-1, 10)
  })

  it('handles cosine of 3π/2 radians', () => {
    const component = {
      inputs: { SIGNAL_IN: 3 * Math.PI / 2 },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles cosine of 2π radians', () => {
    const component = {
      inputs: { SIGNAL_IN: 2 * Math.PI },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles cosine of 0 degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: 0 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles cosine of 90 degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: 90 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles cosine of 180 degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: 180 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-1, 10)
  })

  it('handles cosine of 270 degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: 270 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles cosine of 360 degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: 360 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles string numbers', () => {
    const component = {
      inputs: { SIGNAL_IN: '0' },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles string numbers with spaces', () => {
    const component = {
      inputs: { SIGNAL_IN: '  0  ' },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('returns undefined for non-numeric strings', () => {
    const component = { inputs: { SIGNAL_IN: 'test' } }
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for boolean strings', () => {
    const component = { inputs: { SIGNAL_IN: 'true' } }
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })

  it('handles boolean true as 1', () => {
    const component = {
      inputs: { SIGNAL_IN: true },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.cos(1), 10)
  })

  it('handles boolean false as 0', () => {
    const component = {
      inputs: { SIGNAL_IN: false },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles undefined settings', () => {
    const component = { inputs: { SIGNAL_IN: 0 } }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })

  it('clamps result to valid range', () => {
    // Test with very large numbers that might cause precision issues
    const component = {
      inputs: { SIGNAL_IN: 1e10 },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
    expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
  })

  it('handles negative angles', () => {
    const component = {
      inputs: { SIGNAL_IN: -Math.PI },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-1, 10)
  })

  it('handles negative angles in degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: -180 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-1, 10)
  })
})
