import { describe, it, expect, beforeEach } from 'vitest'
import processWiFiTick from '../../../../../src/stores/circuit/processors/processWiFiTick'

describe('processWiFiTick', () => {
  let component
  let wifiChannels

  beforeEach(() => {
    component = {
      inputs: {},
      settings: { channel: 10 }
    }
    // This represents the state of channels from the previous tick
    wifiChannels = {
      10: 'hello',
      20: 'world'
    }
  })

  it('should receive a signal from the channel specified in settings', () => {
    const result = processWiFiTick(component, wifiChannels)

    expect(result.SIGNAL_OUT).toBe('hello')
  })

  it('should receive a signal from the channel specified by SET_CHANNEL input', () => {
    component.inputs.SET_CHANNEL = '20'
    const result = processWiFiTick(component, wifiChannels)

    expect(result.SIGNAL_OUT).toBe('world')
  })

  it('should prioritize SET_CHANNEL over settings.channel', () => {
    component.settings.channel = 10 // This should be ignored
    component.inputs.SET_CHANNEL = '20'
    const result = processWiFiTick(component, wifiChannels)

    expect(result.SIGNAL_OUT).toBe('world')
  })

  it('should return undefined if no signal is on its channel', () => {
    component.settings.channel = 30 // Channel 30 has no signal
    const result = processWiFiTick(component, wifiChannels)

    expect(result).toBeUndefined()
  })

  it('should return undefined if the wifiChannels object is empty', () => {
    const result = processWiFiTick(component, {})

    expect(result).toBeUndefined()
  })

  it('should handle numeric SET_CHANNEL input', () => {
    component.inputs.SET_CHANNEL = 10
    const result = processWiFiTick(component, wifiChannels)

    expect(result.SIGNAL_OUT).toBe('hello')
  })
})
