import { describe, it, expect } from 'vitest'
import processAtanTick from '../../../../../src/stores/circuit/processors/processAtanTick'

describe('processAtanTick', () => {
  it('should calculate atan in degrees by default', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 },
      settings: { useRadians: false }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(45)
  })

  it('should calculate atan in radians when specified', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4)
  })

  it('should use atan2 when both Y and X signals are provided', () => {
    const component = {
      inputs: { SIGNAL_IN_Y: 1, SIGNAL_IN_X: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4)
  })

  it('should calculate atan2 in degrees', () => {
    const component = {
      inputs: { SIGNAL_IN_Y: 1, SIGNAL_IN_X: -1 },
      settings: { useRadians: false }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(135)
  })

  it('should handle non-numeric strings', () => {
    const component = {
      inputs: { SIGNAL_IN: 'test' },
      settings: { useRadians: false }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0)
  })

  it('should return undefined if no signals are provided', () => {
    const component = {
      inputs: {},
      settings: { useRadians: false }
    }
    const result = processAtanTick(component)

    expect(result).toBeUndefined()
  })

  it('should handle NaN values in atan2 mode', () => {
    const component = {
      inputs: { SIGNAL_IN_Y: 'invalid', SIGNAL_IN_X: 'also invalid' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(0, 0))
  })

  it('should handle NaN values in atan mode', () => {
    const component = {
      inputs: { SIGNAL_IN: 'invalid' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan(0))
  })

  it('should handle mixed valid and invalid values in atan2 mode', () => {
    const component = {
      inputs: { SIGNAL_IN_Y: 1, SIGNAL_IN_X: 'invalid' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(1, 0))
  })

  it('should handle undefined settings', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 }
      // settings is undefined
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(45)
  })
})
