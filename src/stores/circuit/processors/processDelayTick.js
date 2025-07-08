/**
 * Processes a single tick for a Delay component in the circuit simulation.
 *
 * Queues incoming signals and releases them after a specified delay.
 * Uses FIFO buffer management with proper timestamp handling.
 *
 * @param {Object} component - The Delay component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {*} component.inputs.SIGNAL_IN - The input signal to delay
 * @param {number|string} component.inputs.SET_DELAY - The delay time in seconds
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} component.settings.delay - Default delay time in seconds
 * @param {boolean} component.settings.resetOnNewSignal - Reset buffer when any signal received
 * @param {boolean} component.settings.resetOnDifferentSignal - Reset buffer when signal changes
 * @returns {Object|undefined} Object with SIGNAL_OUT, or undefined if no delayed signal ready
 *
 * @example
 * // Basic delay with 2-second delay
 * const component = {
 *   inputs: { SIGNAL_IN: 1.0, SET_DELAY: 2.0 },
 *   settings: { delay: 2.0, resetOnNewSignal: false, resetOnDifferentSignal: false }
 * }
 * const result = processDelayTick(component)
 * console.log(result.SIGNAL_OUT) // undefined (signal not ready yet)
 *
 * @example
 * // After 2 seconds, the signal would be output
 * // (This would be called again after the delay period)
 */
export default function processDelayTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN
  const setDelay = inputs?.SET_DELAY

  // Initialize buffer if not exists
  if (!component.signalBuffer) {
    component.signalBuffer = []
    component.lastInputSignal = 0
  }

  const currentTime = Date.now()
  const delayTime = Math.max(0, parseFloat(setDelay) || settings?.delay || 0)
  const delayMs = delayTime * 1000

  // Process input signal
  if (signalIn !== undefined && signalIn !== null) {
    // Check if we should reset the buffer
    if (shouldResetBuffer(component, signalIn, settings)) {
      component.signalBuffer = []
    }

    // Add signal to buffer with timestamp
    if (signalIn !== 0 || component.signalBuffer.length > 0) {
      component.signalBuffer.push({
        value: signalIn,
        timestamp: currentTime
      })
    }

    component.lastInputSignal = signalIn
  }

  // Update output based on delayed signals
  let outputValue = 0
  const signalsToRemove = []

  // Process signals in buffer
  for (let i = 0; i < component.signalBuffer.length; i++) {
    const signal = component.signalBuffer[i]
    const timeDiff = currentTime - signal.timestamp

    if (timeDiff >= delayMs) {
      // Signal has been delayed long enough
      outputValue = signal.value
      signalsToRemove.push(i)
    }
  }

  // Remove processed signals (in reverse order to maintain indices)
  for (let i = signalsToRemove.length - 1; i >= 0; i--) {
    component.signalBuffer.splice(signalsToRemove[i], 1)
  }

  // Return output (undefined if no signal is ready)
  return outputValue !== 0 ? { SIGNAL_OUT: outputValue } : undefined
}

/**
 * Determine if buffer should be reset based on settings and input
 *
 * @param {Object} component - The component object
 * @param {*} inputSignal - The current input signal
 * @param {Object} settings - The component settings
 * @returns {boolean} True if buffer should be reset
 */
function shouldResetBuffer (component, inputSignal, settings) {
  if (settings?.resetOnNewSignal && inputSignal !== 0) {
    return true
  }

  if (settings?.resetOnDifferentSignal && inputSignal !== component.lastInputSignal) {
    return true
  }

  return false
}
