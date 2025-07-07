/**
 * Processes a single tick for a Floor component in the circuit simulation
 *
 * Outputs the largest integer value that is smaller than or equal to the input.
 *
 * @param {Object} component - The Floor component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal
 * @returns {number|undefined} The floor of the input, or undefined if the input is not valid
 */
export default function processFloorTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn) || 0

    return { SIGNAL_OUT: Math.floor(num) }
  }
}
