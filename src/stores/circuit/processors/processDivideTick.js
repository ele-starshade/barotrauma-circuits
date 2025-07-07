/**
 * Processes a single tick for a Divide component in the circuit simulation
 *
 * Calculates the quotient of two input signals when both inputs are available
 * and their timestamps are within the configured timeframe. The function handles
 * division by zero protection and optional value clamping.
 *
 * @param {Object} component - The Divide component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number} [component.inputs.SIGNAL_IN_1] - First input signal value
 * @param {number} [component.inputs.SIGNAL_IN_2] - Second input signal value (divisor)
 * @param {Object} component.lastSignalTimestamps - Timestamps of when each input was last received
 * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_1] - Timestamp of first input signal
 * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_2] - Timestamp of second input signal
 * @param {Object} component.settings - Component configuration settings
 * @param {number} [component.settings.timeframe] - Maximum time difference allowed between inputs
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {string|undefined} The calculated quotient as a string, or undefined if conditions aren't met
 *
 * @description
 * This function performs the following operations:
 * - Validates that both input signals are present and have valid timestamps
 * - Checks if the time difference between inputs is within the configured timeframe
 * - Converts input values to numbers and calculates the quotient (SIGNAL_IN_1 / SIGNAL_IN_2)
 * - Protects against division by zero by returning 0 when the divisor is zero
 * - Applies optional clamping to keep the result within min/max bounds
 * - Returns the calculated quotient as a string or undefined if processing conditions aren't met
 *
 * The function only processes the division when both inputs are available and
 * their timestamps are within the specified timeframe. If timeframe is set to 0.0,
 * the time constraint is ignored and processing occurs whenever both inputs are present.
 * Division by zero is handled gracefully by returning 0 instead of throwing an error.
 *
 * @example
 * // Process a Divide component with inputs 10 and 2
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
 *   settings: { timeframe: 100, clampMax: 10, clampMin: -5 }
 * }
 * const result = circuitStore._processDivideTick(component)
 * console.log(result) // "5"
 */
export default function processDivideTick (component) {
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
      let quotient = num2 !== 0 ? num1 / num2 : 0 // Avoid division by zero

      if (settings.clampMax !== undefined) quotient = Math.min(quotient, settings.clampMax)

      if (settings.clampMin !== undefined) quotient = Math.max(quotient, settings.clampMin)

      return { SIGNAL_OUT: quotient.toString() }
    }
  }
}
