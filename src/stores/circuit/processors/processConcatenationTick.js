/**
 * Processes a single tick for a Concatenation component in the circuit simulation.
 *
 * Joins two input signals together with an optional separator.
 *
 * @param {Object} component - The Concatenation component to process.
 * @returns {string|undefined} The concatenated string, or undefined.
 */
export default function processConcatenationTick (component) {
  const { lastSignalTimestamps, settings, inputs } = component
  const in1 = inputs?.SIGNAL_IN_1
  const in2 = inputs?.SIGNAL_IN_2
  const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
  const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

  if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
    const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

    if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
      const s1 = String(in1 ?? '')
      const s2 = String(in2 ?? '')
      const result = s1 + settings.separator + s2

      return { SIGNAL_OUT: result.substring(0, settings.maxOutputLength) }
    }
  }
}
