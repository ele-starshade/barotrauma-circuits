/**
 * Processes a single tick for an Asin component in the circuit simulation
 *
 * The Asin Component is an electrical component that performs the inverse sine
 * function; sin-1(x). It outputs the angle whose sine is equal to the input.
 * Non-numeric inputs return null.
 * Values outside [-1, 1] produce no output.
 *
 * @param {Object} component - The Asin component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal (sine value)
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, output in radians (default), false for degrees
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Input 0.5, useRadians: true (default) -> Output: 0.523... (radians)
 * const component = {
 *   inputs: { SIGNAL_IN: 0.5 },
 *   settings: { useRadians: true }
 * }
 * const result = processAsinTick(component)
 * console.log(result.SIGNAL_OUT) // 0.5235987755982989
 *
 * @example
 * // Input 0.5, useRadians: false -> Output: 30 (degrees)
 * const component = {
 *   inputs: { SIGNAL_IN: 0.5 },
 *   settings: { useRadians: false }
 * }
 * const result = processAsinTick(component)
 * console.log(result.SIGNAL_OUT) // 30.000000000000004
 *
 * @example
 * // Input 2 (outside domain) -> Output: undefined (no output)
 * const component = {
 *   inputs: { SIGNAL_IN: 2 },
 *   settings: { useRadians: true }
 * }
 * const result = processAsinTick(component)
 * console.log(result) // undefined
 */
export default function processAsinTick (component) {
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

    // Check domain: arcsine is only defined for values between -1 and 1
    if (numericValue < -1 || numericValue > 1) {
      return undefined // Invalid input, no output
    }

    // Calculate arcsine (returns angle in radians)
    const result = Math.asin(numericValue)

    // Check if result is valid (not NaN)
    if (isNaN(result)) {
      return undefined
    }

    // Convert to degrees if requested
    let angle = result

    if (component.settings?.useRadians === false) {
      angle = angle * (180 / Math.PI)
    }

    return { SIGNAL_OUT: angle }
  } catch (error) {
    return undefined
  }
}
