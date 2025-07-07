/**
 * Processes a single tick for an InputSelector component in the circuit simulation.
 *
 * Selects an input and forwards its signal.
 *
 * @param {Object} component - The InputSelector component to process.
 * @param {Array} wires - The array of wires in the circuit.
 * @returns {Object|undefined} An object with SIGNAL_OUT and SELECTED_INPUT_OUT, or undefined.
 */
export default function processInputSelectorTick (component, wires) {
  const { inputs, settings } = component
  let { selectedConnection } = component.settings
  const setInput = inputs?.SET_INPUT
  const moveInput = inputs?.MOVE_INPUT

  // Handle direct setting of the input
  if (setInput !== undefined) {
    const newSelection = parseInt(setInput, 10)

    if (!isNaN(newSelection) && newSelection >= 0 && newSelection <= 9) {
      selectedConnection = newSelection
    }
  }

  // Handle moving the selection
  if (moveInput !== undefined && moveInput !== 0 && moveInput !== component.lastMoveSignal) {
    const moveAmount = Math.sign(parseFloat(moveInput) || 0)
    const numInputs = 10
    let currentIdx = selectedConnection

    for (let i = 0; i < numInputs; i++) {
      currentIdx = (currentIdx + moveAmount)
      if (settings.wrapAround) {
        currentIdx = (currentIdx + numInputs) % numInputs
      } else {
        currentIdx = Math.max(0, Math.min(numInputs - 1, currentIdx))
      }

      if (settings.skipEmptyConnections) {
        const pinName = `SIGNAL_IN_${currentIdx}`
        const isConnected = wires.some(w => w.toId === component.id && w.toPin === pinName)

        if (isConnected) {
          break // Found a connected pin
        }
      } else {
        break // Don't skip, take the next one
      }
    }
    selectedConnection = currentIdx
  }

  component.lastMoveSignal = moveInput

  // Update component's internal state if changed
  if (selectedConnection !== component.settings.selectedConnection) {
    component.settings.selectedConnection = selectedConnection
  }

  const selectedPinName = `SIGNAL_IN_${selectedConnection}`
  const signalOut = inputs?.[selectedPinName]

  return {
    SIGNAL_OUT: signalOut,
    SELECTED_INPUT_OUT: selectedConnection
  }
}
