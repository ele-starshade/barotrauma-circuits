/**
 * Processes a single tick for a Relay component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with output signals.
 */
export default function processRelayTick (component) {
  const { inputs } = component
  const toggleState = inputs?.TOGGLE_STATE
  const setState = inputs?.SET_STATE

  // --- Update state ---
  if (toggleState !== undefined && toggleState !== component.lastToggleSignal) {
    if (toggleState !== 0) {
      component.isOn = !component.isOn
    }

    component.lastToggleSignal = toggleState
  }

  if (setState !== undefined) {
    component.isOn = (String(setState).trim() !== '0')
  }

  // --- Determine outputs ---
  const stateOut = component.isOn ? 1 : 0
  let signalOut1, signalOut2

  if (component.isOn) {
    signalOut1 = inputs?.SIGNAL_IN_1
    signalOut2 = inputs?.SIGNAL_IN_2
  } else {
    signalOut1 = 0
    signalOut2 = 0
  }

  return {
    STATE_OUT: stateOut,
    SIGNAL_OUT_1: signalOut1,
    SIGNAL_OUT_2: signalOut2
  }
}
