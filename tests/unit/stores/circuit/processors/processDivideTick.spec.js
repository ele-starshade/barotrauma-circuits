import { describe, it, expect } from 'vitest'
import processDivideTick from '../../../../../src/stores/circuit/processors/processDivideTick'

describe('processDivideTick', () => {
  it('divides two positive numbers correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('divides two negative numbers correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: -10, SIGNAL_IN_2: -2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('divides positive by negative correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: -2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(-5)
  })

  it('divides negative by positive correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: -10, SIGNAL_IN_2: 2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(-5)
  })

  it('handles decimal division', () => {
    const component = { inputs: { SIGNAL_IN_1: 15, SIGNAL_IN_2: 4 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(3.75)
  })

  it('handles division by zero', () => {
    const component = { inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 0 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles zero divided by number', () => {
    const component = { inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 5 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles zero divided by zero', () => {
    const component = { inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles string numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: '10', SIGNAL_IN_2: '2' } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('handles string numbers with spaces', () => {
    const component = { inputs: { SIGNAL_IN_1: '  10  ', SIGNAL_IN_2: '  2  ' } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('returns first input as-is when second input is non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('returns first input as-is when first input is non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 10 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('returns first input as-is when both inputs are non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('treats null inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 10 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('treats undefined inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: 10 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('treats empty string inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 10 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as null', () => {
    const component = { inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: null } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as undefined', () => {
    const component = { inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: undefined } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as empty strings', () => {
    const component = { inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: '' } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('clamps to maximum value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 20, SIGNAL_IN_2: 2 },
      settings: { clampMax: 8 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(8)
  })

  it('does not clamp when result is below maximum', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
      settings: { clampMax: 8 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('clamps to minimum value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -20, SIGNAL_IN_2: 2 },
      settings: { clampMin: -8 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(-8)
  })

  it('does not clamp when result is above minimum', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -10, SIGNAL_IN_2: 2 },
      settings: { clampMin: -8 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(-5)
  })

  it('applies both minimum and maximum clamping', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 2 },
      settings: { clampMin: 0, clampMax: 50 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(50)
  })

  it('applies both minimum and maximum clamping (below minimum)', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -100, SIGNAL_IN_2: 2 },
      settings: { clampMin: -50, clampMax: 0 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(-50)
  })

  it('handles timeframe averaging', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 20, SIGNAL_IN_2: 2 },
      settings: { timeFrame: 1, clampMin: -1000, clampMax: 1000 }
    }

    // Simulate 3 ticks: 2 with quotient 10, 1 with quotient 0, all within 1s
    const now = Date.now()

    component.signalHistory = [
      { value: 10, timestamp: now - 500 },
      { value: 10, timestamp: now - 300 },
      { value: 0, timestamp: now - 100 }
    ]

    const result = processDivideTick(component)

    // Average: (10 + 10 + 0 + 10) / 4 = 7.5
    expect(result.SIGNAL_OUT).toBeCloseTo(7.5, 10)
  })

  it('only considers entries within timeframe window', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 20, SIGNAL_IN_2: 2 },
      settings: { timeFrame: 1, clampMin: -1000, clampMax: 1000 }
    }

    // Simulate 2 old (outside window) and 1 recent (inside window)
    const now = Date.now()

    component.signalHistory = [
      { value: 0, timestamp: now - 2000 }, // outside window
      { value: 0, timestamp: now - 1500 }, // outside window
      { value: 10, timestamp: now - 500 } // inside window
    ]

    const result = processDivideTick(component)

    // Only 2 entries in window: 10 (from history) and 10 (current)
    expect(result.SIGNAL_OUT).toBeCloseTo(10, 10)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles missing settings object', () => {
    const component = { inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('handles very large numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: 1e6, SIGNAL_IN_2: 1e3 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(1000)
  })

  it('handles very small numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: 1e-6, SIGNAL_IN_2: 1e-3 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0.001)
  })

  it('handles boolean true as 1', () => {
    const component = { inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: 2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0.5)
  })

  it('handles boolean false as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: false, SIGNAL_IN_2: 2 } }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
