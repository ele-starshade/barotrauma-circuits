import { describe, it, expect } from 'vitest'
import processDisplayTick from '../../../../../src/stores/circuit/processors/processDisplayTick'

describe('processDisplayTick', () => {
  it('should pass the input signal to the value property', () => {
    const component = {
      inputs: { SIGNAL_IN: 'Hello, World!' },
      value: null
    }

    processDisplayTick(component)
    expect(component.value).toBe('Hello, World!')
  })

  it('should update the value when the signal changes', () => {
    const component = {
      inputs: { SIGNAL_IN: 12345 },
      value: 'old value'
    }

    processDisplayTick(component)
    expect(component.value).toBe(12345)
  })

  it('should not update if the signal is the same (this function actually does update)', () => {
    const component = {
      inputs: { SIGNAL_IN: 'same' },
      value: 'same'
    }

    processDisplayTick(component)
    expect(component.value).toBe('same')
  })

  it('should handle missing signal input by not updating', () => {
    const component = {
      inputs: {},
      value: 'initial'
    }

    processDisplayTick(component)
    expect(component.value).toBe('initial')
  })

  it('should handle null signal input', () => {
    const component = {
      inputs: { SIGNAL_IN: null },
      value: 'not null'
    }

    processDisplayTick(component)
    expect(component.value).toBe(null)
  })
})
