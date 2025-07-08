/**
 * Processes a single tick for an Oscillator component in the circuit simulation.
 *
 * Generates periodic waveforms based on frequency and output type.
 * Handles special cases and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Oscillator component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SET_FREQUENCY] - Frequency control signal
 * @param {number|string} [component.inputs.SET_OUTPUTTYPE] - Output type control signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.frequency] - Default frequency in Hz (default: 1)
 * @param {number} [component.settings.outputType] - Default output type: 0=Pulse, 1=Sawtooth, 2=Sine, 3=Square, 4=Triangle (default: 0)
 * @param {number} tickInterval - The simulation tick interval in milliseconds
 * @returns {Object} Object with SIGNAL_OUT containing the generated waveform
 *
 * @example
 * // Basic pulse oscillator
 * const component = {
 *   inputs: {},
 *   settings: { frequency: 1, outputType: 0 },
 *   cumulativePhase: 0
 * }
 * const result = processOscillatorTick(component, 16)
 * console.log(result.SIGNAL_OUT) // 0 or 1 depending on phase
 *
 * @example
 * // Sine wave oscillator
 * const component = {
 *   inputs: { SET_FREQUENCY: 2, SET_OUTPUTTYPE: 2 },
 *   settings: { frequency: 1, outputType: 0 },
 *   cumulativePhase: 0
 * }
 * const result = processOscillatorTick(component, 16)
 * console.log(result.SIGNAL_OUT) // Sine wave value between -1 and 1
 */
export default function processOscillatorTick (component, tickInterval) {
  // Ensure phase is valid, default to 0
  if (typeof component.cumulativePhase !== 'number' || isNaN(component.cumulativePhase)) {
    component.cumulativePhase = 0
  }

  const { settings, inputs } = component

  try {
    // Determine frequency with validation
    let frequency = settings?.frequency ?? 1

    // Validate frequency from settings
    if (typeof frequency !== 'number' || isNaN(frequency) || frequency < 0.1 || frequency > 10) {
      frequency = Math.max(0.1, Math.min(10, frequency))
    }

    // Override with input if provided
    if (inputs?.SET_FREQUENCY !== null && inputs?.SET_FREQUENCY !== undefined && inputs?.SET_FREQUENCY !== '') {
      const inputFreq = Number(inputs.SET_FREQUENCY)

      if (!isNaN(inputFreq)) {
        frequency = Math.max(0.1, Math.min(10, inputFreq)) // Clamp to valid range
      }
    }

    // Determine output type with validation
    let outputType = settings?.outputType ?? 0

    // Validate output type from settings
    if (typeof outputType !== 'number' || isNaN(outputType) || outputType < 0 || outputType > 4) {
      outputType = 0
    }

    // Override with input if provided
    if (inputs?.SET_OUTPUTTYPE !== null && inputs?.SET_OUTPUTTYPE !== undefined && inputs?.SET_OUTPUTTYPE !== '') {
      const inputType = Number(inputs.SET_OUTPUTTYPE)

      if (!isNaN(inputType) && inputType >= 0 && inputType <= 4) {
        outputType = Math.floor(inputType)
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
      default:
        output = 0
    }

    return { SIGNAL_OUT: output }
  } catch (error) {
    // If calculation fails, return 0
    return { SIGNAL_OUT: 0 }
  }
}
