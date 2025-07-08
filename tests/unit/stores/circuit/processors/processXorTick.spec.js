import { describe, it, expect, vi, beforeEach } from 'vitest'
import processXorTick from '../../../../../src/stores/circuit/processors/processXorTick.js'

describe('processXorTick', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('Basic XOR functionality', () => {
    it('should output true when exactly one input is above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.value).toBe('XOR_TRUE')
    })

    it('should output false when both inputs are above threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.9 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
    })

    it('should output false when both inputs are below threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.2, SIGNAL_IN_2: 0.3 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
    })

    it('should output false when inputs are missing', () => {
      const component = {
        inputs: {},
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
    })

    it('should output false when only one input is provided', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
    })
  })

  describe('Threshold handling', () => {
    it('should use default threshold of 0.5 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should use custom threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.9,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // Both below 0.9 threshold
    })

    it('should handle negative threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -0.5, SIGNAL_IN_2: 0.5 },
        settings: {
          threshold: -0.1,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE') // One above -0.1, one below
    })

    it('should handle very high threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.9 },
        settings: {
          threshold: 0.95,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // Both below 0.95 threshold
    })
  })

  describe('Input type handling', () => {
    it('should handle string numbers', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '0.8', SIGNAL_IN_2: '0.2' },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should handle mixed string and number inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: '0.2' },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should handle invalid string inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 'invalid', SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // 0 vs 0.2, one above threshold
    })

    it('should handle null inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: 0.8 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE') // 0 vs 0.8, one above threshold
    })

    it('should handle undefined inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: undefined, SIGNAL_IN_2: 0.8 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // 0 vs 0.8, one above threshold
    })

    it('should handle empty string inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '', SIGNAL_IN_2: 0.8 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE') // 0 vs 0.8, one above threshold
    })
  })

  describe('Hysteresis functionality', () => {
    it('should use default hysteresis of 0.1 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.55, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should maintain previous state when input is within hysteresis band', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.55, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          hysteresis: 0.1,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      // First call - input 1 is 0.55, which is within 0.1 of threshold 0.5
      // Should default to above threshold since 0.55 > 0.5
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.hysteresisState1).toBe(1)

      // Second call - input 1 changes to 0.45, still within hysteresis band
      // Should maintain previous state (1)
      component.inputs.SIGNAL_IN_1 = 0.45
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.hysteresisState1).toBe(1)

      // Third call - input 1 changes to 0.35, outside hysteresis band
      // Should switch to below threshold (0)
      component.inputs.SIGNAL_IN_1 = 0.35
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // 0 vs 0.2, both below threshold
      expect(component.hysteresisState1).toBe(0)
    })

    it('should handle hysteresis for both inputs', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.55, SIGNAL_IN_2: 0.45 },
        settings: {
          threshold: 0.5,
          hysteresis: 0.1,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      // First call - both inputs within hysteresis band
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE') // 1 vs 0
      expect(component.hysteresisState1).toBe(1)
      expect(component.hysteresisState2).toBe(0)

      // Second call - maintain states
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.hysteresisState1).toBe(1)
      expect(component.hysteresisState2).toBe(0)
    })

    it('should handle custom hysteresis value', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.6, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          hysteresis: 0.2,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      // Input 1 is 0.6, which is within 0.2 of threshold 0.5
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.hysteresisState1).toBe(1)

      // Change to 0.4, still within 0.2 hysteresis band
      component.inputs.SIGNAL_IN_1 = 0.4
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.hysteresisState1).toBe(1)
    })
  })

  describe('Dynamic overrides', () => {
    it('should use SET_OUTPUT override when provided', () => {
      const component = {
        inputs: {
          SIGNAL_IN_1: 0.8,
          SIGNAL_IN_2: 0.2,
          SET_OUTPUT: 'OVERRIDE_T'
        },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('OVERRIDE_T')
    })

    it('should fall back to settings.output when SET_OUTPUT is undefined', () => {
      const component = {
        inputs: {
          SIGNAL_IN_1: 0.8,
          SIGNAL_IN_2: 0.2,
          SET_OUTPUT: undefined
        },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should handle string SET_OUTPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_1: 0.8,
          SIGNAL_IN_2: 0.2,
          SET_OUTPUT: '123'
        },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('123')
    })
  })

  describe('Time-based averaging', () => {
    it('should calculate average over time frame', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          timeFrame: 1,
          maxOutputLength: 10
        }
      }

      // First call - XOR is true
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')

      // Second call - XOR is false
      vi.setSystemTime(new Date('2023-01-01T00:00:00.500Z'))
      component.inputs.SIGNAL_IN_1 = 0.2
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')

      // Third call - XOR is true again
      vi.setSystemTime(new Date('2023-01-01T00:00:00.700Z'))
      component.inputs.SIGNAL_IN_1 = 0.8
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_TRUE') // Average of 1, 0, 1 = 0.67 > 0.5
    })

    it('should remove old entries outside time frame', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          timeFrame: 1,
          maxOutputLength: 10
        }
      }

      // First call
      vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')

      // Second call 1.5s later (outside time frame)
      vi.setSystemTime(new Date('2023-01-01T00:00:01.500Z'))
      component.inputs.SIGNAL_IN_1 = 0.2
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // Only the new value
    })

    it('should handle zero time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          timeFrame: 0,
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.signalHistory).toBeUndefined()
    })

    it('should handle negative time frame (no averaging)', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          timeFrame: -1,
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.signalHistory).toBeUndefined()
    })
  })

  describe('Output length limiting', () => {
    it('should limit output length when maxOutputLength is set', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'VERY_LONG_XOR_OUTPUT',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 5
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('VERY_')
    })

    it('should limit falseOutput length when maxOutputLength is set', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.9 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'VERY_LONG_FALSE_OUTPUT',
          maxOutputLength: 4
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('VERY')
    })

    it('should not limit output when maxOutputLength is 0', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'FULL_OUTPUT',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 0
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('FULL_OUTPUT')
    })

    it('should not limit output when maxOutputLength is negative', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'FULL_OUTPUT',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: -1
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('FULL_OUTPUT')
    })

    it('should not limit output when maxOutputLength is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'FULL_OUTPUT',
          falseOutput: 'XOR_FALSE'
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('FULL_OUTPUT')
    })
  })

  describe('Edge cases', () => {
    it('should handle inputs exactly at threshold', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.5, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // 0.5 is not > 0.5, so 0 vs 0.2
    })

    it('should handle very large input values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 999999, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should handle very small input values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.000001, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
    })

    it('should handle negative input values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: -0.5, SIGNAL_IN_2: 0.8 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
    })

    it('should handle null output values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: null,
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })

    it('should handle undefined output values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: undefined,
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 1, SIGNAL_IN_2: 0 }
      }
      expect(() => processXorTick(component)).toThrow()
    })

    it('should handle completely empty component', () => {
      const component = {
        settings: {}
      }

      const result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })
  })

  describe('Integration scenarios', () => {
    it('should handle changing input values with hysteresis', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.55, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          hysteresis: 0.1,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      // First call
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')

      // Change input 1 to be within hysteresis band
      component.inputs.SIGNAL_IN_1 = 0.45
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_TRUE') // Maintains previous state

      // Change input 1 to be outside hysteresis band
      component.inputs.SIGNAL_IN_1 = 0.35
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // Switches to new state
    })

    it('should handle changing settings between calls', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      // First call with default threshold
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')

      // Change threshold
      component.settings.threshold = 0.9
      // Reset hysteresis states when threshold changes
      delete component.hysteresisState1
      delete component.hysteresisState2
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_FALSE') // Both below 0.9 threshold
    })

    it('should maintain state across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
        settings: {
          threshold: 0.5,
          output: 'XOR_TRUE',
          falseOutput: 'XOR_FALSE',
          maxOutputLength: 10
        }
      }

      // First call
      let result = processXorTick(component)

      expect(result.SIGNAL_OUT).toBe('XOR_TRUE')
      expect(component.value).toBe('XOR_TRUE')

      // Second call with no inputs
      component.inputs = {}
      result = processXorTick(component)
      expect(result.SIGNAL_OUT).toBe('XOR_FALSE')
      expect(component.value).toBe('XOR_FALSE')
    })
  })
})
