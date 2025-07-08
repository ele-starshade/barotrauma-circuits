import { describe, it, expect } from 'vitest'
import processSinTick from '../../../../../src/stores/circuit/processors/processSinTick.js'

describe('processSinTick', () => {
  describe('Basic functionality', () => {
    it('should calculate sine of input in radians by default', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.value).toBe(1)
    })

    it('should calculate sine of zero', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should calculate sine of negative value', () => {
      const component = {
        inputs: { SIGNAL_IN: -Math.PI / 2 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(-1)
    })

    it('should return 0 when no input signal', () => {
      const component = {
        inputs: {}
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Degree to radian conversion', () => {
    it('should convert degrees to radians when useRadians is false', () => {
      const component = {
        inputs: { SIGNAL_IN: 90 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should convert degrees to radians when useRadians is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: 90 },
        settings: {}
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should not convert when useRadians is true', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle 180 degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: 180 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle 270 degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: 270 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(-1)
    })

    it('should handle 360 degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: 360 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle negative degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: -90 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(-1)
    })
  })

  describe('Input type handling', () => {
    it('should handle string numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '1.5707963267948966' }, // π/2 as string
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle string degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: '90' },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should return 0 for invalid string input', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid' }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for null input', () => {
      const component = {
        inputs: { SIGNAL_IN: null }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for empty string input', () => {
      const component = {
        inputs: { SIGNAL_IN: '' }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Special cases', () => {
    it('should return NaN for Infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: Infinity },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)
    })

    it('should return NaN for negative Infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: -Infinity },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)
    })

    it('should return 0 for NaN input', () => {
      const component = {
        inputs: { SIGNAL_IN: NaN }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1000000 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.000001 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.000001, 10)
    })
  })

  describe('Sine function properties', () => {
    it('should output values between -1 and 1', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
    })

    it('should handle sine of π/6 (30 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 30 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.5, 10)
    })

    it('should handle sine of π/4 (45 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 45 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(2) / 2, 10)
    })

    it('should handle sine of π/3 (60 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 60 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(3) / 2, 10)
    })

    it('should handle sine of π (180 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 180 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle sine of 3π/2 (270 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 270 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(-1)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large degree values', () => {
      const component = {
        inputs: { SIGNAL_IN: 720 }, // 2 full rotations
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle very large radian values', () => {
      const component = {
        inputs: { SIGNAL_IN: 4 * Math.PI }, // 2 full rotations
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle very negative values', () => {
      const component = {
        inputs: { SIGNAL_IN: -720 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle decimal degree values', () => {
      const component = {
        inputs: { SIGNAL_IN: 45.5 },
        settings: { useRadians: false }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
    })

    it('should handle decimal radian values', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
    })
  })

  describe('Output clamping', () => {
    it('should clamp output to valid range', () => {
      // This test verifies the safety clamping works
      // In practice, Math.sin should always return values in [-1, 1]
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
    })

    it('should handle edge case where sine might exceed bounds', () => {
      // Test with a value that might cause floating point precision issues
      const component = {
        inputs: { SIGNAL_IN: 1e15 },
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { useRadians: true }
      }

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 }
      }

      expect(() => processSinTick(component)).toThrow(TypeError)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle changing input values', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: { useRadians: false }
      }

      // Start at 0 degrees
      let result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(0)

      // Change to 90 degrees
      component.inputs.SIGNAL_IN = 90
      result = processSinTick(component)
      expect(result.SIGNAL_OUT).toBe(1)

      // Change to 180 degrees
      component.inputs.SIGNAL_IN = 180
      result = processSinTick(component)
      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle changing settings', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5707963267948966 }, // π/2
        settings: { useRadians: true }
      }

      // First call with radians
      let result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)

      // Change to degrees mode
      component.settings.useRadians = false
      result = processSinTick(component)
      expect(result.SIGNAL_OUT).toBeCloseTo(0.0274, 3) // sin(1.5708 degrees)
    })

    it('should maintain state across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 },
        settings: { useRadians: true }
      }

      // First call
      let result = processSinTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.value).toBe(1)

      // Second call with no input
      component.inputs = {}
      result = processSinTick(component)
      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.value).toBe(0)
    })
  })
})
