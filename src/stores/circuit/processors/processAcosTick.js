/**
 * Processes a single tick for an Acos component in the circuit simulation
 *
 * The Acos Component is an electrical component that performs the inverse cosine
 * function; cos-1(x). It outputs the angle whose cosine is equal to the input.
 *
 * @param {Object} component - The Acos component to process
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} component.inputs.SIGNAL_IN - The input signal, clamped to [-1, 1]
 * @param {Object} component.settings - The component's configuration settings
 * @param {boolean} component.settings.useRadians - If set to true, the trigonometric function uses radians instead of degrees.
 * @returns {number|undefined} The arccosine of the input, or undefined if the input is not valid
 *
 * @example
 * // Input 0.5, useRadians: false (default) -> Output: 60 (degrees)
 * const component = {
 *   inputs: { SIGNAL_IN: 0.5 },
 *   settings: { useRadians: false }
 * }
 * const result = circuitStore._processAcosTick(component)
 * console.log(result) // 60.00000000000001
 *
 * @example
 * // Input 0.5, useRadians: true -> Output: 1.047... (radians)
 * const component = {
 *   inputs: { SIGNAL_IN: 0.5 },
 *   settings: { useRadians: true }
 * }
 * const result = circuitStore._processAcosTick(component)
 * console.log(result) // 1.0471975511965979
 *
 * @example
 * // Input clamped to 1, output in degrees
 * const component = {
 *   inputs: { SIGNAL_IN: 5 },
 *   settings: { useRadians: false }
 * }
 * const result = circuitStore._processAcosTick(component)
 * console.log(result) // 0
 */
export default function processAcosTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    let num = parseFloat(signalIn) || 0

    // Clamp the input value to the valid range for acos [-1, 1]
    num = Math.max(-1, Math.min(1, num))

    let angle = Math.acos(num)

    if (!component.settings.useRadians) {
      angle = angle * (180 / Math.PI)
    }

    return { SIGNAL_OUT: angle }
  }
}
