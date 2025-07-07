import { describe, it, expect } from 'vitest'
import processAdderTick from '../../../../../src/stores/circuit/processors/processAdderTick'

describe('processAdderTick', () => {
  it('should add two numbers correctly', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { timeframe: 10 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('should clamp the sum to the max value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { timeframe: 10, clampMax: 15 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('should clamp the sum to the min value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -10, SIGNAL_IN_2: -10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { timeframe: 10, clampMin: -15 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(-15)
  })

  it('should not output if timeframe is exceeded', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 },
      settings: { timeframe: 10 }
    }
    const result = processAdderTick(component)

    expect(result).toBeUndefined()
  })

  it('should output if timeframe is 0 (disabled)', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 1000 },
      settings: { timeframe: 0.0 }
    }
    const result = processAdderTick(component)

    expect(result.SIGNAL_OUT).toBe(15)
  })

  it('should return undefined if signals are missing', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 },
      settings: { timeframe: 10 }
    }
    const result = processAdderTick(component)

    expect(result).toBeUndefined()
  })
})
