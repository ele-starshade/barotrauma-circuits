/**
 * Processes a single tick for a Relay component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with output signals.
 */
export default function processRelayTick (component) {
  const { inputs, settings } = component
  const toggleState = inputs?.TOGGLE_STATE
  const setState = inputs?.SET_STATE
  const signalIn1 = inputs?.SIGNAL_IN_1
  const signalIn2 = inputs?.SIGNAL_IN_2

  // Initialize component state if not exists
  if (component.isOn === undefined) {
    component.isOn = settings.isOn !== undefined ? settings.isOn : true
  }

  if (component.lastToggleSignal === undefined) {
    component.lastToggleSignal = 0
  }

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

  // --- Signal processing ---
  let signalOut1 = 0
  let signalOut2 = 0

  if (component.isOn) {
    signalOut1 = signalIn1 !== undefined ? signalIn1 : 0
    signalOut2 = signalIn2 !== undefined ? signalIn2 : 0
  }

  // --- State output ---
  const stateOut = component.isOn ? 1 : 0

  // Update component state
  component.value = {
    state: stateOut,
    signalOut1,
    signalOut2
  }

  return {
    STATE_OUT: stateOut,
    SIGNAL_OUT_1: signalOut1,
    SIGNAL_OUT_2: signalOut2
  }
}
