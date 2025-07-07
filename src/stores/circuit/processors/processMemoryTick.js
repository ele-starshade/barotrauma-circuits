/**
 * Processes a single tick for a Memory component in the circuit simulation.
 *
 * Stores a value and outputs it.
 *
 * @param {Object} component - The Memory component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processMemoryTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN
  const lockState = inputs?.LOCK_STATE

  // eslint-disable-next-line eqeqeq
  const isLocked = lockState == '1' || lockState === true

  if (settings.writeable && !isLocked && signalIn !== undefined) {
    component.value = String(signalIn).substring(0, settings.maxValueLength)
    // Also update settings to persist the value in the config panel
    settings.value = component.value
  }

  return { SIGNAL_OUT: component.value }
}
