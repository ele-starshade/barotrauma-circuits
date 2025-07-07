import { describe, it, expect, beforeEach } from 'vitest'
import processRegExTick from '../../../../../src/stores/circuit/processors/processRegExTick'

describe('processRegExTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: {
        expression: '^\\d+$', // match digits only
        output: 'match',
        falseOutput: 'no_match',
        maxOutputLength: 20,
        continuousOutput: false,
        useCaptureGroup: false,
        outputEmptyCaptureGroup: false
      },
      value: ''
    }
  })

  it('should output the "output" value on a successful match', () => {
    component.inputs.SIGNAL_IN = '12345'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('match')
  })

  it('should output the "falseOutput" value on a failed match', () => {
    component.inputs.SIGNAL_IN = 'abcde'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should handle an empty input string', () => {
    component.inputs.SIGNAL_IN = ''
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should return "falseOutput" if SIGNAL_IN is missing', () => {
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should output "falseOutput" if the regex expression is invalid', () => {
    component.inputs.SIGNAL_IN = '123'
    component.settings.expression = '[' // Invalid regex
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should handle case-sensitive matching', () => {
    component.inputs.SIGNAL_IN = 'HELLO'
    component.settings.expression = 'hello'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should return the last value if signal is missing and continuousOutput is true', () => {
    component.settings.continuousOutput = true
    component.value = 'last_value'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('last_value')
  })
})
