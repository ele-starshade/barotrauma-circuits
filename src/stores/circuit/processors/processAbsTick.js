/**
 * Processes a single tick for an Abs component in the circuit simulation
 *
 * Calculates the absolute value of an input signal.
 * Non-numeric inputs are passed through unchanged.
 * Empty/null signals result in no output.
 *
 * @param {Object} component - The Abs component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 */
export default function processAbsTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  // Handle empty/null/undefined signals - no output
  if (signalIn === null || signalIn === undefined || signalIn === '') {
    return undefined
  }

  try {
    // Convert to number and check if it's valid
    const numericValue = Number(signalIn)

    if (isNaN(numericValue)) {
      // Non-numeric input passed through unchanged
      return { SIGNAL_OUT: signalIn }
    }

    // Calculate absolute value
    return { SIGNAL_OUT: Math.abs(numericValue) }
  } catch (error) {
    // If conversion fails, pass through unchanged
    return { SIGNAL_OUT: signalIn }
  }
}
