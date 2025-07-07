import { describe, it, expect } from 'vitest'
import processMemoryTick from '../../../../../src/stores/circuit/processors/processMemoryTick'

describe('processMemoryTick', () => {
  it('should update component value when writeable and not locked', () => {
    const component = {
      inputs: { SIGNAL_IN: 'new data' },
      settings: { writeable: true, maxValueLength: 20, value: 'old data' },
      value: 'old data'
    }
    const result = processMemoryTick(component)

    expect(component.value).toBe('new data')
    expect(component.settings.value).toBe('new data')
    expect(result.SIGNAL_OUT).toBe('new data')
  })

  it('should not update component value when not writeable', () => {
    const component = {
      inputs: { SIGNAL_IN: 'new data' },
      settings: { writeable: false, maxValueLength: 20, value: 'old data' },
      value: 'old data'
    }
    const result = processMemoryTick(component)

    expect(component.value).toBe('old data')
    expect(result.SIGNAL_OUT).toBe('old data')
  })

  it('should not update component value when locked', () => {
    const component = {
      inputs: { SIGNAL_IN: 'new data', LOCK_STATE: '1' },
      settings: { writeable: true, maxValueLength: 20, value: 'old data' },
      value: 'old data'
    }
    const result = processMemoryTick(component)

    expect(component.value).toBe('old data')
    expect(result.SIGNAL_OUT).toBe('old data')
  })

  it('should truncate the input signal to maxValueLength', () => {
    const component = {
      inputs: { SIGNAL_IN: 'this is a very long string' },
      settings: { writeable: true, maxValueLength: 10, value: '' },
      value: ''
    }
    const result = processMemoryTick(component)

    expect(component.value).toBe('this is a ')
    expect(result.SIGNAL_OUT).toBe('this is a ')
  })

  it('should just return the value if SIGNAL_IN is undefined', () => {
    const component = {
      inputs: {},
      settings: { writeable: true, maxValueLength: 20, value: 'current data' },
      value: 'current data'
    }
    const result = processMemoryTick(component)

    expect(component.value).toBe('current data')
    expect(result.SIGNAL_OUT).toBe('current data')
  })
})
