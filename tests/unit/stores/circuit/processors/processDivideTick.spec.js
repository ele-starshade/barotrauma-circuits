import { describe, it, expect } from 'vitest'
import processDivideTick from '../../../../../src/stores/circuit/processors/processDivideTick'

describe('processDivideTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10
    }
  }

  it('should divide two numbers correctly', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('5')
  })

  it('should return 0 when dividing by zero', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should not output if timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processDivideTick(component)

    expect(result).toBeUndefined()
  })

  it('should clamp the result to the max value', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 20, SIGNAL_IN_2: 2 }, // 10
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMax: 8 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('8')
  })

  it('should clamp the result to the min value', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 5 }, // 2
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMin: 3 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('3')
  })

  it('should return undefined if signals are missing', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processDivideTick(component)

    expect(result).toBeUndefined()
  })

  it('should return 0 when dividing 0 by a non-zero number', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processDivideTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })
})
