/**
 * Processes a single tick for an Abs component in the circuit simulation
 *
 * Calculates the absolute value of an input signal.
 *
 * @param {Object} component - The Abs component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal
 * @returns {number|undefined} The absolute value of the input, or undefined if the input is not valid
 */
export default function processAbsTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn) || 0

    return { SIGNAL_OUT: Math.abs(num) }
  }
}
