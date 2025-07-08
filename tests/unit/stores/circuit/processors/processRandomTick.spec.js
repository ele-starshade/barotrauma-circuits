import { describe, it, expect } from 'vitest'
import processRandomTick from '../../../../../src/stores/circuit/processors/processRandomTick'

describe('processRandomTick', () => {
  describe('Basic functionality', () => {
    it('should return the currentOutput value of the component', () => {
      const component = {
        currentOutput: 42
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(42)
    })

    it('should return another value', () => {
      const component = {
        currentOutput: -10
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(-10)
    })

    it('should return undefined if currentOutput is not set', () => {
      const component = {}
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBeUndefined()
    })
  })

  describe('Different data types', () => {
    it('should handle string currentOutput', () => {
      const component = {
        currentOutput: '123.45'
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe('123.45')
    })

    it('should handle boolean currentOutput', () => {
      const component = {
        currentOutput: true
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(true)
    })

    it('should handle null currentOutput', () => {
      const component = {
        currentOutput: null
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(null)
    })

    it('should handle undefined currentOutput', () => {
      const component = {
        currentOutput: undefined
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(undefined)
    })

    it('should handle zero currentOutput', () => {
      const component = {
        currentOutput: 0
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(0)
    })

    it('should handle negative currentOutput', () => {
      const component = {
        currentOutput: -999.99
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(-999.99)
    })

    it('should handle very large currentOutput', () => {
      const component = {
        currentOutput: 999999999.999
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(999999999.999)
    })

    it('should handle very small currentOutput', () => {
      const component = {
        currentOutput: 0.000001
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(0.000001)
    })
  })

  describe('Edge cases', () => {
    it('should handle NaN currentOutput', () => {
      const component = {
        currentOutput: NaN
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(NaN)
    })

    it('should handle Infinity currentOutput', () => {
      const component = {
        currentOutput: Infinity
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(Infinity)
    })

    it('should handle negative Infinity currentOutput', () => {
      const component = {
        currentOutput: -Infinity
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(-Infinity)
    })

    it('should handle empty string currentOutput', () => {
      const component = {
        currentOutput: ''
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe('')
    })

    it('should handle object currentOutput', () => {
      const component = {
        currentOutput: { value: 42 }
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toEqual({ value: 42 })
    })

    it('should handle array currentOutput', () => {
      const component = {
        currentOutput: [1, 2, 3]
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toEqual([1, 2, 3])
    })

    it('should handle function currentOutput', () => {
      const testFunction = () => 42
      const component = {
        currentOutput: testFunction
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(testFunction)
    })
  })

  describe('Component structure variations', () => {
    it('should work with full component structure', () => {
      const component = {
        id: 'random-1',
        name: 'Random',
        currentOutput: 42,
        settings: { min: 1, max: 100, period: 1000 },
        lastExecution: 1640995200000
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(42)
    })

    it('should work with minimal component structure', () => {
      const component = {
        currentOutput: 123
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(123)
    })

    it('should work with additional properties', () => {
      const component = {
        currentOutput: 456,
        extraProperty: 'should be ignored',
        anotherProperty: { nested: 'object' }
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(456)
    })

    it('should work with null component', () => {
      expect(() => processRandomTick(null)).toThrow()
    })

    it('should work with undefined component', () => {
      expect(() => processRandomTick(undefined)).toThrow()
    })

    it('should handle missing component gracefully', () => {
      expect(() => processRandomTick()).toThrow()
    })
  })

  describe('Error handling', () => {
    it('should handle missing component gracefully', () => {
      const result = processRandomTick()

      expect(result.VALUE_OUT).toBeUndefined()
    })

    it('should handle component with non-object currentOutput', () => {
      const component = {
        currentOutput: 'not an object'
      }
      const result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe('not an object')
    })
  })

  describe('Integration scenarios', () => {
    it('should maintain consistent output across multiple calls', () => {
      const component = {
        currentOutput: 7.5
      }

      const result1 = processRandomTick(component)
      const result2 = processRandomTick(component)
      const result3 = processRandomTick(component)

      expect(result1.VALUE_OUT).toBe(7.5)
      expect(result2.VALUE_OUT).toBe(7.5)
      expect(result3.VALUE_OUT).toBe(7.5)
    })

    it('should handle component with changing currentOutput', () => {
      const component = {
        currentOutput: 10
      }

      let result = processRandomTick(component)

      expect(result.VALUE_OUT).toBe(10)

      component.currentOutput = 20
      result = processRandomTick(component)
      expect(result.VALUE_OUT).toBe(20)

      component.currentOutput = 30
      result = processRandomTick(component)
      expect(result.VALUE_OUT).toBe(30)
    })
  })
})
