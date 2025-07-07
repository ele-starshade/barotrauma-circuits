import { describe, it, expect } from 'vitest'
import processConstantTick from '../../../../../src/stores/circuit/processors/processConstantTick'

describe('processConstantTick', () => {
  it('should return the configured constant value', () => {
    const component = {
      value: '42'
    }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe('42')
  })

  it('should return a string value', () => {
    const component = {
      value: 'hello'
    }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe('hello')
  })

  it('should return an empty string if that is the value', () => {
    const component = {
      value: ''
    }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe('')
  })

  it('should return a numeric value', () => {
    const component = {
      value: 123
    }
    const result = processConstantTick(component)

    expect(result.VALUE_OUT).toBe(123)
  })
})
