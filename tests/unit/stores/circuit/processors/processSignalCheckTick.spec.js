import { describe, it, expect } from 'vitest'
import processSignalCheckTick from '../../../../../src/stores/circuit/processors/processSignalCheckTick.js'

describe('processSignalCheckTick', () => {
  describe('Basic functionality', () => {
    it('should output configured value when signals match', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'VALID',
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('VALID')
      expect(component.value).toBe('VALID')
    })

    it('should output falseOutput when signals do not match', () => {
      const component = {
        inputs: { SIGNAL_IN: 'LOW' },
        settings: {
          target_signal: 'HIGH',
          output: 'VALID',
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('INVALID')
      expect(component.value).toBe('INVALID')
    })

    it('should output falseOutput when no input signal', () => {
      const component = {
        inputs: {},
        settings: {
          target_signal: 'HIGH',
          output: 'VALID',
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('INVALID')
    })
  })

  describe('Signal comparison', () => {
    it('should perform exact equality comparison (type-sensitive)', () => {
      const component = {
        inputs: { SIGNAL_IN: '5' },
        settings: {
          target_signal: 5,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('NO_MATCH') // String '5' !== number 5
    })

    it('should match identical strings', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test' },
        settings: {
          target_signal: 'test',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should not match different strings', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test' },
        settings: {
          target_signal: 'TEST',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('NO_MATCH')
    })

    it('should match numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 42 },
        settings: {
          target_signal: 42,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should match booleans', () => {
      const component = {
        inputs: { SIGNAL_IN: true },
        settings: {
          target_signal: true,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should match null values', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: {
          target_signal: null,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should match undefined values', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined },
        settings: {
          target_signal: undefined,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('NO_MATCH')
    })
  })

  describe('Dynamic overrides', () => {
    it('should use SET_TARGETSIGNAL override when provided', () => {
      const component = {
        inputs: {
          SIGNAL_IN: 'NEW_TARGET',
          SET_TARGETSIGNAL: 'NEW_TARGET'
        },
        settings: {
          target_signal: 'OLD_TARGET',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should use SET_OUTPUT override when provided', () => {
      const component = {
        inputs: {
          SIGNAL_IN: 'HIGH',
          SET_OUTPUT: 'OVERRIDE_MATCH'
        },
        settings: {
          target_signal: 'HIGH',
          output: 'DEFAULT_MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('OVERRIDE_M')
    })

    it('should use both overrides when provided', () => {
      const component = {
        inputs: {
          SIGNAL_IN: 'NEW_VALUE',
          SET_TARGETSIGNAL: 'NEW_VALUE',
          SET_OUTPUT: 'OVERRIDE_MATCH'
        },
        settings: {
          target_signal: 'OLD_VALUE',
          output: 'DEFAULT_MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('OVERRIDE_M')
    })

    it('should fall back to settings when overrides are not provided', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'DEFAULT_MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('DEFAULT_MA')
    })

    it('should handle undefined overrides', () => {
      const component = {
        inputs: {
          SIGNAL_IN: 'HIGH',
          SET_TARGETSIGNAL: undefined,
          SET_OUTPUT: undefined
        },
        settings: {
          target_signal: 'HIGH',
          output: 'DEFAULT_MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('DEFAULT_MA')
    })
  })

  describe('Output length limiting', () => {
    it('should limit output length when maxOutputLength is set', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'VERY_LONG_OUTPUT_STRING',
          falseOutput: 'INVALID',
          maxOutputLength: 5
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('VERY_')
    })

    it('should limit falseOutput length when maxOutputLength is set', () => {
      const component = {
        inputs: { SIGNAL_IN: 'LOW' },
        settings: {
          target_signal: 'HIGH',
          output: 'VALID',
          falseOutput: 'VERY_LONG_FALSE_OUTPUT',
          maxOutputLength: 4
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('VERY')
    })

    it('should not limit output when maxOutputLength is 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'FULL_OUTPUT',
          falseOutput: 'INVALID',
          maxOutputLength: 0
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('FULL_OUTPUT')
    })

    it('should not limit output when maxOutputLength is negative', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'FULL_OUTPUT',
          falseOutput: 'INVALID',
          maxOutputLength: -1
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('FULL_OUTPUT')
    })

    it('should not limit output when maxOutputLength is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'FULL_OUTPUT',
          falseOutput: 'INVALID'
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('FULL_OUTPUT')
    })
  })

  describe('Input type handling', () => {
    it('should handle string input', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test' },
        settings: {
          target_signal: 'test',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle number input', () => {
      const component = {
        inputs: { SIGNAL_IN: 42 },
        settings: {
          target_signal: 42,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle boolean input', () => {
      const component = {
        inputs: { SIGNAL_IN: false },
        settings: {
          target_signal: false,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle null input', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: {
          target_signal: null,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle undefined input', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined },
        settings: {
          target_signal: undefined,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('NO_MATCH')
    })

    it('should handle empty string input', () => {
      const component = {
        inputs: { SIGNAL_IN: '' },
        settings: {
          target_signal: '',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })
  })

  describe('Output value handling', () => {
    it('should convert number output to string', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 123,
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('123')
    })

    it('should convert boolean output to string', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: true,
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('true')
    })

    it('should handle null output', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: null,
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })

    it('should handle undefined output', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: undefined,
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })

    it('should handle null falseOutput', () => {
      const component = {
        inputs: { SIGNAL_IN: 'LOW' },
        settings: {
          target_signal: 'HIGH',
          output: 'VALID',
          falseOutput: null,
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })
  })

  describe('Edge cases', () => {
    it('should handle very long output strings', () => {
      const longString = 'a'.repeat(1000)
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: longString,
          falseOutput: 'INVALID',
          maxOutputLength: 5
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('aaaaa')
    })

    it('should handle very long target signals', () => {
      const longTarget = 'b'.repeat(1000)
      const component = {
        inputs: { SIGNAL_IN: longTarget },
        settings: {
          target_signal: longTarget,
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle special characters in signals', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test@#$%^&*()' },
        settings: {
          target_signal: 'test@#$%^&*()',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle unicode characters', () => {
      const component = {
        inputs: { SIGNAL_IN: 'café' },
        settings: {
          target_signal: 'café',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle emoji characters', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello 😀 world' },
        settings: {
          target_signal: 'hello 😀 world',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {
          target_signal: 'HIGH',
          output: 'VALID',
          falseOutput: 'INVALID',
          maxOutputLength: 10
        }
      }

      const result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('INVALID')
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' }
      }

      expect(() => processSignalCheckTick(component)).toThrow(TypeError)
    })

    it('should handle completely empty component', () => {
      const component = {}

      expect(() => processSignalCheckTick(component)).toThrow(TypeError)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle dynamic target signal changes', () => {
      const component = {
        inputs: { SIGNAL_IN: 'VALUE1' },
        settings: {
          target_signal: 'VALUE1',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      // First call with matching signal
      let result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')

      // Change target signal via override
      component.inputs.SET_TARGETSIGNAL = 'VALUE2'
      result = processSignalCheckTick(component)
      expect(result.SIGNAL_OUT).toBe('NO_MATCH')

      // Change input to match new target
      component.inputs.SIGNAL_IN = 'VALUE2'
      result = processSignalCheckTick(component)
      expect(result.SIGNAL_OUT).toBe('MATCH')
    })

    it('should handle dynamic output changes', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'DEFAULT_MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      // First call with default output
      let result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('DEFAULT_MA')

      // Override output
      component.inputs.SET_OUTPUT = 'OVERRIDE_MATCH'
      result = processSignalCheckTick(component)
      expect(result.SIGNAL_OUT).toBe('OVERRIDE_M')

      // Remove override
      delete component.inputs.SET_OUTPUT
      result = processSignalCheckTick(component)
      expect(result.SIGNAL_OUT).toBe('DEFAULT_MA')
    })

    it('should maintain state across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN: 'HIGH' },
        settings: {
          target_signal: 'HIGH',
          output: 'MATCH',
          falseOutput: 'NO_MATCH',
          maxOutputLength: 10
        }
      }

      // First call
      let result = processSignalCheckTick(component)

      expect(result.SIGNAL_OUT).toBe('MATCH')
      expect(component.value).toBe('MATCH')

      // Second call with no input
      component.inputs = {}
      result = processSignalCheckTick(component)
      expect(result.SIGNAL_OUT).toBe('NO_MATCH')
      expect(component.value).toBe('NO_MATCH')
    })
  })
})
