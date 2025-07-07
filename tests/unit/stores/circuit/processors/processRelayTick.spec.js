import { describe, it, expect, beforeEach } from 'vitest'
import processRelayTick from '../../../../../src/stores/circuit/processors/processRelayTick'

describe('processRelayTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      isOn: false,
      lastToggleSignal: undefined
    }
  })

  it('should set isOn to true with non-zero SET_STATE', () => {
    component.inputs.SET_STATE = '1'
    const result = processRelayTick(component)

    expect(component.isOn).toBe(true)
    expect(result.STATE_OUT).toBe(1)
  })

  it('should set isOn to false with SET_STATE of "0"', () => {
    component.isOn = true
    component.inputs.SET_STATE = '0'
    const result = processRelayTick(component)

    expect(component.isOn).toBe(false)
    expect(result.STATE_OUT).toBe(0)
  })

  it('should toggle isOn with a new, non-zero TOGGLE_STATE signal', () => {
    // Turn on
    component.inputs.TOGGLE_STATE = 1
    let result = processRelayTick(component)

    expect(component.isOn).toBe(true)
    expect(result.STATE_OUT).toBe(1)

    // Turn off
    component.lastToggleSignal = 1 // Simulate previous tick
    component.inputs.TOGGLE_STATE = 'different' // new non-zero signal
    result = processRelayTick(component)
    expect(component.isOn).toBe(false)
    expect(result.STATE_OUT).toBe(0)
  })

  it('should not toggle state if TOGGLE_STATE is 0', () => {
    component.inputs.TOGGLE_STATE = 0
    const result = processRelayTick(component)

    expect(component.isOn).toBe(false)
    expect(result.STATE_OUT).toBe(0)
  })

  it('should not toggle state if TOGGLE_STATE is the same as the last tick', () => {
    component.inputs.TOGGLE_STATE = 1
    component.lastToggleSignal = 1
    const result = processRelayTick(component)

    expect(component.isOn).toBe(false) // Does not toggle
    expect(result.STATE_OUT).toBe(0)
  })

  it('should prioritize SET_STATE over TOGGLE_STATE', () => {
    component.inputs.TOGGLE_STATE = 1 // would toggle to true
    component.inputs.SET_STATE = '0' // should set to false
    const result = processRelayTick(component)

    expect(component.isOn).toBe(false)
    expect(result.STATE_OUT).toBe(0)
  })

  it('should pass through SIGNAL_IN_1 and SIGNAL_IN_2 when isOn is true', () => {
    component.isOn = true
    component.inputs.SIGNAL_IN_1 = 'hello'
    component.inputs.SIGNAL_IN_2 = 'world'
    const result = processRelayTick(component)

    expect(result.SIGNAL_OUT_1).toBe('hello')
    expect(result.SIGNAL_OUT_2).toBe('world')
  })

  it('should output 0 for signals when isOn is false', () => {
    component.isOn = false
    component.inputs.SIGNAL_IN_1 = 'hello'
    component.inputs.SIGNAL_IN_2 = 'world'
    const result = processRelayTick(component)

    expect(result.SIGNAL_OUT_1).toBe(0)
    expect(result.SIGNAL_OUT_2).toBe(0)
  })

  it('should return defined signals even if inputs are missing', () => {
    component.isOn = true
    // No SIGNAL_IN_1 or SIGNAL_IN_2
    const result = processRelayTick(component)

    expect(result.SIGNAL_OUT_1).toBeUndefined()
    expect(result.SIGNAL_OUT_2).toBeUndefined()
    expect(result.STATE_OUT).toBe(1)
  })
})
