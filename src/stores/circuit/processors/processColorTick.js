import hsvToRgb from '../../../utils/hsvToRgb'

/**
 * Processes a single tick for a Color component in the circuit simulation.
 *
 * Outputs a combined color signal for light control.
 * Inputs are normalized to [0,1] range.
 * Non-numeric inputs are handled gracefully.
 *
 * @param {Object} component - The Color component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN_R - Red channel input (0-1)
 * @param {number|string} component.inputs.SIGNAL_IN_G - Green channel input (0-1)
 * @param {number|string} component.inputs.SIGNAL_IN_B - Blue channel input (0-1)
 * @param {number|string} component.inputs.SIGNAL_IN_A - Alpha channel input (0-1)
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useHSV - If true, inputs are interpreted as HSV
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid inputs
 *
 * @example
 * // RGB mode
 * const component = {
 *   inputs: { SIGNAL_IN_R: 1.0, SIGNAL_IN_G: 0.5, SIGNAL_IN_B: 0.0, SIGNAL_IN_A: 1.0 },
 *   settings: { useHSV: false }
 * }
 * const result = processColorTick(component)
 * console.log(result.SIGNAL_OUT) // "1,0.5,0,1"
 *
 * @example
 * // HSV mode
 * const component = {
 *   inputs: { SIGNAL_IN_R: 120, SIGNAL_IN_G: 1.0, SIGNAL_IN_B: 0.8, SIGNAL_IN_A: 1.0 },
 *   settings: { useHSV: true }
 * }
 * const result = processColorTick(component)
 * console.log(result.SIGNAL_OUT) // "0,0.8,0,1" (green color)
 */
export default function processColorTick (component) {
  const { inputs, settings } = component

  const rIn = inputs?.SIGNAL_IN_R
  const gIn = inputs?.SIGNAL_IN_G
  const bIn = inputs?.SIGNAL_IN_B
  const aIn = inputs?.SIGNAL_IN_A

  // Handle case where no inputs are provided
  if (rIn === undefined && gIn === undefined && bIn === undefined && aIn === undefined) {
    return undefined
  }

  try {
    let r, g, b

    // Process alpha channel (default to 1 if not provided)
    const a = clampToRange(parseFloat(aIn) || 1, 0, 1)

    if (settings?.useHSV) {
      // HSV mode: R=Hue(0-360), G=Saturation(0-1), B=Value(0-1)
      const h = clampToRange(parseFloat(rIn) || 0, 0, 360)
      const s = clampToRange(parseFloat(gIn) || 0, 0, 1)
      const v = clampToRange(parseFloat(bIn) || 0, 0, 1)

      const rgb = hsvToRgb(h, s, v)

      r = clampToRange(rgb.r, 0, 1)
      g = clampToRange(rgb.g, 0, 1)
      b = clampToRange(rgb.b, 0, 1)
    } else {
      // RGB mode: all channels 0-1
      r = clampToRange(parseFloat(rIn) || 0, 0, 1)
      g = clampToRange(parseFloat(gIn) || 0, 0, 1)
      b = clampToRange(parseFloat(bIn) || 0, 0, 1)
    }

    // Validate all values
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
      return undefined
    }

    return { SIGNAL_OUT: `${r},${g},${b},${a}` }
  } catch (error) {
    return undefined
  }
}

/**
 * Clamp a value to a specified range
 *
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} The clamped value
 */
function clampToRange (value, min, max) {
  if (isNaN(value) || !isFinite(value)) {
    return min
  }

  return Math.max(min, Math.min(max, value))
}
