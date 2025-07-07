import { describe, it, expect } from 'vitest'
import processModuloTick from '../../../../../src/stores/circuit/processors/processModuloTick'

describe('processModuloTick', () => {
  it('should calculate the modulo using settings.modulus', () => {
    const component = {
      inputs: { SIGNAL_IN: 10 },
      settings: { modulus: 3 }
    }
    const result = processModuloTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('should use SET_MODULUS input to override settings', () => {
    const component = {
      inputs: { SIGNAL_IN: 10, SET_MODULUS: 4 },
      settings: { modulus: 3 }
    }
    const result = processModuloTick(component)

    expect(result.SIGNAL_OUT).toBe(2)
  })

  it('should return 0 when the modulus is zero', () => {
    const component = {
      inputs: { SIGNAL_IN: 10 },
      settings: { modulus: 0 }
    }
    const result = processModuloTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should handle negative numbers', () => {
    const component = {
      inputs: { SIGNAL_IN: -10 },
      settings: { modulus: 3 }
    }
    const result = processModuloTick(component)

    expect(result.SIGNAL_OUT).toBe(-1)
  })

  it('should handle non-numeric input by treating it as 0', () => {
    const component = {
      inputs: { SIGNAL_IN: 'test' },
      settings: { modulus: 5 }
    }
    const result = processModuloTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return undefined if SIGNAL_IN is missing', () => {
    const component = {
      inputs: {},
      settings: { modulus: 5 }
    }
    const result = processModuloTick(component)

    expect(result).toBeUndefined()
  })
})
