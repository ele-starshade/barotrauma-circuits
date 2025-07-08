import { describe, it, expect } from 'vitest'
import processAbsTick from '../../../../../src/stores/circuit/processors/processAbsTick'

describe('processAbsTick', () => {
  it('returns undefined for null input', () => {
    const component = { inputs: { SIGNAL_IN: null } }
    const result = processAbsTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    const component = { inputs: { SIGNAL_IN: undefined } }
    const result = processAbsTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for empty string input', () => {
    const component = { inputs: { SIGNAL_IN: '' } }
    const result = processAbsTick(component)

    expect(result).toBeUndefined()
  })

  it('returns absolute value for positive number', () => {
    const component = { inputs: { SIGNAL_IN: 42 } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(42)
  })

  it('returns absolute value for negative number', () => {
    const component = { inputs: { SIGNAL_IN: -42 } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(42)
  })

  it('returns absolute value for string number', () => {
    const component = { inputs: { SIGNAL_IN: '-15.5' } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(15.5)
  })

  it('returns absolute value for string number with spaces', () => {
    const component = { inputs: { SIGNAL_IN: '  -42  ' } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(42)
  })

  it('passes through non-numeric string unchanged', () => {
    const component = { inputs: { SIGNAL_IN: 'hello' } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('passes through boolean string unchanged', () => {
    const component = { inputs: { SIGNAL_IN: 'true' } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe('true')
  })

  it('returns absolute value for boolean true', () => {
    const component = { inputs: { SIGNAL_IN: true } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('returns absolute value for boolean false', () => {
    const component = { inputs: { SIGNAL_IN: false } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('passes through objects unchanged', () => {
    const obj = { key: 'value' }
    const component = { inputs: { SIGNAL_IN: obj } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(obj)
  })

  it('passes through arrays unchanged', () => {
    const arr = [1, 2, 3]
    const component = { inputs: { SIGNAL_IN: arr } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(arr)
  })

  it('passes through functions unchanged', () => {
    const fn = () => 'test'
    const component = { inputs: { SIGNAL_IN: fn } }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(fn)
  })

  it('returns undefined if inputs object is missing', () => {
    const component = {}
    const result = processAbsTick(component)

    expect(result).toBeUndefined()
  })
})
