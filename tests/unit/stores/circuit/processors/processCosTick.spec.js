import { describe, it, expect } from 'vitest'
import processCosTick from '../../../../../src/stores/circuit/processors/processCosTick'

describe('processCosTick', () => {
  it('should calculate cos in degrees by default', () => {
    const component = {
      inputs: { SIGNAL_IN: 60 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0.5)
  })

  it('should calculate cos in radians when specified', () => {
    const component = {
      inputs: { SIGNAL_IN: Math.PI / 3 },
      settings: { useRadians: true }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0.5)
  })

  it('should handle negative angles in degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: -60 },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0.5)
  })

  it('should handle non-numeric strings', () => {
    const component = {
      inputs: { SIGNAL_IN: 'test' },
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1) // cos(0)
  })

  it('should return undefined if signal is missing', () => {
    const component = {
      inputs: {},
      settings: { useRadians: false }
    }
    const result = processCosTick(component)

    expect(result).toBeUndefined()
  })
})
