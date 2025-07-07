import { describe, it, expect } from 'vitest'
import processMultiplyTick from '../../../../../src/stores/circuit/processors/processMultiplyTick'

describe('processMultiplyTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10
    }
  }

  it('should multiply two numbers correctly', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processMultiplyTick(component)

    expect(result.SIGNAL_OUT).toBe(50)
  })

  it('should not output if timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processMultiplyTick(component)

    expect(result).toBeUndefined()
  })

  it('should clamp the result to the max value', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMax: 50 }
    }
    const result = processMultiplyTick(component)

    expect(result.SIGNAL_OUT).toBe(50)
  })

  it('should clamp the result to the min value', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMin: 30 }
    }
    const result = processMultiplyTick(component)

    expect(result.SIGNAL_OUT).toBe(30)
  })

  it('should return undefined if signals are missing', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processMultiplyTick(component)

    expect(result).toBeUndefined()
  })

  it('should handle multiplication by zero', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processMultiplyTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
