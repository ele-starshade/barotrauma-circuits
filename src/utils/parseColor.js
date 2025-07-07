/**
 * Parses various color input formats and converts them to rgba() format
 * @param {string} input - The color string to parse
 * @returns {string|null} The color in rgba() format, or null if parsing fails
 *
 * @description
 * This function supports the following color formats:
 * - Hexadecimal: #RRGGBB or #RRGGBBAA
 * - Decimal RGB: "255, 128, 64" or "255, 128, 64, 0.5"
 * - Float RGB: "1.0, 0.5, 0.25" or "1.0, 0.5, 0.25, 0.8"
 *
 * @example
 * parseColor("#FF0000")     // returns "rgba(255, 0, 0, 1)"
 * parseColor("#FF000080")   // returns "rgba(255, 0, 0, 0.5)"
 * parseColor("255, 0, 0")   // returns "rgba(255, 0, 0, 1)"
 * parseColor("1.0, 0, 0")   // returns "rgba(255, 0, 0, 1)"
 * parseColor("255, 0, 0, 0.5") // returns "rgba(255, 0, 0, 0.5)"
 * parseColor("invalid")     // returns null
 */

export default function parseColor (input) {
  if (typeof input !== 'string') return null

  const str = input.trim()

  // Hexadecimal
  if (str.startsWith('#')) {
    const hex = str.substring(1)

    if (!/^[0-9a-fA-F]+$/.test(hex)) return null

    let r, g, b, a

    if (hex.length === 8) { // #RRGGBBAA
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
      a = (parseInt(hex.substring(6, 8), 16) / 255).toFixed(2)
    } else if (hex.length === 6) { // #RRGGBB
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
      a = 1
    } else {
      return null
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  // Decimal or Float
  if (str.includes(',')) {
    const parts = str.split(',').map(p => p.trim())

    if (parts.length < 3 || parts.length > 4) return null

    // Float
    if (parts.some(p => p.includes('.'))) {
      const [r, g, b, a = '1.0'] = parts
      const rNum = parseFloat(r) * 255
      const gNum = parseFloat(g) * 255
      const bNum = parseFloat(b) * 255
      const aNum = parseFloat(a)

      if ([rNum, gNum, bNum, aNum].some(isNaN)) return null

      return `rgba(${Math.round(rNum)}, ${Math.round(gNum)}, ${Math.round(bNum)}, ${aNum})`
    }

    // Decimal
    const [r, g, b, a = '255'] = parts
    const rNum = parseInt(r, 10)
    const gNum = parseInt(g, 10)
    const bNum = parseInt(b, 10)
    const aNum = parseInt(a, 10) / 255

    if ([rNum, gNum, bNum, aNum].some(isNaN)) return null

    return `rgba(${rNum}, ${gNum}, ${bNum}, ${aNum.toFixed(2)})`
  }

  return null
}
