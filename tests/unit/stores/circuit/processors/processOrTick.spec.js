import { describe, it, expect, beforeEach, vi } from 'vitest'
import processOrTick from '../../../../../src/stores/circuit/processors/processOrTick.js'

describe('processOrTick', () => {
  beforeEach(() => {
    // Reset Date.now to a fixed value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
  })

  describe('Basic functionality', () => {
    it('should output true when first input is above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should output true when second input is above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should output true when both inputs are above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.9 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should output false when both inputs are below threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should use default threshold of 0.5 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: {}
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle negative inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -0.5, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle zero inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('Input handling', () => {
    it('should handle null SIGNAL_IN_1 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle undefined SIGNAL_IN_1 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle empty string SIGNAL_IN_1 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle null SIGNAL_IN_2 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: null },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle undefined SIGNAL_IN_2 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: undefined },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle empty string SIGNAL_IN_2 as 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: '' },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle string inputs by converting to numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '0.8', SIGNAL_IN_2: '0.3' },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle invalid numeric inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle both invalid inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: 'invalid' },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('SET_OUTPUT functionality', () => {
    it('should override output when SET_OUTPUT is above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4, SET_OUTPUT: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should not override output when SET_OUTPUT is below threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3, SET_OUTPUT: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle null SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4, SET_OUTPUT: null },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle undefined SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4, SET_OUTPUT: undefined },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle invalid SET_OUTPUT gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3, SET_OUTPUT: 'invalid' },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('Hysteresis functionality', () => {
    it('should use default hysteresis of 0.1 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.6, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should transition from low to high state when input exceeds high threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.7, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'low'
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
      expect(component.hysteresisState).toBe('high')
    })

    it('should stay in low state when inputs are below high threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.5, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'low'
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
      expect(component.hysteresisState).toBe('low')
    })

    it('should transition from high to low state when both inputs fall below low threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'high'
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
      expect(component.hysteresisState).toBe('low')
    })

    it('should stay in high state when at least one input is above low threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.5, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'high'
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
      expect(component.hysteresisState).toBe('high')
    })

    it('should initialize hysteresis state when not present', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4 },
        settings: { threshold: 0.5, hysteresis: 0.1 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
      expect(component.hysteresisState).toBe('low')
    })
  })

  describe('Custom output values', () => {
    it('should use custom output values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, output: 'ACTIVE', falseOutput: 'INACTIVE' }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('ACTIVE')
    })

    it('should use custom false output when condition not met', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4 },
        settings: { threshold: 0.5, output: 'ACTIVE', falseOutput: 'INACTIVE' }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('INACTIVE')
    })

    it('should use default output values when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })
  })

  describe('Output length limiting', () => {
    it('should limit output length when maxOutputLength is specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, output: 'VERY_LONG_OUTPUT', maxOutputLength: 5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('VERY_')
    })

    it('should not limit output when maxOutputLength is -1', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, output: 'LONG_OUTPUT', maxOutputLength: -1 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('LONG_OUTPUT')
    })

    it('should use default maxOutputLength of -1 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, output: 'LONG_OUTPUT' }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('LONG_OUTPUT')
    })
  })

  describe('Special cases', () => {
    it('should handle infinity inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle negative infinity inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -Infinity, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle NaN inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: NaN, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: false },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle both boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: false, SIGNAL_IN_2: false },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('Time-based processing', () => {
    it('should initialize signalHistory when timeFrame > 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 }
      }

      processOrTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
      expect(component.signalHistory[0].value).toBe(1)
    })

    it('should not initialize signalHistory when timeFrame = 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, timeFrame: 0 }
      }

      processOrTick(component)

      expect(component.signalHistory).toBeUndefined()
    })

    it('should add entries to existing signalHistory', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [{ value: 0, timestamp: Date.now() - 500 }]
      }

      processOrTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[1].value).toBe(1)
    })

    it('should remove old entries outside timeFrame', () => {
      const oldTimestamp = Date.now() - 2000 // 2 seconds ago
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: oldTimestamp },
          { value: 1, timestamp: Date.now() - 500 }
        ]
      }

      processOrTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[0].value).toBe(1)
      expect(component.signalHistory[1].value).toBe(1)
    })

    it('should calculate average and convert to boolean', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: Date.now() - 500 },
          { value: 1, timestamp: Date.now() - 200 }
        ]
      }

      const result = processOrTick(component)

      // Average of 0, 1, 1 = 0.67, which is > 0.5, so output true
      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should output false when average is <= 0.5', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: Date.now() - 500 },
          { value: 0, timestamp: Date.now() - 200 }
        ]
      }

      const result = processOrTick(component)

      // Average of 0, 0, 0 = 0, which is <= 0.5, so output false
      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('Component state updates', () => {
    it('should update component.value with result', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      processOrTick(component)

      expect(component.value).toBe('1')
    })
  })

  describe('Error handling', () => {
    it('should return false output on calculation error', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      // Mock a scenario that would cause an error
      vi.spyOn(Number, 'isNaN').mockImplementation(() => {
        throw new Error('Test error')
      })

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')

      vi.restoreAllMocks()
    })

    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 1e308, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 1e-308, SIGNAL_IN_2: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle threshold exactly at input value', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.5, SIGNAL_IN_2: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'low'
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })
  })

  describe('Integration scenarios', () => {
    it('should handle typical OR scenarios', () => {
      const testCases = [
        { in1: 0, in2: 0, expected: '0' },
        { in1: 0, in2: 0.8, expected: '1' },
        { in1: 0.8, in2: 0, expected: '1' },
        { in1: 0.8, in2: 0.9, expected: '1' },
        { in1: 0.3, in2: 0.4, expected: '0' }
      ]

      testCases.forEach(({ in1, in2, expected }) => {
        const component = {
          inputs: { SIGNAL_IN_1: in1, SIGNAL_IN_2: in2 },
          settings: { threshold: 0.5, hysteresis: 0.1 }
        }

        const result = processOrTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle hysteresis transitions correctly', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4 },
        settings: { threshold: 0.5, hysteresis: 0.1 }
      }

      // Start in low state
      let result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
      expect(component.hysteresisState).toBe('low')

      // Input above high threshold, should transition to high
      component.inputs.SIGNAL_IN_1 = 0.7
      result = processOrTick(component)
      expect(result.SIGNAL_OUT).toBe('1')
      expect(component.hysteresisState).toBe('high')

      // Both inputs below low threshold, should transition back to low
      component.inputs.SIGNAL_IN_1 = 0.3
      component.inputs.SIGNAL_IN_2 = 0.4
      result = processOrTick(component)
      expect(result.SIGNAL_OUT).toBe('0')
      expect(component.hysteresisState).toBe('low')
    })

    it('should handle SET_OUTPUT override with hysteresis', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.3, SIGNAL_IN_2: 0.4, SET_OUTPUT: 0.8 },
        settings: { threshold: 0.5, hysteresis: 0.1 }
      }

      const result = processOrTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })

    it('should handle time-based processing with custom outputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.3 },
        settings: {
          threshold: 0.5,
          timeFrame: 1,
          output: 'ACTIVE',
          falseOutput: 'INACTIVE'
        },
        signalHistory: [
          { value: 0, timestamp: Date.now() - 500 },
          { value: 1, timestamp: Date.now() - 200 }
        ]
      }

      const result = processOrTick(component)

      // Average of 0, 1, 1 = 0.67, which is > 0.5, so output 'ACTIVE'
      expect(result.SIGNAL_OUT).toBe('ACTIVE')
    })
  })
})
