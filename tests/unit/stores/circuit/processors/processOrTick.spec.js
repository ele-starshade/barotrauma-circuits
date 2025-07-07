import { describe, it, expect } from 'vitest'
import processOrTick from '../../../../../src/stores/circuit/processors/processOrTick'

describe('processOrTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10,
      output: '1',
      falseOutput: '0',
      maxOutputLength: 10
    }
  }

  it('should output true when both inputs are truthy and within timeframe', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processOrTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output true when one input is truthy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processOrTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output false when both inputs are falsy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processOrTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output true when timeframe is exceeded but one signal is present and truthy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processOrTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output false when timeframe is exceeded and both signals are falsy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processOrTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should handle different truthy values', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processOrTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })
})
