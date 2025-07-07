import { describe, it, expect } from 'vitest'
import processRandomTick from '../../../../../src/stores/circuit/processors/processRandomTick'

describe('processRandomTick', () => {
  it('should return the currentOutput value of the component', () => {
    const component = {
      currentOutput: 42
    }
    const result = processRandomTick(component)

    expect(result.VALUE_OUT).toBe(42)
  })

  it('should return another value', () => {
    const component = {
      currentOutput: -10
    }
    const result = processRandomTick(component)

    expect(result.VALUE_OUT).toBe(-10)
  })

  it('should return undefined if currentOutput is not set', () => {
    const component = {}
    const result = processRandomTick(component)

    expect(result.VALUE_OUT).toBeUndefined()
  })
})
