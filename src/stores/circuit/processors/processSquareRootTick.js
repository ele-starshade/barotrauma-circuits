/**
 * Processes a single tick for a SquareRoot component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processSquareRootTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN

  let outputSignal = 0

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn)

    if (!isNaN(num)) {
      // Handle special cases
      if (num < 0) {
        // Negative input returns NaN
        outputSignal = NaN
      } else if (num === Infinity) {
        outputSignal = Infinity
      } else {
        // Calculate square root
        outputSignal = Math.sqrt(num)
      }

      // Apply time-based processing if configured
      if (settings.timeFrame > 0) {
        // Initialize signal history if not exists
        if (!component.signalHistory) {
          component.signalHistory = []
        }

        const currentTime = Date.now()

        // Add current value to history
        component.signalHistory.push({
          value: outputSignal,
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

          outputSignal = sum / component.signalHistory.length
        }
      }

      // Apply clamping if configured
      if (settings.clampMin !== undefined && settings.clampMax !== undefined) {
        outputSignal = Math.max(settings.clampMin, Math.min(settings.clampMax, outputSignal))
      }

      // Apply precision if configured
      if (settings.precision !== undefined && settings.precision > 0) {
        outputSignal = parseFloat(outputSignal.toFixed(settings.precision))
      }
    }
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
