/**
 * Processes a single tick for a Divide component in the circuit simulation
 *
 * Calculates the quotient of two input signals.
 * Handles division by zero and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Divide component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN_1 - First input signal value (dividend)
 * @param {number|string} component.inputs.SIGNAL_IN_2 - Second input signal value (divisor)
 * @param {Object} component.settings - Component configuration settings
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid inputs
 *
 * @example
 * // Basic division
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
 *   settings: { clampMax: 10, clampMin: -5 }
 * }
 * const result = processDivideTick(component)
 * console.log(result.SIGNAL_OUT) // 5
 *
 * @example
 * // Division by zero
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 0 },
 *   settings: {}
 * }
 * const result = processDivideTick(component)
 * console.log(result.SIGNAL_OUT) // 0 (error handling)
 */
export default function processDivideTick (component) {
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
      // If either input cannot be converted to number, return first input as-is
      return { SIGNAL_OUT: input1 }
    }

    // Handle division by zero
    if (num2 === 0) {
      return { SIGNAL_OUT: 0 } // Return 0 for division by zero
    }

    // Calculate quotient
    let quotient = num1 / num2

    // Apply clamping if configured
    if (settings?.clampMax !== undefined) {
      quotient = Math.min(quotient, settings.clampMax)
    }

    if (settings?.clampMin !== undefined) {
      quotient = Math.max(quotient, settings.clampMin)
    }

    // --- Timeframe logic start ---
    if (settings?.timeFrame > 0) {
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: quotient,
        timestamp: currentTime
      })
      // Remove old entries outside time frame
      const cutoffTime = currentTime - (settings.timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry => entry.timestamp >= cutoffTime)
      // Calculate average over time frame
      if (component.signalHistory.length > 0) {
        const total = component.signalHistory.reduce((acc, entry) => acc + entry.value, 0)

        quotient = total / component.signalHistory.length
        // Re-apply clamping after averaging
        if (settings?.clampMax !== undefined) {
          quotient = Math.min(quotient, settings.clampMax)
        }

        if (settings?.clampMin !== undefined) {
          quotient = Math.max(quotient, settings.clampMin)
        }
      }
    }
    // --- Timeframe logic end ---

    return { SIGNAL_OUT: quotient }
  } catch (error) {
    // If calculation fails, return first input as-is
    return { SIGNAL_OUT: input1 }
  }
}
