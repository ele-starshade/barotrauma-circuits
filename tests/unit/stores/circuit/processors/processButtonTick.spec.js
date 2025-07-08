import { describe, it, expect } from 'vitest'
import processButtonTick from '../../../../../src/stores/circuit/processors/processButtonTick'

describe('processButtonTick', () => {
  it('returns configured output when button is pressed', () => {
    const component = {
      isPressed: true,
      settings: { output: 'PRESSED' }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('PRESSED')
  })

  it('returns default output "1" when button is pressed and no output configured', () => {
    const component = {
      isPressed: true,
      settings: {}
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('returns default output "1" when button is pressed and settings is undefined', () => {
    const component = {
      isPressed: true
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('returns undefined when button is not pressed', () => {
    const component = {
      isPressed: false,
      settings: { output: 'PRESSED' }
    }
    const result = processButtonTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined when isPressed is undefined', () => {
    const component = {
      settings: { output: 'PRESSED' }
    }
    const result = processButtonTick(component)

    expect(result).toBeUndefined()
  })

  it('returns undefined when isPressed is null', () => {
    const component = {
      isPressed: null,
      settings: { output: 'PRESSED' }
    }
    const result = processButtonTick(component)

    expect(result).toBeUndefined()
  })

  it('handles numeric output values', () => {
    const component = {
      isPressed: true,
      settings: { output: 42 }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe(42)
  })

  it('handles boolean output values', () => {
    const component = {
      isPressed: true,
      settings: { output: true }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe(true)
  })

  it('handles empty string output', () => {
    const component = {
      isPressed: true,
      settings: { output: '' }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles null output value', () => {
    const component = {
      isPressed: true,
      settings: { output: null }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles undefined output value', () => {
    const component = {
      isPressed: true,
      settings: { output: undefined }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles false output value', () => {
    const component = {
      isPressed: true,
      settings: { output: false }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles zero output value', () => {
    const component = {
      isPressed: true,
      settings: { output: 0 }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe('1')
  })

  it('handles object output value', () => {
    const obj = { key: 'value' }
    const component = {
      isPressed: true,
      settings: { output: obj }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe(obj)
  })

  it('handles array output value', () => {
    const arr = [1, 2, 3]
    const component = {
      isPressed: true,
      settings: { output: arr }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe(arr)
  })

  it('handles function output value', () => {
    const fn = () => 'test'
    const component = {
      isPressed: true,
      settings: { output: fn }
    }
    const result = processButtonTick(component)

    expect(result.SIGNAL_OUT).toBe(fn)
  })
})
