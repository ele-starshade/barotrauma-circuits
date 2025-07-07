/**
 * Processes a single tick for a Cos component in the circuit simulation.
 *
 * Outputs the cosine of the input signal.
 *
 * @param {Object} component - The Cos component to process.
 * @returns {number|undefined} The cosine of the input, or undefined.
 */
export default function processCosTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    let num = parseFloat(signalIn) || 0

    if (!component.settings.useRadians) {
      // Input is in degrees, convert to radians for Math.cos
      num = num * (Math.PI / 180)
    }

    return { SIGNAL_OUT: Math.cos(num) }
  }
}
