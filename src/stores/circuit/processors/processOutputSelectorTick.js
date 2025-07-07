/**
 * Processes a single tick for an OutputSelector component.
 * @param {Object} component The component to process.
 * @param {Array} wires The array of wires in the circuit.
 * @returns {Object|undefined} An object with output signals.
 */
export default function processOutputSelectorTick (component, wires) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN
  const setOutput = inputs?.SET_OUTPUT
  const moveOutput = parseFloat(inputs?.MOVE_OUTPUT) || 0

  // --- Update selected connection ---
  if (setOutput !== undefined) {
    const newSelection = parseInt(setOutput, 10)

    if (!isNaN(newSelection) && newSelection >= 0 && newSelection <= 9) {
      component.selectedConnection = newSelection
    }
  } else if (moveOutput !== 0 && component.lastMoveSignal === 0) {
    const step = Math.sign(moveOutput)
    const connectedOutputPins = wires
      .filter(w => w.fromId === component.id && w.fromPinName.startsWith('SIGNAL_OUT_'))
      .map(w => parseInt(w.fromPinName.split('_')[2]))

    let nextConnection = component.selectedConnection
    let attempts = 0

    do {
      nextConnection += step
      if (settings.wrapAround) {
        nextConnection = (nextConnection + 10) % 10
      } else {
        nextConnection = Math.max(0, Math.min(9, nextConnection))
      }

      attempts++
    } while (
      settings.skipEmptyConnections &&
      !connectedOutputPins.includes(nextConnection) &&
      attempts < 10
    )

    if (attempts < 10) {
      component.selectedConnection = nextConnection
    }
  }

  component.lastMoveSignal = moveOutput

  // --- Determine outputs ---
  const outputs = {
    SELECTED_OUTPUT_OUT: component.selectedConnection
  }

  // Set all other outputs to undefined
  for (let i = 0; i < 10; i++) {
    outputs[`SIGNAL_OUT_${i}`] = undefined
  }

  // Set the selected output to the input signal
  if (signalIn !== undefined) {
    outputs[`SIGNAL_OUT_${component.selectedConnection}`] = signalIn
  }

  return outputs
}
