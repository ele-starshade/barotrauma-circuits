/**
 * Processes a single tick for a Button component in the circuit simulation
 *
 * The Button component outputs a specified value when pressed. Since the button
 * press is handled by the component's UI interaction, this processor simply
 * returns the configured output value that was set when the button was pressed.
 *
 * @param {Object} component - The Button component to process
 * @param {Object} component.settings - The component's configuration settings
 * @param {string} component.settings.output - The output value when button is pressed (defaults to '1')
 * @returns {string|undefined} The configured output value, or undefined if no output is set
 *
 * @description
 * This function is called during each simulation tick to determine the
 * output value of a Button component. The actual button press interaction
 * is handled by the component's UI, which calls sendSignal() to propagate
 * the output value through the circuit.
 *
 * The Button component works by:
 * 1. User clicks the button in the UI
 * 2. Component calls sendSignal() with the configured output value
 * 3. This processor returns the configured output value for the current tick
 * 4. After a brief delay, the component sends '0' to reset the signal
 *
 * @example
 * // Process a Button component with default output
 * const component = {
 *   settings: { output: '1' }
 * }
 * const result = processButtonTick(component)
 * console.log(result) // { SIGNAL_OUT: '1' }
 *
 * @example
 * // Process a Button component with custom output
 * const component = {
 *   settings: { output: 'PRESSED' }
 * }
 * const result = processButtonTick(component)
 * console.log(result) // { SIGNAL_OUT: 'PRESSED' }
 */
export default function processButtonTick (component) {
  const { settings } = component

  // Only output when button is pressed
  if (component.isPressed) {
    const outputValue = settings?.output || '1'

    return { SIGNAL_OUT: outputValue }
  }

  // Return undefined when not pressed (no signal)
  return undefined
}
