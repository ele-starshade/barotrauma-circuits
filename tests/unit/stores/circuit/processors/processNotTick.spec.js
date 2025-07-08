import { describe, it, expect, beforeEach, vi } from 'vitest'
import processNotTick from '../../../../../src/stores/circuit/processors/processNotTick.js'

describe('processNotTick', () => {
  beforeEach(() => {
    // Reset Date.now to a fixed value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
  })

  describe('Basic functionality', () => {
    it('should output 1 when input is below threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should output 0 when input is above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.8 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should use default threshold of 0.5 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: {}
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle negative inputs', () => {
      const component = {
        inputs: { SIGNAL_IN: -0.5 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle zero input', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })
  })

  describe('Input handling', () => {
    it('should handle null input with continuousOutput false', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: { continuousOutput: false }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle undefined input with continuousOutput false', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined },
        settings: { continuousOutput: false }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle empty string input with continuousOutput false', () => {
      const component = {
        inputs: { SIGNAL_IN: '' },
        settings: { continuousOutput: false }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle null input with continuousOutput true and existing value', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: { continuousOutput: true },
        value: 0
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle null input with continuousOutput true and no existing value', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: { continuousOutput: true }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle string inputs by converting to numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '0.3' },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle invalid numeric inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid' },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })
  })

  describe('Hysteresis functionality', () => {
    it('should use default hysteresis of 0.1 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.6 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should transition from low to high state when input exceeds high threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.7 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'low'
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.hysteresisState).toBe('high')
    })

    it('should stay in low state when input is below high threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.5 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'low'
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.hysteresisState).toBe('low')
    })

    it('should transition from high to low state when input falls below low threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'high'
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.hysteresisState).toBe('low')
    })

    it('should stay in high state when input is above low threshold', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.5 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'high'
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.hysteresisState).toBe('high')
    })

    it('should initialize hysteresis state when not present', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.hysteresisState).toBe('low')
    })
  })

  describe('Special cases', () => {
    it('should handle infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: Infinity },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle negative infinity input', () => {
      const component = {
        inputs: { SIGNAL_IN: -Infinity },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle NaN input', () => {
      const component = {
        inputs: { SIGNAL_IN: NaN },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN: true },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle false boolean input', () => {
      const component = {
        inputs: { SIGNAL_IN: false },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })
  })

  describe('Time-based processing', () => {
    it('should initialize signalHistory when timeFrame > 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 }
      }

      processNotTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
      expect(component.signalHistory[0].value).toBe(1)
    })

    it('should not initialize signalHistory when timeFrame = 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, timeFrame: 0 }
      }

      processNotTick(component)

      expect(component.signalHistory).toBeUndefined()
    })

    it('should add entries to existing signalHistory', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [{ value: 0, timestamp: Date.now() - 500 }]
      }

      processNotTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[1].value).toBe(1)
    })

    it('should remove old entries outside timeFrame', () => {
      const oldTimestamp = Date.now() - 2000 // 2 seconds ago
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: oldTimestamp },
          { value: 1, timestamp: Date.now() - 500 }
        ]
      }

      processNotTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[0].value).toBe(1)
      expect(component.signalHistory[1].value).toBe(1)
    })

    it('should calculate average and convert to binary', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: Date.now() - 500 },
          { value: 1, timestamp: Date.now() - 200 }
        ]
      }

      const result = processNotTick(component)

      // Average of 0, 1, 1 = 0.67, which is > 0.5, so output 1
      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should output 0 when average is <= 0.5', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.8 },
        settings: { threshold: 0.5, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: Date.now() - 500 },
          { value: 0, timestamp: Date.now() - 200 }
        ]
      }

      const result = processNotTick(component)

      // Average of 0, 0, 0 = 0, which is <= 0.5, so output 0
      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Component state updates', () => {
    it('should update component.value with result', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5 }
      }

      processNotTick(component)

      expect(component.value).toBe(1)
    })
  })

  describe('Error handling', () => {
    it('should return 1 on calculation error', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5 }
      }

      // Mock a scenario that would cause an error
      vi.spyOn(Number, 'isNaN').mockImplementation(() => {
        throw new Error('Test error')
      })

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)

      vi.restoreAllMocks()
    })

    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1e308 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1e-308 },
        settings: { threshold: 0.5 }
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle threshold exactly at input value', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.5 },
        settings: { threshold: 0.5, hysteresis: 0.1 },
        hysteresisState: 'low'
      }

      const result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle typical NOT scenarios', () => {
      const testCases = [
        { input: 0, expected: 1 },
        { input: 0.3, expected: 1 },
        { input: 0.5, expected: 1 }, // Below high threshold when in low state
        { input: 0.7, expected: 0 },
        { input: 1, expected: 0 }
      ]

      testCases.forEach(({ input, expected }) => {
        const component = {
          inputs: { SIGNAL_IN: input },
          settings: { threshold: 0.5, hysteresis: 0.1 }
        }

        const result = processNotTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle hysteresis transitions correctly', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1 }
      }

      // Start in low state
      let result = processNotTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.hysteresisState).toBe('low')

      // Input above high threshold, should transition to high
      component.inputs.SIGNAL_IN = 0.7
      result = processNotTick(component)
      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.hysteresisState).toBe('high')

      // Input below low threshold, should transition back to low
      component.inputs.SIGNAL_IN = 0.3
      result = processNotTick(component)
      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.hysteresisState).toBe('low')
    })

    it('should handle time-based processing with hysteresis', () => {
      const component = {
        inputs: { SIGNAL_IN: 0.3 },
        settings: { threshold: 0.5, hysteresis: 0.1, timeFrame: 1 },
        signalHistory: [
          { value: 0, timestamp: Date.now() - 500 },
          { value: 1, timestamp: Date.now() - 200 }
        ]
      }

      const result = processNotTick(component)

      // Average of 0, 1, 1 = 0.67, which is > 0.5, so output 1
      expect(result.SIGNAL_OUT).toBe(1)
    })
  })
})
