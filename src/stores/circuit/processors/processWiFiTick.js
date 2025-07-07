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
  const channel = channelOverride !== undefined ? Number(channelOverride) : settings.channel

  // Read from the channels of the PREVIOUS tick
  const signalOut = wifiChannels[channel]

  if (signalOut !== undefined) {
    return { SIGNAL_OUT: signalOut }
  }
}
