import { describe, it, expect } from 'vitest'
import distanceToLineSegment from '../../../src/utils/distanceToLineSegment.js'

describe('distanceToLineSegment', () => {
  describe('basic functionality', () => {
    it('should calculate distance to a horizontal line segment', () => {
      // Point at (0, 0), line from (0, 5) to (10, 5)
      const distance = distanceToLineSegment(0, 0, 0, 5, 10, 5)

      expect(distance).toBe(5)
    })

    it('should calculate distance to a vertical line segment', () => {
      // Point at (0, 0), line from (5, 0) to (5, 10)
      const distance = distanceToLineSegment(0, 0, 5, 0, 5, 10)

      expect(distance).toBe(5)
    })

    it('should calculate distance to a diagonal line segment', () => {
      // Point at (0, 0), line from (3, 4) to (6, 8)
      const distance = distanceToLineSegment(0, 0, 3, 4, 6, 8)

      expect(distance).toBeCloseTo(5, 1) // Distance to nearest endpoint (3, 4)
    })
  })

  describe('point on line segment', () => {
    it('should return 0 when point is exactly on the line segment', () => {
      // Point at (5, 5), line from (0, 5) to (10, 5)
      const distance = distanceToLineSegment(5, 5, 0, 5, 10, 5)

      expect(distance).toBe(0)
    })

    it('should return 0 when point is at one endpoint', () => {
      // Point at (0, 5), line from (0, 5) to (10, 5)
      const distance = distanceToLineSegment(0, 5, 0, 5, 10, 5)

      expect(distance).toBe(0)
    })

    it('should return 0 when point is at the other endpoint', () => {
      // Point at (10, 5), line from (0, 5) to (10, 5)
      const distance = distanceToLineSegment(10, 5, 0, 5, 10, 5)

      expect(distance).toBe(0)
    })
  })

  describe('point beyond line segment', () => {
    it('should calculate distance to nearest endpoint when point is beyond line segment', () => {
      // Point at (15, 5), line from (0, 5) to (10, 5)
      const distance = distanceToLineSegment(15, 5, 0, 5, 10, 5)

      expect(distance).toBe(5) // Distance to endpoint (10, 5)
    })

    it('should calculate distance to nearest endpoint when point is before line segment', () => {
      // Point at (-5, 5), line from (0, 5) to (10, 5)
      const distance = distanceToLineSegment(-5, 5, 0, 5, 10, 5)

      expect(distance).toBe(5) // Distance to endpoint (0, 5)
    })
  })

  describe('degenerate line segment (zero length)', () => {
    it('should handle line segment with zero length (same endpoints)', () => {
      // Point at (0, 0), line from (5, 5) to (5, 5) (same point)
      const distance = distanceToLineSegment(0, 0, 5, 5, 5, 5)

      expect(distance).toBeCloseTo(7.071, 3) // sqrt(5^2 + 5^2)
    })

    it('should handle line segment with very small length', () => {
      // Point at (0, 0), line from (5, 5) to (5.0001, 5.0001)
      const distance = distanceToLineSegment(0, 0, 5, 5, 5.0001, 5.0001)

      expect(distance).toBeCloseTo(7.071, 3) // Should be very close to sqrt(5^2 + 5^2)
    })
  })

  describe('edge cases', () => {
    it('should handle negative coordinates', () => {
      // Point at (-1, -1), line from (-5, -5) to (-2, -2)
      const distance = distanceToLineSegment(-1, -1, -5, -5, -2, -2)

      expect(distance).toBeCloseTo(1.414, 3) // Distance to the line
    })

    it('should handle very large coordinates', () => {
      // Point at (1000, 1000), line from (0, 0) to (2000, 2000)
      const distance = distanceToLineSegment(1000, 1000, 0, 0, 2000, 2000)

      expect(distance).toBeCloseTo(0, 1) // Point should be on the line
    })

    it('should handle decimal coordinates', () => {
      // Point at (1.5, 2.5), line from (0, 0) to (3, 5)
      const distance = distanceToLineSegment(1.5, 2.5, 0, 0, 3, 5)

      expect(distance).toBeCloseTo(0, 1) // Point should be on the line
    })
  })

  describe('mathematical accuracy', () => {
    it('should provide accurate results for known geometric cases', () => {
      // Point at (0, 0), line from (3, 0) to (0, 4) (right triangle)
      const distance = distanceToLineSegment(0, 0, 3, 0, 0, 4)

      expect(distance).toBeCloseTo(2.4, 1) // Height of triangle
    })

    it('should handle perpendicular distance calculation', () => {
      // Point at (0, 0), line from (1, 0) to (1, 10)
      const distance = distanceToLineSegment(0, 0, 1, 0, 1, 10)

      expect(distance).toBe(1) // Perpendicular distance should be exactly 1
    })
  })
})
