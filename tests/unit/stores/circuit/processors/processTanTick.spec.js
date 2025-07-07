import { describe, it, expect, beforeEach } from 'vitest'
import processTanTick from '../../../../../src/stores/circuit/processors/processTanTick'

describe('processTanTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: { useRadians: false }
    }
  })

  it('should calculate tan in degrees by default', () => {
    component.inputs.SIGNAL_IN = 45
    const result = processTanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1)
  })

  it('should calculate tan in radians when specified', () => {
    component.settings.useRadians = true
    component.inputs.SIGNAL_IN = Math.PI / 4
    const result = processTanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1)
  })

  it('should handle asymptotes gracefully (90 degrees)', () => {
    component.inputs.SIGNAL_IN = 90
    const result = processTanTick(component)

    expect(result.SIGNAL_OUT).toBeGreaterThan(1e9) // A very large number
  })

  it('should handle asymptotes gracefully (270 degrees)', () => {
    component.inputs.SIGNAL_IN = 270
    const result = processTanTick(component)

    // Due to floating point inaccuracy, tan(270deg) yields a large positive number
    expect(result.SIGNAL_OUT).toBeGreaterThan(1e9)
  })

  it('should return 0 for non-numeric strings', () => {
    component.inputs.SIGNAL_IN = 'test'
    const result = processTanTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return 0 if signal is missing', () => {
    const result = processTanTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
