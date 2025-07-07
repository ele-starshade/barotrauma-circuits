import { describe, it, expect, beforeEach } from 'vitest'
import processSignalCheckTick from '../../../../../src/stores/circuit/processors/processSignalCheckTick'

describe('processSignalCheckTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: {
        target_signal: 'open',
        output: '1',
        falseOutput: '0',
        maxOutputLength: 10
      }
    }
  })

  it('should output the "output" value when the input matches the target signal', () => {
    component.inputs.SIGNAL_IN = 'open'
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output the "falseOutput" value when the input does not match', () => {
    component.inputs.SIGNAL_IN = 'close'
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should be case-sensitive', () => {
    component.inputs.SIGNAL_IN = 'Open' // Different case
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output an empty string for a missing signal', () => {
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should handle numeric target signals', () => {
    component.settings.target_signal = '123'
    component.settings.output = 'match'
    component.inputs.SIGNAL_IN = '123'
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('match')
  })

  it('should not match a number with its string representation due to strict equality', () => {
    component.settings.target_signal = '123' // string type
    component.settings.output = 'match'
    component.settings.falseOutput = 'no_match'
    component.inputs.SIGNAL_IN = 123 // number type
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('no_match')
  })

  it('should use SET_TARGETSIGNAL to override settings', () => {
    component.inputs.SET_TARGETSIGNAL = 'close'
    component.inputs.SIGNAL_IN = 'close'
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should use SET_OUTPUT to override settings on match', () => {
    component.inputs.SET_OUTPUT = 'OVERRIDE'
    component.inputs.SIGNAL_IN = 'open'
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('OVERRIDE')
  })

  it('should truncate the output to maxOutputLength', () => {
    component.settings.output = 'THIS IS A VERY LONG STRING'
    component.settings.maxOutputLength = 4
    component.inputs.SIGNAL_IN = 'open'
    const result = processSignalCheckTick(component)

    expect(result.SIGNAL_OUT).toBe('THIS')
  })
})
