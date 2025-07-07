/**
 * Processes a single tick for a Round component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processRoundTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn)

    if (!isNaN(num)) {
      return { SIGNAL_OUT: Math.round(num) }
    }
  }

  return { SIGNAL_OUT: 0 }
}
