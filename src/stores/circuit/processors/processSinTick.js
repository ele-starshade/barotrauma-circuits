/**
 * Processes a single tick for a Sin component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processSinTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN

  let outputSignal = 0

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn)

    if (!isNaN(num)) {
      let angle = num

      // Convert degrees to radians if not using radians
      if (!settings.useRadians) {
        angle = num * (Math.PI / 180)
      }

      // Handle special cases
      if (angle === Infinity || angle === -Infinity) {
        outputSignal = NaN
      } else {
        // Calculate sine value
        outputSignal = Math.sin(angle)

        // Clamp output to valid range (shouldn't be necessary for sine, but for safety)
        outputSignal = Math.max(-1, Math.min(1, outputSignal))
      }
    }
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
