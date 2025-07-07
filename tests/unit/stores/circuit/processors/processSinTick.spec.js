import { describe, it, expect, beforeEach } from 'vitest'
import processSinTick from '../../../../../src/stores/circuit/processors/processSinTick'

describe('processSinTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: { useRadians: false }
    }
  })

  it('should calculate sin in degrees by default', () => {
    component.inputs.SIGNAL_IN = 30
    const result = processSinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0.5)
  })

  it('should calculate sin in radians when specified', () => {
    component.settings.useRadians = true
    component.inputs.SIGNAL_IN = Math.PI / 6
    const result = processSinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0.5)
  })

  it('should handle negative angles in degrees', () => {
    component.inputs.SIGNAL_IN = -90
    const result = processSinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-1)
  })

  it('should return 0 for non-numeric strings', () => {
    component.inputs.SIGNAL_IN = 'test'
    const result = processSinTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return 0 if signal is missing', () => {
    const result = processSinTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
