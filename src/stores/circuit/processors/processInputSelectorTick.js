/**
 * Processes a single tick for an InputSelector component in the circuit simulation.
 *
 * Selects an input and forwards its signal.
 * Handles channel selection, movement, and validation gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The InputSelector component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SET_INPUT] - Direct channel selection
 * @param {number|string} [component.inputs.MOVE_INPUT] - Channel increment/decrement
 * @param {number|string} [component.inputs.SIGNAL_IN_0] - Input signal for channel 0
 * @param {number|string} [component.inputs.SIGNAL_IN_1] - Input signal for channel 1
 * @param {number|string} [component.inputs.SIGNAL_IN_2] - Input signal for channel 2
 * @param {number|string} [component.inputs.SIGNAL_IN_3] - Input signal for channel 3
 * @param {number|string} [component.inputs.SIGNAL_IN_4] - Input signal for channel 4
 * @param {number|string} [component.inputs.SIGNAL_IN_5] - Input signal for channel 5
 * @param {number|string} [component.inputs.SIGNAL_IN_6] - Input signal for channel 6
 * @param {number|string} [component.inputs.SIGNAL_IN_7] - Input signal for channel 7
 * @param {number|string} [component.inputs.SIGNAL_IN_8] - Input signal for channel 8
 * @param {number|string} [component.inputs.SIGNAL_IN_9] - Input signal for channel 9
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.selectedConnection] - Currently selected channel (default: 0)
 * @param {boolean} [component.settings.wrapAround] - Whether to wrap around channel selection (default: true)
 * @param {number} [component.settings.channelCount] - Number of available channels (default: 10)
 * @returns {Object} Object with SIGNAL_OUT and SELECTED_INPUT_OUT
 *
 * @example
 * // Basic channel selection
 * const component = {
 *   inputs: { SIGNAL_IN_0: 5, SIGNAL_IN_1: 10, SET_INPUT: 1 },
 *   settings: { selectedConnection: 0, wrapAround: true }
 * }
 * const result = processInputSelectorTick(component)
 * console.log(result.SIGNAL_OUT) // 10
 * console.log(result.SELECTED_INPUT_OUT) // 1
 *
 * @example
 * // Channel movement
 * const component = {
 *   inputs: { SIGNAL_IN_0: 5, SIGNAL_IN_1: 10, MOVE_INPUT: 1 },
 *   settings: { selectedConnection: 0, wrapAround: true }
 * }
 * const result = processInputSelectorTick(component)
 * console.log(result.SIGNAL_OUT) // 10
 * console.log(result.SELECTED_INPUT_OUT) // 1
 */
export default function processInputSelectorTick (component) {
  const { settings, inputs } = component
  const setInput = inputs?.SET_INPUT
  const moveInput = inputs?.MOVE_INPUT

  // Get current selected channel
  let selectedChannel = settings?.selectedConnection ?? 0
  const wrapAround = settings?.wrapAround ?? true
  const channelCount = settings?.channelCount ?? 10

  try {
    // Handle direct channel selection
    if (setInput !== null && setInput !== undefined && setInput !== '') {
      const newSelection = Number(setInput)

      if (!isNaN(newSelection)) {
        selectedChannel = validateChannel(newSelection, channelCount, wrapAround)
      }
    }

    // Handle channel movement
    if (moveInput !== null && moveInput !== undefined && moveInput !== '' && moveInput !== 0) {
      const moveAmount = Math.sign(Number(moveInput) || 0)
      const newChannel = selectedChannel + moveAmount

      selectedChannel = validateChannel(newChannel, channelCount, wrapAround)
    }

    // Get signal from selected channel
    const selectedPinName = `SIGNAL_IN_${selectedChannel}`
    const signalOut = inputs?.[selectedPinName]

    // Handle null/undefined/empty signal as 0
    const outputSignal = (signalOut === null || signalOut === undefined || signalOut === '') ? 0 : signalOut

    return {
      SIGNAL_OUT: outputSignal,
      SELECTED_INPUT_OUT: selectedChannel
    }
  } catch (error) {
    // If calculation fails, return current channel with 0 signal
    return {
      SIGNAL_OUT: 0,
      SELECTED_INPUT_OUT: selectedChannel
    }
  }
}

/**
 * Validate and adjust channel number
 * @param {number} channel - Channel number to validate
 * @param {number} channelCount - Total number of channels
 * @param {boolean} wrapAround - Whether to wrap around
 * @returns {number} - Valid channel number
 */
function validateChannel (channel, channelCount, wrapAround) {
  // Ensure channel is a number
  if (typeof channel !== 'number' || isNaN(channel)) {
    return 0
  }

  // Handle wrap-around
  if (wrapAround) {
    // Wrap around for both positive and negative values
    while (channel < 0) {
      channel += channelCount
    }
    while (channel >= channelCount) {
      channel -= channelCount
    }
  } else {
    // Clamp to valid range
    channel = Math.max(0, Math.min(channel, channelCount - 1))
  }

  return Math.floor(channel)
}
