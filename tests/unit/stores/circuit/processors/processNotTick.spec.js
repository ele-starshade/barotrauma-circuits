import { describe, it, expect, beforeEach } from 'vitest'
import processNotTick from '../../../../../src/stores/circuit/processors/processNotTick'

describe('processNotTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      settings: {},
      value: undefined
    }
  })

  it('should output 1 for a numeric 0 input', () => {
    component.inputs.SIGNAL_IN = 0
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
    expect(component.value).toBe(1)
  })

  it('should output 0 for a non-zero numeric input', () => {
    component.inputs.SIGNAL_IN = 5
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
    expect(component.value).toBe(0)
  })

  it('should output 1 for a non-numeric string (coerced to 0)', () => {
    component.inputs.SIGNAL_IN = 'hello'
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
    expect(component.value).toBe(1)
  })

  it('should output 1 for an empty string (coerced to 0)', () => {
    component.inputs.SIGNAL_IN = ''
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
    expect(component.value).toBe(1)
  })

  it('should output 0 if signal is missing and continuousOutput is false', () => {
    component.settings.continuousOutput = false
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should output the last value if signal is missing and continuousOutput is true', () => {
    component.settings.continuousOutput = true
    component.value = 1
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(1)
  })

  it('should output 0 if signal is missing, continuousOutput is true, but value is uninitialized', () => {
    component.settings.continuousOutput = true
    // component.value is undefined
    const result = processNotTick(component)

    expect(result.SIGNAL_OUT).toBe(undefined)
  })
})
