/**
 * Processes a single tick for the Greater component
 *
 * Evaluates whether the first input signal is greater than the second input signal,
 * considering timing constraints and returning appropriate output values based on
 * the comparison result and configured settings.
 *
 * @param {Object} component - The Greater component to process
 * @param {Object} component.lastSignalTimestamps - Timestamps of when signals were last received
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of first input signal
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of second input signal
 * @param {Object} component.settings - Component configuration settings
 * @param {number} component.settings.timeframe - Maximum time difference allowed between signals (0.0 = no limit)
 * @param {string} component.settings.output - Output value when condition is met
 * @param {string} component.settings.falseOutput - Output value when condition is not met
 * @param {number} component.settings.maxOutputLength - Maximum length of output string
 * @param {Object} component.inputs - Current input signal values
 * @param {string|number} component.inputs.SIGNAL_IN_1 - First input signal value
 * @param {string|number} component.inputs.SIGNAL_IN_2 - Second input signal value
 * @param {string} [component.inputs.SET_OUTPUT] - Optional override for output when condition is met
 * @returns {string} The output value based on the comparison result, truncated to maxOutputLength
 *
 * @description
 * This function performs the following operations:
 * - Extracts input signals and their timestamps from the component
 * - Validates that both input signals and timestamps are available
 * - Calculates the time difference between signal arrivals
 * - Checks if the time difference is within the configured timeframe (or if timeframe is 0.0 for no limit)
 * - Converts input signals to numbers and compares them numerically
 * - Returns the configured output value if SIGNAL_IN_1 > SIGNAL_IN_2, otherwise returns falseOutput
 * - Supports dynamic output override through the SET_OUTPUT input pin
 * - Truncates the output to the maximum configured length
 * - Returns an empty string if no valid comparison can be made
 *
 * The function supports dynamic overrides through input pins:
 * - SET_OUTPUT: Overrides the default output value when the condition is met
 *
 * @example
 * // Process a Greater component with valid signals and timeframe
 * const component = {
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1000, SIGNAL_IN_2: 1050 },
 *   settings: { timeframe: 100, output: "GREATER", falseOutput: "NOT_GREATER", maxOutputLength: 10 },
 *   inputs: { SIGNAL_IN_1: "15", SIGNAL_IN_2: "10" }
 * }
 * const result = circuitStore._processGreaterTick(component)
 * console.log(result) // "GREATER"
 *
 * @example
 * // Process a Greater component with signals outside timeframe
 * const component = {
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1000, SIGNAL_IN_2: 1200 },
 *   settings: { timeframe: 100, output: "GREATER", falseOutput: "NOT_GREATER", maxOutputLength: 10 },
 *   inputs: { SIGNAL_IN_1: "15", SIGNAL_IN_2: "10" }
 * }
 * const result = circuitStore._processGreaterTick(component)
 * console.log(result) // "NOT_GREATER"
 */
export default function processGreaterTick (component) {
  const { lastSignalTimestamps, settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
  const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2
  let newValue
  let conditionMet = false

  if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
    const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

    if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
      const num1 = parseFloat(in1) || 0
      const num2 = parseFloat(in2) || 0

      if (num1 > num2) {
        conditionMet = true
      }
    }
  }

  if (conditionMet) {
    newValue = inputs?.SET_OUTPUT ?? settings.output
  } else {
    newValue = settings.falseOutput
  }

  if (newValue !== undefined && newValue !== '') {
    newValue = String(newValue).substring(0, settings.maxOutputLength)
  } else {
    newValue = ''
  }

  return { SIGNAL_OUT: newValue }
}
