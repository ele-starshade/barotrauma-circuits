/**
 * Calculates the distance from a point to a line segment
 * @param {number} px - The x-coordinate of the point
 * @param {number} py - The y-coordinate of the point
 * @param {number} x1 - The x-coordinate of the first endpoint of the line segment
 * @param {number} y1 - The y-coordinate of the first endpoint of the line segment
 * @param {number} x2 - The x-coordinate of the second endpoint of the line segment
 * @param {number} y2 - The y-coordinate of the second endpoint of the line segment
 * @returns {number} The shortest distance from the point to the line segment
 */
export default function distanceToLineSegment (px, py, x1, y1, x2, y2) {
  const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2

  if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)

  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2

  t = Math.max(0, Math.min(1, t))
  const projectionX = x1 + t * (x2 - x1)
  const projectionY = y1 + t * (y2 - y1)

  return Math.sqrt((px - projectionX) ** 2 + (py - projectionY) ** 2)
}
