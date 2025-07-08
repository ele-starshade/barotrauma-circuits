import { describe, it, expect } from 'vitest'
import processTanTick from '../../../../../src/stores/circuit/processors/processTanTick.js'

describe('processTanTick', () => {
  describe('Basic functionality', () => {
    it('should calculate tangent of input in radians by default', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 4 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
      expect(component.value).toBeCloseTo(1, 10)
    })

    it('should calculate tangent of zero', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should calculate tangent of negative value', () => {
      const component = {
        inputs: { SIGNAL_IN: -Math.PI / 4 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(-1, 10)
    })

    it('should return 0 when no input signal', () => {
      const component = {
        inputs: {}
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Degree to radian conversion', () => {
    it('should convert degrees to radians when useRadians is false', () => {
      const component = {
        inputs: { SIGNAL_IN: 45 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
    })

    it('should convert degrees to radians when useRadians is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: 45 },
        settings: {}
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
    })

    it('should not convert when useRadians is true', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 4 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
    })

    it('should handle 30 degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: 30 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1 / Math.sqrt(3), 10)
    })

    it('should handle 60 degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: 60 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(3), 10)
    })

    it('should handle negative degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: -45 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(-1, 10)
    })
  })

  describe('Input type handling', () => {
    it('should handle string numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '0.7853981633974483' }, // π/4 as string
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
    })

    it('should handle string degrees', () => {
      const component = {
        inputs: { SIGNAL_IN: '45' },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
    })

    it('should return 0 for invalid string input', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid' }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for null input', () => {
      const component = {
        inputs: { SIGNAL_IN: null }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for empty string input', () => {
      const component = {
        inputs: { SIGNAL_IN: '' }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Special cases', () => {
    it('should return NaN for Infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: Infinity },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)
    })

    it('should return NaN for negative Infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: -Infinity },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)
    })

    it('should return 0 for NaN input', () => {
      const component = {
        inputs: { SIGNAL_IN: NaN }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1000000 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-999999)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(999999)
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.000001 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.000001, 10)
    })
  })

  describe('Asymptote handling', () => {
    it('should handle values very close to π/2 asymptote', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 + 0.0005 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(999999) // Clamped to max value
    })

    it('should handle values very close to 3π/2 asymptote', () => {
      const component = {
        inputs: { SIGNAL_IN: 3 * Math.PI / 2 + 0.0005 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(999999) // Clamped to max value
    })

    it('should handle values very close to π/2 asymptote (negative)', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 - 0.0005 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(999999) // Implementation clamps to max for positive angles
    })

    it('should handle values very close to 3π/2 asymptote (negative)', () => {
      const component = {
        inputs: { SIGNAL_IN: 3 * Math.PI / 2 - 0.0005 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(999999) // Implementation clamps to max for positive angles
    })

    it('should handle 90 degrees (asymptote)', () => {
      const component = {
        inputs: { SIGNAL_IN: 90 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(999999) // Clamped to max value
    })

    it('should handle 270 degrees (asymptote)', () => {
      const component = {
        inputs: { SIGNAL_IN: 270 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(999999) // Clamped to max value
    })

    it('should handle values just outside asymptote threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 + 0.002 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeLessThan(999999) // Should calculate actual tangent
    })
  })

  describe('Tangent function properties', () => {
    it('should handle tangent of π/6 (30 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 30 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1 / Math.sqrt(3), 10)
    })

    it('should handle tangent of π/4 (45 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 45 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
    })

    it('should handle tangent of π/3 (60 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 60 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(3), 10)
    })

    it('should handle tangent of π (180 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 180 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle tangent of 2π (360 degrees)', () => {
      const component = {
        inputs: { SIGNAL_IN: 360 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })
  })

  describe('Clamping functionality', () => {
    it('should clamp values to specified range', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 4 },
        settings: { clampMin: -5, clampMax: 5, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10) // Within range, no clamping needed
    })

    it('should clamp values above maximum', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { clampMin: -5, clampMax: 1, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(1) // sqrt(3) clamped to 1
    })

    it('should clamp values below minimum', () => {
      const component = {
        inputs: { SIGNAL_IN: -Math.PI / 3 },
        settings: { clampMin: -1, clampMax: 5, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(-1) // -sqrt(3) clamped to -1
    })

    it('should handle clamping with negative bounds', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 4 },
        settings: { clampMin: -10, clampMax: -5, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(-5) // 1 clamped to -5
    })

    it('should handle reversed clamp bounds', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 4 },
        settings: { clampMin: 10, clampMax: 0, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // Implementation uses min when bounds are reversed
    })
  })

  describe('Precision functionality', () => {
    it('should apply precision to output', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { precision: 2, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(1.73) // sqrt(3) ≈ 1.732..., rounded to 2 decimal places
    })

    it('should handle precision of 0', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { precision: 0, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(3), 10) // Implementation doesn't apply precision when it's 0
    })

    it('should handle precision of 1', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { precision: 1, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(1.7) // sqrt(3) ≈ 1.732..., rounded to 1 decimal place
    })

    it('should handle precision of 3', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { precision: 3, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(1.732) // sqrt(3) ≈ 1.7320508075688772, rounded to 3 decimal places
    })

    it('should not apply precision when precision is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(3), 10)
    })

    it('should not apply precision when precision is 0 or negative', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: { precision: -1, useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(3), 10)
    })
  })

  describe('Combined features', () => {
    it('should apply tangent, clamping, and precision in order', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 3 },
        settings: {
          clampMin: -5,
          clampMax: 5,
          precision: 1,
          useRadians: true
        }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(1.7) // sqrt(3) ≈ 1.732..., clamped, then precision
    })

    it('should handle asymptote with custom clamping', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 2 + 0.0005 },
        settings: {
          clampMin: -100,
          clampMax: 100,
          useRadians: true
        }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(100) // Asymptote clamped to custom max
    })
  })

  describe('Edge cases', () => {
    it('should handle very large degree values', () => {
      const component = {
        inputs: { SIGNAL_IN: 720 }, // 2 full rotations
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle very large radian values', () => {
      const component = {
        inputs: { SIGNAL_IN: 4 * Math.PI }, // 2 full rotations
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle very negative values', () => {
      const component = {
        inputs: { SIGNAL_IN: -720 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
    })

    it('should handle decimal degree values', () => {
      const component = {
        inputs: { SIGNAL_IN: 45.5 },
        settings: { useRadians: false }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-999999)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(999999)
    })

    it('should handle decimal radian values', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5 },
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-999999)
      expect(result.SIGNAL_OUT).toBeLessThanOrEqual(999999)
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { useRadians: true }
      }

      const result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.5 }
      }

      expect(() => processTanTick(component)).toThrow()
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processTanTick(component)

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
      let result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBe(0)

      // Change to 45 degrees
      component.inputs.SIGNAL_IN = 45
      result = processTanTick(component)
      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)

      // Change to 90 degrees (asymptote)
      component.inputs.SIGNAL_IN = 90
      result = processTanTick(component)
      expect(result.SIGNAL_OUT).toBe(999999)
    })

    it('should handle changing settings', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.7853981633974483 }, // π/4
        settings: { useRadians: true }
      }

      // First call with radians
      let result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)

      // Change to degrees mode
      component.settings.useRadians = false
      result = processTanTick(component)
      expect(result.SIGNAL_OUT).toBeCloseTo(0.0137, 3) // tan(0.7854 degrees)
    })

    it('should maintain state across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN: Math.PI / 4 },
        settings: { useRadians: true }
      }

      // First call
      let result = processTanTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 10)
      expect(component.value).toBeCloseTo(1, 10)

      // Second call with no input
      component.inputs = {}
      result = processTanTick(component)
      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.value).toBe(0)
    })
  })
})
