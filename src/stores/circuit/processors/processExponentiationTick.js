/**
 * Processes a single tick for an Exponentiation component in the circuit simulation.
 *
 * Outputs the input raised to a given power.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Exponentiation component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The base input signal
 * @param {number|string} component.inputs.SET_EXPONENT - The exponent input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} component.settings.exponent - Default exponent value
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Basic exponentiation
 * const component = {
 *   inputs: { SIGNAL_IN: 2, SET_EXPONENT: 3 },
 *   settings: { exponent: 2, clampMax: 100, clampMin: 0 }
 * }
 * const result = processExponentiationTick(component)
 * console.log(result.SIGNAL_OUT) // 8
 *
 * @example
 * // Special case: zero to non-positive power
 * const component = {
 *   inputs: { SIGNAL_IN: 0, SET_EXPONENT: 0 },
 *   settings: { exponent: 2 }
 * }
 * const result = processExponentiationTick(component)
 * console.log(result.SIGNAL_OUT) // 0 (error handling)
 */
export default function processExponentiationTick (component) {
  const { settings, inputs } = component
  const base = inputs?.SIGNAL_IN
  const exponent = inputs?.SET_EXPONENT ?? settings?.exponent ?? 2

  // Handle null/undefined/empty inputs as 0
  const inputBase = (base === null || base === undefined || base === '') ? 0 : base
  const inputExponent = (exponent === null || exponent === undefined || exponent === '') ? 0 : exponent

  try {
    // Convert to numbers
    const numBase = Number(inputBase)
    const numExponent = Number(inputExponent)

    if (isNaN(numBase) || isNaN(numExponent)) {
      // If either input cannot be converted to number, return first input as-is
      return { SIGNAL_OUT: inputBase }
    }

    // Handle special cases
    if (numBase === 0 && numExponent <= 0) {
      return { SIGNAL_OUT: 0 } // Zero raised to non-positive power
    }

    if (numBase < 0 && !Number.isInteger(numExponent)) {
      return { SIGNAL_OUT: 0 } // Negative base with non-integer exponent
    }

    // Handle infinity cases
    if (!isFinite(numBase) || !isFinite(numExponent)) {
      return { SIGNAL_OUT: 0 }
    }

    // Perform exponentiation
    let result = Math.pow(numBase, numExponent)

    // Apply clamping if configured
    if (settings?.clampMax !== undefined) {
      result = Math.min(result, settings.clampMax)
    }

    if (settings?.clampMin !== undefined) {
      result = Math.max(result, settings.clampMin)
    }

    return { SIGNAL_OUT: result }
  } catch (error) {
    // If calculation fails, return first input as-is
    return { SIGNAL_OUT: inputBase }
  }
}
