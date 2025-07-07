import { describe, it, expect } from 'vitest'
import processAbsTick from '../../../../../src/stores/circuit/processors/processAbsTick'

describe('processAbsTick', () => {
  it('should return the absolute value of a positive number', () => {
    const component = {
      inputs: {
        SIGNAL_IN: 10
      }
    }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('should return the absolute value of a negative number', () => {
    const component = {
      inputs: {
        SIGNAL_IN: -10
      }
    }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('should return the absolute value of zero', () => {
    const component = {
      inputs: {
        SIGNAL_IN: 0
      }
    }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should handle string numbers', () => {
    const component = {
      inputs: {
        SIGNAL_IN: '-15.5'
      }
    }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(15.5)
  })

  it('should return 0 for non-numeric strings', () => {
    const component = {
      inputs: {
        SIGNAL_IN: 'hello'
      }
    }
    const result = processAbsTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return undefined if SIGNAL_IN is not present', () => {
    const component = {
      inputs: {}
    }
    const result = processAbsTick(component)

    expect(result).toBeUndefined()
  })

  it('should return undefined if inputs object is not present', () => {
    const component = {}
    const result = processAbsTick(component)

    expect(result).toBeUndefined()
  })
})
