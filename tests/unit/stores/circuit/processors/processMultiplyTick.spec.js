import { describe, it, expect, beforeEach, vi } from 'vitest'
import processMultiplyTick from '../../../../../src/stores/circuit/processors/processMultiplyTick.js'

describe('processMultiplyTick', () => {
  beforeEach(() => {
    // Reset Date.now to a fixed value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
  })

  describe('Basic functionality', () => {
    it('should multiply two positive numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should multiply positive and negative numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: -3 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(-15)
    })

    it('should multiply two negative numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -5, SIGNAL_IN_2: -3 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should handle zero multiplication', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 0 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle decimal multiplication', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.2 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(8)
    })
  })

  describe('Input handling', () => {
    it('should handle null SIGNAL_IN_1 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 5 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle undefined SIGNAL_IN_1 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: 5 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle empty string SIGNAL_IN_1 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 5 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle null SIGNAL_IN_2 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: null },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle undefined SIGNAL_IN_2 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: undefined },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle empty string SIGNAL_IN_2 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: '' },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle string inputs by converting to numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '5', SIGNAL_IN_2: '3' },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should handle invalid numeric inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: 3 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle both invalid inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: 'invalid' },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Special cases', () => {
    it('should handle infinity * finite number', () => {
      const component = {
        inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: 5 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(Infinity)
    })

    it('should handle negative infinity * finite number', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -Infinity, SIGNAL_IN_2: 5 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(-Infinity)
    })

    it('should handle infinity * zero', () => {
      const component = {
        inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: 0 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle zero * infinity', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: Infinity },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle NaN inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: NaN, SIGNAL_IN_2: 5 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle both NaN inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: NaN, SIGNAL_IN_2: NaN },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Precision handling', () => {
    it('should apply precision to result', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.2 },
        settings: { precision: 2 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(8)
    })

    it('should round to specified precision', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.3 },
        settings: { precision: 2 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(8.25)
    })

    it('should use default precision of 0 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.2 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(8)
    })

    it('should handle precision with negative numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -2.5, SIGNAL_IN_2: 3.2 },
        settings: { precision: 2 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(-8)
    })
  })

  describe('Clamping', () => {
    it('should clamp result to maximum value', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { clampMax: 10 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
    })

    it('should clamp result to minimum value', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -5, SIGNAL_IN_2: 3 },
        settings: { clampMin: -10 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(-10)
    })

    it('should apply both min and max clamping', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { clampMin: 0, clampMax: 10 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
    })

    it('should not clamp when limits not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should handle clamping with precision', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.2 },
        settings: { precision: 2, clampMax: 8.2 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(8.2)
    })
  })

  describe('Time-based processing', () => {
    it('should initialize signalHistory when timeFrame > 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1 }
      }

      processMultiplyTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
      expect(component.signalHistory[0].value).toBe(15)
    })

    it('should not initialize signalHistory when timeFrame = 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 0 }
      }

      processMultiplyTick(component)

      expect(component.signalHistory).toBeUndefined()
    })

    it('should add entries to existing signalHistory', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1 },
        signalHistory: [{ value: 10, timestamp: Date.now() - 500 }]
      }

      processMultiplyTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[1].value).toBe(15)
    })

    it('should remove old entries outside timeFrame', () => {
      const oldTimestamp = Date.now() - 2000 // 2 seconds ago
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1 },
        signalHistory: [
          { value: 10, timestamp: oldTimestamp },
          { value: 20, timestamp: Date.now() - 500 }
        ]
      }

      processMultiplyTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[0].value).toBe(20)
      expect(component.signalHistory[1].value).toBe(15)
    })

    it('should calculate average over timeFrame', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1 },
        signalHistory: [
          { value: 10, timestamp: Date.now() - 500 },
          { value: 20, timestamp: Date.now() - 200 }
        ]
      }

      const result = processMultiplyTick(component)

      // Average of 10, 20, 15 = 15
      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should re-apply precision after averaging', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.2 },
        settings: { timeFrame: 1, precision: 2 },
        signalHistory: [
          { value: 8.123, timestamp: Date.now() - 500 },
          { value: 8.456, timestamp: Date.now() - 200 }
        ]
      }

      const result = processMultiplyTick(component)

      // Average of 8.123, 8.456, 8 = 8.193, rounded to 2 decimal places
      expect(result.SIGNAL_OUT).toBe(8.19)
    })

    it('should re-apply clamping after averaging', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: { timeFrame: 1, clampMax: 12 },
        signalHistory: [
          { value: 10, timestamp: Date.now() - 500 },
          { value: 20, timestamp: Date.now() - 200 }
        ]
      }

      const result = processMultiplyTick(component)

      // Average of 10, 20, 15 = 15, but clamped to 12
      expect(result.SIGNAL_OUT).toBe(12)
    })
  })

  describe('Component state updates', () => {
    it('should update component.value with result', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: {}
      }

      processMultiplyTick(component)

      expect(component.value).toBe(15)
    })
  })

  describe('Error handling', () => {
    it('should return 0 on calculation error', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
        settings: {}
      }

      // Mock a scenario that would cause an error
      vi.spyOn(Number, 'isNaN').mockImplementation(() => {
        throw new Error('Test error')
      })

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)

      vi.restoreAllMocks()
    })

    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 }
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 1e308, SIGNAL_IN_2: 2 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(Infinity)
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 1e-308, SIGNAL_IN_2: 2 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(2e-308)
    })

    it('should handle boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: 3 },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(3)
    })

    it('should handle both boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: false },
        settings: {}
      }

      const result = processMultiplyTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle typical multiplication scenarios', () => {
      const testCases = [
        { in1: 2, in2: 3, expected: 6 },
        { in1: -2, in2: 3, expected: -6 },
        { in1: 0, in2: 5, expected: 0 },
        { in1: 2.5, in2: 2, expected: 5 },
        { in1: -2.5, in2: -2, expected: 5 }
      ]

      testCases.forEach(({ in1, in2, expected }) => {
        const component = {
          inputs: { SIGNAL_IN_1: in1, SIGNAL_IN_2: in2 },
          settings: {}
        }

        const result = processMultiplyTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle precision, clamping, and time-based processing together', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 2.5, SIGNAL_IN_2: 3.2 },
        settings: {
          precision: 2,
          clampMin: 0,
          clampMax: 8.2,
          timeFrame: 1
        },
        signalHistory: [
          { value: 8.1, timestamp: Date.now() - 500 },
          { value: 8.3, timestamp: Date.now() - 200 }
        ]
      }

      const result = processMultiplyTick(component)

      // Average of 8.1, 8.3, 8 = 8.13, rounded to 8.13, clamped to 8.2
      expect(result.SIGNAL_OUT).toBe(8.13)
    })
  })
})
