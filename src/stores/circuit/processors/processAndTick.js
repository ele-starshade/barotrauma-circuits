/**
 * Processes a single tick for an And component during circuit simulation
 *
 * Evaluates logical AND operation between two input signals with configurable
 * output values and timing constraints. The component outputs different values
 * based on whether both inputs are truthy (non-zero, non-empty, non-undefined)
 * within a specified timeframe.
 *
 * @param {Object} component - The And component to process
 * @param {Object} component.inputs - The input signal values
 * @param {*} component.inputs.SIGNAL_IN_1 - First input signal value
 * @param {*} component.inputs.SIGNAL_IN_2 - Second input signal value
 * @param {Object} component.lastSignalTimestamps - Timestamps of last signal updates
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of first input signal
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of second input signal
 * @param {Object} component.settings - Component configuration settings
 * @param {number} component.settings.timeframe - Maximum time difference allowed between signals (0.0 = no limit)
 * @param {string} component.settings.output - Output value when both inputs are truthy
 * @param {string} component.settings.falseOutput - Output value when condition is not met
 * @param {number} component.settings.maxOutputLength - Maximum length of output string
 * @returns {string} The output value based on logical AND evaluation, or empty string if condition not met
 *
 * @description
 * This function performs the following operations:
 * 1. Validates that input signals have valid timestamps
 * 2. Checks if the time difference between input signals is within the configured timeframe
 * 3. Evaluates whether both inputs are truthy (non-zero, non-empty, non-undefined)
 * 4. Returns the configured output value if both inputs are truthy within timeframe
 * 5. Returns the configured falseOutput value if condition is not met
 * 6. Truncates output to maxOutputLength if specified
 *
 * The function ensures signal synchronization by validating timestamps and timeframes,
 * preventing processing of stale or mismatched input signals. If the timeframe is set
 * to 0.0, no time validation is performed.
 *
 * Truthy evaluation considers values that are not undefined, empty strings, or zero.
 * The returned value will be propagated to any components connected to this
 * And component's output pin.
 *
 * @example
 * // Process an And component with truthy inputs
 * const component = {
 *   id: 'and-1',
 *   name: 'And',
 *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' },
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
 *   settings: { timeframe: 100, output: 'TRUE', falseOutput: 'FALSE', maxOutputLength: 10 }
 * }
 * const result = circuitStore._processAndTick(component)
 * console.log(result) // 'TRUE'
 */
export default function processAndTick (component) {
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
      conditionMet = (in1Truthy && in2Truthy)
    }
  } else if (in1Timestamp || in2Timestamp) {
    conditionMet = (in1Truthy && in2Truthy)
  }

  if (conditionMet) {
    newValue = settings.output
  } else {
    newValue = settings.falseOutput
  }

  if (newValue !== undefined && newValue !== '') {
    newValue = String(newValue).substring(0, settings.maxOutputLength)
  } else {
    // Ensure we send an empty string if falseOutput is empty, rather than undefined
    newValue = ''
  }

  return { SIGNAL_OUT: newValue }
}
