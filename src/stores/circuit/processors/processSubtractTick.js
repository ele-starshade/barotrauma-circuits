/**
 * Processes a single tick for a Subtract component in the circuit simulation
 *
 * Calculates the difference between two input signals within a specified timeframe.
 * The component subtracts the second input from the first input and applies optional
 * clamping to keep the result within configured minimum and maximum bounds.
 *
 * @param {Object} component - The Subtract component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN_1 - The first input signal (minuend)
 * @param {number|string} component.inputs.SIGNAL_IN_2 - The second input signal (subtrahend)
 * @param {Object} component.lastSignalTimestamps - Timestamps of when each input was last received
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of first input signal
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of second input signal
 * @param {Object} component.settings - Configuration settings for the component
 * @param {number} component.settings.timeframe - Maximum time difference (ms) between inputs to process
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {number|undefined} The calculated difference, or undefined if conditions aren't met
 *
 * @description
 * This function performs the following operations:
 * - Validates that both input signals are present and have valid timestamps
 * - Checks if the time difference between inputs is within the configured timeframe
 * - Converts input values to numbers and calculates the difference (SIGNAL_IN_1 - SIGNAL_IN_2)
 * - Applies optional clamping to keep the result within min/max bounds
 * - Returns the calculated difference or undefined if processing conditions aren't met
 *
 * The function only processes the subtraction when both inputs are available and
 * their timestamps are within the specified timeframe. If timeframe is set to 0.0,
 * the time constraint is ignored and processing occurs whenever both inputs are present.
 *
 * @example
 * // Process a Subtract component with inputs 10 and 3
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
 *   settings: { timeframe: 100, clampMax: 20, clampMin: -10 }
 * }
 * const result = circuitStore._processSubtractTick(component)
 * console.log(result) // 7
 */
export default function processSubtractTick (component) {
  const { lastSignalTimestamps, settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
  const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

  if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
    const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

    if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
      const num1 = parseFloat(in1) || 0
      const num2 = parseFloat(in2) || 0
      let difference = num1 - num2

      if (settings.clampMax !== undefined) difference = Math.min(difference, settings.clampMax)

      if (settings.clampMin !== undefined) difference = Math.max(difference, settings.clampMin)

      return { SIGNAL_OUT: difference }
    }
  }
}
