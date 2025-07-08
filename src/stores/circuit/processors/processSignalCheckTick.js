/**
 * Processes a single tick for the SignalCheck component
 *
 * Compares an input signal against a target signal and outputs a configured value
 * based on whether the signals match. This component is useful for signal validation
 * and conditional output generation in circuit logic.
 *
 * @param {Object} component - The SignalCheck component to process
 * @param {Object} component.settings - The component's configuration settings
 * @param {string} component.settings.target_signal - The target signal to compare against
 * @param {string} component.settings.output - The output value when signals match
 * @param {string} component.settings.falseOutput - The output value when signals don't match
 * @param {number} component.settings.maxOutputLength - Maximum length for output strings
 * @param {Object} component.inputs - The current input values for the component
 * @param {*} component.inputs.SIGNAL_IN - The input signal to check
 * @param {string} [component.inputs.SET_TARGETSIGNAL] - Override for target signal (optional)
 * @param {string} [component.inputs.SET_OUTPUT] - Override for output value when signals match (optional)
 * @returns {string} The output value based on signal comparison, or empty string if no input
 *
 * @description
 * This function performs the following operations:
 * - Extracts the input signal and target signal from component inputs and settings
 * - Compares the input signal against the target signal for exact equality
 * - Returns the configured output value if signals match, or falseOutput if they don't
 * - Truncates the output to the maximum configured length
 * - Returns an empty string if no input signal is provided
 *
 * The function supports dynamic overrides through input pins:
 * - SET_TARGETSIGNAL: Overrides the default target signal from settings
 * - SET_OUTPUT: Overrides the default output value when signals match
 *
 * @example
 * // Process a SignalCheck component with matching signals
 * const component = {
 *   settings: { target_signal: "HIGH", output: "VALID", falseOutput: "INVALID", maxOutputLength: 10 },
 *   inputs: { SIGNAL_IN: "HIGH" }
 * }
 * const result = circuitStore._processSignalCheckTick(component)
 * console.log(result) // "VALID"
 *
 * @example
 * // Process a SignalCheck component with non-matching signals
 * const component = {
 *   settings: { target_signal: "HIGH", output: "VALID", falseOutput: "INVALID", maxOutputLength: 10 },
 *   inputs: { SIGNAL_IN: "LOW" }
 * }
 * const result = circuitStore._processSignalCheckTick(component)
 * console.log(result) // "INVALID"
 */
export default function processSignalCheckTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN
  const targetSignal = inputs?.SET_TARGETSIGNAL ?? settings.target_signal
  const output = inputs?.SET_OUTPUT ?? settings.output
  let newValue

  if (signalIn !== undefined) {
    // Perform exact equality comparison (type-sensitive)
    if (signalIn === targetSignal) {
      newValue = output
    } else {
      newValue = settings.falseOutput
    }
  } else {
    // No input signal - output false output
    newValue = settings.falseOutput
  }

  // Convert to string and apply length limit
  if (newValue !== undefined && newValue !== null) {
    newValue = String(newValue)
    if (settings.maxOutputLength > 0) {
      newValue = newValue.substring(0, settings.maxOutputLength)
    }
  } else {
    newValue = ''
  }

  component.value = newValue

  return { SIGNAL_OUT: newValue }
}
