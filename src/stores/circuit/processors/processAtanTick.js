/**
 * Processes a single tick for an Atan component in the circuit simulation
 *
 * Outputs the angle whose tangent is equal to the input. If the "SIGNAL_IN_X"
 * and "SIGNAL_IN_Y" connections are used, the input is interpreted as a
 * vector and the angle calculated using Atan2.
 * Invalid inputs result in output of 0.
 *
 * @param {Object} component - The Atan component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The primary input signal for atan
 * @param {number|string} [component.inputs.SIGNAL_IN_Y] - The y-coordinate for atan2
 * @param {number|string} [component.inputs.SIGNAL_IN_X] - The x-coordinate for atan2
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, output in radians (default), false for degrees
 * @returns {Object} Object with SIGNAL_OUT containing the calculated angle
 *
 * @example
 * // Single input mode (atan)
 * const component = {
 *   inputs: { SIGNAL_IN: 1.0 },
 *   settings: { useRadians: true }
 * }
 * const result = processAtanTick(component)
 * console.log(result.SIGNAL_OUT) // 0.7853981633974483 (π/4)
 *
 * @example
 * // Dual input mode (atan2)
 * const component = {
 *   inputs: { SIGNAL_IN_X: 1.0, SIGNAL_IN_Y: 1.0 },
 *   settings: { useRadians: true }
 * }
 * const result = processAtanTick(component)
 * console.log(result.SIGNAL_OUT) // 0.7853981633974483 (π/4)
 */
export default function processAtanTick (component) {
  const { inputs, settings = { useRadians: true } } = component
  const signalIn = inputs?.SIGNAL_IN
  const signalY = inputs?.SIGNAL_IN_Y
  const signalX = inputs?.SIGNAL_IN_X

  let angle = 0

  try {
    // Determine mode based on available inputs
    if (signalY !== undefined && signalY !== null && signalY !== '' &&
        signalX !== undefined && signalX !== null && signalX !== '') {
      // Atan2 mode: calculate angle from vector components
      const y = parseFloat(signalY) || 0
      const x = parseFloat(signalX) || 0

      angle = Math.atan2(y, x)
    } else if (signalIn !== undefined && signalIn !== null && signalIn !== '') {
      // Single input mode: standard arctangent
      const num = parseFloat(signalIn) || 0

      angle = Math.atan(num)
    } else {
      // No valid inputs, return 0
      angle = 0
    }

    // Validate output
    if (isNaN(angle) || !isFinite(angle)) {
      angle = 0
    }

    // Convert to degrees if requested
    if (settings.useRadians === false) {
      angle = angle * (180 / Math.PI)
    }

    return { SIGNAL_OUT: angle }
  } catch (error) {
    // If calculation fails, return 0
    return { SIGNAL_OUT: 0 }
  }
}
