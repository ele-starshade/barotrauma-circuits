import { describe, it, expect } from 'vitest'
import processConcatenationTick from '../../../../../src/stores/circuit/processors/processConcatenationTick'

describe('processConcatenationTick', () => {
  const baseComponent = {
    settings: {
      timeframe: 10,
      separator: '-',
      maxOutputLength: 20
    }
  }

  it('should concatenate two strings with a separator', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello-world')
  })

  it('should handle number inputs', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 123, SIGNAL_IN_2: 456 },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('123-456')
  })

  it('should truncate the output to maxOutputLength', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'longstringone', SIGNAL_IN_2: 'longstringtwo' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, maxOutputLength: 10 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('longstring')
  })

  it('should not output if timeframe is exceeded', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'a', SIGNAL_IN_2: 'b' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    }
    const result = processConcatenationTick(component)

    expect(result).toBeUndefined()
  })

  it('should handle an empty separator', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 },
      settings: { ...baseComponent.settings, separator: '' }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('helloworld')
  })

  it('should return undefined if a signal is missing', () => {
    const component = {
      ...baseComponent,
      inputs: { SIGNAL_IN_1: 'hello' },
      lastSignalTimestamps: { SIGNAL_IN_1: 100 }
    }
    const result = processConcatenationTick(component)

    expect(result).toBeUndefined()
  })
})
