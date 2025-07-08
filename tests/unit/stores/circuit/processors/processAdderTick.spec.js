import { describe, it, expect } from 'vitest'
import processAdderTick from '../../../../../src/stores/circuit/processors/processAdderTick'

describe('processAdderTick', () => {
  it('adds two positive numbers correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('adds two negative numbers correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: -5, SIGNAL_IN_2: -10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(-15)
  })

  it('adds positive and negative numbers correctly', () => {
    const component = { inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: -3 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(7)
  })

  it('handles zero inputs', () => {
    const component = { inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles one zero input', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 0 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('handles decimal numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: 3.5, SIGNAL_IN_2: 2.7 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(6.2, 10)
  })

  it('handles string numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: '5', SIGNAL_IN_2: '10' } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('handles string numbers with spaces', () => {
    const component = { inputs: { SIGNAL_IN_1: '  5  ', SIGNAL_IN_2: '  10  ' } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('returns first input as-is when second input is non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('returns first input as-is when first input is non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('returns first input as-is when both inputs are non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('treats null inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('treats undefined inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: 10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('treats empty string inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('handles both inputs as null', () => {
    const component = { inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: null } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as undefined', () => {
    const component = { inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: undefined } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as empty strings', () => {
    const component = { inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: '' } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('clamps to maximum value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 10 },
      settings: { clampMax: 15 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('does not clamp when sum is below maximum', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 5 },
      settings: { clampMax: 15 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('clamps to minimum value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -10, SIGNAL_IN_2: -10 },
      settings: { clampMin: -15 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(-15)
  })

  it('does not clamp when sum is above minimum', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -5, SIGNAL_IN_2: -5 },
      settings: { clampMin: -15 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(-10)
  })

  it('applies both minimum and maximum clamping', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 200 },
      settings: { clampMin: 0, clampMax: 250 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(250)
  })

  it('applies both minimum and maximum clamping (below minimum)', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -100, SIGNAL_IN_2: -200 },
      settings: { clampMin: -250, clampMax: 0 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(-250)
  })

  it('handles timeframe averaging', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
      settings: { timeFrame: 1, clampMin: -1000, clampMax: 1000 }
    }

    // Simulate 3 ticks: 2 with sum 12, 1 with sum 0, all within 1s
    const now = Date.now()

    component.signalHistory = [
      { value: 12, timestamp: now - 500 },
      { value: 12, timestamp: now - 300 },
      { value: 0, timestamp: now - 100 }
    ]

    const result = processAdderTick(component)

    // Average: (12 + 12 + 0 + 12) / 4 = 9
    expect(result.SIGNAL_OUT).toBeCloseTo(9, 10)
  })

  it('only considers entries within timeframe window', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
      settings: { timeFrame: 1, clampMin: -1000, clampMax: 1000 }
    }

    // Simulate 2 old (outside window) and 1 recent (inside window)
    const now = Date.now()

    component.signalHistory = [
      { value: 0, timestamp: now - 2000 }, // outside window
      { value: 0, timestamp: now - 1500 }, // outside window
      { value: 12, timestamp: now - 500 } // inside window
    ]

    const result = processAdderTick(component)

    // Only 2 entries in window: 12 (from history) and 12 (current)
    expect(result.SIGNAL_OUT).toBeCloseTo(12, 10)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles missing settings object', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 } }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })
})
