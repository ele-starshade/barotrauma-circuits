/**
 * Processes a single tick for an XOR component in the circuit simulation
 *
 * Evaluates the XOR logic operation on two input signals and determines the appropriate
 * output based on whether exactly one input is above the threshold. The function
 * supports configurable output values and threshold-based logic.
 *
 * @param {Object} component - The XOR component to process
 * @param {Object} component.inputs - The input signals for the component
 * @param {*} component.inputs.SIGNAL_IN_1 - The first input signal
 * @param {*} component.inputs.SIGNAL_IN_2 - The second input signal
 * @param {*} component.inputs.SET_OUTPUT - Optional override for the output value when condition is met
 * @param {Object} component.settings - Configuration settings for the component
 * @param {number} component.settings.threshold - Signal threshold for logical operations (default: 0.5)
 * @param {number} component.settings.hysteresis - Hysteresis band to prevent oscillation (default: 0.1)
 * @param {string} component.settings.output - Default output value when XOR condition is met
 * @param {string} component.settings.falseOutput - Output value when XOR condition is not met
 * @param {number} component.settings.maxOutputLength - Maximum length for the output string
 * @returns {string} The processed output value
 *
 * @description
 * This function performs the following operations:
 * - Extracts input signals from the component
 * - Applies threshold to convert inputs to binary values
 * - Uses hysteresis to prevent oscillation near threshold
 * - Evaluates XOR logic: condition is met when exactly one input is above threshold
 * - Selects appropriate output based on whether the XOR condition is met
 * - Applies output length restrictions and string conversion
 * - Returns the final output value
 *
 * The XOR logic works as follows:
 * - If both inputs are above threshold or both are below threshold → condition not met (falseOutput)
 * - If exactly one input is above threshold → condition met (output)
 *
 * @example
 * // Process an XOR component with one input above threshold
 * const component = {
 *   inputs: { SIGNAL_IN_1: 0.8, SIGNAL_IN_2: 0.2 },
 *   settings: { threshold: 0.5, output: "XOR_TRUE", falseOutput: "XOR_FALSE", maxOutputLength: 10 }
 * }
 * const result = processXorTick(component)
 * console.log(result) // { SIGNAL_OUT: "XOR_TRUE" }
 */
export default function processXorTick (component) {
  const { settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const setOutput = inputs?.SET_OUTPUT

  let outputSignal = settings.falseOutput

  if (in1 !== undefined && in2 !== undefined) {
    const threshold = settings.threshold || 0.5
    const hysteresis = settings.hysteresis || 0.1

    // Convert inputs to numbers
    const num1 = parseFloat(in1) || 0
    const num2 = parseFloat(in2) || 0

    // Apply hysteresis to prevent oscillation
    let binary1, binary2

    if (Math.abs(num1 - threshold) < hysteresis) {
      // Use previous state for input 1 if near threshold
      binary1 = component.hysteresisState1 !== undefined ? component.hysteresisState1 : (num1 > threshold ? 1 : 0)
    } else {
      binary1 = num1 > threshold ? 1 : 0
    }

    if (Math.abs(num2 - threshold) < hysteresis) {
      // Use previous state for input 2 if near threshold
      binary2 = component.hysteresisState2 !== undefined ? component.hysteresisState2 : (num2 > threshold ? 1 : 0)
    } else {
      binary2 = num2 > threshold ? 1 : 0
    }

    // Store hysteresis states
    component.hysteresisState1 = binary1
    component.hysteresisState2 = binary2

    // Perform XOR operation
    let xorResult = binary1 ^ binary2

    // --- Timeframe logic start ---
    if (settings.timeFrame > 0) {
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: xorResult,
        timestamp: currentTime
      })
      // Remove old entries outside time frame
      const cutoffTime = currentTime - (settings.timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry => entry.timestamp >= cutoffTime)
      // Calculate average over time frame
      if (component.signalHistory.length > 0) {
        const sum = component.signalHistory.reduce((acc, entry) => acc + entry.value, 0)
        const average = sum / component.signalHistory.length

        xorResult = average > 0.5 ? 1 : 0
      }
    }
    // --- Timeframe logic end ---

    if (xorResult === 1) {
      // Exactly one input is above threshold
      outputSignal = setOutput !== undefined ? setOutput : settings.output
    } else {
      // Both inputs are above threshold or both are below threshold
      outputSignal = settings.falseOutput
    }
  }

  // Apply output length limit
  if (outputSignal !== undefined && outputSignal !== null) {
    outputSignal = String(outputSignal)
    if (settings.maxOutputLength > 0) {
      outputSignal = outputSignal.substring(0, settings.maxOutputLength)
    }
  } else {
    outputSignal = ''
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
