/**
 * Processes a single tick for a Floor component in the circuit simulation
 *
 * Outputs the largest integer value that is smaller than or equal to the input.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Floor component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @param {number} [component.settings.precision] - Decimal places for output (default: 0)
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Basic floor
 * const component = {
 *   inputs: { SIGNAL_IN: 3.7 },
 *   settings: { clampMax: 100, clampMin: 0 }
 * }
 * const result = processFloorTick(component)
 * console.log(result.SIGNAL_OUT) // 3
 *
 * @example
 * // Special case: negative number
 * const component = {
 *   inputs: { SIGNAL_IN: -3.7 },
 *   settings: {}
 * }
 * const result = processFloorTick(component)
 * console.log(result.SIGNAL_OUT) // -4
 */
export default function processFloorTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN

  // Handle null/undefined/empty inputs
  if (signalIn === null || signalIn === undefined || signalIn === '') {
    return { SIGNAL_OUT: 0 }
  }

  try {
    // Convert to number
    const num = Number(signalIn)

    if (isNaN(num)) {
      // If input cannot be converted to number, return input as-is
      return { SIGNAL_OUT: signalIn }
    }

    // Handle special cases
    if (!isFinite(num)) {
      if (num === Infinity) return { SIGNAL_OUT: Infinity }

      if (num === -Infinity) return { SIGNAL_OUT: -Infinity }

      if (isNaN(num)) return { SIGNAL_OUT: NaN }
    }

    // Perform floor operation
    let result = Math.floor(num)

    // Apply precision if configured
    const precision = settings?.precision ?? 0

    if (precision > 0) {
      const factor = Math.pow(10, precision)

      result = Math.floor(result * factor) / factor
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
    // If calculation fails, return input as-is
    return { SIGNAL_OUT: signalIn }
  }
}
