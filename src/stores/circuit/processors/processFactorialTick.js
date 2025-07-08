/**
 * Processes a single tick for a Factorial component in the circuit simulation.
 *
 * Outputs the factorial of the input.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Factorial component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @param {number} [component.settings.maxInput] - Maximum input value allowed (default: 170)
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Basic factorial
 * const component = {
 *   inputs: { SIGNAL_IN: 5 },
 *   settings: { clampMax: 1000, clampMin: 0 }
 * }
 * const result = processFactorialTick(component)
 * console.log(result.SIGNAL_OUT) // 120
 *
 * @example
 * // Special case: zero factorial
 * const component = {
 *   inputs: { SIGNAL_IN: 0 },
 *   settings: {}
 * }
 * const result = processFactorialTick(component)
 * console.log(result.SIGNAL_OUT) // 1
 */
export default function processFactorialTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN

  // Handle null/undefined/empty inputs
  if (signalIn === null || signalIn === undefined || signalIn === '') {
    return { SIGNAL_OUT: 0 }
  }

  try {
    // Convert to number
    const n = Number(signalIn)

    if (isNaN(n)) {
      // If input cannot be converted to number, return input as-is
      return { SIGNAL_OUT: signalIn }
    }

    // Handle negative numbers
    if (n < 0) {
      return { SIGNAL_OUT: 0 }
    }

    // Handle non-integers
    if (!Number.isInteger(n)) {
      return { SIGNAL_OUT: 0 }
    }

    // Handle overflow cases
    const maxInput = settings?.maxInput ?? 170

    if (n > maxInput) {
      return { SIGNAL_OUT: 0 }
    }

    // Calculate factorial
    let result = 1

    for (let i = 2; i <= n; i++) {
      result *= i
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

        // Re-apply clamping after averaging
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
    // If calculation fails, return input as-is
    return { SIGNAL_OUT: signalIn }
  }
}
