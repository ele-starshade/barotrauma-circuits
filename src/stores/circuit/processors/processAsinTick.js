/**
 * Processes a single tick for an Asin component in the circuit simulation
 *
 * The Asin Component is an electrical component that performs the inverse sine
 * function; sin-1(x). It outputs the angle whose sine is equal to the input.
 *
 * @param {Object} component - The Asin component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal, clamped to [-1, 1]
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, the trigonometric function uses radians instead of degrees.
 * @returns {number|undefined} The arcsine of the input, or undefined if the input is not valid
 */
export default function processAsinTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    let num = parseFloat(signalIn) || 0

    // Clamp the input value to the valid range for asin [-1, 1]
    num = Math.max(-1, Math.min(1, num))

    let angle = Math.asin(num)

    if (!component.settings.useRadians) {
      angle = angle * (180 / Math.PI)
    }

    return { SIGNAL_OUT: angle }
  }
}
