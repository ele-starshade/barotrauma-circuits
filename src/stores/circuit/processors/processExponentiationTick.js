/**
 * Processes a single tick for an Exponentiation component in the circuit simulation.
 *
 * Outputs the input raised to a given power.
 *
 * @param {Object} component - The Exponentiation component to process.
 * @returns {number|undefined} The result of the exponentiation, or undefined.
 */
export default function processExponentiationTick (component) {
  const { inputs, settings } = component
  const base = inputs?.SIGNAL_IN
  const exponent = inputs?.SET_EXPONENT ?? settings.exponent

  if (base !== undefined) {
    const numBase = parseFloat(base) || 0
    const numExponent = parseFloat(exponent) || 0

    return { SIGNAL_OUT: Math.pow(numBase, numExponent) }
  }
}
