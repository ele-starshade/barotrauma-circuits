import { describe, it, expect } from 'vitest'
import processAcosTick from '../../../../../src/stores/circuit/processors/processAcosTick'

describe('processAcosTick', () => {
  it('returns undefined for null input', () => {
    const component = { inputs: { SIGNAL_IN: null } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    const component = { inputs: { SIGNAL_IN: undefined } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for empty string input', () => {
    const component = { inputs: { SIGNAL_IN: '' } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for input greater than 1', () => {
    const component = { inputs: { SIGNAL_IN: 2 } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for input less than -1', () => {
    const component = { inputs: { SIGNAL_IN: -2 } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for input exactly 1.1', () => {
    const component = { inputs: { SIGNAL_IN: 1.1 } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined for input exactly -1.1', () => {
    const component = { inputs: { SIGNAL_IN: -1.1 } }
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })

  it('calculates arccosine in radians by default', () => {
    const component = { inputs: { SIGNAL_IN: 0.5 } }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 3, 10)
  })

  it('calculates arccosine in radians when useRadians is true', () => {
    const component = {
      inputs: { SIGNAL_IN: 0.5 },
      settings: { useRadians: true }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 3, 10)
  })

  it('calculates arccosine in degrees when useRadians is false', () => {
    const component = {
      inputs: { SIGNAL_IN: 0.5 },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(60, 10)
  })

  it('handles boundary value 1 in radians', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 },
      settings: { useRadians: true }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles boundary value -1 in radians', () => {
    const component = {
      inputs: { SIGNAL_IN: -1 },
      settings: { useRadians: true }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI, 10)
  })

  it('handles boundary value 1 in degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: 1 },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles boundary value -1 in degrees', () => {
    const component = {
      inputs: { SIGNAL_IN: -1 },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(180, 10)
  })

  it('handles string numbers', () => {
    const component = {
      inputs: { SIGNAL_IN: '0.5' },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(60, 10)
  })

  it('handles string numbers with spaces', () => {
    const component = {
      inputs: { SIGNAL_IN: '  0.5  ' },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(60, 10)
  })

  it('passes through non-numeric strings unchanged', () => {
    const component = { inputs: { SIGNAL_IN: 'test' } }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBe('test')
  })

  it('passes through boolean strings unchanged', () => {
    const component = { inputs: { SIGNAL_IN: 'true' } }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBe('true')
  })

  it('handles boolean true as 1', () => {
    const component = {
      inputs: { SIGNAL_IN: true },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(0, 10)
  })

  it('handles boolean false as 0', () => {
    const component = {
      inputs: { SIGNAL_IN: false },
      settings: { useRadians: false }
    }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(90, 10)
  })

  it('handles undefined settings', () => {
    const component = { inputs: { SIGNAL_IN: 0.5 } }
    const result = processAcosTick(component)

    expect(result.SIGNAL_OUT).toBeCloseTo(Math.PI / 3, 10)
  })

  it('handles missing inputs object', () => {
    const component = {}
    const result = processAcosTick(component)

    expect(result).toBeUndefined()
  })
})
