import { describe, it, expect, vi } from 'vitest'
import processColorTick from '../../../../../src/stores/circuit/processors/processColorTick'
import hsvToRgb from '../../../../../src/utils/hsvToRgb'

vi.mock('../../../../../src/utils/hsvToRgb')

describe('processColorTick', () => {
  it('should process RGB values correctly', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 100, SIGNAL_IN_G: 150, SIGNAL_IN_B: 200, SIGNAL_IN_A: 255 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('100,150,200,255')
  })

  it('should clamp RGB values to the 0-255 range', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 300, SIGNAL_IN_G: -50, SIGNAL_IN_B: 200, SIGNAL_IN_A: 300 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('255,0,200,255')
  })

  it('should process HSV values correctly', () => {
    hsvToRgb.mockReturnValue({ r: 99, g: 149, b: 199 })
    const component = {
      inputs: { SIGNAL_IN_R: 210, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.8, SIGNAL_IN_A: 255 },
      settings: { useHSV: true }
    }
    const result = processColorTick(component)

    expect(hsvToRgb).toHaveBeenCalledWith(210, 0.5, 0.8)
    expect(result.SIGNAL_OUT).toBe('99,149,199,255')
  })

  it('should clamp HSV values to their respective ranges', () => {
    hsvToRgb.mockReturnValue({ r: 255, g: 255, b: 255 })
    const component = {
      inputs: { SIGNAL_IN_R: 400, SIGNAL_IN_G: 1.5, SIGNAL_IN_B: -1, SIGNAL_IN_A: 255 },
      settings: { useHSV: true }
    }

    processColorTick(component)
    expect(hsvToRgb).toHaveBeenCalledWith(360, 1, 0)
  })

  it('should handle non-numeric HSV inputs', () => {
    hsvToRgb.mockReturnValue({ r: 0, g: 0, b: 0 })
    const component = {
      inputs: { SIGNAL_IN_R: 'foo', SIGNAL_IN_G: 'bar', SIGNAL_IN_B: 'baz', SIGNAL_IN_A: 255 },
      settings: { useHSV: true }
    }

    processColorTick(component)
    expect(hsvToRgb).toHaveBeenCalledWith(0, 0, 0)
  })

  it('should return undefined if no inputs are provided', () => {
    const component = {
      inputs: {},
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result).toBeUndefined()
  })

  it('should handle partial inputs for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 100 },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('100,0,0,0')
  })

  it('should handle non-numeric inputs for RGB', () => {
    const component = {
      inputs: { SIGNAL_IN_R: 'foo', SIGNAL_IN_G: 'bar', SIGNAL_IN_B: 'baz', SIGNAL_IN_A: 'a' },
      settings: { useHSV: false }
    }
    const result = processColorTick(component)

    expect(result.SIGNAL_OUT).toBe('0,0,0,0')
  })
})
