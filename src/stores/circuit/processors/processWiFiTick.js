/**
 * Processes a single tick for a WiFi component in the circuit simulation.
 *
 * Receives signals broadcasted on a specific channel from other WiFi components.
 * The signal is read from the state of the previous tick to ensure a 1-tick delay.
 *
 * @param {Object} component - The WiFi component to process.
 * @param {Object} wifiChannels - The object of wifi channels from the previous tick.
 * @returns {Object|undefined} An object with SIGNAL_OUT if a signal is on the channel.
 */
export default function processWiFiTick (component, wifiChannels) {
  const { settings, inputs } = component
  const channelOverride = inputs?.SET_CHANNEL

  // Determine channel to use (override takes precedence)
  let channel = settings.channel

  if (channelOverride !== undefined) {
    const overrideChannel = Number(channelOverride)

    if (!isNaN(overrideChannel)) {
      // Clamp channel to valid range (1-100)
      channel = Math.max(1, Math.min(100, Math.floor(overrideChannel)))
    }
  }

  // Read from the channels of the PREVIOUS tick
  const signalOut = wifiChannels[channel]

  if (signalOut !== undefined && signalOut !== null) {
    component.value = signalOut

    return { SIGNAL_OUT: signalOut }
  } else {
    // No signal on this channel
    component.value = 0

    return { SIGNAL_OUT: 0 }
  }
}
