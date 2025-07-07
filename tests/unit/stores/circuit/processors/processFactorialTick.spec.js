import { describe, it, expect } from 'vitest'
import processFactorialTick from '../../../../../src/stores/circuit/processors/processFactorialTick'

describe('processFactorialTick', () => {
  it('should calculate the factorial of a positive integer', () => {
    const component = { inputs: { SIGNAL_IN: 5 } }
    const result = processFactorialTick(component)

    expect(result.SIGNAL_OUT).toBe(120)
  })

  it('should return 1 for the factorial of 0', () => {
    const component = { inputs: { SIGNAL_IN: 0 } }
    const result = processFactorialTick(component)

    expect(result).toBe(1)
  })

  it('should round a positive float down and calculate its factorial', () => {
    const component = { inputs: { SIGNAL_IN: 5.9 } }
    const result = processFactorialTick(component)

    expect(result.SIGNAL_OUT).toBe(120)
  })

  it('should return 0 for negative numbers', () => {
    const component = { inputs: { SIGNAL_IN: -5 } }
    const result = processFactorialTick(component)

    expect(result).toBe(0)
  })

  it('should return 0 for numbers greater than 20', () => {
    const component = { inputs: { SIGNAL_IN: 21 } }
    const result = processFactorialTick(component)

    expect(result).toBe(0)
  })

  it('should handle string numbers', () => {
    const component = { inputs: { SIGNAL_IN: '4' } }
    const result = processFactorialTick(component)

    expect(result.SIGNAL_OUT).toBe(24)
  })

  it('should return 0 for non-numeric strings', () => {
    const component = { inputs: { SIGNAL_IN: 'test' } }
    const result = processFactorialTick(component)

    expect(result).toBe(0)
  })

  it('should return undefined for missing signal', () => {
    const component = { inputs: {} }
    const result = processFactorialTick(component)

    expect(result).toBeUndefined()
  })
})
