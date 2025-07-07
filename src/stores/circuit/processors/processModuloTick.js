/**
 * Processes a single tick for a Modulo component in the circuit simulation.
 *
 * Outputs the remainder of a division operation.
 *
 * @param {Object} component - The Modulo component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processModuloTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN
  const modulus = inputs?.SET_MODULUS ?? settings.modulus

  if (signalIn !== undefined) {
    const numSignal = parseFloat(signalIn) || 0
    const numModulus = parseFloat(modulus) || 0

    if (numModulus === 0) {
      return { SIGNAL_OUT: 0 }
    }

    return { SIGNAL_OUT: numSignal % numModulus }
  }
}
