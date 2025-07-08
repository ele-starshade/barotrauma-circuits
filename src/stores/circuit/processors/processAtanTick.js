/**
 * Processes a single tick for an Atan component in the circuit simulation
 *
 * Outputs the angle whose tangent is equal to the input. If the "SIGNAL_IN_X"
 * and "SIGNAL_IN_Y" connections are used, the input is interpreted as a
 * vector and the angle calculated using Atan2.
 *
 * @param {Object} component - The Atan component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The primary input signal for atan
 * @param {number|string} [component.inputs.SIGNAL_IN_Y] - The y-coordinate for atan2
 * @param {number|string} [component.inputs.SIGNAL_IN_X] - The x-coordinate for atan2
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, the trigonometric function uses radians instead of degrees.
 * @returns {number|undefined} The arctangent of the input, or undefined if inputs are not valid
 */
export default function processAtanTick (component) {
  const { inputs, settings = { useRadians: false } } = component
  const signalIn = inputs?.SIGNAL_IN
  const signalY = inputs?.SIGNAL_IN_Y
  const signalX = inputs?.SIGNAL_IN_X

  let angle

  if (signalY !== undefined && signalX !== undefined) {
    // Atan2 mode
    const y = parseFloat(signalY) || 0
    const x = parseFloat(signalX) || 0

    angle = Math.atan2(y, x)
  } else if (signalIn !== undefined) {
    // Atan mode
    const num = parseFloat(signalIn) || 0

    angle = Math.atan(num)
  } else {
    return undefined
  }

  if (!settings.useRadians) {
    angle = angle * (180 / Math.PI)
  }

  return { SIGNAL_OUT: angle }
}
