/**
 * Processes a single tick for a Not component in the circuit simulation.
 *
 * Outputs 1 if the input signal is 0, otherwise outputs 0.
 *
 * @param {Object} component - The Not component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processNotTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const numSignal = parseFloat(signalIn) || 0
    const newValue = (numSignal === 0) ? 1 : 0

    component.value = newValue

    return { SIGNAL_OUT: newValue }
  } else {
    if (settings.continuousOutput) {
      return { SIGNAL_OUT: component.value }
    } else {
      return { SIGNAL_OUT: 0 }
    }
  }
}
