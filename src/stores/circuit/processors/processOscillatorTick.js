/**
 * Processes a single tick for an Oscillator component in the circuit simulation.
 *
 * @param {Object} component - The Oscillator component to process.
 * @param {number} tickInterval - The simulation tick interval in milliseconds.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processOscillatorTick (component, tickInterval) {
  // Ensure phase is valid, default to 0
  if (typeof component.cumulativePhase !== 'number' || isNaN(component.cumulativePhase)) {
    component.cumulativePhase = 0
  }

  const { inputs, settings } = component

  // Determine a valid frequency, preferring input, falling back to settings. Default to 1 if both are invalid.
  let frequency = 1

  if (settings?.frequency && typeof settings.frequency === 'number' && !isNaN(settings.frequency)) {
    frequency = settings.frequency
  }

  if (inputs?.SET_FREQUENCY !== undefined && String(inputs.SET_FREQUENCY).trim() !== '') {
    const parsedFreq = parseFloat(inputs.SET_FREQUENCY)

    if (!isNaN(parsedFreq)) {
      frequency = parsedFreq
    }
  }

  // Determine a valid outputType, with similar logic. Default to 0.
  let outputType = 0

  if (settings?.outputType >= 0 && settings?.outputType <= 4) {
    outputType = settings.outputType
  }

  if (inputs?.SET_OUTPUTTYPE !== undefined && String(inputs.SET_OUTPUTTYPE).trim() !== '') {
    const parsedType = parseInt(inputs.SET_OUTPUTTYPE, 10)

    if (!isNaN(parsedType) && parsedType >= 0 && parsedType <= 4) {
      outputType = parsedType
    }
  }

  // Advance phase
  const phaseIncrement = frequency * (tickInterval / 1000)
  const oldPhase = component.cumulativePhase

  component.cumulativePhase += phaseIncrement

  const currentCyclePhase = ((component.cumulativePhase % 1.0) + 1.0) % 1.0

  let output = 0

  switch (outputType) {
    case 0: { // Pulse
      // A pulse occurs when the phase crosses an integer boundary
      const hasCycled = Math.floor(component.cumulativePhase) !== Math.floor(oldPhase)

      output = (frequency !== 0 && hasCycled) ? 1 : 0
      break
    }
    case 1: // Sawtooth
      output = currentCyclePhase
      break
    case 2: // Sine
      output = Math.sin(currentCyclePhase * 2 * Math.PI)
      break
    case 3: // Square
      output = (currentCyclePhase < 0.5) ? 1 : 0
      break
    case 4: // Triangle
      if (currentCyclePhase < 0.5) {
        output = currentCyclePhase * 4 - 1
      } else {
        output = -currentCyclePhase * 4 + 3
      }

      break
  }

  return { SIGNAL_OUT: output }
}
