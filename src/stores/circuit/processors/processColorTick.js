import hsvToRgb from '../../../utils/hsvToRgb'

/**
 * Processes a single tick for a Color component in the circuit simulation.
 *
 * Outputs a combined color signal for light control.
 *
 * @param {Object} component - The Color component to process.
 * @returns {string|undefined} The combined color string (e.g., "r,g,b,a"), or undefined.
 */
export default function processColorTick (component) {
  const { inputs, settings } = component

  const rIn = inputs?.SIGNAL_IN_R
  const gIn = inputs?.SIGNAL_IN_G
  const bIn = inputs?.SIGNAL_IN_B
  const aIn = inputs?.SIGNAL_IN_A

  if (rIn === undefined && gIn === undefined && bIn === undefined && aIn === undefined) {
    return undefined // No inputs, no output
  }

  let r, g, b
  const a = Math.max(0, Math.min(255, parseInt(aIn, 10) || 0))

  if (settings.useHSV) {
    const h = Math.max(0, Math.min(360, parseFloat(rIn) || 0))
    const s = Math.max(0, Math.min(1, parseFloat(gIn) || 0))
    const v = Math.max(0, Math.min(1, parseFloat(bIn) || 0))
    const rgb = hsvToRgb(h, s, v)

    r = rgb.r
    g = rgb.g
    b = rgb.b
  } else {
    r = Math.max(0, Math.min(255, parseInt(rIn, 10) || 0))
    g = Math.max(0, Math.min(255, parseInt(gIn, 10) || 0))
    b = Math.max(0, Math.min(255, parseInt(bIn, 10) || 0))
  }

  return { SIGNAL_OUT: `${r},${g},${b},${a}` }
}
