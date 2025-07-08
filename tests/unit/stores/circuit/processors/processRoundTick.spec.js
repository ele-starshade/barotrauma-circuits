import { describe, it, expect, vi, beforeEach } from 'vitest'
import processRoundTick from '../../../../../src/stores/circuit/processors/processRoundTick.js'

describe('processRoundTick', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('Basic rounding functionality', () => {
    it('should round positive numbers correctly', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
      expect(component.value).toBe(4)
    })

    it('should round negative numbers correctly', () => {
      const component = {
        inputs: { SIGNAL_IN: -3.7 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(-4)
    })

    it('should round numbers at exactly 0.5 boundary', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.5 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should round numbers just below 0.5 boundary', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.4 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3)
    })

    it('should round numbers just above 0.5 boundary', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.6 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle integers without change', () => {
      const component = {
        inputs: { SIGNAL_IN: 5 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle zero', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Input type handling', () => {
    it('should handle string numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '3.7' }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle string integers', () => {
      const component = {
        inputs: { SIGNAL_IN: '5' }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should return 0 for invalid string input', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid' }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for null input', () => {
      const component = {
        inputs: { SIGNAL_IN: null }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for empty string input', () => {
      const component = {
        inputs: { SIGNAL_IN: '' }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Special number handling', () => {
    it('should handle Infinity correctly', () => {
      const component = {
        inputs: { SIGNAL_IN: Infinity }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(Infinity)
    })

    it('should handle negative Infinity correctly', () => {
      const component = {
        inputs: { SIGNAL_IN: -Infinity }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(-Infinity)
    })

    it('should handle NaN correctly', () => {
      const component = {
        inputs: { SIGNAL_IN: NaN }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 999999999.7 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(1000000000)
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.0000001 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Time-based averaging', () => {
    it('should calculate average over time frame', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: 1 } // 1 second
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)

      // Second call 500ms later
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 5.2
      result = processRoundTick(component)
      expect(result.SIGNAL_OUT).toBe(5)

      // Third call 200ms later (within 1s window)
      vi.setSystemTime(new Date('2023-01-01T00:00:00.700Z'))
      component.inputs.SIGNAL_IN = 2.8
      result = processRoundTick(component)
      expect(result.SIGNAL_OUT).toBe(4) // Average of 4, 5, 3
    })

    it('should remove old entries outside time frame', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: 1 } // 1 second
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)

      // Second call 1.5s later (outside time frame)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN = 5.2
      result = processRoundTick(component)
      expect(result.SIGNAL_OUT).toBe(5) // Only the new value
    })

    it('should handle zero time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: 0 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
      expect(component.signalHistory).toBeUndefined()
    })

    it('should handle negative time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: -1 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
      expect(component.signalHistory).toBeUndefined()
    })

    it('should initialize signal history on first call', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: 1 }
      }

      processRoundTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
    })
  })

  describe('Clamping functionality', () => {
    it('should clamp values to specified range', () => {
      const component = {
        inputs: { SIGNAL_IN: 15.7 },
        settings: { clampMin: 0, clampMax: 10 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
    })

    it('should clamp negative values', () => {
      const component = {
        inputs: { SIGNAL_IN: -5.3 },
        settings: { clampMin: 0, clampMax: 10 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should not clamp when values are within range', () => {
      const component = {
        inputs: { SIGNAL_IN: 5.3 },
        settings: { clampMin: 0, clampMax: 10 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle clamping with negative bounds', () => {
      const component = {
        inputs: { SIGNAL_IN: -15.7 },
        settings: { clampMin: -10, clampMax: -5 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(-10)
    })

    it('should not clamp when only one bound is specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 15.7 },
        settings: { clampMin: 0 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(16)
    })

    it('should not clamp when only max bound is specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 15.7 },
        settings: { clampMax: 10 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(16)
    })
  })

  describe('Precision functionality', () => {
    it('should apply precision to output', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: { precision: 2 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3.14)
    })

    it('should handle precision of 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: { precision: 0 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3)
    })

    it('should handle precision of 1', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: { precision: 1 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3.1)
    })

    it('should handle precision of 3', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: { precision: 3 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3.142)
    })

    it('should not apply precision when precision is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3)
    })

    it('should not apply precision when precision is 0 or negative', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: { precision: -1 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3)
    })
  })

  describe('Combined features', () => {
    it('should apply rounding, time averaging, clamping, and precision in order', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: {
          timeFrame: 1,
          clampMin: 0,
          clampMax: 10,
          precision: 1
        }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3.7) // Rounded to 4, then averaged, then clamped, then precision

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 5.2
      result = processRoundTick(component)
      expect(result.SIGNAL_OUT).toBe(4.5) // Average of 4 and 5
    })

    it('should handle time averaging with clamping', () => {
      const component = {
        inputs: { SIGNAL_IN: 15.7 },
        settings: {
          timeFrame: 1,
          clampMin: 0,
          clampMax: 10
        }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // Clamped to 10

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 5.2
      result = processRoundTick(component)
      expect(result.SIGNAL_OUT).toBe(10) // Average of 10 and 5, then clamped to 10
    })
  })

  describe('Edge cases', () => {
    it('should handle very large precision values', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.14159 },
        settings: { precision: 10 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3.14159)
    })

    it('should handle very large time frame values', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: 999999 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle very large clamp values', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { clampMin: -999999, clampMax: 999999 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(4)
    })

    it('should handle reversed clamp bounds', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { clampMin: 10, clampMax: 0 }
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0) // Clamped to min (0)
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {}
      }

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 }
      }
      expect(() => processRoundTick(component)).toThrow()
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should maintain signal history across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { timeFrame: 1 }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      processRoundTick(component)
      expect(component.signalHistory.length).toBe(1)

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN = 5.2
      processRoundTick(component)
      expect(component.signalHistory.length).toBe(2)

      // Third call (old entry should be removed)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN = 2.8
      processRoundTick(component)
      expect(component.signalHistory.length).toBe(1)
    })

    it('should handle changing settings between calls', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7 },
        settings: { precision: 1 }
      }

      // First call with precision
      let result = processRoundTick(component)

      expect(result.SIGNAL_OUT).toBe(3.7)

      // Change to no precision
      component.settings.precision = undefined
      result = processRoundTick(component)
      expect(result.SIGNAL_OUT).toBe(4)
    })
  })
})
