/**
 * Processes a single tick for a Cos component in the circuit simulation.
 *
 * Outputs the cosine of the input signal.
 * Non-numeric inputs are handled gracefully.
 * Empty/null signals result in no output.
 *
 * @param {Object} component - The Cos component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal (angle)
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, input is in radians (default), false for degrees
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Input 0 (radians) -> Output 1
 * const component = {
 *   inputs: { SIGNAL_IN: 0 },
 *   settings: { useRadians: true }
 * }
 * const result = processCosTick(component)
 * console.log(result.SIGNAL_OUT) // 1
 *
 * @example
 * // Input 90 (degrees) -> Output 0
 * const component = {
 *   inputs: { SIGNAL_IN: 90 },
 *   settings: { useRadians: false }
 * }
 * const result = processCosTick(component)
 * console.log(result.SIGNAL_OUT) // 0
 */
export default function processCosTick (component) {
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

    // Convert to radians if input is in degrees
    let angleInRadians = numericValue

    if (component.settings?.useRadians === false) {
      angleInRadians = numericValue * (Math.PI / 180)
    }

    // Calculate cosine
    let result = Math.cos(angleInRadians)

    // Validate output
    if (isNaN(result) || !isFinite(result)) {
      return undefined
    }

    // Clamp to valid range (though cosine is naturally bounded)
    result = Math.max(-1, Math.min(1, result))

    return { SIGNAL_OUT: result }
  } catch (error) {
    return undefined
  }
}
