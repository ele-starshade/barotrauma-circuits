import { describe, it, expect } from 'vitest'
import processXorTick from '../../../../../src/stores/circuit/processors/processXorTick'

describe('processXorTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10,
      output: '1',
      falseOutput: '0',
      maxOutputLength: 10
    }
  }

  it('should output true when one input is truthy and the other is falsy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output false when both inputs are truthy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output false when both inputs are falsy', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output false when timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output true if one signal is missing (evaluates as falsy)', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should handle different truthy/falsy values', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: '' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output empty string if falseOutput is undefined', () => {
    const component = {
      ...baseComponent,
      settings: { ...baseComponent.settings, falseOutput: undefined },
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output empty string if falseOutput is empty string', () => {
    const component = {
      ...baseComponent,
      settings: { ...baseComponent.settings, falseOutput: '' },
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 1 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output empty string if SET_OUTPUT and output are both undefined', () => {
    const component = {
      ...baseComponent,
      settings: { ...baseComponent.settings, output: undefined },
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }

    delete component.inputs.SET_OUTPUT
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output empty string if SET_OUTPUT and output are both empty string', () => {
    const component = {
      ...baseComponent,
      settings: { ...baseComponent.settings, output: '' },
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0, SET_OUTPUT: '' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output empty string if output is undefined', () => {
    const component = {
      ...baseComponent,
      settings: { ...baseComponent.settings, output: undefined },
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }

    delete component.inputs.SET_OUTPUT
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output empty string if output is empty string', () => {
    const component = {
      ...baseComponent,
      settings: { ...baseComponent.settings, output: '' },
      inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }

    delete component.inputs.SET_OUTPUT
    const result = processXorTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })
})
