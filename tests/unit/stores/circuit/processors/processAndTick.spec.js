import { describe, it, expect } from 'vitest'
import processAndTick from '../../../../../src/stores/circuit/processors/processAndTick'

describe('processAndTick', () => {
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
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output false when one input is falsy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output false when both inputs are falsy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output false when timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should handle one signal being present but truthy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should handle different truthy values', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should handle different falsy values', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processAndTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })
})
