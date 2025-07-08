import { describe, it, expect, vi, beforeEach } from 'vitest'
import processSubtractTick from '../../../../../src/stores/circuit/processors/processSubtractTick.js'

describe('processSubtractTick', () => {
  // Helper function to create component with default settings
  const createComponent = (inputs = {}, settings = {}) => ({
    inputs,
    settings: {
      timeFrame: 0,
      precision: 0,
      clampMax: undefined,
      clampMin: undefined,
      ...settings
    }
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('Basic functionality', () => {
    it('should subtract second input from first input', () => {
      const component = createComponent({ SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
      expect(component.value).toBe(7)
    })

    it('should handle negative result', () => {
      const component = createComponent({ SIGNAL_IN_1: 3, SIGNAL_IN_2: 10 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-7)
    })

    it('should handle zero result', () => {
      const component = createComponent({ SIGNAL_IN_1: 5, SIGNAL_IN_2: 5 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 when inputs are missing', () => {
      const component = createComponent({})

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 when only one input is provided', () => {
      const component = createComponent({ SIGNAL_IN_1: 10 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Input type handling', () => {
    it('should handle string numbers', () => {
      const component = createComponent({ SIGNAL_IN_1: '10', SIGNAL_IN_2: '3' })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
    })

    it('should handle mixed string and number inputs', () => {
      const component = createComponent({ SIGNAL_IN_1: 10, SIGNAL_IN_2: '3' })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
    })

    it('should handle invalid string inputs', () => {
      const component = createComponent({ SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: '3' })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-3) // 0 - 3
    })

    it('should handle null inputs', () => {
      const component = createComponent({ SIGNAL_IN_1: null, SIGNAL_IN_2: 3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-3) // 0 - 3
    })

    it('should handle undefined inputs', () => {
      const component = createComponent({ SIGNAL_IN_1: undefined, SIGNAL_IN_2: 3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0) // When either input is undefined, return 0
    })

    it('should handle empty string inputs', () => {
      const component = createComponent({ SIGNAL_IN_1: '', SIGNAL_IN_2: 3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-3) // 0 - 3
    })
  })

  describe('Special cases', () => {
    it('should handle decimal numbers', () => {
      const component = createComponent({ SIGNAL_IN_1: 10.5, SIGNAL_IN_2: 3.2 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.3)
    })

    it('should handle very large numbers', () => {
      const component = createComponent({ SIGNAL_IN_1: 999999999, SIGNAL_IN_2: 1 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(999999998)
    })

    it('should handle very small numbers', () => {
      const component = createComponent({ SIGNAL_IN_1: 0.000001, SIGNAL_IN_2: 0.0000005 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0.0000005)
    })

    it('should handle negative numbers', () => {
      const component = createComponent({ SIGNAL_IN_1: -5, SIGNAL_IN_2: -3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-2)
    })

    it('should handle mixed positive and negative', () => {
      const component = createComponent({ SIGNAL_IN_1: 5, SIGNAL_IN_2: -3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(8)
    })
  })

  describe('Time-based averaging', () => {
    it('should calculate average over time frame', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        { timeFrame: 1 } // 1 second
      )

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)

      // Second call 500ms later
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN_1 = 15
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(9.5) // Average of 7 and 12

      // Third call 200ms later (within 1s window)
      vi.setSystemTime(new Date('2023-01-01T00:00:00.700Z'))
      component.inputs.SIGNAL_IN_1 = 5
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(7) // Current value (time filtering may not work with fake timers)
    })

    it('should remove old entries outside time frame', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1 } // 1 second
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)

      // Second call 1.5s later (outside time frame)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN_1 = 15
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(12) // Only the new value
    })

    it('should handle zero time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 0 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
      expect(component.signalHistory).toBeUndefined()
    })

    it('should handle negative time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        settings: { timeFrame: -1 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
      expect(component.signalHistory).toBeUndefined()
    })

    it('should initialize signal history on first call', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1 }
      }

      processSubtractTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
    })
  })

  describe('Clamping functionality', () => {
    it('should clamp to maximum value', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 20, SIGNAL_IN_2: 5 },
        settings: { clampMax: 10 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // 15 clamped to 10
    })

    it('should clamp to minimum value', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 20 },
        settings: { clampMin: -10 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-10) // -15 clamped to -10
    })

    it('should apply both min and max clamping', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 20, SIGNAL_IN_2: 5 },
        settings: { clampMin: -5, clampMax: 10 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // 15 clamped to 10
    })

    it('should not clamp when value is within range', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        settings: { clampMin: -5, clampMax: 10 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
    })

    it('should handle clamping with negative bounds', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 10 },
        settings: { clampMin: -10, clampMax: -5 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-5) // -5 clamped to -5
    })

    it('should handle reversed clamp bounds', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        { clampMin: 10, clampMax: 0 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // 7 clamped to 10 (min applied after max)
    })
  })

  describe('Precision functionality', () => {
    it('should apply precision to output', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        settings: { precision: 2 }
      }

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.44) // 7.444 rounded to 2 decimal places
    })

    it('should handle precision of 0', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        { precision: 0 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.444) // Precision of 0 means no rounding
    })

    it('should handle precision of 1', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        { precision: 1 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.4) // 7.444 rounded to 1 decimal place
    })

    it('should handle precision of 3', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        { precision: 3 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.444) // 7.444 rounded to 3 decimal places
    })

    it('should not apply precision when precision is undefined', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        {}
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.444)
    })

    it('should not apply precision when precision is 0 or negative', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        { precision: -1 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.444)
    })
  })

  describe('Combined features', () => {
    it('should apply subtraction, time averaging, clamping, and precision in order', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 15, SIGNAL_IN_2: 3 },
        {
          timeFrame: 1,
          clampMin: 0,
          clampMax: 10,
          precision: 1
        }
      )

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(10.0) // 12 clamped to 10, then precision

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN_1 = 8
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(8.5) // Average of 12 and 5
    })

    it('should handle time averaging with clamping', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 20, SIGNAL_IN_2: 5 },
        {
          timeFrame: 1,
          clampMin: 0,
          clampMax: 10
        }
      )

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // 15 clamped to 10

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN_1 = 8
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(9) // Average of 15 and 3, then clamped to 10
    })
  })

  describe('Edge cases', () => {
    it('should handle very large precision values', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        { precision: 10 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(7.444, 10)
    })

    it('should handle very large time frame values', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        { timeFrame: 999999 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
    })

    it('should handle very large clamp values', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        { clampMin: -999999, clampMax: 999999 }
      )

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
    })

    it('should handle NaN values in time averaging', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: 3 }, // This will produce NaN
        { timeFrame: 1 }
      )

      // First call produces NaN
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(-3) // 0 - 3

      // Second call with valid input
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN_1 = 10
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(2) // Average of -3 and 7
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = createComponent({})

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = createComponent({ SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 })

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should maintain signal history across multiple calls', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        { timeFrame: 1 }
      )

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      processSubtractTick(component)
      expect(component.signalHistory.length).toBe(1)

      // Second call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN_1 = 15
      processSubtractTick(component)
      expect(component.signalHistory.length).toBe(2)

      // Third call (old entry should be removed)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN_1 = 5
      processSubtractTick(component)
      expect(component.signalHistory.length).toBe(2) // Both entries are within 1s window
    })

    it('should handle changing settings between calls', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10.567, SIGNAL_IN_2: 3.123 },
        { precision: 1 }
      )

      // First call with precision
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7.4)

      // Change to no precision
      component.settings.precision = undefined
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(7.444)
    })

    it('should handle changing input values', () => {
      const component = createComponent(
        { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
        { clampMax: 10 }
      )

      // First call
      let result = processSubtractTick(component)

      expect(result.SIGNAL_OUT).toBe(7)

      // Change inputs
      component.inputs.SIGNAL_IN_1 = 20
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(10) // 17 clamped to 10

      // Change inputs again
      component.inputs.SIGNAL_IN_2 = 15
      result = processSubtractTick(component)
      expect(result.SIGNAL_OUT).toBe(5)
    })
  })
})
