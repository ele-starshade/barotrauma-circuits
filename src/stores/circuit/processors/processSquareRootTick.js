/**
 * Processes a single tick for a SquareRoot component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processSquareRootTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const num = parseFloat(signalIn)

    if (!isNaN(num) && num >= 0) {
      return { SIGNAL_OUT: Math.sqrt(num) }
    }
  }

  return { SIGNAL_OUT: 0 }
}
