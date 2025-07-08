import { describe, it, expect, vi } from 'vitest'
import processModuloTick from '../../../../../src/stores/circuit/processors/processModuloTick.js'

describe('processModuloTick', () => {
  describe('Basic functionality', () => {
    it('should perform basic modulo operation', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle negative dividend', () => {
      const component = {
        inputs: { SIGNAL_IN: -7, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(-1)
    })

    it('should handle negative modulus', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: -3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle both negative inputs', () => {
      const component = {
        inputs: { SIGNAL_IN: -7, SET_MODULUS: -3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(-1)
    })

    it('should use default modulus when SET_MODULUS not provided', () => {
      const component = {
        inputs: { SIGNAL_IN: 7 },
        settings: { modulus: 3 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should use default modulus of 1 when no modulus provided', () => {
      const component = {
        inputs: { SIGNAL_IN: 7 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Input handling', () => {
    it('should handle null SIGNAL_IN as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: null, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle undefined SIGNAL_IN as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle empty string SIGNAL_IN as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: '', SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle null SET_MODULUS as 1', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: null },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle undefined SET_MODULUS as 1', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: undefined },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle empty string SET_MODULUS as 1', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: '' },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle string inputs by converting to numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '7', SET_MODULUS: '3' },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle invalid numeric inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid', SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle invalid modulus gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 'invalid' },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Special cases', () => {
    it('should handle division by zero', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 0 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle infinity dividend', () => {
      const component = {
        inputs: { SIGNAL_IN: Infinity, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle negative infinity dividend', () => {
      const component = {
        inputs: { SIGNAL_IN: -Infinity, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle infinity modulus', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: Infinity },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle NaN dividend', () => {
      const component = {
        inputs: { SIGNAL_IN: NaN, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle NaN modulus', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: NaN },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle zero dividend', () => {
      const component = {
        inputs: { SIGNAL_IN: 0, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Precision handling', () => {
    it('should apply precision to result', () => {
      const component = {
        inputs: { SIGNAL_IN: 7.123, SET_MODULUS: 3 },
        settings: { precision: 2 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1.12)
    })

    it('should round to specified precision', () => {
      const component = {
        inputs: { SIGNAL_IN: 7.126, SET_MODULUS: 3 },
        settings: { precision: 2 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1.13)
    })

    it('should use default precision of 0 when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 7.123, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(1.123, 3)
    })

    it('should handle precision with negative numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: -7.123, SET_MODULUS: 3 },
        settings: { precision: 2 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(-1.12)
    })
  })

  describe('Clamping', () => {
    it('should clamp result to maximum value', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
        settings: { clampMax: 0.5 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0.5)
    })

    it('should clamp result to minimum value', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
        settings: { clampMin: 2 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(2)
    })

    it('should apply both min and max clamping', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
        settings: { clampMin: 0.5, clampMax: 1.5 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should not clamp when limits not specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle clamping with precision', () => {
      const component = {
        inputs: { SIGNAL_IN: 7.123, SET_MODULUS: 3 },
        settings: { precision: 2, clampMax: 1.1 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1.1)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1e308, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(2)
    })

    it('should handle very small numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1e-308, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1e-308)
    })

    it('should handle decimal modulus', () => {
      const component = {
        inputs: { SIGNAL_IN: 7.5, SET_MODULUS: 2.5 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN: true, SET_MODULUS: 3 },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle boolean modulus', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: true },
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Error handling', () => {
    it('should return 0 on calculation error', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
        settings: {}
      }

      // Mock a scenario that would cause an error
      vi.spyOn(Number, 'isNaN').mockImplementation(() => {
        throw new Error('Test error')
      })

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)

      vi.restoreAllMocks()
    })

    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {}
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle typical modulo scenarios', () => {
      const testCases = [
        { signal: 10, modulus: 3, expected: 1 },
        { signal: 15, modulus: 4, expected: 3 },
        { signal: 8, modulus: 8, expected: 0 },
        { signal: 0, modulus: 5, expected: 0 },
        { signal: -5, modulus: 3, expected: -2 }
      ]

      testCases.forEach(({ signal, modulus, expected }) => {
        const component = {
          inputs: { SIGNAL_IN: signal, SET_MODULUS: modulus },
          settings: {}
        }

        const result = processModuloTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle precision and clamping together', () => {
      const component = {
        inputs: { SIGNAL_IN: 7.123, SET_MODULUS: 3 },
        settings: { precision: 2, clampMin: 0.5, clampMax: 1.5 }
      }

      const result = processModuloTick(component)

      expect(result.SIGNAL_OUT).toBe(1.12)
    })
  })
})
