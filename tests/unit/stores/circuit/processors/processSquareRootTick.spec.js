import { describe, it, expect, beforeEach } from 'vitest'
import processSquareRootTick from '../../../../../src/stores/circuit/processors/processSquareRootTick'

describe('processSquareRootTick', () => {
  let component

  beforeEach(() => {
    component = {
      inputs: {}
    }
  })

  it('should calculate the square root of a positive number', () => {
    component.inputs.SIGNAL_IN = 9
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBe(3)
  })

  it('should return 0 for a negative input', () => {
    component.inputs.SIGNAL_IN = -9
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should calculate the square root of 0', () => {
    component.inputs.SIGNAL_IN = 0
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should handle floating point numbers', () => {
    component.inputs.SIGNAL_IN = 2
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(1.414)
  })

  it('should handle string numbers', () => {
    component.inputs.SIGNAL_IN = '16'
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBe(4)
  })

  it('should return 0 for non-numeric strings', () => {
    component.inputs.SIGNAL_IN = 'test'
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should return 0 for missing signal', () => {
    const result = processSquareRootTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })
})
