/**
 * Processes a single tick for a Modulo component in the circuit simulation.
 *
 * Outputs the remainder of a division operation.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Modulo component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal (dividend)
 * @param {number|string} [component.inputs.SET_MODULUS] - The modulus value (divisor)
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.modulus] - Default modulus value
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @param {number} [component.settings.precision] - Decimal places for output (default: 0)
 * @returns {Object} Object with SIGNAL_OUT containing the modulo result
 *
 * @example
 * // Basic modulo
 * const component = {
 *   inputs: { SIGNAL_IN: 7, SET_MODULUS: 3 },
 *   settings: { clampMax: 10, clampMin: 0 }
 * }
 * const result = processModuloTick(component)
 * console.log(result.SIGNAL_OUT) // 1
 *
 * @example
 * // Division by zero
 * const component = {
 *   inputs: { SIGNAL_IN: 5, SET_MODULUS: 0 },
 *   settings: {}
 * }
 * const result = processModuloTick(component)
 * console.log(result.SIGNAL_OUT) // 0 (error handling)
 */
export default function processModuloTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN
  const modulus = inputs?.SET_MODULUS ?? settings?.modulus ?? 1

  // Handle null/undefined/empty inputs as 0
  const inputSignal = (signalIn === null || signalIn === undefined || signalIn === '') ? 0 : signalIn
  const inputModulus = (modulus === null || modulus === undefined || modulus === '') ? 1 : modulus

  try {
    // Convert to numbers
    const numSignal = Number(inputSignal)
    const numModulus = Number(inputModulus)

    if (isNaN(numSignal) || isNaN(numModulus)) {
      // If either input cannot be converted to number, return 0
      return { SIGNAL_OUT: 0 }
    }

    // Handle special cases
    if (!isFinite(numSignal) || !isFinite(numModulus)) {
      if (isNaN(numSignal) || isNaN(numModulus)) return { SIGNAL_OUT: 0 }

      if (numModulus === 0) return { SIGNAL_OUT: 0 }

      if (numSignal === Infinity || numSignal === -Infinity) return { SIGNAL_OUT: 0 }

      return { SIGNAL_OUT: 0 }
    }

    // Handle division by zero
    if (numModulus === 0) {
      return { SIGNAL_OUT: 0 }
    }

    // Perform modulo operation
    let result = numSignal % numModulus

    // Apply precision if configured
    const precision = settings?.precision ?? 0

    if (precision > 0) {
      const factor = Math.pow(10, precision)

      result = Math.round(result * factor) / factor
    }

    // Apply clamping if configured
    if (settings?.clampMax !== undefined) {
      result = Math.min(result, settings.clampMax)
    }

    if (settings?.clampMin !== undefined) {
      result = Math.max(result, settings.clampMin)
    }

    return { SIGNAL_OUT: result }
  } catch (error) {
    // If calculation fails, return 0
    return { SIGNAL_OUT: 0 }
  }
}
