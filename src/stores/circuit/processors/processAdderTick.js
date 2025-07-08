/**
 * Processes a single simulation tick for the Adder component
 *
 * Performs addition of two input signals and returns the result. The component
 * adds the two inputs, with optional clamping to ensure the result stays within bounds.
 * Non-numeric inputs are passed through unchanged.
 * Empty/null signals are treated as 0.
 *
 * @param {Object} component - The Adder component to process
 * @param {Object} component.inputs - The current input values for the component
 * @param {number|string} component.inputs.SIGNAL_IN_1 - The first input signal
 * @param {number|string} component.inputs.SIGNAL_IN_2 - The second input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid input
 *
 * @example
 * // Process an Adder component with inputs 10 and 3
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
 *   settings: { clampMin: 0, clampMax: 100 }
 * }
 * const result = processAdderTick(component)
 * console.log(result.SIGNAL_OUT) // 13
 */
export default function processAdderTick (component) {
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

    // Calculate sum
    let sum = num1 + num2

    // Apply clamping if configured
    if (settings?.clampMax !== undefined) {
      sum = Math.min(sum, settings.clampMax)
    }

    if (settings?.clampMin !== undefined) {
      sum = Math.max(sum, settings.clampMin)
    }

    // --- Timeframe logic start ---
    if (settings?.timeFrame > 0) {
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: sum,
        timestamp: currentTime
      })
      // Remove old entries outside time frame
      const cutoffTime = currentTime - (settings.timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry => entry.timestamp >= cutoffTime)
      // Calculate average over time frame
      if (component.signalHistory.length > 0) {
        const total = component.signalHistory.reduce((acc, entry) => acc + entry.value, 0)

        sum = total / component.signalHistory.length
        // Re-apply clamping after averaging
        if (settings?.clampMax !== undefined) {
          sum = Math.min(sum, settings.clampMax)
        }

        if (settings?.clampMin !== undefined) {
          sum = Math.max(sum, settings.clampMin)
        }
      }
    }
    // --- Timeframe logic end ---

    return { SIGNAL_OUT: sum }
  } catch (error) {
    // If inputs cannot be processed, return first input as-is
    return { SIGNAL_OUT: input1 }
  }
}
