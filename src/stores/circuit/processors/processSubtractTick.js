/**
 * Processes a single tick for a Subtract component in the circuit simulation
 *
 * Calculates the difference between two input signals. The component subtracts
 * the second input from the first input and applies optional clamping to keep
 * the result within configured minimum and maximum bounds.
 *
 * @param {Object} component - The Subtract component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN_1 - The first input signal (minuend)
 * @param {number|string} component.inputs.SIGNAL_IN_2 - The second input signal (subtrahend)
 * @param {Object} component.settings - Configuration settings for the component
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @param {number} [component.settings.precision] - Decimal places for output (default: 0)
 * @returns {number} The calculated difference
 *
 * @description
 * This function performs the following operations:
 * - Validates that both input signals are present
 * - Converts input values to numbers and calculates the difference (SIGNAL_IN_1 - SIGNAL_IN_2)
 * - Applies optional clamping to keep the result within min/max bounds
 * - Applies optional precision formatting
 * - Returns the calculated difference
 *
 * @example
 * // Process a Subtract component with inputs 10 and 3
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
 *   settings: { clampMax: 20, clampMin: -10 }
 * }
 * const result = processSubtractTick(component)
 * console.log(result) // { SIGNAL_OUT: 7 }
 */
export default function processSubtractTick (component) {
  const { settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2

  let outputSignal = 0

  if (in1 !== undefined && in2 !== undefined) {
    const num1 = parseFloat(in1) || 0
    const num2 = parseFloat(in2) || 0

    // Perform subtraction
    outputSignal = num1 - num2

    // Apply time-based processing if configured
    if (settings.timeFrame > 0) {
      // Initialize signal history if not exists
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current value to history
      component.signalHistory.push({
        value: outputSignal,
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

        outputSignal = sum / component.signalHistory.length
      }
    }

    // Apply clamping if configured
    if (settings.clampMax !== undefined) {
      outputSignal = Math.min(outputSignal, settings.clampMax)
    }

    if (settings.clampMin !== undefined) {
      outputSignal = Math.max(outputSignal, settings.clampMin)
    }

    // Apply precision if configured
    if (settings.precision !== undefined && settings.precision > 0) {
      outputSignal = parseFloat(outputSignal.toFixed(settings.precision))
    }
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
