import { describe, it, expect, beforeEach } from 'vitest'
import processExponentiationTick from '../../../../../src/stores/circuit/processors/processExponentiationTick'

describe('processExponentiationTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: {}
    }
  })

  it('should calculate power using SIGNAL_IN and SET_EXPONENT', () => {
    component.inputs.SIGNAL_IN = '2'
    component.inputs.SET_EXPONENT = '3'
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(8)
  })

  it('should use settings.exponent if SET_EXPONENT is not provided', () => {
    component.inputs.SIGNAL_IN = '3'
    component.settings.exponent = 2
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(9)
  })

  it('should prioritize SET_EXPONENT over settings.exponent', () => {
    component.inputs.SIGNAL_IN = '4'
    component.inputs.SET_EXPONENT = '2'
    component.settings.exponent = 3 // Should be ignored
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(16)
  })

  it('should return undefined if SIGNAL_IN is missing', () => {
    component.inputs.SET_EXPONENT = '2'
    const result = processExponentiationTick(component)

    expect(result).toBeUndefined()
  })

  it('should treat non-numeric SIGNAL_IN as 0', () => {
    component.inputs.SIGNAL_IN = 'foo'
    component.inputs.SET_EXPONENT = '2'
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(0) // 0^2 = 0
  })

  it('should treat non-numeric exponent as 0', () => {
    component.inputs.SIGNAL_IN = '5'
    component.inputs.SET_EXPONENT = 'bar'
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(1) // 5^0 = 1
  })

  it('should handle negative exponents', () => {
    component.inputs.SIGNAL_IN = '2'
    component.inputs.SET_EXPONENT = '-2'
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(0.25)
  })

  it('should handle fractional exponents', () => {
    component.inputs.SIGNAL_IN = '9'
    component.inputs.SET_EXPONENT = '0.5'
    const result = processExponentiationTick(component)

    expect(result.SIGNAL_OUT).toBe(3)
  })
})
