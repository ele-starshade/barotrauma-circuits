import { describe, it, expect } from 'vitest'
import processEqualsTick from '../../../../../src/stores/circuit/processors/processEqualsTick'

describe('processEqualsTick', () => {
  it('outputs true when inputs are equal', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 10 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('outputs false when inputs are not equal', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 5 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles numeric equality', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 42, SIGNAL_IN_2: 42 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles string equality', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'hello' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles boolean equality', () => {
    const component = {
      inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: true },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles null equality', () => {
    const component = {
      inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: null },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles undefined equality', () => {
    const component = {
      inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: undefined },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles null vs undefined as not equal', () => {
    const component = {
      inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: undefined },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles null vs other values as not equal', () => {
    const component = {
      inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 0 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles undefined vs other values as not equal', () => {
    const component = {
      inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: '' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles tolerance for floating-point numbers', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5.1, SIGNAL_IN_2: 5.0 },
      settings: { tolerance: 0.1, output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles tolerance for floating-point numbers (not within tolerance)', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5.2, SIGNAL_IN_2: 5.0 },
      settings: { tolerance: 0.1, output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles tolerance with zero tolerance', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5.1, SIGNAL_IN_2: 5.0 },
      settings: { tolerance: 0, output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles mixed type comparison with numeric conversion', () => {
    const component = {
      inputs: { SIGNAL_IN_1: '10', SIGNAL_IN_2: 10 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles mixed type comparison with string conversion', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 42, SIGNAL_IN_2: '42' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles mixed type comparison with tolerance', () => {
    const component = {
      inputs: { SIGNAL_IN_1: '5.1', SIGNAL_IN_2: 5.0 },
      settings: { tolerance: 0.1, output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles mixed type comparison with non-numeric strings', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 42 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('overrides normal logic when SET_OUTPUT is provided', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0, SET_OUTPUT: 'OVERRIDE' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('OVERRIDE')
  })

  it('applies maxOutputLength to SET_OUTPUT', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0, SET_OUTPUT: 'LONG_OVERRIDE' },
      settings: { output: '1', falseOutput: '0', maxOutputLength: 5 }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('LONG_')
  })

  it('does not override when SET_OUTPUT is null', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1, SET_OUTPUT: null },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('does not override when SET_OUTPUT is undefined', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1, SET_OUTPUT: undefined },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('does not override when SET_OUTPUT is empty string', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1, SET_OUTPUT: '' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('uses default output values when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('uses custom output values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'EQUAL', falseOutput: 'NOT_EQUAL' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('EQUAL')
  })

  it('uses custom false output values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 2 },
      settings: { output: 'EQUAL', falseOutput: 'NOT_EQUAL' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('NOT_EQUAL')
  })

  it('applies maxOutputLength to normal output', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'VERY_LONG_OUTPUT', falseOutput: '0', maxOutputLength: 5 }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('VERY_')
  })

  it('applies maxOutputLength to false output', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 2 },
      settings: { output: '1', falseOutput: 'VERY_LONG_FALSE_OUTPUT', maxOutputLength: 5 }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('VERY_')
  })

  it('does not apply maxOutputLength when set to 0', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'LONG_OUTPUT', falseOutput: '0', maxOutputLength: 0 }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('LONG_OUTPUT')
  })

  it('does not apply maxOutputLength when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'LONG_OUTPUT', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('LONG_OUTPUT')
  })

  it('handles timeframe averaging', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { timeFrame: 1, output: '1', falseOutput: '0' }
    }

    // Simulate 3 ticks: 2 with true, 1 with false, all within 1s
    const now = Date.now()

    component.signalHistory = [
      { value: 1, timestamp: now - 500 },
      { value: 1, timestamp: now - 300 },
      { value: 0, timestamp: now - 100 }
    ]

    const result = processEqualsTick(component)

    // Average: (1 + 1 + 0 + 1) / 4 = 0.75 > 0.5, so true
    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles timeframe averaging with false result', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 2 },
      settings: { timeFrame: 1, output: '1', falseOutput: '0' }
    }

    // Simulate 3 ticks: 2 with false, 1 with true, all within 1s
    const now = Date.now()

    component.signalHistory = [
      { value: 0, timestamp: now - 500 },
      { value: 0, timestamp: now - 300 },
      { value: 1, timestamp: now - 100 }
    ]

    const result = processEqualsTick(component)

    // Average: (0 + 0 + 1 + 0) / 4 = 0.25 <= 0.5, so false
    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('stores result in component.value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(component.value).toBe('1')
    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles missing inputs object', () => {
    const component = {
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles missing settings object', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles when only one input is provided', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles when only second input is provided', () => {
    const component = {
      inputs: { SIGNAL_IN_2: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })
})
