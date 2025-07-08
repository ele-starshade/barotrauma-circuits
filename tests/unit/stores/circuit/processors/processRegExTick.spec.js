import { describe, it, expect } from 'vitest'
import processRegExTick from '../../../../../src/stores/circuit/processors/processRegExTick.js'

describe('processRegExTick', () => {
  describe('Basic functionality', () => {
    it('should match simple pattern and return output', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world' },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
      expect(component.value).toBe('matched')
    })

    it('should not match pattern and return falseOutput', () => {
      const component = {
        inputs: { SIGNAL_IN: 'goodbye world' },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
      expect(component.value).toBe('no match')
    })

    it('should handle case-sensitive matching', () => {
      const component = {
        inputs: { SIGNAL_IN: 'Hello World' },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
    })
  })

  describe('Capture groups', () => {
    it('should extract first capture group when useCaptureGroup is true', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world' },
        settings: {
          expression: 'hello (\\w+)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('world')
      expect(component.value).toBe('world')
    })

    it('should return falseOutput when capture group is empty and outputEmptyCaptureGroup is false', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello ' },
        settings: {
          expression: 'hello (\\w*)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          outputEmptyCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
    })

    it('should return empty string when capture group is empty and outputEmptyCaptureGroup is true', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello ' },
        settings: {
          expression: 'hello (\\w*)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          outputEmptyCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })

    it('should handle multiple capture groups and use first one', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world test' },
        settings: {
          expression: 'hello (\\w+) (\\w+)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('world')
    })

    it('should handle named capture groups', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world' },
        settings: {
          expression: 'hello (?<word>\\w+)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('world')
    })
  })

  describe('SET_OUTPUT override', () => {
    it('should use SET_OUTPUT instead of settings.output when provided', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world', SET_OUTPUT: 'override' },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('override')
    })

    it('should handle string SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world', SET_OUTPUT: '123' },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('123')
    })

    it('should use settings.output when SET_OUTPUT is undefined', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world', SET_OUTPUT: undefined },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })
  })

  describe('Empty pattern handling', () => {
    it('should always match when expression is empty', () => {
      const component = {
        inputs: { SIGNAL_IN: 'any string' },
        settings: {
          expression: '',
          output: 'always match',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('always match')
    })

    it('should always match when expression is only whitespace', () => {
      const component = {
        inputs: { SIGNAL_IN: 'any string' },
        settings: {
          expression: '   ',
          output: 'always match',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('always match')
    })
  })

  describe('Continuous output mode', () => {
    it('should maintain previous output when no input and continuousOutput is true', () => {
      const component = {
        inputs: {},
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: true,
          maxOutputLength: -1
        },
        value: 'previous output'
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('previous output')
    })

    it('should use falseOutput when no input, continuousOutput is true, and no previous value', () => {
      const component = {
        inputs: {},
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: true,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
    })

    it('should use falseOutput when no input and continuousOutput is false', () => {
      const component = {
        inputs: {},
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        },
        value: 'previous output'
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
    })
  })

  describe('Output length limiting', () => {
    it('should limit output length when maxOutputLength is set', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world' },
        settings: {
          expression: 'hello (\\w+)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: 3
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('wor')
    })

    it('should not limit output when maxOutputLength is -1', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world' },
        settings: {
          expression: 'hello (\\w+)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('world')
    })

    it('should handle zero maxOutputLength', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello world' },
        settings: {
          expression: 'hello (\\w+)',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: 0
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('')
    })
  })

  describe('Input type handling', () => {
    it('should convert number input to string for matching', () => {
      const component = {
        inputs: { SIGNAL_IN: 12345 },
        settings: {
          expression: '123',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })

    it('should convert boolean input to string for matching', () => {
      const component = {
        inputs: { SIGNAL_IN: true },
        settings: {
          expression: 'true',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })

    it('should handle null input', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: {
          expression: 'null',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })

    it('should handle undefined input', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined },
        settings: {
          expression: 'undefined',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })
  })

  describe('Invalid regex handling', () => {
    it('should return falseOutput when regex is invalid', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test string' },
        settings: {
          expression: '[invalid regex',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
    })

    it('should handle regex with special characters', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test.string' },
        settings: {
          expression: 'test\\.string',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })
  })

  describe('Edge cases', () => {
    it('should handle very long input strings', () => {
      const longString = 'a'.repeat(10000)
      const component = {
        inputs: { SIGNAL_IN: longString },
        settings: {
          expression: 'a+',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })

    it('should handle very long regex patterns', () => {
      const longPattern = 'a'.repeat(1000) + 'b'
      const component = {
        inputs: { SIGNAL_IN: 'a'.repeat(1000) + 'b' },
        settings: {
          expression: longPattern,
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })

    it('should handle unicode characters', () => {
      const component = {
        inputs: { SIGNAL_IN: 'café' },
        settings: {
          expression: 'café',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })

    it('should handle emoji characters', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello 😀 world' },
        settings: {
          expression: '😀',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('no match')
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 'test' }
      }
      expect(() => processRegExTick(component)).toThrow()
    })

    it('should handle completely empty component', () => {
      const component = {}
      expect(() => processRegExTick(component)).toThrow()
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complex regex with multiple features', () => {
      const component = {
        inputs: { SIGNAL_IN: 'user@example.com' },
        settings: {
          expression: '^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})$',
          output: 'valid email',
          falseOutput: 'invalid email',
          useCaptureGroup: true,
          continuousOutput: false,
          maxOutputLength: -1
        }
      }

      const result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('user')
    })

    it('should maintain state across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN: 'hello' },
        settings: {
          expression: 'hello',
          output: 'matched',
          falseOutput: 'no match',
          useCaptureGroup: false,
          continuousOutput: true,
          maxOutputLength: -1
        }
      }

      // First call
      let result = processRegExTick(component)

      expect(result.SIGNAL_OUT).toBe('matched')

      // Second call with no input
      component.inputs = {}
      result = processRegExTick(component)
      expect(result.SIGNAL_OUT).toBe('matched')
    })
  })
})
