import { describe, it, expect } from 'vitest'
import processAsinTick from '../../../../../src/stores/circuit/processors/processAsinTick'

describe('processAsinTick', () => {
  it('should calculate asin in degrees by default', () => {
    const component = {
      inputs: { SIGNAL_IN: 0.5 },
      settings: { useRadians: false }
    }
    const result = processAsinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(30)
  })

  it('should calculate asin in radians when specified', () => {
    const component = {
      inputs: { SIGNAL_IN: 0.5 },
      settings: { useRadians: true }
    }
    const result = processAsinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 6)
  })

  it('should clamp input greater than 1', () => {
    const component = {
      inputs: { SIGNAL_IN: 2 },
      settings: { useRadians: true }
    }
    const result = processAsinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 2)
  })

  it('should clamp input less than -1', () => {
    const component = {
      inputs: { SIGNAL_IN: -2 },
      settings: { useRadians: true }
    }
    const result = processAsinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(-Math.PI / 2)
  })

  it('should return 0 for non-numeric strings', () => {
    const component = {
      inputs: { SIGNAL_IN: 'test' },
      settings: { useRadians: false }
    }
    const result = processAsinTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0)
  })

  it('should return undefined for missing signal', () => {
    const component = {
      inputs: {},
      settings: { useRadians: false }
    }
    const result = processAsinTick(component)

    expect(result).toBeUndefined()
  })
})
