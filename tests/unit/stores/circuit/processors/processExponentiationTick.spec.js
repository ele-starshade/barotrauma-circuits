import { describe, it, expect, beforeEach } from 'vitest'
import processExponentiationTick from '../../../../../src/stores/circuit/processors/processExponentiationTick.js'

describe('processExponentiationTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: {
        exponent: 2
      }
    }
  })

  describe('Basic exponentiation calculations', () => {
    it('should calculate basic exponentiation correctly', () => {
      const testCases = [
        { base: 2, exponent: 3, expected: 8 }, // 2^3 = 8
        { base: 3, exponent: 2, expected: 9 }, // 3^2 = 9
        { base: 5, exponent: 0, expected: 1 }, // 5^0 = 1
        { base: 1, exponent: 10, expected: 1 }, // 1^10 = 1
        { base: 0, exponent: 5, expected: 0 }, // 0^5 = 0
        { base: 10, exponent: 2, expected: 100 }, // 10^2 = 100
        { base: 2, exponent: 10, expected: 1024 } // 2^10 = 1024
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should use default exponent when SET_EXPONENT is not provided', () => {
      component.settings.exponent = 3
      component.inputs.SIGNAL_IN = 2
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(8) // 2^3 = 8
    })

    it('should use default exponent of 2 when no exponent is configured', () => {
      component.settings = {}
      component.inputs.SIGNAL_IN = 3
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(9) // 3^2 = 9
    })

    it('should handle string inputs by converting to numbers', () => {
      component.inputs.SIGNAL_IN = '2'
      component.inputs.SET_EXPONENT = '3'
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(8)
    })

    it('should handle decimal exponents', () => {
      component.inputs.SIGNAL_IN = 4
      component.inputs.SET_EXPONENT = 0.5
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(2) // 4^0.5 = 2
    })

    it('should handle negative exponents', () => {
      component.inputs.SIGNAL_IN = 2
      component.inputs.SET_EXPONENT = -2
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0.25) // 2^(-2) = 1/4 = 0.25
    })
  })

  describe('Special cases and edge cases', () => {
    it('should handle zero to non-positive power', () => {
      const testCases = [
        { base: 0, exponent: 0, expected: 0 },
        { base: 0, exponent: -1, expected: 0 },
        { base: 0, exponent: -5, expected: 0 }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle negative base with non-integer exponent', () => {
      const testCases = [
        { base: -2, exponent: 0.5, expected: 0 },
        { base: -3, exponent: 1.5, expected: 0 },
        { base: -1, exponent: 0.25, expected: 0 }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle negative base with integer exponent', () => {
      const testCases = [
        { base: -2, exponent: 2, expected: 4 }, // (-2)^2 = 4
        { base: -2, exponent: 3, expected: -8 }, // (-2)^3 = -8
        { base: -3, exponent: 2, expected: 9 }, // (-3)^2 = 9
        { base: -3, exponent: 3, expected: -27 } // (-3)^3 = -27
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle infinity cases', () => {
      const testCases = [
        { base: Infinity, exponent: 2, expected: 0 },
        { base: 2, exponent: Infinity, expected: 0 },
        { base: -Infinity, exponent: 3, expected: 0 },
        { base: 5, exponent: -Infinity, expected: 0 }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle NaN inputs', () => {
      const testCases = [
        { base: NaN, exponent: 2, expected: NaN },
        { base: 2, exponent: NaN, expected: 2 },
        { base: NaN, exponent: NaN, expected: NaN }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })
  })

  describe('Input validation and edge cases', () => {
    it('should handle null inputs as 0', () => {
      const testCases = [
        { base: null, exponent: 2, expected: 0 },
        { base: 2, exponent: null, expected: 4 },
        { base: null, exponent: null, expected: 0 }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle undefined inputs as 0', () => {
      const testCases = [
        { base: undefined, exponent: 2, expected: 0 },
        { base: 2, exponent: undefined, expected: 4 },
        { base: undefined, exponent: undefined, expected: 0 }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle empty string inputs as 0', () => {
      const testCases = [
        { base: '', exponent: 2, expected: 0 },
        { base: 2, exponent: '', expected: 1 },
        { base: '', exponent: '', expected: 0 }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle non-numeric string inputs', () => {
      const testCases = [
        { base: 'abc', exponent: 2, expected: 'abc' },
        { base: 2, exponent: 'xyz', expected: 2 },
        { base: 'abc', exponent: 'xyz', expected: 'abc' }
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle missing inputs object', () => {
      component.inputs = undefined
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings object', () => {
      component.settings = undefined
      component.inputs.SIGNAL_IN = 3
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(9) // 3^2 = 9 (default exponent)
    })
  })

  describe('Clamping functionality', () => {
    it('should apply clampMax when result exceeds limit', () => {
      component.inputs.SIGNAL_IN = 5
      component.inputs.SET_EXPONENT = 3
      component.settings.clampMax = 100
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(100) // 125 clamped to 100
    })

    it('should apply clampMin when result is below limit', () => {
      component.inputs.SIGNAL_IN = 2
      component.inputs.SET_EXPONENT = -2
      component.settings.clampMin = 1
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(1) // 0.25 clamped to 1
    })

    it('should apply both clampMin and clampMax', () => {
      component.inputs.SIGNAL_IN = 3
      component.inputs.SET_EXPONENT = 4
      component.settings.clampMin = 10
      component.settings.clampMax = 50
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(50) // 81 clamped to 50
    })

    it('should not clamp when result is within bounds', () => {
      component.inputs.SIGNAL_IN = 3
      component.inputs.SET_EXPONENT = 2
      component.settings.clampMin = 1
      component.settings.clampMax = 20
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(9) // 9 is within bounds
    })

    it('should handle clampMax of 0', () => {
      component.inputs.SIGNAL_IN = 2
      component.inputs.SET_EXPONENT = 3
      component.settings.clampMax = 0
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle clampMin of 0', () => {
      component.inputs.SIGNAL_IN = 2
      component.inputs.SET_EXPONENT = -1
      component.settings.clampMin = 0
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0.5) // 0.5 is >= 0
    })
  })

  describe('Complex mathematical scenarios', () => {
    it('should handle fractional powers correctly', () => {
      const testCases = [
        { base: 4, exponent: 0.5, expected: 2 }, // Square root
        { base: 8, exponent: 1 / 3, expected: 2 }, // Cube root
        { base: 16, exponent: 0.25, expected: 2 }, // Fourth root
        { base: 9, exponent: 0.5, expected: 3 } // Square root
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })

    it('should handle very large numbers', () => {
      component.inputs.SIGNAL_IN = 10
      component.inputs.SET_EXPONENT = 6
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(1000000)
    })

    it('should handle very small numbers', () => {
      component.inputs.SIGNAL_IN = 0.1
      component.inputs.SET_EXPONENT = 3
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.001, 10)
    })

    it('should handle negative fractional powers', () => {
      const testCases = [
        { base: 4, exponent: -0.5, expected: 0.5 }, // 1/sqrt(4)
        { base: 8, exponent: -1 / 3, expected: 0.5 }, // 1/cbrt(8)
        { base: 16, exponent: -0.25, expected: 0.5 } // 1/fourth_root(16)
      ]

      testCases.forEach(({ base, exponent, expected }) => {
        component.inputs.SIGNAL_IN = base
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })
  })

  describe('Error handling', () => {
    it('should return base input when calculation throws error', () => {
      // Mock a scenario where Math.pow might fail
      const originalMathPow = Math.pow

      Math.pow = () => {
        throw new Error('Mock error')
      }

      component.inputs.SIGNAL_IN = 5
      component.inputs.SET_EXPONENT = 2
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(5)

      // Restore Math.pow
      Math.pow = originalMathPow
    })

    it('should handle missing inputs gracefully', () => {
      component.inputs = {}
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle missing settings gracefully', () => {
      component.settings = {}
      component.inputs.SIGNAL_IN = 3
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(9) // Uses default exponent of 2
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complex scenario with all features', () => {
      component.settings = {
        exponent: 3,
        clampMin: 1,
        clampMax: 1000
      }

      component.inputs.SIGNAL_IN = 5
      component.inputs.SET_EXPONENT = 4
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(625) // 5^4 = 625, within bounds
    })

    it('should handle scenario with clamping', () => {
      component.settings = {
        exponent: 2,
        clampMin: 10,
        clampMax: 100
      }

      component.inputs.SIGNAL_IN = 3
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(10) // 9 clamped to 10
    })

    it('should handle scenario with override exponent', () => {
      component.settings.exponent = 2
      component.inputs.SIGNAL_IN = 4
      component.inputs.SET_EXPONENT = 3
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(64) // 4^3 = 64 (uses override)
    })

    it('should handle scenario with default exponent', () => {
      component.settings.exponent = 3
      component.inputs.SIGNAL_IN = 2
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(8) // 2^3 = 8 (uses default)
    })
  })

  describe('Performance and edge cases', () => {
    it('should handle very large exponents', () => {
      component.inputs.SIGNAL_IN = 2
      component.inputs.SET_EXPONENT = 20
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(1048576) // 2^20
    })

    it('should handle very small bases', () => {
      component.inputs.SIGNAL_IN = 0.001
      component.inputs.SET_EXPONENT = 2
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0.000001)
    })

    it('should handle zero base with positive exponent', () => {
      component.inputs.SIGNAL_IN = 0
      component.inputs.SET_EXPONENT = 5
      const result = processExponentiationTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should handle one base with any exponent', () => {
      const testCases = [
        { exponent: 0, expected: 1 },
        { exponent: 1, expected: 1 },
        { exponent: 10, expected: 1 },
        { exponent: -5, expected: 1 },
        { exponent: 0.5, expected: 1 }
      ]

      testCases.forEach(({ exponent, expected }) => {
        component.inputs.SIGNAL_IN = 1
        component.inputs.SET_EXPONENT = exponent
        const result = processExponentiationTick(component)

        expect(result.SIGNAL_OUT).toBe(expected)
      })
    })
  })
})
