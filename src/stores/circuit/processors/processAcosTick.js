/**
 * Processes a single tick for an Acos component in the circuit simulation
 *
 * The Acos Component is an electrical component that performs the inverse cosine
 * function; cos-1(x). It outputs the angle whose cosine is equal to the input.
 * Non-numeric inputs are passed through unchanged.
 * Values outside [-1, 1] produce no output.
 *
 * @param {Object} component - The Acos component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal (cosine value)
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, output in radians (default), false for degrees
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Input 0.5, useRadians: true (default) -> Output: 1.047... (radians)
 * const component = {
 *   inputs: { SIGNAL_IN: 0.5 },
 *   settings: { useRadians: true }
 * }
 * const result = processAcosTick(component)
 * console.log(result.SIGNAL_OUT) // 1.0471975511965979
 *
 * @example
 * // Input 0.5, useRadians: false -> Output: 60 (degrees)
 * const component = {
 *   inputs: { SIGNAL_IN: 0.5 },
 *   settings: { useRadians: false }
 * }
 * const result = processAcosTick(component)
 * console.log(result.SIGNAL_OUT) // 60.00000000000001
 *
 * @example
 * // Input 2 (outside domain) -> Output: undefined (no output)
 * const component = {
 *   inputs: { SIGNAL_IN: 2 },
 *   settings: { useRadians: true }
 * }
 * const result = processAcosTick(component)
 * console.log(result) // undefined
 */
export default function processAcosTick (component) {
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

    // Check domain: arccosine is only defined for values between -1 and 1
    if (numericValue < -1 || numericValue > 1) {
      return undefined // Invalid input, no output
    }

    // Calculate arccosine (returns angle in radians)
    let angle = Math.acos(numericValue)

    // Convert to degrees if requested
    if (component.settings?.useRadians === false) {
      angle = angle * (180 / Math.PI)
    }

    return { SIGNAL_OUT: angle }
  } catch (error) {
    // If conversion fails, pass through unchanged
    return { SIGNAL_OUT: signalIn }
  }
}
