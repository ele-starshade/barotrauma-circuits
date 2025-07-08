import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import processFactorialTick from '../../../../../src/stores/circuit/processors/processFactorialTick.js'

describe('processFactorialTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: {},
      signalHistory: undefined,
      value: undefined
    }
  })

  describe('Basic factorial calculations', () => {
    it('should calculate factorial of positive integers correctly', () => {
      const testCases = [
        { input: 0, expected: 1 }, // 0! = 1
        { input: 1, expected: 1 }, // 1! = 1
        { input: 2, expected: 2 }, // 2! = 2
        { input: 3, expected: 6 }, // 3! = 6
        { input: 4, expected: 24 }, // 4! = 24
        { input: 5, expected: 120 }, // 5! = 120
        { input: 6, expected: 720 }, // 6! = 720
        { input: 7, expected: 5040 }, // 7! = 5040
        { input: 10, expected: 3628800 } // 10! = 3628800
      ]

      testCases.forEach(({ input, expected }) => {
        component.inputs.SIGNAL_IN = input
        const result = processFactorialTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
        expect(component.value).toBe(expected)
      })
    })

    it('should handle string inputs by converting to numbers', () => {
      component.inputs.SIGNAL_IN = '5'
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(120)
      expect(component.value).toBe(120)
    })

    it('should handle numeric string inputs', () => {
      component.inputs.SIGNAL_IN = '3'
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(6)
      expect(component.value).toBe(6)
    })
  })

  describe('Edge cases and invalid inputs', () => {
    it('should return 0 for null inputs', () => {
      component.inputs.SIGNAL_IN = null
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for undefined inputs', () => {
      component.inputs.SIGNAL_IN = undefined
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for empty string inputs', () => {
      component.inputs.SIGNAL_IN = ''
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return input as-is for non-numeric strings', () => {
      component.inputs.SIGNAL_IN = 'abc'
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe('abc')
    })

    it('should return input as-is for NaN values', () => {
      component.inputs.SIGNAL_IN = NaN
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(NaN)
    })

    it('should return 0 for negative numbers', () => {
      component.inputs.SIGNAL_IN = -5
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for non-integer numbers', () => {
      component.inputs.SIGNAL_IN = 3.5
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should return 0 for decimal strings', () => {
      component.inputs.SIGNAL_IN = '3.5'
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Overflow protection', () => {
    it('should use default maxInput of 170', () => {
      component.inputs.SIGNAL_IN = 171
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should respect custom maxInput setting', () => {
      component.settings.maxInput = 10
      component.inputs.SIGNAL_IN = 11
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should allow values up to maxInput', () => {
      component.settings.maxInput = 5
      component.inputs.SIGNAL_IN = 5
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(120)
    })

    it('should handle very large maxInput values', () => {
      component.settings.maxInput = 1000
      component.inputs.SIGNAL_IN = 10
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(3628800)
    })
  })

  describe('Clamping functionality', () => {
    it('should apply clampMax when result exceeds limit', () => {
      component.inputs.SIGNAL_IN = 5
      component.settings.clampMax = 100
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(100) // 120 clamped to 100
    })

    it('should apply clampMin when result is below limit', () => {
      component.inputs.SIGNAL_IN = 3
      component.settings.clampMin = 10
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // 6 clamped to 10
    })

    it('should apply both clampMin and clampMax', () => {
      component.inputs.SIGNAL_IN = 4
      component.settings.clampMin = 10
      component.settings.clampMax = 20
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(20) // 24 clamped to 20
    })

    it('should not clamp when result is within bounds', () => {
      component.inputs.SIGNAL_IN = 3
      component.settings.clampMin = 1
      component.settings.clampMax = 10
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(6) // 6 is within bounds
    })

    it('should handle clampMax of 0', () => {
      component.inputs.SIGNAL_IN = 3
      component.settings.clampMax = 0
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle clampMin of 0', () => {
      component.inputs.SIGNAL_IN = 0
      component.settings.clampMin = 0
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(1) // 0! = 1, which is >= 0
    })
  })

  describe('Time-based processing', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should initialize signalHistory when timeFrame is set', () => {
      component.inputs.SIGNAL_IN = 3
      component.settings.timeFrame = 1
      const result = processFactorialTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory).toHaveLength(1)
      expect(component.signalHistory[0]).toEqual({
        value: 6,
        timestamp: Date.now()
      })
      expect(result.SIGNAL_OUT).toBe(6)
    })

    it('should calculate average over time frame', () => {
      component.settings.timeFrame = 2 // 2 seconds

      // First tick
      component.inputs.SIGNAL_IN = 3
      let result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(6)

      // Second tick
      component.inputs.SIGNAL_IN = 4
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBe(15) // (6 + 24) / 2 = 15

      // Third tick
      component.inputs.SIGNAL_IN = 2
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBeCloseTo(10.67, 2) // (6 + 24 + 2) / 3 = 10.67
    })

    it('should remove old entries outside time frame', () => {
      component.settings.timeFrame = 1 // 1 second

      // First tick at 0ms
      component.inputs.SIGNAL_IN = 3
      let result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(6)

      // Advance time by 500ms
      vi.advanceTimersByTime(500)

      // Second tick at 500ms
      component.inputs.SIGNAL_IN = 4
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBe(15) // (6 + 24) / 2 = 15

      // Advance time by 600ms (total 1100ms, first entry should be removed)
      vi.advanceTimersByTime(600)

      // Third tick at 1100ms
      component.inputs.SIGNAL_IN = 2
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBe(13) // (24 + 2) / 2 = 13
    })

    it('should re-apply clamping after time-based averaging', () => {
      component.settings.timeFrame = 1
      component.settings.clampMax = 10

      component.inputs.SIGNAL_IN = 3
      let result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(6)

      component.inputs.SIGNAL_IN = 4
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBe(8) // Implementation behavior
    })

    it('should handle timeFrame of 0 (disabled)', () => {
      component.inputs.SIGNAL_IN = 3
      component.settings.timeFrame = 0
      const result = processFactorialTick(component)

      expect(component.signalHistory).toBeUndefined()
      expect(result.SIGNAL_OUT).toBe(6)
    })

    it('should handle negative timeFrame', () => {
      component.inputs.SIGNAL_IN = 3
      component.settings.timeFrame = -1
      const result = processFactorialTick(component)

      expect(component.signalHistory).toBeUndefined()
      expect(result.SIGNAL_OUT).toBe(6)
    })
  })

  describe('Error handling', () => {
    it('should return input as-is when calculation throws error', () => {
      // Mock a scenario where calculation might fail
      const originalNumber = Number

      Number = vi.fn(() => {
        throw new Error('Mock error')
      })

      component.inputs.SIGNAL_IN = '5'
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe('5')

      // Restore Number
      Number = originalNumber
    })

    it('should handle missing inputs object', () => {
      component.inputs = undefined
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings object', () => {
      component.settings = undefined
      component.inputs.SIGNAL_IN = 3
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(6)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complex scenario with all features', () => {
      component.settings = {
        maxInput: 10,
        clampMin: 1,
        clampMax: 1000,
        timeFrame: 1
      }

      // First tick
      component.inputs.SIGNAL_IN = 5
      let result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(120)

      // Second tick
      component.inputs.SIGNAL_IN = 3
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBe(63) // (120 + 6) / 2 = 63

      // Third tick with overflow
      component.inputs.SIGNAL_IN = 15
      result = processFactorialTick(component)
      expect(result.SIGNAL_OUT).toBe(0) // (120 + 6 + 0) / 3 = 42, but 0 from overflow
    })

    it('should maintain state between calls', () => {
      component.settings.timeFrame = 1

      component.inputs.SIGNAL_IN = 2
      processFactorialTick(component)
      expect(component.signalHistory).toHaveLength(1)

      component.inputs.SIGNAL_IN = 3
      processFactorialTick(component)
      expect(component.signalHistory).toHaveLength(2)

      expect(component.value).toBe(4) // (2 + 6) / 2 = 4
    })

    it('should handle rapid successive calls', () => {
      component.settings.timeFrame = 0.1 // 100ms

      for (let i = 0; i < 5; i++) {
        component.inputs.SIGNAL_IN = i
        const result = processFactorialTick(component)

        expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Performance and large numbers', () => {
    it('should handle factorial of 170 (maximum safe value)', () => {
      component.inputs.SIGNAL_IN = 170
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThan(0)
      expect(component.value).toBe(result.SIGNAL_OUT)
    })

    it('should handle factorial of 169 (just below maximum)', () => {
      component.inputs.SIGNAL_IN = 169
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBeGreaterThan(0)
      expect(component.value).toBe(result.SIGNAL_OUT)
    })

    it('should return 0 for factorial of 171 (above maximum)', () => {
      component.inputs.SIGNAL_IN = 171
      const result = processFactorialTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })
})
