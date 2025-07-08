import { describe, it, expect } from 'vitest'
import { useCircuitStore } from '../../../../src/stores/circuit'

describe('aggregateInputValues', () => {
  let circuitStore

  beforeEach(() => {
    circuitStore = useCircuitStore()
  })

  describe('Barotrauma signal aggregation rules', () => {
    it('should filter out undefined/null/empty signals', () => {
      const component = { name: 'Adder' }
      const values = [undefined, null, '', '5', '3']

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBe('5') // First active signal
    })

    it('should return undefined when no active signals exist', () => {
      const component = { name: 'Adder' }
      const values = [undefined, null, '', '']

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBeUndefined()
    })

    it('should return single value when only one active signal exists', () => {
      const component = { name: 'Adder' }
      const values = ['10']

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBe('10')
    })

    it('should return first active signal when multiple active signals exist (first-come-first-served)', () => {
      const component = { name: 'Adder' }
      const values = ['5', '10', '15']

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBe('5') // First signal wins
    })

    it('should handle mixed signal types correctly', () => {
      const component = { name: 'SignalCheck' }
      const values = [undefined, '50', null, '90', '']

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN', values)

      expect(result).toBe('50') // First active signal
    })
  })

  describe('Component-specific behavior', () => {
    it('should work with any component type (same aggregation logic)', () => {
      const components = [
        { name: 'Adder' },
        { name: 'Not' },
        { name: 'SignalCheck' },
        { name: 'Light' },
        { name: 'WiFi' }
      ]

      const values = ['first', 'second', 'third']

      components.forEach(component => {
        const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN', values)

        expect(result).toBe('first') // All components use same first-signal-wins logic
      })
    })

    it('should work with different pin names', () => {
      const component = { name: 'Light' }
      const values = ['red', 'blue', 'green']

      const result1 = circuitStore.aggregateInputValues(component, 'SET_COLOR', values)
      const result2 = circuitStore.aggregateInputValues(component, 'SET_STATE', values)

      expect(result1).toBe('red') // First signal wins
      expect(result2).toBe('red') // First signal wins
    })
  })

  describe('Edge cases', () => {
    it('should handle empty array', () => {
      const component = { name: 'Adder' }
      const values = []

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBeUndefined()
    })

    it('should handle array with only inactive signals', () => {
      const component = { name: 'Adder' }
      const values = [undefined, null, '', '']

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBeUndefined()
    })

    it('should handle zero values correctly', () => {
      const component = { name: 'Adder' }
      const values = [0, '5', 0]

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values)

      expect(result).toBe(0) // Zero is a valid signal value
    })

    it('should handle boolean values correctly', () => {
      const component = { name: 'Not' }
      const values = [false, true, false]

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN', values)

      expect(result).toBe(false) // First signal wins
    })
  })

  describe('Real-world scenarios', () => {
    it('should handle multiple wires to Not Component (Barotrauma Example 1)', () => {
      const component = { name: 'Not' }
      const values = ['1', undefined] // Wire A (signal="1") + Wire B (no signal)

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN', values)

      expect(result).toBe('1') // Wire A's signal is used
    })

    it('should handle multiple wires to Signal Check Component (Barotrauma Example 2)', () => {
      const component = { name: 'SignalCheck' }
      const values = ['50', '90'] // Wire A (signal="50") + Wire B (signal="90")

      const result = circuitStore.aggregateInputValues(component, 'SIGNAL_IN', values)

      expect(result).toBe('50') // Wire A's signal is used (first signal wins)
    })

    it('should handle complex battery controller logic (Barotrauma Example 3)', () => {
      const component = { name: 'Greater' }
      const values1 = ['50'] // Memory (50) → Wire 1103 → Greater Component (signal_in1)
      const values2 = ['90'] // Memory (90) → Wire 1104 → Greater Component (signal_in2)

      const result1 = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_1', values1)
      const result2 = circuitStore.aggregateInputValues(component, 'SIGNAL_IN_2', values2)

      expect(result1).toBe('50') // First signal for input 1
      expect(result2).toBe('90') // First signal for input 2
    })
  })
})
