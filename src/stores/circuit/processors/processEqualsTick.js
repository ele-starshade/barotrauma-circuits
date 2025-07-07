/**
 * Processes a single tick for an Equals component in the circuit simulation.
 *
 * Outputs a signal if both inputs are the same.
 *
 * @param {Object} component - The Equals component to process.
 * @returns {string|undefined} The configured output signal.
 */
export default function processEqualsTick (component) {
  const { lastSignalTimestamps, settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
  const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2
  let newValue
  let conditionMet = false

  if (in1 !== undefined && in2 !== undefined) {
    if (settings.timeframe > 0) {
      if (in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (timeDiff <= settings.timeframe) {
          // eslint-disable-next-line eqeqeq
          if (in1 == in2) {
            conditionMet = true
          }
        }
      }
    } else {
      // eslint-disable-next-line eqeqeq
      if (in1 == in2) {
        conditionMet = true
      }
    }
  }

  if (conditionMet) {
    newValue = inputs?.SET_OUTPUT ?? settings.output
  } else {
    newValue = settings.falseOutput
  }

  if (newValue !== undefined && newValue !== '') {
    newValue = String(newValue).substring(0, settings.maxOutputLength)
  } else {
    newValue = ''
  }

  return { SIGNAL_OUT: newValue }
}
