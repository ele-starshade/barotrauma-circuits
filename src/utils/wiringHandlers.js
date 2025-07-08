// Reusable click-to-connect wiring handler for circuit components
export function handleWirePinClick (circuit, componentId, pinName, event) {
  if (circuit.justEndedWiring) {
    circuit.justEndedWiring = false

    return
  }

  if (circuit.wiringInfo) {
    const pinCircle = event.currentTarget.parentElement.querySelector('.pin-circle')

    circuit.endWiring(pinCircle)
  } else {
    circuit.startWiring(componentId, pinName)
  }
}
