/**
 * Processes a single tick for an And component during circuit simulation
 *
 * Evaluates logical AND operation between two input signals. The component outputs
 * different values based on whether both inputs are active (truthy).
 * SET_OUTPUT can override the normal AND logic.
 *
 * @param {Object} component - The And component to process
 * @param {Object} component.inputs - The input signal values
 * @param {*} component.inputs.SIGNAL_IN_1 - First input signal value
 * @param {*} component.inputs.SIGNAL_IN_2 - Second input signal value
 * @param {*} component.inputs.SET_OUTPUT - Override output value (optional)
 * @param {Object} component.settings - Component configuration settings
 * @param {string} component.settings.output - Output value when both inputs are active (default: "1")
 * @param {string} component.settings.falseOutput - Output value when condition is not met (default: "0")
 * @param {number} component.settings.maxOutputLength - Maximum length of output string
 * @returns {Object} Object with SIGNAL_OUT containing the result
 *
 * @example
 * // Process an And component with active inputs
 * const component = {
 *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' },
 *   settings: { output: '1', falseOutput: '0', maxOutputLength: 10 }
 * }
 * const result = processAndTick(component)
 * console.log(result.SIGNAL_OUT) // '1'
 */
export default function processAndTick (component) {
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

  // Check if inputs are active using proper signal activity detection
  const input1Active = isSignalActive(in1)
  const input2Active = isSignalActive(in2)

  // Both inputs must be active for AND logic
  let conditionMet = input1Active && input2Active

  // --- Timeframe logic start ---
  if (settings?.timeFrame > 0) {
    if (!component.signalHistory) {
      component.signalHistory = []
    }

    const currentTime = Date.now()

    // Add current result to history
    component.signalHistory.push({
      value: conditionMet ? 1 : 0,
      timestamp: currentTime
    })
    // Remove old entries outside time frame
    const cutoffTime = currentTime - (settings.timeFrame * 1000)

    component.signalHistory = component.signalHistory.filter(entry => entry.timestamp >= cutoffTime)
    // Calculate average over time frame
    if (component.signalHistory.length > 0) {
      const sum = component.signalHistory.reduce((acc, entry) => acc + entry.value, 0)
      const average = sum / component.signalHistory.length

      conditionMet = average > 0.5
    }
  }
  // --- Timeframe logic end ---

  // Determine output value
  let outputValue

  if (conditionMet) {
    outputValue = settings?.output || '1'
  } else {
    outputValue = settings?.falseOutput || '0'
  }

  // Apply length limit if configured
  if (settings?.maxOutputLength > 0) {
    outputValue = String(outputValue).substring(0, settings.maxOutputLength)
  }

  return { SIGNAL_OUT: outputValue }
}

/**
 * Determines if a signal is considered "active"
 *
 * @param {string|number|boolean} signal - The signal to check
 * @returns {boolean} True if signal is active
 */
function isSignalActive (signal) {
  if (signal === null || signal === undefined || signal === '') {
    return false
  }

  // Convert to string for consistent checking
  const signalStr = String(signal).toLowerCase()

  // Check for common "false" values
  if (signalStr === 'false' || signalStr === '0' || signalStr === 'no' || signalStr === 'off') {
    return false
  }

  // Check for common "true" values
  if (signalStr === 'true' || signalStr === '1' || signalStr === 'yes' || signalStr === 'on') {
    return true
  }

  // For numeric values, check if non-zero
  const numValue = Number(signal)

  if (!isNaN(numValue)) {
    return numValue !== 0
  }

  // For other values, consider non-empty strings as active
  return signalStr.length > 0
}
