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

  it('should use capture group when useCaptureGroup is true', () => {
    component.settings.useCaptureGroup = true
    component.settings.expression = '(?<digit>\\d+)'
    component.inputs.SIGNAL_IN = 'abc123def'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('123')
  })

  it('should handle maxOutputLength = -1 (no truncation)', () => {
    component.settings.maxOutputLength = -1
    component.inputs.SIGNAL_IN = '12345678901234567890'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('match')
  })

  it('should handle match.groups undefined (no named capture)', () => {
    component.settings.useCaptureGroup = true
    component.settings.expression = '(\\d+)' // no named group
    component.inputs.SIGNAL_IN = 'abc123def'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should output falseOutput when capture group is empty and outputEmptyCaptureGroup is false', () => {
    component.settings.useCaptureGroup = true
    component.settings.outputEmptyCaptureGroup = false
    component.settings.expression = '(?<digit>\\d*)'
    component.inputs.SIGNAL_IN = 'abc'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should output empty capture group when outputEmptyCaptureGroup is true', () => {
    component.settings.useCaptureGroup = true
    component.settings.outputEmptyCaptureGroup = true
    component.settings.expression = '(?<digit>\\d*)'
    component.inputs.SIGNAL_IN = 'abc'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output falseOutput when no capture groups are found', () => {
    component.settings.useCaptureGroup = true
    component.settings.expression = '\\d+'
    component.inputs.SIGNAL_IN = '123'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should output last value if signalIn is undefined and continuousOutput is true', () => {
    component.inputs = {}
    component.settings.continuousOutput = true
    component.value = 'last_value'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('last_value')
  })

  it('should output falseOutput if signalIn is undefined and continuousOutput is false', () => {
    component.inputs = {}
    component.settings.continuousOutput = false
    component.value = 'should_not_return'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should not truncate output if maxOutputLength is -1', () => {
    component.settings.maxOutputLength = -1
    component.inputs.SIGNAL_IN = '12345'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('match')
  })

  it('should not truncate long output if maxOutputLength is -1', () => {
    component.settings.maxOutputLength = -1
    component.settings.output = 'very long output string that should not be truncated'
    component.inputs.SIGNAL_IN = '12345'
    const result = processRegExTick(component)

    expect(result.SIGNAL_OUT).toBe('very long output string that should not be truncated')
  })
})
