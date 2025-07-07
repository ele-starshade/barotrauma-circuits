import { describe, it, expect } from 'vitest'
import processGreaterTick from '../../../../../src/stores/circuit/processors/processGreaterTick'

describe('processGreaterTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10,
      output: '1',
      falseOutput: '0',
      maxOutputLength: 10
    }
  }

  it('should output true when SIGNAL_IN_1 > SIGNAL_IN_2 and within timeframe', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output false when SIGNAL_IN_1 is not > SIGNAL_IN_2', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output false when signals are equal', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output false when timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should correctly compare string numbers', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: '100', SIGNAL_IN_2: '20' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output false if one signal is missing', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })
})
