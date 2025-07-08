/**
 * Processes a single tick for a Not component in the circuit simulation.
 *
 * Outputs 1 if the input signal is below threshold, otherwise outputs 0.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Not component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.threshold] - Threshold for determining true/false (default: 0.5)
 * @param {number} [component.settings.hysteresis] - Hysteresis value to prevent oscillation (default: 0.1)
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @param {boolean} [component.settings.continuousOutput] - Whether to maintain output when no input (default: false)
 * @returns {Object} Object with SIGNAL_OUT containing the inverted signal
 *
 * @example
 * // Basic NOT operation
 * const component = {
 *   inputs: { SIGNAL_IN: 0 },
 *   settings: { threshold: 0.5, hysteresis: 0.1 }
 * }
 * const result = processNotTick(component)
 * console.log(result.SIGNAL_OUT) // 1
 *
 * @example
 * // NOT with high input
 * const component = {
 *   inputs: { SIGNAL_IN: 0.8 },
 *   settings: { threshold: 0.5, hysteresis: 0.1 }
 * }
 * const result = processNotTick(component)
 * console.log(result.SIGNAL_OUT) // 0
 */
export default function processNotTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN

  // Get configuration
  const threshold = settings?.threshold ?? 0.5
  const hysteresis = settings?.hysteresis ?? 0.1
  const timeFrame = settings?.timeFrame ?? 0
  const continuousOutput = settings?.continuousOutput ?? false

  // Handle null/undefined/empty inputs
  if (signalIn === null || signalIn === undefined || signalIn === '') {
    if (continuousOutput && component.value !== undefined) {
      return { SIGNAL_OUT: component.value }
    } else {
      return { SIGNAL_OUT: 1 } // Default output when no input
    }
  }

  try {
    // Convert to number
    const numSignal = Number(signalIn)

    if (isNaN(numSignal)) {
      // If input cannot be converted to number, return 1 (output signal)
      return { SIGNAL_OUT: 1 }
    }

    // Handle special cases
    if (!isFinite(numSignal)) {
      if (isNaN(numSignal)) return { SIGNAL_OUT: 1 } // NaN input → output signal

      return { SIGNAL_OUT: 0 } // Infinity input → no output signal
    }

    // Apply hysteresis to prevent oscillation
    const highThreshold = threshold + hysteresis
    const lowThreshold = threshold - hysteresis

    let result
    const currentHysteresisState = component.hysteresisState ?? 'low'

    if (currentHysteresisState === 'low') {
      // Currently in low state
      if (numSignal >= highThreshold) {
        component.hysteresisState = 'high'
        result = 0 // No output signal
      } else {
        result = 1 // Output signal
      }
    } else {
      // Currently in high state
      if (numSignal <= lowThreshold) {
        component.hysteresisState = 'low'
        result = 1 // Output signal
      } else {
        result = 0 // No output signal
      }
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
        value: result,
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

        result = average > 0.5 ? 1 : 0 // Convert back to binary
      }
    }

    // Update component's internal state
    component.value = result

    return { SIGNAL_OUT: result }
  } catch (error) {
    // If calculation fails, return 1 (output signal)
    return { SIGNAL_OUT: 1 }
  }
}
