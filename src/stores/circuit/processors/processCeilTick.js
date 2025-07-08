/**
 * Processes a single tick for a Ceil component in the circuit simulation
 *
 * Outputs the smallest integer value that is bigger than or equal to the input.
 * Non-numeric inputs return null.
 * Empty/null signals result in no output.
 *
 * @param {Object} component - The Ceil component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Input 3.2 -> Output 4
 * const component = { inputs: { SIGNAL_IN: 3.2 } }
 * const result = processCeilTick(component)
 * console.log(result.SIGNAL_OUT) // 4
 *
 * @example
 * // Input -3.2 -> Output -3
 * const component = { inputs: { SIGNAL_IN: -3.2 } }
 * const result = processCeilTick(component)
 * console.log(result.SIGNAL_OUT) // -3
 *
 * @example
 * // Invalid input -> Output undefined
 * const component = { inputs: { SIGNAL_IN: 'abc' } }
 * const result = processCeilTick(component)
 * console.log(result) // undefined
 */
export default function processCeilTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  // Handle empty/null/undefined signals - no output
  if (signalIn === null || signalIn === undefined || signalIn === '') {
    return undefined
  }

  try {
    // Convert to number and check if it's valid
    const numericValue = Number(signalIn)

    if (isNaN(numericValue)) {
      return undefined // Non-numeric input, no output
    }

    // Calculate ceiling (smallest integer >= input)
    const result = Math.ceil(numericValue)

    // Check if result is valid (not NaN)
    if (isNaN(result)) {
      return undefined
    }

    return { SIGNAL_OUT: result }
  } catch (error) {
    return undefined
  }
}
