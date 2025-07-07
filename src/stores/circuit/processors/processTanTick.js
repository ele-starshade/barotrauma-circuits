/**
 * Processes a single tick for a Tan component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processTanTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    let num = parseFloat(signalIn)

    if (!isNaN(num)) {
      if (!settings.useRadians) {
        num = num * (Math.PI / 180) // Convert degrees to radians
      }

      return { SIGNAL_OUT: Math.tan(num) }
    }
  }

  return { SIGNAL_OUT: 0 }
}
