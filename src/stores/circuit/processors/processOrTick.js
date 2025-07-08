/**
 * Processes a single tick for an Or component in the circuit simulation.
 *
 * Outputs 1 if either input signal is above threshold, otherwise outputs 0.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Or component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN_1] - First input signal
 * @param {number|string} [component.inputs.SIGNAL_IN_2] - Second input signal
 * @param {number|string} [component.inputs.SET_OUTPUT] - Output control signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.threshold] - Threshold for determining active signals (default: 0.5)
 * @param {number} [component.settings.hysteresis] - Hysteresis value to prevent oscillation (default: 0.1)
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @param {string} [component.settings.output] - Output value when condition is met (default: "1")
 * @param {string} [component.settings.falseOutput] - Output value when condition is not met (default: "0")
 * @param {number} [component.settings.maxOutputLength] - Maximum length of output string (default: -1)
 * @returns {Object} Object with SIGNAL_OUT containing the OR result
 *
 * @example
 * // Basic OR operation
 * const component = {
 *   inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 1 },
 *   settings: { threshold: 0.5, hysteresis: 0.1 }
 * }
 * const result = processOrTick(component)
 * console.log(result.SIGNAL_OUT) // "1"
 *
 * @example
 * // OR with SET_OUTPUT override
 * const component = {
 *   inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0, SET_OUTPUT: 1 },
 *   settings: { threshold: 0.5, output: "ACTIVE", falseOutput: "INACTIVE" }
 * }
 * const result = processOrTick(component)
 * console.log(result.SIGNAL_OUT) // "ACTIVE"
 */
export default function processOrTick (component) {
  const { settings, inputs } = component
  const signal1 = inputs?.SIGNAL_IN_1
  const signal2 = inputs?.SIGNAL_IN_2
  const setOutput = inputs?.SET_OUTPUT

  // Get configuration
  const threshold = settings?.threshold ?? 0.5
  const hysteresis = settings?.hysteresis ?? 0.1
  const timeFrame = settings?.timeFrame ?? 0
  const outputValue = settings?.output ?? '1'
  const falseOutputValue = settings?.falseOutput ?? '0'
  const maxOutputLength = settings?.maxOutputLength ?? -1

  // Handle null/undefined/empty inputs as 0
  const input1 = (signal1 === null || signal1 === undefined || signal1 === '') ? 0 : signal1
  const input2 = (signal2 === null || signal2 === undefined || signal2 === '') ? 0 : signal2

  try {
    // Convert to numbers
    const num1 = Number(input1)
    const num2 = Number(input2)
    const numSetOutput = setOutput !== null && setOutput !== undefined ? Number(setOutput) : null

    if (isNaN(num1) || isNaN(num2) || (numSetOutput !== null && isNaN(numSetOutput))) {
      // If any input cannot be converted to number, return false output
      return { SIGNAL_OUT: falseOutputValue }
    }

    // Handle special cases
    if (!isFinite(num1) || !isFinite(num2)) {
      if (isNaN(num1) || isNaN(num2)) return { SIGNAL_OUT: falseOutputValue }

      return { SIGNAL_OUT: outputValue } // Infinity input → output signal
    }

    // Determine if either input is above threshold
    const input1Active = num1 >= threshold
    const input2Active = num2 >= threshold
    const logicalOr = input1Active || input2Active

    // Apply hysteresis to prevent oscillation
    const highThreshold = threshold + hysteresis
    const lowThreshold = threshold - hysteresis

    let result
    const currentHysteresisState = component.hysteresisState ?? 'low'

    if (currentHysteresisState === 'low') {
      // Currently in low state
      if (logicalOr && (num1 >= highThreshold || num2 >= highThreshold)) {
        component.hysteresisState = 'high'
        result = true // Output signal
      } else {
        result = false // No output signal
      }
    } else {
      // Currently in high state
      if (!logicalOr && num1 <= lowThreshold && num2 <= lowThreshold) {
        component.hysteresisState = 'low'
        result = false // No output signal
      } else {
        result = true // Output signal
      }
    }

    // Apply SET_OUTPUT override if provided and above threshold
    if (numSetOutput !== null && numSetOutput >= threshold) {
      result = true // Force output on
    }

    // Apply time-based processing if configured
    if (timeFrame > 0) {
      // Initialize signal history if not exists
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: result ? 1 : 0,
        timestamp: currentTime
      })

      // Remove old entries outside time frame
      const cutoffTime = currentTime - (timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry =>
        entry.timestamp >= cutoffTime
      )

      // Calculate average over time frame
      if (component.signalHistory.length > 0) {
        const sum = component.signalHistory.reduce((acc, entry) => acc + entry.value, 0)
        const average = sum / component.signalHistory.length

        result = average > 0.5 // Convert back to boolean
      }
    }

    // Determine final output value
    let finalOutput = result ? outputValue : falseOutputValue

    // Apply length limit if configured
    if (maxOutputLength > -1) {
      finalOutput = String(finalOutput).substring(0, maxOutputLength)
    }

    component.value = finalOutput

    return { SIGNAL_OUT: finalOutput }
  } catch (error) {
    // If calculation fails, return false output
    return { SIGNAL_OUT: falseOutputValue }
  }
}
