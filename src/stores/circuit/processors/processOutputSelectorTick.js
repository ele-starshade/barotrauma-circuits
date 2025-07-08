/**
 * Processes a single tick for an OutputSelector component.
 *
 * Routes input signal to a selected output channel.
 * Handles channel selection, movement, and validation gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal to route
 * @param {number|string} [component.inputs.SET_OUTPUT] - Direct channel selection
 * @param {number|string} [component.inputs.MOVE_OUTPUT] - Channel increment/decrement
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.selectedConnection] - Currently selected channel (default: 0)
 * @param {boolean} [component.settings.wrapAround] - Whether to wrap around channel selection (default: true)
 * @param {number} [component.settings.channelCount] - Number of available channels (default: 10)
 * @returns {Object} Object with output signals for all channels and selected output
 *
 * @example
 * // Basic output routing
 * const component = {
 *   inputs: { SIGNAL_IN: 5.5, SET_OUTPUT: 2 },
 *   settings: { selectedConnection: 0, wrapAround: true }
 * }
 * const result = processOutputSelectorTick(component)
 * console.log(result.SIGNAL_OUT_2) // 5.5
 * console.log(result.SELECTED_OUTPUT_OUT) // 2
 *
 * @example
 * // Channel movement
 * const component = {
 *   inputs: { SIGNAL_IN: 3.2, MOVE_OUTPUT: 1 },
 *   settings: { selectedConnection: 1, wrapAround: true }
 * }
 * const result = processOutputSelectorTick(component)
 * console.log(result.SIGNAL_OUT_2) // 3.2
 * console.log(result.SELECTED_OUTPUT_OUT) // 2
 */
export default function processOutputSelectorTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN
  const setOutput = inputs?.SET_OUTPUT
  const moveOutput = inputs?.MOVE_OUTPUT

  // Get current selected channel
  let selectedChannel = settings?.selectedConnection ?? 0
  const wrapAround = settings?.wrapAround ?? true
  const channelCount = settings?.channelCount ?? 10

  try {
    // Handle direct channel selection
    if (setOutput !== null && setOutput !== undefined && setOutput !== '') {
      const newSelection = Number(setOutput)

      if (!isNaN(newSelection)) {
        selectedChannel = validateChannel(newSelection, channelCount, wrapAround)
      }
    }

    // Handle channel movement
    if (moveOutput !== null && moveOutput !== undefined && moveOutput !== '' && moveOutput !== 0) {
      const moveAmount = Math.sign(Number(moveOutput) || 0)
      const newChannel = selectedChannel + moveAmount

      selectedChannel = validateChannel(newChannel, channelCount, wrapAround)
    }

    // Determine outputs
    const outputs = {
      SELECTED_OUTPUT_OUT: selectedChannel
    }

    // Set all outputs to 0 initially
    for (let i = 0; i < channelCount; i++) {
      outputs[`SIGNAL_OUT_${i}`] = 0
    }

    // Set the selected output to the input signal
    if (signalIn !== null && signalIn !== undefined && signalIn !== '') {
      const inputSignal = Number(signalIn)

      if (!isNaN(inputSignal)) {
        outputs[`SIGNAL_OUT_${selectedChannel}`] = inputSignal
      }
    }

    return outputs
  } catch (error) {
    // If calculation fails, return default outputs
    const outputs = {
      SELECTED_OUTPUT_OUT: selectedChannel
    }

    for (let i = 0; i < channelCount; i++) {
      outputs[`SIGNAL_OUT_${i}`] = 0
    }

    return outputs
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
