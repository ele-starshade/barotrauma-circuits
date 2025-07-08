/**
 * Processes a single tick for the Greater component
 *
 * Evaluates whether the first input signal is greater than the second input signal.
 * Returns 1 if signal_in1 > signal_in2, otherwise returns 0.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Greater component to process
 * @param {Object} component.inputs - Current input signal values
 * @param {string|number} component.inputs.SIGNAL_IN_1 - First input signal value
 * @param {string|number} component.inputs.SIGNAL_IN_2 - Second input signal value
 * @param {string|number} [component.inputs.SET_OUTPUT] - Optional override for output when condition is met
 * @param {Object} component.settings - Component configuration settings
 * @param {number} [component.settings.timeFrame] - Time frame for signal processing (default: 0)
 * @param {number} [component.settings.hysteresis] - Hysteresis value to prevent oscillation (default: 0)
 * @param {string} [component.settings.outputFormat] - Output format: 'numeric' or 'boolean' (default: 'numeric')
 * @returns {Object} Object with SIGNAL_OUT containing the comparison result
 *
 * @example
 * // Basic comparison
 * const component = {
 *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
 *   settings: { outputFormat: 'numeric' }
 * }
 * const result = processGreaterTick(component)
 * console.log(result.SIGNAL_OUT) // 1
 *
 * @example
 * // Equal values
 * const component = {
 *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 5 },
 *   settings: { outputFormat: 'numeric' }
 * }
 * const result = processGreaterTick(component)
 * console.log(result.SIGNAL_OUT) // 0
 */
export default function processGreaterTick (component) {
  const { settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const setOutput = inputs?.SET_OUTPUT

  // Handle null/undefined/empty inputs as 0
  const input1 = (in1 === null || in1 === undefined || in1 === '') ? 0 : in1
  const input2 = (in2 === null || in2 === undefined || in2 === '') ? 0 : in2

  try {
    // Convert to numbers
    const num1 = Number(input1)
    const num2 = Number(input2)

    if (isNaN(num1) || isNaN(num2)) {
      // If either input cannot be converted to number, return 0
      return { SIGNAL_OUT: 0 }
    }

    // Handle special cases
    if (!isFinite(num1) || !isFinite(num2)) {
      // Handle infinity cases
      if (num1 === Infinity && num2 !== Infinity) return { SIGNAL_OUT: 1 }

      if (num1 === -Infinity) return { SIGNAL_OUT: 0 }

      if (num2 === Infinity) return { SIGNAL_OUT: 0 }

      if (num2 === -Infinity && num1 !== -Infinity) return { SIGNAL_OUT: 1 }

      return { SIGNAL_OUT: 0 } // Both infinite, same sign
    }

    // Perform comparison
    const isGreater = num1 > num2

    // Format output based on configuration
    const outputFormat = settings?.outputFormat ?? 'numeric'
    let result

    if (outputFormat === 'boolean') {
      result = isGreater
    } else {
      result = isGreater ? 1 : 0
    }

    // Apply SET_OUTPUT override if provided and condition is met
    if (setOutput !== null && setOutput !== undefined && isGreater) {
      result = setOutput
    }

    return { SIGNAL_OUT: result }
  } catch (error) {
    // If calculation fails, return 0
    return { SIGNAL_OUT: 0 }
  }
}
