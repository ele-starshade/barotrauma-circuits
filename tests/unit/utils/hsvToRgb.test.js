import { describe, it, expect } from 'vitest'
import hsvToRgb from '../../../src/utils/hsvToRgb.js'

describe('hsvToRgb', () => {
  describe('pure colors (saturation = 1, value = 1)', () => {
    it('should convert red (hue = 0)', () => {
      const result = hsvToRgb(0, 1, 1)

      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should convert yellow (hue = 60)', () => {
      const result = hsvToRgb(60, 1, 1)

      expect(result).toEqual({ r: 255, g: 255, b: 0 })
    })

    it('should convert green (hue = 120)', () => {
      const result = hsvToRgb(120, 1, 1)

      expect(result).toEqual({ r: 0, g: 255, b: 0 })
    })

    it('should convert cyan (hue = 180)', () => {
      const result = hsvToRgb(180, 1, 1)

      expect(result).toEqual({ r: 0, g: 255, b: 255 })
    })

    it('should convert blue (hue = 240)', () => {
      const result = hsvToRgb(240, 1, 1)

      expect(result).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('should convert magenta (hue = 300)', () => {
      const result = hsvToRgb(300, 1, 1)

      expect(result).toEqual({ r: 255, g: 0, b: 255 })
    })

    it('should convert back to red (hue = 360)', () => {
      const result = hsvToRgb(360, 1, 1)

      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe('intermediate hues', () => {
    it('should convert orange (hue = 30)', () => {
      const result = hsvToRgb(30, 1, 1)

      expect(result).toEqual({ r: 255, g: 128, b: 0 })
    })

    it('should convert lime (hue = 90)', () => {
      const result = hsvToRgb(90, 1, 1)

      expect(result).toEqual({ r: 128, g: 255, b: 0 })
    })

    it('should convert spring green (hue = 150)', () => {
      const result = hsvToRgb(150, 1, 1)

      expect(result).toEqual({ r: 0, g: 255, b: 128 })
    })

    it('should convert azure (hue = 210)', () => {
      const result = hsvToRgb(210, 1, 1)

      expect(result).toEqual({ r: 0, g: 128, b: 255 })
    })

    it('should convert violet (hue = 270)', () => {
      const result = hsvToRgb(270, 1, 1)

      expect(result).toEqual({ r: 128, g: 0, b: 255 })
    })

    it('should convert rose (hue = 330)', () => {
      const result = hsvToRgb(330, 1, 1)

      expect(result).toEqual({ r: 255, g: 0, b: 128 })
    })
  })

  describe('saturation variations', () => {
    it('should handle zero saturation (grayscale)', () => {
      const result = hsvToRgb(0, 0, 1)

      expect(result).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('should handle half saturation', () => {
      const result = hsvToRgb(0, 0.5, 1)

      expect(result).toEqual({ r: 255, g: 128, b: 128 })
    })

    it('should handle quarter saturation', () => {
      const result = hsvToRgb(120, 0.25, 1)

      expect(result).toEqual({ r: 191, g: 255, b: 191 })
    })
  })

  describe('value variations', () => {
    it('should handle zero value (black)', () => {
      const result = hsvToRgb(0, 1, 0)

      expect(result).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('should handle half value', () => {
      const result = hsvToRgb(0, 1, 0.5)

      expect(result).toEqual({ r: 128, g: 0, b: 0 })
    })

    it('should handle quarter value', () => {
      const result = hsvToRgb(120, 1, 0.25)

      expect(result).toEqual({ r: 0, g: 64, b: 0 })
    })
  })

  describe('combined saturation and value', () => {
    it('should handle low saturation and low value', () => {
      const result = hsvToRgb(0, 0.3, 0.4)

      expect(result).toEqual({ r: 102, g: 71, b: 71 })
    })

    it('should handle high saturation and low value', () => {
      const result = hsvToRgb(240, 0.8, 0.2)

      expect(result).toEqual({ r: 10, g: 10, b: 51 })
    })

    it('should handle low saturation and high value', () => {
      const result = hsvToRgb(180, 0.1, 0.9)

      expect(result).toEqual({ r: 207, g: 230, b: 230 })
    })
  })

  describe('edge cases', () => {
    it('should handle negative hue values', () => {
      const result = hsvToRgb(-30, 1, 1)

      expect(result).toEqual({ r: NaN, g: NaN, b: NaN }) // Function doesn't handle negative hue
    })

    it('should handle hue values greater than 360', () => {
      const result = hsvToRgb(390, 1, 1)

      expect(result).toEqual({ r: 255, g: 128, b: 0 }) // Same as hue 30
    })

    it('should handle saturation greater than 1', () => {
      const result = hsvToRgb(0, 1.5, 1)

      expect(result).toEqual({ r: 255, g: -127, b: -127 }) // Function doesn't clamp values
    })

    it('should handle value greater than 1', () => {
      const result = hsvToRgb(0, 1, 1.5)

      expect(result).toEqual({ r: 383, g: 0, b: 0 }) // Function doesn't clamp values
    })

    it('should handle negative saturation', () => {
      const result = hsvToRgb(0, -0.5, 1)

      expect(result).toEqual({ r: 255, g: 383, b: 383 }) // Function doesn't handle negative values
    })

    it('should handle negative value', () => {
      const result = hsvToRgb(0, 1, -0.5)

      expect(result).toEqual({ r: -127, g: -0, b: -0 }) // Function doesn't handle negative values
    })
  })

  describe('precision and rounding', () => {
    it('should round RGB values correctly', () => {
      const result = hsvToRgb(0, 0.5, 0.5)

      expect(result.r).toBe(Math.round(result.r))
      expect(result.g).toBe(Math.round(result.g))
      expect(result.b).toBe(Math.round(result.b))
    })

    it('should handle decimal precision in hue', () => {
      const result = hsvToRgb(30.5, 1, 1)

      expect(result.r).toBe(255)
      expect(result.g).toBe(130)
      expect(result.b).toBe(0)
    })

    it('should handle very small saturation values', () => {
      const result = hsvToRgb(0, 0.001, 1)

      expect(result).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('should handle very small value values', () => {
      const result = hsvToRgb(0, 1, 0.001)

      expect(result).toEqual({ r: 0, g: 0, b: 0 })
    })
  })

  describe('color theory validation', () => {
    it('should maintain color relationships across hue spectrum', () => {
      const red = hsvToRgb(0, 1, 1)
      const green = hsvToRgb(120, 1, 1)
      const blue = hsvToRgb(240, 1, 1)

      // Red should have maximum red component
      expect(red.r).toBe(255)
      expect(red.g).toBe(0)
      expect(red.b).toBe(0)

      // Green should have maximum green component
      expect(green.r).toBe(0)
      expect(green.g).toBe(255)
      expect(green.b).toBe(0)

      // Blue should have maximum blue component
      expect(blue.r).toBe(0)
      expect(blue.g).toBe(0)
      expect(blue.b).toBe(255)
    })

    it('should produce complementary colors at 180° difference', () => {
      const color1 = hsvToRgb(0, 1, 1) // Red
      const color2 = hsvToRgb(180, 1, 1) // Cyan

      // Cyan should be the complement of red
      expect(color1.r).toBe(255)
      expect(color1.g).toBe(0)
      expect(color1.b).toBe(0)

      expect(color2.r).toBe(0)
      expect(color2.g).toBe(255)
      expect(color2.b).toBe(255)
    })
  })
})
