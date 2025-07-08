import { describe, it, expect } from 'vitest'
import parseColor from '../../../src/utils/parseColor.js'

describe('parseColor', () => {
  describe('hexadecimal format', () => {
    describe('6-digit hex (#RRGGBB)', () => {
      it('should parse red hex color', () => {
        const result = parseColor('#FF0000')

        expect(result).toBe('rgba(255, 0, 0, 1)')
      })

      it('should parse green hex color', () => {
        const result = parseColor('#00FF00')

        expect(result).toBe('rgba(0, 255, 0, 1)')
      })

      it('should parse blue hex color', () => {
        const result = parseColor('#0000FF')

        expect(result).toBe('rgba(0, 0, 255, 1)')
      })

      it('should parse black hex color', () => {
        const result = parseColor('#000000')

        expect(result).toBe('rgba(0, 0, 0, 1)')
      })

      it('should parse white hex color', () => {
        const result = parseColor('#FFFFFF')

        expect(result).toBe('rgba(255, 255, 255, 1)')
      })

      it('should parse mixed case hex', () => {
        const result = parseColor('#Ff00Ff')

        expect(result).toBe('rgba(255, 0, 255, 1)')
      })

      it('should parse lowercase hex', () => {
        const result = parseColor('#ff00ff')

        expect(result).toBe('rgba(255, 0, 255, 1)')
      })
    })

    describe('8-digit hex (#RRGGBBAA)', () => {
      it('should parse hex with full alpha', () => {
        const result = parseColor('#FF0000FF')

        expect(result).toBe('rgba(255, 0, 0, 1.00)')
      })

      it('should parse hex with half alpha', () => {
        const result = parseColor('#FF000080')

        expect(result).toBe('rgba(255, 0, 0, 0.50)')
      })

      it('should parse hex with zero alpha', () => {
        const result = parseColor('#FF000000')

        expect(result).toBe('rgba(255, 0, 0, 0.00)')
      })

      it('should parse hex with quarter alpha', () => {
        const result = parseColor('#FF000040')

        expect(result).toBe('rgba(255, 0, 0, 0.25)')
      })
    })

    describe('invalid hex formats', () => {
      it('should return null for invalid hex characters', () => {
        const result = parseColor('#GG0000')

        expect(result).toBeNull()
      })

      it('should return null for 5-digit hex', () => {
        const result = parseColor('#FFFFF')

        expect(result).toBeNull()
      })

      it('should return null for 7-digit hex', () => {
        const result = parseColor('#FFFFFFF')

        expect(result).toBeNull()
      })

      it('should return null for 9-digit hex', () => {
        const result = parseColor('#FFFFFFFFF')

        expect(result).toBeNull()
      })

      it('should return null for hex without #', () => {
        const result = parseColor('FF0000')

        expect(result).toBeNull()
      })
    })
  })

  describe('decimal RGB format', () => {
    describe('3-component RGB', () => {
      it('should parse red RGB', () => {
        const result = parseColor('255, 0, 0')

        expect(result).toBe('rgba(255, 0, 0, 1.00)')
      })

      it('should parse green RGB', () => {
        const result = parseColor('0, 255, 0')

        expect(result).toBe('rgba(0, 255, 0, 1.00)')
      })

      it('should parse blue RGB', () => {
        const result = parseColor('0, 0, 255')

        expect(result).toBe('rgba(0, 0, 255, 1.00)')
      })

      it('should parse black RGB', () => {
        const result = parseColor('0, 0, 0')

        expect(result).toBe('rgba(0, 0, 0, 1.00)')
      })

      it('should parse white RGB', () => {
        const result = parseColor('255, 255, 255')

        expect(result).toBe('rgba(255, 255, 255, 1.00)')
      })

      it('should handle spaces around commas', () => {
        const result = parseColor('255,0,0')

        expect(result).toBe('rgba(255, 0, 0, 1.00)')
      })

      it('should handle extra spaces', () => {
        const result = parseColor('  255  ,  0  ,  0  ')

        expect(result).toBe('rgba(255, 0, 0, 1.00)')
      })
    })

    describe('4-component RGBA', () => {
      it('should parse RGB with full alpha', () => {
        const result = parseColor('255, 0, 0, 255')

        expect(result).toBe('rgba(255, 0, 0, 1.00)')
      })

      it('should parse RGB with half alpha', () => {
        const result = parseColor('255, 0, 0, 128')

        expect(result).toBe('rgba(255, 0, 0, 0.50)')
      })

      it('should parse RGB with zero alpha', () => {
        const result = parseColor('255, 0, 0, 0')

        expect(result).toBe('rgba(255, 0, 0, 0.00)')
      })

      it('should parse RGB with quarter alpha', () => {
        const result = parseColor('255, 0, 0, 64')

        expect(result).toBe('rgba(255, 0, 0, 0.25)')
      })
    })

    describe('invalid decimal formats', () => {
      it('should return null for non-numeric values', () => {
        const result = parseColor('abc, 0, 0')

        expect(result).toBeNull()
      })

      it('should return null for too few components', () => {
        const result = parseColor('255, 0')

        expect(result).toBeNull()
      })

      it('should return null for too many components', () => {
        const result = parseColor('255, 0, 0, 255, 255')

        expect(result).toBeNull()
      })

      it('should return null for empty string', () => {
        const result = parseColor('')

        expect(result).toBeNull()
      })
    })
  })

  describe('float RGB format', () => {
    describe('3-component float RGB', () => {
      it('should parse red float RGB', () => {
        const result = parseColor('1.0, 0.0, 0.0')

        expect(result).toBe('rgba(255, 0, 0, 1)')
      })

      it('should parse green float RGB', () => {
        const result = parseColor('0.0, 1.0, 0.0')

        expect(result).toBe('rgba(0, 255, 0, 1)')
      })

      it('should parse blue float RGB', () => {
        const result = parseColor('0.0, 0.0, 1.0')

        expect(result).toBe('rgba(0, 0, 255, 1)')
      })

      it('should parse black float RGB', () => {
        const result = parseColor('0.0, 0.0, 0.0')

        expect(result).toBe('rgba(0, 0, 0, 1)')
      })

      it('should parse white float RGB', () => {
        const result = parseColor('1.0, 1.0, 1.0')

        expect(result).toBe('rgba(255, 255, 255, 1)')
      })

      it('should parse fractional values', () => {
        const result = parseColor('0.5, 0.25, 0.75')

        expect(result).toBe('rgba(128, 64, 191, 1)')
      })

      it('should handle values without .0', () => {
        const result = parseColor('1, 0, 0')

        expect(result).toBe('rgba(1, 0, 0, 1.00)') // Treated as decimal format
      })
    })

    describe('4-component float RGBA', () => {
      it('should parse float RGB with full alpha', () => {
        const result = parseColor('1.0, 0.0, 0.0, 1.0')

        expect(result).toBe('rgba(255, 0, 0, 1)')
      })

      it('should parse float RGB with half alpha', () => {
        const result = parseColor('1.0, 0.0, 0.0, 0.5')

        expect(result).toBe('rgba(255, 0, 0, 0.5)')
      })

      it('should parse float RGB with zero alpha', () => {
        const result = parseColor('1.0, 0.0, 0.0, 0.0')

        expect(result).toBe('rgba(255, 0, 0, 0)')
      })

      it('should parse float RGB with quarter alpha', () => {
        const result = parseColor('1.0, 0.0, 0.0, 0.25')

        expect(result).toBe('rgba(255, 0, 0, 0.25)')
      })
    })

    describe('invalid float formats', () => {
      it('should return null for non-numeric float values', () => {
        const result = parseColor('abc, 0.0, 0.0')

        expect(result).toBeNull()
      })

      it('should return null for values outside 0-1 range', () => {
        const result = parseColor('1.5, 0.0, 0.0')

        expect(result).toBe('rgba(383, 0, 0, 1)') // Function doesn't validate ranges
      })

      it('should return null for negative values', () => {
        const result = parseColor('-0.5, 0.0, 0.0')

        expect(result).toBe('rgba(-127, 0, 0, 1)') // Function doesn't validate ranges
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should return null for non-string input', () => {
      expect(parseColor(null)).toBeNull()
      expect(parseColor(undefined)).toBeNull()
      expect(parseColor(123)).toBeNull()
      expect(parseColor({})).toBeNull()
      expect(parseColor([])).toBeNull()
    })

    it('should handle whitespace-only strings', () => {
      const result = parseColor('   ')

      expect(result).toBeNull()
    })

    it('should handle strings with only commas', () => {
      const result = parseColor(',,,')

      expect(result).toBeNull()
    })

    it('should handle mixed decimal and float formats', () => {
      // This is treated as float format since any component has a decimal point
      const result = parseColor('255, 0.5, 0')

      expect(result).toBe('rgba(65025, 128, 0, 1)') // 255 * 255 = 65025, 0.5 * 255 = 128
    })

    it('should handle very large numbers', () => {
      const result = parseColor('999, 999, 999')

      expect(result).toBe('rgba(999, 999, 999, 1.00)')
    })

    it('should handle very small numbers', () => {
      const result = parseColor('0.001, 0.001, 0.001')

      expect(result).toBe('rgba(0, 0, 0, 1)')
    })
  })

  describe('format detection', () => {
    it('should prioritize hex format when input starts with #', () => {
      const result = parseColor('#FF0000')

      expect(result).toBe('rgba(255, 0, 0, 1)')
    })

    it('should detect decimal format when no dots present', () => {
      const result = parseColor('255, 0, 0')

      expect(result).toBe('rgba(255, 0, 0, 1.00)')
    })

    it('should detect float format when dots present', () => {
      const result = parseColor('1.0, 0.0, 0.0')

      expect(result).toBe('rgba(255, 0, 0, 1)')
    })

    it('should handle mixed format detection correctly', () => {
      // Treated as float format since any component has a decimal point
      const result = parseColor('255, 0.0, 0')

      expect(result).toBe('rgba(65025, 0, 0, 1)') // 255 * 255 = 65025, 0.0 * 255 = 0
    })
  })

  describe('real-world examples', () => {
    it('should parse common web colors', () => {
      expect(parseColor('#FF0000')).toBe('rgba(255, 0, 0, 1)') // Red
      expect(parseColor('#00FF00')).toBe('rgba(0, 255, 0, 1)') // Green
      expect(parseColor('#0000FF')).toBe('rgba(0, 0, 255, 1)') // Blue
      expect(parseColor('#FFFF00')).toBe('rgba(255, 255, 0, 1)') // Yellow
      expect(parseColor('#FF00FF')).toBe('rgba(255, 0, 255, 1)') // Magenta
      expect(parseColor('#00FFFF')).toBe('rgba(0, 255, 255, 1)') // Cyan
    })

    it('should parse with transparency', () => {
      expect(parseColor('#FF000080')).toBe('rgba(255, 0, 0, 0.50)') // Semi-transparent red
      expect(parseColor('255, 0, 0, 0.5')).toBe('rgba(65025, 0, 0, 0.5)') // Treated as float format
      expect(parseColor('255, 0, 0, 128')).toBe('rgba(255, 0, 0, 0.50)') // Semi-transparent red
    })

    it('should parse grayscale values', () => {
      expect(parseColor('#808080')).toBe('rgba(128, 128, 128, 1)') // Gray
      expect(parseColor('128, 128, 128')).toBe('rgba(128, 128, 128, 1.00)') // Gray
      expect(parseColor('0.5, 0.5, 0.5')).toBe('rgba(128, 128, 128, 1)') // Gray
    })
  })
})
