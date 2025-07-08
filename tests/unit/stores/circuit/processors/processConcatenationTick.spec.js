import { describe, it, expect } from 'vitest'
import processConcatenationTick from '../../../../../src/stores/circuit/processors/processConcatenationTick'

describe('processConcatenationTick', () => {
  it('concatenates two strings with default separator', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'mud', SIGNAL_IN_2: 'raptor' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('mud+raptor')
  })

  it('concatenates two numbers with space separator', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 1250, SIGNAL_IN_2: 450 },
      settings: { separator: ' ', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('1250 450')
  })

  it('uses default separator when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      settings: { maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello+world')
  })

  it('handles empty first input', () => {
    const component = {
      inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 'world' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('world')
  })

  it('handles empty second input', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: '' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('handles both inputs empty', () => {
    const component = {
      inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: '' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('handles null inputs as empty strings', () => {
    const component = {
      inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 'world' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('world')
  })

  it('handles undefined inputs as empty strings', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: undefined },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('handles boolean true as "1"', () => {
    const component = {
      inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('1+test')
  })

  it('handles boolean false as "0"', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'test', SIGNAL_IN_2: false },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('test+0')
  })

  it('handles numbers', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 42, SIGNAL_IN_2: 3.14 },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('42+3.14')
  })

  it('handles NaN as empty string', () => {
    const component = {
      inputs: { SIGNAL_IN_1: NaN, SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('test')
  })

  it('handles Infinity as empty string', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'test', SIGNAL_IN_2: Infinity },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('test')
  })

  it('handles -Infinity as empty string', () => {
    const component = {
      inputs: { SIGNAL_IN_1: -Infinity, SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('test')
  })

  it('handles objects as JSON strings', () => {
    const component = {
      inputs: { SIGNAL_IN_1: { key: 'value' }, SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('{"key":"value"}+test')
  })

  it('handles arrays as JSON strings', () => {
    const component = {
      inputs: { SIGNAL_IN_1: [1, 2, 3], SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('[1,2,3]+test')
  })

  it('handles circular objects as [Object]', () => {
    const obj = { key: 'value' }

    obj.self = obj
    const component = {
      inputs: { SIGNAL_IN_1: obj, SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('[Object]+test')
  })

  it('handles functions as strings', () => {
    const fn = () => 'test'
    const component = {
      inputs: { SIGNAL_IN_1: fn, SIGNAL_IN_2: 'world' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('() => \'test\'+world')
  })

  it('applies maxOutputLength limit', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'very long string', SIGNAL_IN_2: 'another long string' },
      settings: { separator: '+', maxOutputLength: 10 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('very long ')
  })

  it('uses default maxOutputLength when not specified', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      settings: { separator: '+' }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello+world')
  })

  it('handles timeframe processing', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      settings: { separator: '+', maxOutputLength: 256, timeFrame: 1 }
    }

    // Simulate previous history
    const now = Date.now()

    component.signalHistory = [
      { value: 'old+value', timestamp: now - 500 },
      { value: 'new+value', timestamp: now - 100 }
    ]

    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello+world')
  })

  it('handles timeframe with old entries outside window', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      settings: { separator: '+', maxOutputLength: 256, timeFrame: 1 }
    }

    // Simulate old history outside time window
    const now = Date.now()

    component.signalHistory = [
      { value: 'old+value', timestamp: now - 2000 }, // outside window
      { value: 'new+value', timestamp: now - 100 } // inside window
    ]

    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello+world')
  })

  it('handles missing inputs object', () => {
    const component = {
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('handles missing settings object', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('hello+world')
  })

  it('stores result in component.value', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(component.value).toBe('hello+world')
    expect(result.SIGNAL_OUT).toBe('hello+world')
  })

  it('handles string numbers', () => {
    const component = {
      inputs: { SIGNAL_IN_1: '123', SIGNAL_IN_2: '456' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('123+456')
  })

  it('handles mixed types', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 42, SIGNAL_IN_2: 'test' },
      settings: { separator: '+', maxOutputLength: 256 }
    }
    const result = processConcatenationTick(component)

    expect(result.SIGNAL_OUT).toBe('42+test')
  })
})
