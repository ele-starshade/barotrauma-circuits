/**
 * Processes a single tick for an Or component in the circuit simulation.
 *
 * Outputs the 'output' value if either input is active, otherwise outputs 'falseOutput'.
 *
 * @param {Object} component - The Or component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processOrTick (component) {
  const { inputs, settings } = component
  const signal1 = inputs?.SIGNAL_IN_1
  const signal2 = inputs?.SIGNAL_IN_2
  const setOutput = inputs?.SET_OUTPUT

  const outputValue = setOutput !== undefined ? setOutput : settings.output
  const falseOutputValue = settings.falseOutput

  const isSignal1Active = signal1 !== undefined && String(signal1).trim() !== '' && parseFloat(signal1) !== 0
  const isSignal2Active = signal2 !== undefined && String(signal2).trim() !== '' && parseFloat(signal2) !== 0

  if (isSignal1Active || isSignal2Active) {
    let finalOutput = String(outputValue)

    if (settings.maxOutputLength > -1) {
      finalOutput = finalOutput.substring(0, settings.maxOutputLength)
    }

    return { SIGNAL_OUT: finalOutput }
  } else {
    return { SIGNAL_OUT: falseOutputValue }
  }
}
