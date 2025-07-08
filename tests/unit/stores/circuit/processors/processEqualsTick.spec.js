import { describe, it, expect, beforeEach } from 'vitest'
import processEqualsTick from '../../../../../src/stores/circuit/processors/processEqualsTick'

describe('processEqualsTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {},
      lastSignalTimestamps: {},
      settings: {
        timeframe: 10,
        output: '1',
        falseOutput: '0',
        maxOutputLength: 10
      }
    }
  })

  it('should output "1" when signals are equal and within timeframe', () => {
    component.inputs = { SIGNAL_IN_1: 'test', SIGNAL_IN_2: 'test' }
    component.lastSignalTimestamps = { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output "0" when signals are not equal', () => {
    component.inputs = { SIGNAL_IN_1: 'test1', SIGNAL_IN_2: 'test2' }
    component.lastSignalTimestamps = { SIGNAL_IN_1: 100, SIGNAL_IN_2: 105 }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output "0" when timeframe is exceeded', () => {
    component.inputs = { SIGNAL_IN_1: 'test', SIGNAL_IN_2: 'test' }
    component.lastSignalTimestamps = { SIGNAL_IN_1: 100, SIGNAL_IN_2: 120 }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should correctly compare numbers and output "1"', () => {
    component.inputs = { SIGNAL_IN_1: 123, SIGNAL_IN_2: 123 }
    component.lastSignalTimestamps = { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should correctly compare a number and a string with loose equality and output "1"', () => {
    component.inputs = { SIGNAL_IN_1: 123, SIGNAL_IN_2: '123' }
    component.lastSignalTimestamps = { SIGNAL_IN_1: 100, SIGNAL_IN_2: 101 }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('should output "0" if one signal is missing', () => {
    component.inputs = { SIGNAL_IN_1: 'hello' }
    component.lastSignalTimestamps = { SIGNAL_IN_1: 100 }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('0')
  })

  it('should output empty string if output and falseOutput are undefined', () => {
    component.settings.output = undefined
    component.settings.falseOutput = undefined
    component.inputs = { SIGNAL_IN_1: 'a', SIGNAL_IN_2: 'a' }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })

  it('should output empty string if output and falseOutput are empty string', () => {
    component.settings.output = ''
    component.settings.falseOutput = ''
    component.inputs = { SIGNAL_IN_1: 'a', SIGNAL_IN_2: 'a' }
    const result = processEqualsTick(component)

    expect(result.SIGNAL_OUT).toBe('')
  })
})
