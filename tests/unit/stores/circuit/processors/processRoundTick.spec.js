import { describe, it, expect, beforeEach } from 'vitest'
import processRoundTick from '../../../../../src/stores/circuit/processors/processRoundTick'

describe('processRoundTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {}
    }
  })

  it('should round a positive decimal up to the nearest integer', () => {
    component.inputs.SIGNAL_IN = 10.8
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(11)
  })

  it('should round a positive decimal down to the nearest integer', () => {
    component.inputs.SIGNAL_IN = 10.2
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(10)
  })

  it('should round a negative decimal to the nearest integer', () => {
    component.inputs.SIGNAL_IN = -10.8
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(-11)
  })

  it('should handle an integer input correctly', () => {
    component.inputs.SIGNAL_IN = 5
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(5)
  })

  it('should handle string numbers', () => {
    component.inputs.SIGNAL_IN = '12.987'
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(13)
  })

  it('should return 0 for non-numeric strings', () => {
    component.inputs.SIGNAL_IN = 'test'
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return 0 for missing signal', () => {
    const result = processRoundTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
