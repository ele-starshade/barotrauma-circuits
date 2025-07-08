/**
 * Processes a single tick for a RegEx component.
 * @param {Object} component The component to process.
 * @returns {Object|undefined} An object with SIGNAL_OUT.
 */
export default function processRegExTick (component) {
  const { inputs, settings } = component
  const signalIn = inputs?.SIGNAL_IN
  const setOutput = inputs?.SET_OUTPUT

  let outputSignal = settings.falseOutput

  // Handle SET_OUTPUT input to override the configured output
  const currentOutput = setOutput !== undefined ? setOutput : settings.output

  if (signalIn !== undefined) {
    let regex

    try {
      // Handle empty pattern - always matches
      if (!settings.expression || settings.expression.trim() === '') {
        outputSignal = currentOutput
      } else {
        regex = new RegExp(settings.expression)

        const match = String(signalIn).match(regex)

        if (match) {
          if (settings.useCaptureGroup) {
            // Handle capture groups
            const captureGroups = match.groups ? Object.values(match.groups) : []
            const firstCapture = captureGroups.length > 0 ? captureGroups[0] : undefined

            if (firstCapture !== undefined && (firstCapture !== '' || settings.outputEmptyCaptureGroup)) {
              outputSignal = firstCapture
            } else {
              outputSignal = settings.falseOutput
            }
          } else {
            outputSignal = currentOutput
          }
        } else {
          outputSignal = settings.falseOutput
        }
      }
    } catch (e) {
      // Invalid regex, treat as no match
      outputSignal = settings.falseOutput
    }
  } else if (settings.continuousOutput) {
    // Maintain previous output in continuous mode
    outputSignal = component.value !== undefined ? component.value : settings.falseOutput
  } else {
    outputSignal = settings.falseOutput
  }

  // Apply output length limit if configured
  if (settings.maxOutputLength > -1) {
    outputSignal = String(outputSignal).substring(0, settings.maxOutputLength)
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
