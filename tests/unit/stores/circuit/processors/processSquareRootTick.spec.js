import { describe, it, expect, vi, beforeEach } from 'vitest'
import processSquareRootTick from '../../../../../src/stores/circuit/processors/processSquareRootTick.js'

describe('processSquareRootTick', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('Basic functionality', () => {
    it('should calculate square root of positive number', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
      expect(component.value).toBe(4)
    })

    it('should calculate square root of zero', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should calculate square root of decimal number', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.25 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1.5)
    })

    it('should return 0 when no input signal', () => {
      const component = {
        inputs: {}
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Special cases', () => {
    it('should return NaN for negative input', () => {
      const component = {
        inputs: { SIGNAL_IN: -4 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)
    })

    it('should return Infinity for Infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: Infinity },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(Infinity)
    })

    it('should return 0 for NaN input', () => {
      const component = {
        inputs: { SIGNAL_IN: NaN }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle very small positive numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.000001 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.001, 6)
    })

    it('should handle very large positive numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1000000 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1000)
    })
  })

  describe('Input type handling', () => {
    it('should handle string numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '16' },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle string decimals', () => {
      const component = {
        inputs: { SIGNAL_IN: '2.25' },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1.5)
    })

    it('should return 0 for invalid string input', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid' }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for null input', () => {
      const component = {
        inputs: { SIGNAL_IN: null }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for empty string input', () => {
      const component = {
        inputs: { SIGNAL_IN: '' }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Time-based averaging', () => {
    it('should calculate average over time frame', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 1 } // 1 second
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)

      // Second call 500ms later
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 25
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(4.5) // Average of 4 and 5

      // Third call 200ms later (within 1s window)
      vi.setSystemTime(new Date('2023-01-01T00:00:00.700Z'))
      component.inputs.SIGNAL_IN = 9
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(4) // Average of 4, 5, 3
    })

    it('should remove old entries outside time frame', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 1 } // 1 second
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)

      // Second call 1.5s later (outside time frame)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN = 25
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(5) // Only the new value
    })

    it('should handle zero time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
      expect(component.signalHistory).toBeUndefined()
    })

    it('should handle negative time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: -1 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
      expect(component.signalHistory).toBeUndefined()
    })

    it('should initialize signal history on first call', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 1 }
      }

      processSquareRootTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
    })
  })

  describe('Clamping functionality', () => {
    it('should clamp values to specified range', () => {
      const component = {
        inputs: { SIGNAL_IN: 100 },
        settings: { clampMin: 0, clampMax: 5 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(5) // sqrt(100) = 10, clamped to 5
    })

    it('should clamp negative values', () => {
      const component = {
        inputs: { SIGNAL_IN: 4 },
        settings: { clampMin: 5, clampMax: 10 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(5) // sqrt(4) = 2, clamped to 5
    })

    it('should not clamp when values are within range', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { clampMin: 0, clampMax: 10 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle clamping with negative bounds', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { clampMin: -10, clampMax: -5 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(-5) // sqrt(16) = 4, clamped to -5
    })

    it('should not clamp when only one bound is specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { clampMin: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should not clamp when only max bound is specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { clampMax: 10 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })
  })

  describe('Precision functionality', () => {
    it('should apply precision to output', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { precision: 2 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1.41) // sqrt(2) ≈ 1.4142135623730951, rounded to 2 decimal places
    })

    it('should handle precision of 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { precision: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(Math.sqrt(2)) // Precision of 0 is not applied (only > 0)
    })

    it('should handle precision of 1', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { precision: 1 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1.4) // sqrt(2) ≈ 1.414..., rounded to 1 decimal place
    })

    it('should handle precision of 3', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { precision: 3 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1.414) // sqrt(2) ≈ 1.4142135623730951, rounded to 3 decimal places
    })

    it('should not apply precision when precision is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: {}
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(Math.sqrt(2))
    })

    it('should not apply precision when precision is 0 or negative', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { precision: -1 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(Math.sqrt(2))
    })
  })

  describe('Combined features', () => {
    it('should apply square root, time averaging, clamping, and precision in order', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: {
          timeFrame: 1,
          clampMin: 0,
          clampMax: 10,
          precision: 1
        }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4.0) // sqrt(16) = 4, then averaged, then clamped, then precision

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 25
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(4.5) // Average of 4 and 5
    })

    it('should handle time averaging with clamping', () => {
      const component = {
        inputs: { SIGNAL_IN: 100 },
        settings: {
          timeFrame: 1,
          clampMin: 0,
          clampMax: 5
        }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(5) // sqrt(100) = 10, clamped to 5

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 4
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(5) // Average of 5 and 2, then clamped to 5
    })
  })

  describe('Mathematical properties', () => {
    it('should handle perfect squares', () => {
      const component = {
        inputs: { SIGNAL_IN: 1 },
        settings: { timeFrame: 0 }
      }

      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1)

      component.inputs.SIGNAL_IN = 4
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(2)

      component.inputs.SIGNAL_IN = 9
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(3)

      component.inputs.SIGNAL_IN = 16
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle irrational square roots', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(2), 10)
    })

    it('should handle square root of 1', () => {
      const component = {
        inputs: { SIGNAL_IN: 1 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle square root of very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.000001 },
        settings: { timeFrame: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.001, 6)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large precision values', () => {
      const component = {
        inputs: { SIGNAL_IN: 2 },
        settings: { precision: 10 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sqrt(2), 10)
    })

    it('should handle very large time frame values', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 999999 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle very large clamp values', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { clampMin: -999999, clampMax: 999999 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle reversed clamp bounds', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { clampMin: 10, clampMax: 0 }
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // Clamped to min (10) since clampMin > clampMax
    })

    it('should handle NaN values in time averaging', () => {
      const component = {
        inputs: { SIGNAL_IN: -4 }, // This will produce NaN
        settings: { timeFrame: 1 }
      }

      // First call produces NaN
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)

      // Second call with valid input
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 16
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(NaN) // Average of NaN and 4 is NaN
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {}
      }

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 }
      }

      expect(() => processSquareRootTick(component)).toThrow(TypeError)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should maintain signal history across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { timeFrame: 1 }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      processSquareRootTick(component)
      expect(component.signalHistory.length).toBe(1)

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 25
      processSquareRootTick(component)
      expect(component.signalHistory.length).toBe(2)

      // Third call (old entry should be removed)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN = 9
      processSquareRootTick(component)
      expect(component.signalHistory.length).toBe(2) // Only the first entry is removed, second and third remain
    })

    it('should handle changing settings between calls', () => {
      const component = {
        inputs: { SIGNAL_IN: 16 },
        settings: { precision: 1 }
      }

      // First call with precision
      let result = processSquareRootTick(component)

      expect(result.SIGNAL_OUT).toBe(4.0)

      // Change to no precision
      component.settings.precision = undefined
      result = processSquareRootTick(component)
      expect(result.SIGNAL_OUT).toBe(4)
    })
  })
})
