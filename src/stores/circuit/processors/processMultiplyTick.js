/**
 * Processes a Multiply component during a simulation tick
 *
 * Multiplies two input signals and applies optional clamping to the result.
 * The function only processes when both inputs are available and their timestamps
 * are within the configured timeframe.
 *
 * @param {Object} component - The Multiply component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number} [component.inputs.SIGNAL_IN_1] - First input signal value
 * @param {number} [component.inputs.SIGNAL_IN_2] - Second input signal value
 * @param {Object} component.lastSignalTimestamps - Timestamps of when signals were last received
 * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_1] - Timestamp of first input signal
 * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_2] - Timestamp of second input signal
 * @param {Object} component.settings - Component configuration settings
 * @param {number} [component.settings.timeframe] - Maximum time difference allowed between inputs (0.0 = no limit)
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {number|undefined} The calculated product, or undefined if conditions aren't met
 *
 * @description
 * This function performs the following operations:
 * - Validates that both input signals are present and have valid timestamps
 * - Checks if the time difference between inputs is within the configured timeframe
 * - Converts input values to numbers and calculates the product (SIGNAL_IN_1 * SIGNAL_IN_2)
 * - Applies optional clamping to keep the result within min/max bounds
 * - Returns the calculated product or undefined if processing conditions aren't met
 *
 * The function only processes the multiplication when both inputs are available and
 * their timestamps are within the specified timeframe. If timeframe is set to 0.0,
 * the time constraint is ignored and processing occurs whenever both inputs are present.
 *
 * @example
 * // Process a Multiply component with inputs 5 and 3
 * const component = {
 *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
 *   settings: { timeframe: 100, clampMax: 20, clampMin: -10 }
 * }
 * const result = circuitStore._processMultiplyTick(component)
 * console.log(result) // 15
 */
export default function processMultiplyTick (component) {
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
      let product = num1 * num2

      if (settings.clampMax !== undefined) product = Math.min(product, settings.clampMax)

      if (settings.clampMin !== undefined) product = Math.max(product, settings.clampMin)

      return { SIGNAL_OUT: product }
    }
  }
}
