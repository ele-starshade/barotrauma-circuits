/**
 * Processes a single tick for an XOR component in the circuit simulation
 *
 * Evaluates the XOR logic operation on two input signals and determines the appropriate
 * output based on whether the inputs have different truthiness values. The function
 * supports time-based signal validation and configurable output values.
 *
 * @param {Object} component - The XOR component to process
 * @param {Object} component.inputs - The input signals for the component
 * @param {*} component.inputs.SIGNAL_IN_1 - The first input signal
 * @param {*} component.inputs.SIGNAL_IN_2 - The second input signal
 * @param {*} component.inputs.SET_OUTPUT - Optional override for the output value when condition is met
 * @param {Object} component.lastSignalTimestamps - Timestamps of when each input signal was last received
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of the first input signal
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of the second input signal
 * @param {Object} component.settings - Configuration settings for the component
 * @param {number} component.settings.timeframe - Maximum time difference (ms) between inputs to consider them synchronized (0.0 disables time constraint)
 * @param {string} component.settings.output - Default output value when XOR condition is met
 * @param {string} component.settings.falseOutput - Output value when XOR condition is not met
 * @param {number} component.settings.maxOutputLength - Maximum length for the output string
 * @returns {string} The processed output value, or empty string if no valid output
 *
 * @description
 * This function performs the following operations:
 * - Extracts input signals and their timestamps from the component
 * - Determines the truthiness of each input (truthy if not undefined, not empty string, and not 0)
 * - Validates input timing if both timestamps are present and timeframe is configured
 * - Evaluates XOR logic: condition is met when inputs have different truthiness values
 * - Selects appropriate output based on whether the XOR condition is met
 * - Applies output length restrictions and string conversion
 * - Returns the final output value or empty string
 *
 * The XOR logic works as follows:
 * - If both inputs are truthy or both are falsy → condition not met (falseOutput)
 * - If one input is truthy and the other is falsy → condition met (output)
 *
 * Time validation ensures inputs are processed within the specified timeframe.
 * If timeframe is 0.0, time constraints are ignored and processing occurs
 * whenever at least one input is available.
 *
 * @example
 * // Process an XOR component with truthy and falsy inputs
 * const component = {
 *   inputs: { SIGNAL_IN_1: "hello", SIGNAL_IN_2: 0 },
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
 *   settings: { timeframe: 100, output: "XOR_TRUE", falseOutput: "XOR_FALSE", maxOutputLength: 10 }
 * }
 * const result = circuitStore._processXorTick(component)
 * console.log(result) // "XOR_TRUE"
 */
export default function processXorTick (component) {
  const { lastSignalTimestamps, settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
  const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2
  let newValue

  // eslint-disable-next-line eqeqeq
  const in1Truthy = in1 != undefined && in1 != '' && in1 != 0
  // eslint-disable-next-line eqeqeq
  const in2Truthy = in2 != undefined && in2 != '' && in2 != 0

  let conditionMet = false

  if (in1Timestamp && in2Timestamp) {
    const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

    if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
      if (in1Truthy !== in2Truthy) {
        conditionMet = true
      }
    }
  } else if (in1Timestamp || in2Timestamp) {
    if (in1Truthy !== in2Truthy) {
      conditionMet = true
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
