/**
 * Processes a single tick for an Equals component in the circuit simulation.
 *
 * Outputs a signal if both inputs are the same.
 * SET_OUTPUT can override the normal comparison logic.
 * Handles type coercion and tolerance for floating-point comparisons.
 *
 * @param {Object} component - The Equals component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {*} component.inputs.SIGNAL_IN_1 - First input signal
 * @param {*} component.inputs.SIGNAL_IN_2 - Second input signal
 * @param {*} component.inputs.SET_OUTPUT - Override output value (optional)
 * @param {Object} component.settings - The component's configuration settings
 * @param {string} component.settings.output - Output value when inputs are equal (default: "1")
 * @param {string} component.settings.falseOutput - Output value when inputs are not equal (default: "0")
 * @param {number} component.settings.maxOutputLength - Maximum length of output string
 * @param {number} component.settings.tolerance - Tolerance for floating-point comparisons
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @returns {Object} Object with SIGNAL_OUT containing the result
 *
 * @example
 * // Basic equality comparison
 * const component = {
 *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 10 },
 *   settings: { output: '1', falseOutput: '0', maxOutputLength: 10 }
 * }
 * const result = processEqualsTick(component)
 * console.log(result.SIGNAL_OUT) // '1'
 *
 * @example
 * // With tolerance for floating-point
 * const component = {
 *   inputs: { SIGNAL_IN_1: 5.1, SIGNAL_IN_2: 5.0 },
 *   settings: { tolerance: 0.1, output: '1', falseOutput: '0' }
 * }
 * const result = processEqualsTick(component)
 * console.log(result.SIGNAL_OUT) // '1' (within tolerance)
 */
export default function processEqualsTick (component) {
  const { settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const setOutput = inputs?.SET_OUTPUT

  // Handle SET_OUTPUT override
  if (setOutput !== null && setOutput !== undefined && setOutput !== '') {
    let outputValue = String(setOutput)

    if (settings?.maxOutputLength > 0) {
      outputValue = outputValue.substring(0, settings.maxOutputLength)
    }

    return { SIGNAL_OUT: outputValue }
  }

  // Perform comparison
  const isEqual = performComparison(in1, in2, settings?.tolerance || 0)

  // Apply time-based processing if configured
  let finalResult = isEqual

  if (settings?.timeFrame > 0) {
    // Initialize signal history if not exists
    if (!component.signalHistory) {
      component.signalHistory = []
    }

    const currentTime = Date.now()

    // Add current result to history
    component.signalHistory.push({
      value: isEqual ? 1 : 0,
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
      const average = sum / component.signalHistory.length

      finalResult = average > 0.5 // Convert back to boolean
    }
  }

  // Determine output value
  let outputValue

  if (finalResult) {
    outputValue = settings?.output || '1'
  } else {
    outputValue = settings?.falseOutput || '0'
  }

  // Apply length limit if configured
  if (settings?.maxOutputLength > 0) {
    outputValue = String(outputValue).substring(0, settings.maxOutputLength)
  }

  component.value = outputValue

  return { SIGNAL_OUT: outputValue }
}

/**
 * Perform equality comparison with tolerance support
 *
 * @param {*} value1 - First value to compare
 * @param {*} value2 - Second value to compare
 * @param {number} tolerance - Tolerance for floating-point comparisons
 * @returns {boolean} True if values are equal
 */
function performComparison (value1, value2, tolerance = 0) {
  // Handle null/undefined cases
  if (value1 === null && value2 === null) return true

  if (value1 === undefined && value2 === undefined) return true

  if (value1 === null || value2 === null) return false

  if (value1 === undefined || value2 === undefined) return false

  // Handle numeric comparisons with tolerance
  if (typeof value1 === 'number' && typeof value2 === 'number') {
    if (tolerance > 0) {
      return Math.abs(value1 - value2) <= tolerance
    }

    return value1 === value2
  }

  // Handle string comparisons
  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return value1 === value2
  }

  // Handle boolean comparisons
  if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
    return value1 === value2
  }

  // Handle mixed types (try type coercion)
  if (typeof value1 !== typeof value2) {
    // Try converting to numbers
    const num1 = Number(value1)
    const num2 = Number(value2)

    if (!isNaN(num1) && !isNaN(num2)) {
      if (tolerance > 0) {
        return Math.abs(num1 - num2) <= tolerance
      }

      return num1 === num2
    }

    // Try converting to strings
    return String(value1) === String(value2)
  }

  // Default strict equality
  return value1 === value2
}
