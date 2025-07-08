/**
 * Processes a Multiply component during a simulation tick
 *
 * Multiplies two input signals and applies optional clamping to the result.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Multiply component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN_1] - First input signal value
 * @param {number|string} [component.inputs.SIGNAL_IN_2] - Second input signal value
 * @param {Object} component.settings - Component configuration settings
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @param {number} [component.settings.precision] - Decimal places for output (default: 0)
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @returns {Object} Object with SIGNAL_OUT containing the calculated product
 *
 * @example
 * // Basic multiplication
 * const component = {
 *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
 *   settings: { clampMax: 20, clampMin: -10 }
 * }
 * const result = processMultiplyTick(component)
 * console.log(result.SIGNAL_OUT) // 15
 *
 * @example
 * // Negative multiplication
 * const component = {
 *   inputs: { SIGNAL_IN_1: -4, SIGNAL_IN_2: 2 },
 *   settings: {}
 * }
 * const result = processMultiplyTick(component)
 * console.log(result.SIGNAL_OUT) // -8
 */
export default function processMultiplyTick (component) {
  const { settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2

  // Handle null/undefined/empty inputs as 0
  const input1 = (in1 === null || in1 === undefined || in1 === '') ? 0 : in1
  const input2 = (in2 === null || in2 === undefined || in2 === '') ? 0 : in2

  try {
    // Convert to numbers
    const num1 = Number(input1)
    const num2 = Number(input2)

    if (isNaN(num1) || isNaN(num2)) {
      // If either input cannot be converted to number, return 0
      return { SIGNAL_OUT: 0 }
    }

    // Handle special cases
    if (!isFinite(num1) || !isFinite(num2)) {
      if (isNaN(num1) || isNaN(num2)) return { SIGNAL_OUT: 0 }

      if (num1 === Infinity || num1 === -Infinity) {
        if (num2 === 0) return { SIGNAL_OUT: 0 }

        return { SIGNAL_OUT: num1 * num2 }
      }

      if (num2 === Infinity || num2 === -Infinity) {
        if (num1 === 0) return { SIGNAL_OUT: 0 }

        return { SIGNAL_OUT: num1 * num2 }
      }

      return { SIGNAL_OUT: 0 }
    }

    // Perform multiplication
    let result = num1 * num2

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

    // Apply time-based processing if configured
    if (settings?.timeFrame > 0) {
      // Initialize signal history if not exists
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: result,
        timestamp: currentTime
      })

      // Remove old entries outside time frame
      const cutoffTime = currentTime - (settings.timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry =>
        entry.timestamp >= cutoffTime
      )

      // Calculate average over time frame
      if (component.signalHistory.length > 0) {
        const sum = component.signalHistory.reduce((acc, entry) => acc + entry.value, 0)

        result = sum / component.signalHistory.length

        // Re-apply precision and clamping after averaging
        if (precision > 0) {
          const factor = Math.pow(10, precision)

          result = Math.round(result * factor) / factor
        }

        if (settings?.clampMax !== undefined) {
          result = Math.min(result, settings.clampMax)
        }

        if (settings?.clampMin !== undefined) {
          result = Math.max(result, settings.clampMin)
        }
      }
    }

    component.value = result

    return { SIGNAL_OUT: result }
  } catch (error) {
    // If calculation fails, return 0
    return { SIGNAL_OUT: 0 }
  }
}
