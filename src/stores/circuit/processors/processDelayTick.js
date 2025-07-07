/**
 * Processes a single tick for a Delay component in the circuit simulation.
 *
 * Queues incoming signals and releases them after a specified delay.
 *
 * @param {Object} component - The Delay component to process.
 * @returns {any|undefined} The value of a signal whose delay has elapsed, or undefined.
 */
export default function processDelayTick (component) {
  const { inputs, settings, lastSignalTimestamps } = component
  const signalIn = inputs?.SIGNAL_IN
  const signalTimestamp = lastSignalTimestamps?.SIGNAL_IN

  // Enqueue new signal if it's new
  if (signalTimestamp && signalTimestamp !== component.lastProcessedTimestamp) {
    const delayInMs = (parseFloat(inputs?.SET_DELAY) || settings.delay) * 1000

    if (settings.resetOnNewSignal) {
      component.pendingSignals = []
    }

    if (settings.resetOnDifferentSignal && signalIn !== component.lastSignalIn) {
      component.pendingSignals = []
    }

    component.pendingSignals.push({
      value: signalIn,
      releaseTime: Date.now() + delayInMs
    })

    component.lastSignalIn = signalIn
    component.lastProcessedTimestamp = signalTimestamp
  }

  // Dequeue a signal if its time has come
  let output
  const now = Date.now()
  const readySignalIndex = component.pendingSignals.findIndex(s => s.releaseTime <= now)

  if (readySignalIndex > -1) {
    output = component.pendingSignals[readySignalIndex].value
    component.pendingSignals.splice(readySignalIndex, 1)
  }

  return { SIGNAL_OUT: output }
}
