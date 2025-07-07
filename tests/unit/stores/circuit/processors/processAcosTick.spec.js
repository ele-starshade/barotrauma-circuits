import { describe, it, expect } from 'vitest'
import processAcosTick from '../../../../../src/stores/circuit/processors/processAcosTick'

describe('processAcosTick', () => {
  it('should calculate acos in degrees by default', () => {
    const component = {
      inputs: { SIGNAL_IN: 0.5 },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(60)
  })

  it('should calculate acos in radians when specified', () => {
    const component = {
      inputs: { SIGNAL_IN: 0.5 },
      settings: { useRadians: true }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 3)
  })

  it('should clamp input greater than 1', () => {
    const component = {
      inputs: { SIGNAL_IN: 2 },
      settings: { useRadians: true }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBe(0)
  })

  it('should clamp input less than -1', () => {
    const component = {
      inputs: { SIGNAL_IN: -2 },
      settings: { useRadians: true }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBe(Math.PI)
  })

  it('should return 0 for non-numeric strings', () => {
    const component = {
      inputs: { SIGNAL_IN: 'test' },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(90)
  })

  it('should return undefined for missing signal', () => {
    const component = {
      inputs: {},
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })
})
