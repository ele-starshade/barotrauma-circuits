import { describe, it, expect } from 'vitest'
import processSubtractTick from '../../../../../src/stores/circuit/processors/processSubtractTick'

describe('processSubtractTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10
    }
  }

  it('should subtract two numbers correctly', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(7)
  })

  it('should not output if timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processSubtractTick(component)

    expect(result).toBeUndefined()
  })

  it('should clamp the result to the max value', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 }, // 8
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMax: 5 }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('should clamp the result to the min value', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 }, // 2
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMin: 4 }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(4)
  })

  it('should return undefined if signals are missing', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processSubtractTick(component)

    expect(result).toBeUndefined()
  })

  it('should handle negative results', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(-5)
  })

  it('should not clamp when clampMin is undefined', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMin: undefined }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(2)
  })

  it('should not clamp when clampMax and clampMin are both undefined', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 8, SIGNAL_IN_2: 3 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, clampMax: undefined, clampMin: undefined }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('should process even if timeframe is 0.0', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 9999 },
      settings: { ...baseComponent.settings, timeframe: 0.0 }
    }
    const result = processSubtractTick(component)

    expect(result.SIGNAL_OUT).toBe(7)
  })
})
