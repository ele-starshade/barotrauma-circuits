import { describe, it, expect } from 'vitest'
import processFloorTick from '../../../../../src/stores/circuit/processors/processFloorTick'

describe('processFloorTick', () => {
  it('returns 0 for null input', () => {
    const component = { inputs: { SIGNAL_IN: null } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns 0 for undefined input', () => {
    const component = { inputs: { SIGNAL_IN: undefined } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns 0 for empty string input', () => {
    const component = { inputs: { SIGNAL_IN: '' } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns floor of positive decimal', () => {
    const component = { inputs: { SIGNAL_IN: 10.7 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('returns floor of negative decimal', () => {
    const component = { inputs: { SIGNAL_IN: -10.3 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-11)
  })

  it('returns same integer for integer input', () => {
    const component = { inputs: { SIGNAL_IN: 5 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('returns same negative integer for negative integer input', () => {
    const component = { inputs: { SIGNAL_IN: -5 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-5)
  })

  it('returns 0 for input 0', () => {
    const component = { inputs: { SIGNAL_IN: 0 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns 0 for input 0.9', () => {
    const component = { inputs: { SIGNAL_IN: 0.9 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns -1 for input -0.1', () => {
    const component = { inputs: { SIGNAL_IN: -0.1 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-1)
  })

  it('returns 0 for input 0.999999', () => {
    const component = { inputs: { SIGNAL_IN: 0.999999 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns -1 for input -0.999999', () => {
    const component = { inputs: { SIGNAL_IN: -0.999999 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-1)
  })

  it('handles very large positive numbers', () => {
    const component = { inputs: { SIGNAL_IN: 1e6 + 0.1 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(1000000)
  })

  it('handles very large negative numbers', () => {
    const component = { inputs: { SIGNAL_IN: -1e6 - 0.1 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-1000001)
  })

  it('handles very small positive numbers', () => {
    const component = { inputs: { SIGNAL_IN: 1e-6 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles very small negative numbers', () => {
    const component = { inputs: { SIGNAL_IN: -1e-6 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-1)
  })

  it('handles string numbers', () => {
    const component = { inputs: { SIGNAL_IN: '10.7' } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('handles string numbers with spaces', () => {
    const component = { inputs: { SIGNAL_IN: '  10.7  ' } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('returns input as-is for non-numeric strings', () => {
    const component = { inputs: { SIGNAL_IN: 'hello' } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('returns input as-is for boolean strings', () => {
    const component = { inputs: { SIGNAL_IN: 'true' } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe('true')
  })

  it('handles boolean true as 1', () => {
    const component = { inputs: { SIGNAL_IN: true } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles boolean false as 0', () => {
    const component = { inputs: { SIGNAL_IN: false } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles Infinity', () => {
    const component = { inputs: { SIGNAL_IN: Infinity } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(Infinity)
  })

  it('handles -Infinity', () => {
    const component = { inputs: { SIGNAL_IN: -Infinity } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-Infinity)
  })

  it('handles NaN', () => {
    const component = { inputs: { SIGNAL_IN: NaN } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(NaN)
  })

  it('applies precision with 1 decimal place', () => {
    const component = {
      inputs: { SIGNAL_IN: 10.67 },
      settings: { precision: 1 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('applies precision with 2 decimal places', () => {
    const component = {
      inputs: { SIGNAL_IN: 10.678 },
      settings: { precision: 2 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('applies precision with 0 decimal places (default)', () => {
    const component = {
      inputs: { SIGNAL_IN: 10.67 },
      settings: { precision: 0 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('uses default precision when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN: 10.67 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('clamps to maximum value', () => {
    const component = {
      inputs: { SIGNAL_IN: 20.7 },
      settings: { clampMax: 15 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('does not clamp when result is below maximum', () => {
    const component = {
      inputs: { SIGNAL_IN: 10.7 },
      settings: { clampMax: 15 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('clamps to minimum value', () => {
    const component = {
      inputs: { SIGNAL_IN: -20.3 },
      settings: { clampMin: -15 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-15)
  })

  it('does not clamp when result is above minimum', () => {
    const component = {
      inputs: { SIGNAL_IN: -10.3 },
      settings: { clampMin: -15 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-11)
  })

  it('applies both minimum and maximum clamping', () => {
    const component = {
      inputs: { SIGNAL_IN: 100.7 },
      settings: { clampMin: 0, clampMax: 50 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(50)
  })

  it('applies both minimum and maximum clamping (below minimum)', () => {
    const component = {
      inputs: { SIGNAL_IN: -100.3 },
      settings: { clampMin: -50, clampMax: 0 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(-50)
  })

  it('applies precision before clamping', () => {
    const component = {
      inputs: { SIGNAL_IN: 10.67 },
      settings: { precision: 1, clampMax: 10.5 }
    }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles missing settings object', () => {
    const component = { inputs: { SIGNAL_IN: 10.7 } }
    const result = processFloorTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })
})
