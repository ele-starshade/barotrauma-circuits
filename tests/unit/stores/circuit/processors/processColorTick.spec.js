import { describe, it, expect } from 'vitest'
import processColorTick from '../../../../../src/stores/circuit/processors/processColorTick'

describe('processColorTick', () => {
  it('returns undefined when no inputs are provided', () => {
    const component = { inputs: {} }
    const result = processColorTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined when all inputs are undefined', () => {
    const component = {
      inputs: {
        SIGNAL_IN_R: undefined,
        SIGNAL_IN_G: undefined,
        SIGNAL_IN_B: undefined,
        SIGNAL_IN_A: undefined
      }
    }
    const result = processColorTick(component)

    expect(result).toBeUndefined()
  })

  it('processes RGB values correctly', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('processes RGB values with default alpha', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('clamps RGB values to 0-1 range', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 2.0, SIGNAL_IN_G: -0.5, SIGNAL_IN_B: 0.5, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0,0.5,1')
  })

  it('handles string numbers for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: '1.0', SIGNAL_IN_G: '0.5', SIGNAL_IN_B: '0.0', SIGNAL_IN_A: '1.0' },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('handles string numbers with spaces for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: '  1.0  ', SIGNAL_IN_G: '  0.5  ', SIGNAL_IN_B: '  0.0  ', SIGNAL_IN_A: '  1.0  ' },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('handles non-numeric strings as 0 for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 'invalid', SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0.5,0,1')
  })

  it('handles null inputs as 0 for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: null, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0.5,0,1')
  })

  it('handles undefined inputs as 0 for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0.5,0,1')
  })

  it('handles boolean true as 1 for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: true, SIGNAL_IN_G: false, SIGNAL_IN_B: true, SIGNAL_IN_A: true },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0,0,1')
  })

  it('handles boolean false as 0 for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: false, SIGNAL_IN_G: false, SIGNAL_IN_B: false, SIGNAL_IN_A: false },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0,0,1')
  })

  it('clamps alpha to 0-1 range', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 2.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('handles negative alpha', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: -0.5 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,0')
  })

  it('handles undefined alpha as 1', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('handles null alpha as 1', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: null },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('handles empty string alpha as 1', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: '' },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('processes HSV values correctly', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 120, SIGNAL_IN_G: 1.0, SIGNAL_IN_B: 0.8, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: true }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,1,0,1')
  })

  it('clamps HSV values to correct ranges', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 400, SIGNAL_IN_G: 1.5, SIGNAL_IN_B: 2.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: true }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0,0,1')
  })

  it('handles string numbers for HSV', () => {
    const component = {
      inputs: { SIGNAL_IN_R: '120', SIGNAL_IN_G: '1.0', SIGNAL_IN_B: '0.8', SIGNAL_IN_A: '1.0' },
      settings: { useHSV: true }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,1,0,1')
  })

  it('handles non-numeric strings as 0 for HSV', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 'invalid', SIGNAL_IN_G: 1.0, SIGNAL_IN_B: 0.8, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: true }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0,0,1')
  })

  it('handles undefined settings', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('1,0.5,0,1')
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processColorTick(component)

    expect(result).toBeUndefined()
  })

  it('handles NaN values', () => {
    const component = {
      inputs: { SIGNAL_IN_R: NaN, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0.5,0,1')
  })

  it('handles Infinity values', () => {
    const component = {
      inputs: { SIGNAL_IN_R: Infinity, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0.5,0,1')
  })

  it('handles -Infinity values', () => {
    const component = {
      inputs: { SIGNAL_IN_R: -Infinity, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0.5,0,1')
  })
})
