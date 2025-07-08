import { describe, it, expect } from 'vitest'
import processConstantTick from '../../../../../src/stores/circuit/processors/processConstantTick'

describe('processConstantTick', () => {
  it('returns string value correctly', () => {
    const component = { value: 'test' }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe('test')
  })

  it('returns numeric value correctly', () => {
    const component = { value: 42 }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(42)
  })

  it('returns boolean value correctly', () => {
    const component = { value: true }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(true)
  })

  it('returns null value correctly', () => {
    const component = { value: null }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(null)
  })

  it('returns undefined value correctly', () => {
    const component = { value: undefined }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(undefined)
  })

  it('returns empty string correctly', () => {
    const component = { value: '' }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe('')
  })

  it('returns zero correctly', () => {
    const component = { value: 0 }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(0)
  })

  it('returns negative number correctly', () => {
    const component = { value: -42 }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(-42)
  })

  it('returns decimal number correctly', () => {
    const component = { value: 3.14 }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(3.14)
  })

  it('returns object value correctly', () => {
    const obj = { key: 'value' }
    const component = { value: obj }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(obj)
  })

  it('returns array value correctly', () => {
    const arr = [1, 2, 3]
    const component = { value: arr }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(arr)
  })

  it('returns function value correctly', () => {
    const fn = () => 'test'
    const component = { value: fn }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(fn)
  })

  it('returns Infinity correctly', () => {
    const component = { value: Infinity }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(Infinity)
  })

  it('returns -Infinity correctly', () => {
    const component = { value: -Infinity }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(-Infinity)
  })

  it('returns NaN correctly', () => {
    const component = { value: NaN }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(NaN)
  })

  it('handles component with additional properties', () => {
    const component = {
      id: 'const-1',
      name: 'Constant',
      value: 'test',
      position: { x: 100, y: 200 }
    }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe('test')
  })

  it('handles component with missing value property', () => {
    const component = {}
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(undefined)
  })
})
