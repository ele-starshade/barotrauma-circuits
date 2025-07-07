/**
 * Processes a single simulation tick for the Adder component
 *
 * Performs addition of two input signals and returns the result. The component
 * adds the two inputs, with optional clamping and timeframe validation to ensure
 * signal synchronization.
 *
 * @param {Object} component - The Adder component to process
 * @param {string} component.id - The unique identifier of the component
 * @param {string} component.name - The component type name ('Adder')
 * @param {Object} component.inputs - The current input values for the component
 * @param {number|string} component.inputs.SIGNAL_IN_1 - The first input signal
 * @param {number|string} component.inputs.SIGNAL_IN_2 - The second input signal
 * @param {Object} component.lastSignalTimestamps - Timestamps of when each input was last received
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of the first input signal
 * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of the second input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} component.settings.timeframe - Maximum time difference allowed between input signals (0.0 = no limit)
 * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
 * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
 * @returns {number|undefined} The result of adding SIGNAL_IN_1 and SIGNAL_IN_2, or undefined if inputs are invalid
 *
 * @description
 * This function processes an Adder component during each simulation tick. It performs
 * the following operations:
 *
 * 1. Validates that both input signals are present and have valid timestamps
 * 2. Checks if the time difference between input signals is within the configured timeframe
 * 3. Converts input values to numbers (defaulting to 0 for invalid values)
 * 4. Performs the addition operation (SIGNAL_IN_1 + SIGNAL_IN_2)
 * 5. Applies optional clamping to keep the result within specified bounds
 * 6. Returns the calculated result for signal propagation
 *
 * The function ensures signal synchronization by validating timestamps and timeframes,
 * preventing processing of stale or mismatched input signals. If the timeframe is set
 * to 0.0, no time validation is performed.
 *
 * The returned value will be propagated to any components connected to this
 * Adder component's output pin.
 *
 * @example
 * // Process an Adder component with inputs 10 and 3
 * const component = {
 *   id: 'adder-1',
 *   name: 'Adder',
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
 *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
 *   settings: { timeframe: 100, clampMin: 0, clampMax: 100 }
 * }
 * const result = circuitStore._processAdderTick(component)
 * console.log(result) // 13
 */
export default function processAdderTick (component) {
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
      let sum = num1 + num2

      if (settings.clampMax !== undefined) sum = Math.min(sum, settings.clampMax)

      if (settings.clampMin !== undefined) sum = Math.max(sum, settings.clampMin)

      return { SIGNAL_OUT: sum }
    }
  }
}
