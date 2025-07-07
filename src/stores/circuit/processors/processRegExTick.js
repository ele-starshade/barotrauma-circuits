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

  if (signalIn !== undefined) {
    let regex

    try {
      regex = new RegExp(settings.expression)
    } catch (e) {
      // Invalid regex, treat as no match
      component.value = settings.falseOutput

      return { SIGNAL_OUT: settings.falseOutput }
    }

    const match = String(signalIn).match(regex)

    if (match) {
      if (settings.useCaptureGroup) {
        const captureGroups = match.groups ? Object.values(match.groups) : []
        const firstCapture = captureGroups.length > 0 ? captureGroups[0] : undefined

        if (firstCapture !== undefined && (firstCapture !== '' || settings.outputEmptyCaptureGroup)) {
          outputSignal = firstCapture
        } else {
          outputSignal = settings.falseOutput
        }
      } else {
        outputSignal = setOutput !== undefined ? setOutput : settings.output
      }
    } else {
      outputSignal = settings.falseOutput
    }
  } else if (settings.continuousOutput) {
    outputSignal = component.value
  } else {
    outputSignal = settings.falseOutput
  }

  if (settings.maxOutputLength > -1) {
    outputSignal = String(outputSignal).substring(0, settings.maxOutputLength)
  }

  component.value = outputSignal

  return { SIGNAL_OUT: outputSignal }
}
