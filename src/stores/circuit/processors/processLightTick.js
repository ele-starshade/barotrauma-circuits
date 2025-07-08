/**
 * Process Light component tick
 * Handles TOGGLE_STATE, SET_STATE, and SET_COLOR inputs
 */
export default function processLightTick (component) {
  const { inputs } = component

  // Handle TOGGLE_STATE input - toggles the light on/off
  if (inputs?.TOGGLE_STATE !== undefined) {
    const toggleValue = inputs.TOGGLE_STATE

    // Any truthy value toggles the state
    if (toggleValue) {
      component.isOn = !component.isOn
    }
  }

  // Handle SET_STATE input - directly sets the light on/off
  // This takes precedence over TOGGLE_STATE
  if (inputs?.SET_STATE !== undefined) {
    const setValue = inputs.SET_STATE

    // Convert to boolean: truthy = on, falsy = off
    component.isOn = Boolean(setValue)
  }

  // Handle SET_COLOR input - sets the light color
  if (inputs?.SET_COLOR !== undefined) {
    const colorValue = inputs.SET_COLOR

    // Only set color if it's a valid string
    if (typeof colorValue === 'string' && colorValue.trim()) {
      component.color = colorValue
    }
  }
}
