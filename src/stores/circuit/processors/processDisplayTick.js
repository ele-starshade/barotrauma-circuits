/**
 * Processes a single tick for a Display component, updating its value.
 * @param {Object} component The Display component to process.
 */
export default function processDisplayTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    component.value = signalIn
  }
}
