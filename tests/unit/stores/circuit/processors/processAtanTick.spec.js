import { describe, it, expect } from 'vitest'
import processAtanTick from '../../../../../src/stores/circuit/processors/processAtanTick'

describe('processAtanTick', () => {
  it('calculates atan in radians by default', () => {
    const component = { inputs: { SIGNAL_IN: 1 } }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('calculates atan in radians when useRadians is true', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('calculates atan in degrees when useRadians is false', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 },
      settings: { useRadians: false }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(45, 10)
  })

  it('calculates atan2 when both SIGNAL_IN_X and SIGNAL_IN_Y are provided', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 1, SIGNAL_IN_Y: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('calculates atan2 in degrees', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 1, SIGNAL_IN_Y: 1 },
      settings: { useRadians: false }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(45, 10)
  })

  it('handles atan2 with negative x and positive y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: -1, SIGNAL_IN_Y: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(3 * Math.PI / 4, 10)
  })

  it('handles atan2 with negative x and negative y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: -1, SIGNAL_IN_Y: -1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-3 * Math.PI / 4, 10)
  })

  it('handles atan2 with positive x and negative y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 1, SIGNAL_IN_Y: -1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-Math.PI / 4, 10)
  })

  it('handles atan2 with zero x and positive y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 0, SIGNAL_IN_Y: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 2, 10)
  })

  it('handles atan2 with zero x and negative y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 0, SIGNAL_IN_Y: -1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-Math.PI / 2, 10)
  })

  it('handles atan2 with positive x and zero y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 1, SIGNAL_IN_Y: 0 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles atan2 with negative x and zero y', () => {
    const component = {
      inputs: { SIGNAL_IN_X: -1, SIGNAL_IN_Y: 0 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI, 10)
  })

  it('handles atan2 with both inputs zero', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 0, SIGNAL_IN_Y: 0 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles string numbers for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: '1' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('handles string numbers for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: '1', SIGNAL_IN_Y: '1' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('handles string numbers with spaces', () => {
    const component = {
      inputs: { SIGNAL_IN: '  1  ' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('handles non-numeric strings as 0 for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: 'invalid' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles non-numeric strings as 0 for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 'invalid', SIGNAL_IN_Y: 'also invalid' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(0, 0), 10)
  })

  it('handles mixed valid and invalid values for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: 1, SIGNAL_IN_Y: 'invalid' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(0, 1), 10)
  })

  it('handles null inputs as 0 for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: null },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles undefined inputs as 0 for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: undefined },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles empty string inputs as 0 for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: '' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles null inputs as 0 for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: null, SIGNAL_IN_Y: null },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(0, 0), 10)
  })

  it('handles undefined inputs as 0 for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: undefined, SIGNAL_IN_Y: undefined },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(0, 0), 10)
  })

  it('handles empty string inputs as 0 for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: '', SIGNAL_IN_Y: '' },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.atan2(0, 0), 10)
  })

  it('handles boolean true as 1 for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: true },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles boolean false as 0 for atan', () => {
    const component = {
      inputs: { SIGNAL_IN: false },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles boolean true as 1 for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: true, SIGNAL_IN_Y: true },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('handles boolean false as 0 for atan2', () => {
    const component = {
      inputs: { SIGNAL_IN_X: false, SIGNAL_IN_Y: false },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles undefined settings', () => {
    const component = { inputs: { SIGNAL_IN: 1 } }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles missing inputs', () => {
    const component = { inputs: {} }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('prioritizes atan2 over atan when both inputs are available', () => {
    const component = {
      inputs: { SIGNAL_IN: 2, SIGNAL_IN_X: 1, SIGNAL_IN_Y: 1 },
      settings: { useRadians: true }
    }
    const result = processAtanTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 4, 10)
  })
})
