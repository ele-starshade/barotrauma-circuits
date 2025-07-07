import { describe, it, expect } from 'vitest'
import processCeilTick from '../../../../../src/stores/circuit/processors/processCeilTick'

describe('processCeilTick', () => {
  it('should return the ceiling of a positive decimal', () => {
    const component = { inputs: { SIGNAL_IN: 10.2 } }
    const result = processCeilTick(component)

    expect(result.SIGNAL_OUT).toBe(11)
  })

  it('should return the ceiling of a negative decimal', () => {
    const component = { inputs: { SIGNAL_IN: -10.8 } }
    const result = processCeilTick(component)

    expect(result.SIGNAL_OUT).toBe(-10)
  })

  it('should return the same integer for an integer input', () => {
    const component = { inputs: { SIGNAL_IN: 5 } }
    const result = processCeilTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('should handle zero correctly', () => {
    const component = { inputs: { SIGNAL_IN: 0 } }
    const result = processCeilTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should handle string numbers', () => {
    const component = { inputs: { SIGNAL_IN: '12.9' } }
    const result = processCeilTick(component)

    expect(result.SIGNAL_OUT).toBe(13)
  })

  it('should return 0 for non-numeric strings', () => {
    const component = { inputs: { SIGNAL_IN: 'test' } }
    const result = processCeilTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return undefined for missing signal', () => {
    const component = { inputs: {} }
    const result = processCeilTick(component)

    expect(result).toBeUndefined()
  })
})
