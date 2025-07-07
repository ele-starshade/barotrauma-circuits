/**
 * Processes a single tick for a Ceil component in the circuit simulation
 *
 * Outputs the smallest integer value that is bigger than or equal to the input.
 *
 * @param {Object} component - The Ceil component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal
 * @returns {number|undefined} The ceiling of the input, or undefined if the input is not valid
 */
export default function processCeilTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn) || 0

    return { SIGNAL_OUT: Math.ceil(num) }
  }
}
