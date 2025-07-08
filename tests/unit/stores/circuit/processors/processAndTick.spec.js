import { describe, it, expect } from 'vitest'
import processAndTick from '../../../../../src/stores/circuit/processors/processAndTick'

describe('processAndTick', () => {
  it('outputs true when both inputs are truthy', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('outputs false when first input is falsy', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('outputs false when second input is falsy', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('outputs false when both inputs are falsy', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles numeric truthy values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles numeric falsy values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles string truthy values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles string falsy values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: '' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles boolean true values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: true },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles boolean false values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: false, SIGNAL_IN_2: false },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles common truthy string values', () => {
    const testCases = ['true', '1', 'yes', 'on']

    testCases.forEach(value => {
      const component = {
        inputs: { SIGNAL_IN_1: value, SIGNAL_IN_2: value },
        settings: { output: '1', falseOutput: '0' }
      }
      const result = processAndTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })
  })

  it('handles common falsy string values', () => {
    const testCases = ['false', '0', 'no', 'off']

    testCases.forEach(value => {
      const component = {
        inputs: { SIGNAL_IN_1: value, SIGNAL_IN_2: 'active' },
        settings: { output: '1', falseOutput: '0' }
      }
      const result = processAndTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  it('handles case-insensitive string values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'TRUE', SIGNAL_IN_2: 'YES' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('overrides normal logic when SET_OUTPUT is provided', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0, SET_OUTPUT: 'OVERRIDE' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('OVERRIDE')
  })

  it('applies maxOutputLength to SET_OUTPUT', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0, SET_OUTPUT: 'LONG_OVERRIDE' },
      settings: { output: '1', falseOutput: '0', maxOutputLength: 5 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('LONG_')
  })

  it('does not override when SET_OUTPUT is null', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1, SET_OUTPUT: null },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('does not override when SET_OUTPUT is undefined', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1, SET_OUTPUT: undefined },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('does not override when SET_OUTPUT is empty string', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1, SET_OUTPUT: '' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('uses default output values when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('uses custom output values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'ACTIVE', falseOutput: 'INACTIVE' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('ACTIVE')
  })

  it('uses custom false output values', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 1 },
      settings: { output: 'ACTIVE', falseOutput: 'INACTIVE' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('INACTIVE')
  })

  it('applies maxOutputLength to normal output', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'VERY_LONG_OUTPUT', falseOutput: '0', maxOutputLength: 5 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('VERY_')
  })

  it('applies maxOutputLength to false output', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 1 },
      settings: { output: '1', falseOutput: 'VERY_LONG_FALSE_OUTPUT', maxOutputLength: 5 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('VERY_')
  })

  it('does not apply maxOutputLength when set to 0', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'LONG_OUTPUT', falseOutput: '0', maxOutputLength: 0 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('LONG_OUTPUT')
  })

  it('does not apply maxOutputLength when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      settings: { output: 'LONG_OUTPUT', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('LONG_OUTPUT')
  })

  it('handles null inputs', () => {
    const component = {
      inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: null },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles undefined inputs', () => {
    const component = {
      inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: undefined },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles missing inputs', () => {
    const component = {
      inputs: {},
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles when inputs object is not present', () => {
    const component = {
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles when settings object is not present', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles when only one input is provided', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles when only second input is provided', () => {
    const component = {
      inputs: { SIGNAL_IN_2: 1 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('handles mixed input types', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles mixed boolean and numeric inputs', () => {
    const component = {
      inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: 10 },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles mixed boolean and string inputs', () => {
    const component = {
      inputs: { SIGNAL_IN_1: false, SIGNAL_IN_2: 'active' },
      settings: { output: '1', falseOutput: '0' }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
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

    const result = processAndTick(component)

    // Average: (1 + 1 + 0 + 1) / 4 = 0.75 > 0.5, so true
    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles timeframe averaging with false result', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      settings: { timeFrame: 1, output: '1', falseOutput: '0' }
    }

    // Simulate 3 ticks: 2 with false, 1 with true, all within 1s
    const now = Date.now()

    component.signalHistory = [
      { value: 0, timestamp: now - 500 },
      { value: 0, timestamp: now - 300 },
      { value: 1, timestamp: now - 100 }
    ]

    const result = processAndTick(component)

    // Average: (0 + 0 + 1 + 0) / 4 = 0.25 <= 0.5, so false
    expect(result.SIGNAL_OUT).toBe('0')
  })
})
