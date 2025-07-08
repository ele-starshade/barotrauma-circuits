import { describe, it, expect } from 'vitest'
import processGreaterTick from '../../../../../src/stores/circuit/processors/processGreaterTick'

describe('processGreaterTick', () => {
  it('returns 1 when first input is greater than second', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('returns 0 when first input is less than second', () => {
    const component = { inputs: { SIGNAL_IN_1: 3, SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns 0 when inputs are equal', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles negative numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: -3, SIGNAL_IN_2: -5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles decimal numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: 5.5, SIGNAL_IN_2: 5.4 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles zero inputs', () => {
    const component = { inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles positive vs zero', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 0 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles zero vs positive', () => {
    const component = { inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles negative vs zero', () => {
    const component = { inputs: { SIGNAL_IN_1: -5, SIGNAL_IN_2: 0 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles zero vs negative', () => {
    const component = { inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: -5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles string numbers', () => {
    const component = { inputs: { SIGNAL_IN_1: '5', SIGNAL_IN_2: '3' } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles string numbers with spaces', () => {
    const component = { inputs: { SIGNAL_IN_1: '  5  ', SIGNAL_IN_2: '  3  ' } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('returns 0 when first input is non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 3 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns 0 when second input is non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('returns 0 when both inputs are non-numeric', () => {
    const component = { inputs: { SIGNAL_IN_1: 'hello', SIGNAL_IN_2: 'world' } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('treats null inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('treats undefined inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('treats empty string inputs as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as null', () => {
    const component = { inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: null } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as undefined', () => {
    const component = { inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: undefined } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles both inputs as empty strings', () => {
    const component = { inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: '' } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles Infinity vs finite number', () => {
    const component = { inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: 1000 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles finite number vs Infinity', () => {
    const component = { inputs: { SIGNAL_IN_1: 1000, SIGNAL_IN_2: Infinity } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles -Infinity vs finite number', () => {
    const component = { inputs: { SIGNAL_IN_1: -Infinity, SIGNAL_IN_2: -1000 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles finite number vs -Infinity', () => {
    const component = { inputs: { SIGNAL_IN_1: -1000, SIGNAL_IN_2: -Infinity } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles Infinity vs Infinity', () => {
    const component = { inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: Infinity } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles -Infinity vs -Infinity', () => {
    const component = { inputs: { SIGNAL_IN_1: -Infinity, SIGNAL_IN_2: -Infinity } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles Infinity vs -Infinity', () => {
    const component = { inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: -Infinity } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles -Infinity vs Infinity', () => {
    const component = { inputs: { SIGNAL_IN_1: -Infinity, SIGNAL_IN_2: Infinity } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('outputs boolean when outputFormat is boolean', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
      settings: { outputFormat: 'boolean' }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(true)
  })

  it('outputs boolean false when outputFormat is boolean and not greater', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 3, SIGNAL_IN_2: 5 },
      settings: { outputFormat: 'boolean' }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(false)
  })

  it('outputs numeric by default', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('outputs numeric when outputFormat is numeric', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
      settings: { outputFormat: 'numeric' }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('applies SET_OUTPUT override when condition is met', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3, SET_OUTPUT: 'OVERRIDE' }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe('OVERRIDE')
  })

  it('does not apply SET_OUTPUT override when condition is not met', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 3, SIGNAL_IN_2: 5, SET_OUTPUT: 'OVERRIDE' }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('does not apply SET_OUTPUT override when SET_OUTPUT is null', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3, SET_OUTPUT: null }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('does not apply SET_OUTPUT override when SET_OUTPUT is undefined', () => {
    const component = {
      inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3, SET_OUTPUT: undefined }
    }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles boolean true as 1', () => {
    const component = { inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: false } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles boolean false as 0', () => {
    const component = { inputs: { SIGNAL_IN_1: false, SIGNAL_IN_2: true } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles missing settings object', () => {
    const component = { inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles when only one input is provided', () => {
    const component = { inputs: { SIGNAL_IN_1: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('handles when only second input is provided', () => {
    const component = { inputs: { SIGNAL_IN_2: 5 } }
    const result = processGreaterTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
