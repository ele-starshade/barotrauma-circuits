/**
 * Processes a single tick for a Tan component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processTanTick (component) {
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
        // Check for asymptote conditions (near π/2 + nπ)
        const normalizedAngle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)
        const asymptotes = [Math.PI / 2, 3 * Math.PI / 2]
        let minDistance = Infinity

        for (const asymptote of asymptotes) {
          const distance = Math.abs(normalizedAngle - asymptote)

          minDistance = Math.min(minDistance, distance)
        }

        if (minDistance < 0.001) {
          // Very close to asymptote - clamp to maximum/minimum value
          const clampMax = settings.clampMax !== undefined ? settings.clampMax : 999999
          const clampMin = settings.clampMin !== undefined ? settings.clampMin : -999999

          outputSignal = angle > 0 ? clampMax : clampMin
        } else {
          // Calculate tangent value
          outputSignal = Math.tan(angle)
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
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
