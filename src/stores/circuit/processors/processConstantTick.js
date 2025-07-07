/**
 * Processes a single simulation tick for the Constant component
 *
 * Returns the constant value configured for this component. The Constant
 * component maintains a fixed output value that doesn't change during
 * simulation, making it useful for providing static signals to other
 * components in the circuit.
 *
 * @param {Object} component - The Constant component to process
 * @param {string} component.id - The unique identifier of the component
 * @param {string} component.name - The component type name ('Constant')
 * @param {string|number} component.value - The constant value to output
 * @returns {string|number} The constant value that should be output by this component
 *
 * @description
 * This function is called during each simulation tick to determine the
 * output value of a Constant component. Unlike other components that
 * process inputs or generate dynamic values, the Constant component
 * simply returns its configured value unchanged.
 *
 * The returned value will be propagated to any components connected
 * to this Constant component's output pin.
 *
 * @example
 * // Process a Constant component with value "5"
 * const component = { id: 'const-1', name: 'Constant', value: '5' }
 * const output = circuitStore._processConstantTick(component)
 * console.log(output) // "5"
 */
export default function processConstantTick (component) {
  return { VALUE_OUT: component.value }
}
