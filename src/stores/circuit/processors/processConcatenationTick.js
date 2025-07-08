/**
 * Processes a single tick for a Concatenation component in the circuit simulation.
 *
 * Joins two input signals together with an optional separator.
 * Handles all input types by converting to strings.
 * Empty inputs are handled gracefully.
 *
 * @param {Object} component - The Concatenation component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {*} component.inputs.SIGNAL_IN_1 - First input signal
 * @param {*} component.inputs.SIGNAL_IN_2 - Second input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {string} component.settings.separator - Separator between inputs (default: "+")
 * @param {number} component.settings.maxOutputLength - Maximum output length (default: 256)
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no valid inputs
 *
 * @example
 * // Basic concatenation
 * const component = {
 *   inputs: { SIGNAL_IN_1: "mud", SIGNAL_IN_2: "raptor" },
 *   settings: { separator: "+", maxOutputLength: 256 }
 * }
 * const result = processConcatenationTick(component)
 * console.log(result.SIGNAL_OUT) // "mud+raptor"
 *
 * @example
 * // With numbers
 * const component = {
 *   inputs: { SIGNAL_IN_1: 1250, SIGNAL_IN_2: 450 },
 *   settings: { separator: " ", maxOutputLength: 256 }
 * }
 * const result = processConcatenationTick(component)
 * console.log(result.SIGNAL_OUT) // "1250 450"
 */
export default function processConcatenationTick (component) {
  const { settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2

  try {
    // Convert inputs to strings
    const string1 = convertToString(in1)
    const string2 = convertToString(in2)

    // Perform concatenation
    let result

    if (string1 === '' && string2 === '') {
      result = ''
    } else if (string1 === '') {
      result = string2
    } else if (string2 === '') {
      result = string1
    } else {
      const separator = settings?.separator || '+'

      result = string1 + separator + string2
    }

    // Apply length limit
    const maxLength = settings?.maxOutputLength || 256

    if (result.length > maxLength) {
      result = result.substring(0, maxLength)
    }

    // Apply time-based processing if configured
    if (settings?.timeFrame > 0) {
      // Initialize signal history if not exists
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: result,
        timestamp: currentTime
      })

      // Remove old entries outside time frame
      const cutoffTime = currentTime - (settings.timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry =>
        entry.timestamp >= cutoffTime
      )

      // Use the most recent result in time frame (for strings, averaging doesn't make sense)
      if (component.signalHistory.length > 0) {
        result = component.signalHistory[component.signalHistory.length - 1].value
      }
    }

    component.value = result

    return { SIGNAL_OUT: result }
  } catch (error) {
    return undefined
  }
}

/**
 * Convert any value to string
 *
 * @param {*} value - The value to convert
 * @returns {string} The string representation
 */
function convertToString (value) {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0'
  }

  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      return ''
    }

    return value.toString()
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      return '[Object]'
    }
  }

  return String(value)
}
