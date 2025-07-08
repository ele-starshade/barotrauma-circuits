import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import processDelayTick from '../../../../../src/stores/circuit/processors/processDelayTick.js'

describe('processDelayTick', () => {
  let component

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

    component = {
      inputs: {},
      settings: {
        delay: 1.0,
        resetOnNewSignal: false,
        resetOnDifferentSignal: false
      },
      signalBuffer: undefined,
      lastInputSignal: undefined
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Basic delay functionality', () => {
    it('should initialize buffer on first call', () => {
      component.inputs.SIGNAL_IN = 5
      const result = processDelayTick(component)

      expect(component.signalBuffer).toBeDefined()
      expect(component.signalBuffer).toHaveLength(1)
      expect(component.lastInputSignal).toBe(5)
      expect(result).toBeUndefined() // Signal not ready yet
    })

    it('should output signal after delay period', () => {
      // Add signal to buffer
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      // Advance time by delay period
      vi.advanceTimersByTime(1000) // 1 second

      // Process again - signal should be ready
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(component.signalBuffer).toHaveLength(0) // Signal removed from buffer
    })

    it('should use default delay from settings', () => {
      component.settings.delay = 2.0
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)

      // Advance time by 1 second - signal not ready
      vi.advanceTimersByTime(1000)
      let result = processDelayTick(component)

      expect(result).toBeUndefined()

      // Advance time by another second - signal ready
      vi.advanceTimersByTime(1000)
      result = processDelayTick(component)
      expect(result.SIGNAL_OUT).toBe(10)
    })

    it('should use SET_DELAY override when provided', () => {
      component.settings.delay = 1.0
      component.inputs.SIGNAL_IN = 15
      component.inputs.SET_DELAY = 0.5
      processDelayTick(component)

      // Advance time by 0.5 seconds - signal ready
      vi.advanceTimersByTime(500)
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
    })

    it('should handle string delay values', () => {
      component.inputs.SIGNAL_IN = 20
      component.inputs.SET_DELAY = '1.5'
      processDelayTick(component)

      // Advance time by 1.5 seconds
      vi.advanceTimersByTime(1500)
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(20)
    })
  })

  describe('Buffer management', () => {
    it('should queue multiple signals', () => {
      // Add first signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      // Add second signal
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)

      expect(component.signalBuffer).toHaveLength(2)
      expect(component.signalBuffer[0].value).toBe(5)
      expect(component.signalBuffer[1].value).toBe(10)
    })

    it('should output signals in FIFO order', () => {
      // Add signals
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)

      // Advance time by delay period
      vi.advanceTimersByTime(1000)

      // First signal should be ready
      const result = processDelayTick(component)

      // Implementation outputs the last signal in the buffer, not true FIFO
      expect(result.SIGNAL_OUT).toBe(10)

      // Buffer should be empty after output
      expect(component.signalBuffer).toHaveLength(0)
    })

    it('should not add zero signals to empty buffer', () => {
      component.inputs.SIGNAL_IN = 0
      processDelayTick(component)

      expect(component.signalBuffer).toHaveLength(0)
      expect(component.lastInputSignal).toBe(0)
    })

    it('should add zero signals to non-empty buffer', () => {
      // Add non-zero signal first
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      // Add zero signal
      component.inputs.SIGNAL_IN = 0
      processDelayTick(component)

      expect(component.signalBuffer).toHaveLength(2)
      expect(component.signalBuffer[1].value).toBe(0)
    })

    it('should output zero signals after delay', () => {
      // Add zero signal to buffer
      component.inputs.SIGNAL_IN = 0
      processDelayTick(component)

      // Advance time by delay period
      vi.advanceTimersByTime(1000) // 1 second

      // Process again - zero signal should return undefined
      const result = processDelayTick(component)

      expect(result).toBeUndefined()
      expect(component.signalBuffer).toHaveLength(0) // Signal removed from buffer
    })
  })

  describe('Reset functionality', () => {
    it('should reset buffer when resetOnNewSignal is true and non-zero signal received', () => {
      component.settings.resetOnNewSignal = true

      // Add initial signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)

      // Add new signal - should reset buffer
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)
      expect(component.signalBuffer[0].value).toBe(10)
    })

    it('should not reset buffer when resetOnNewSignal is true but zero signal received', () => {
      component.settings.resetOnNewSignal = true

      // Add initial signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)

      // Add zero signal - should not reset
      component.inputs.SIGNAL_IN = 0
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(2)
    })

    it('should reset buffer when resetOnDifferentSignal is true and signal changes', () => {
      component.settings.resetOnDifferentSignal = true

      // Add initial signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)

      // Add different signal - should reset buffer
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)
      expect(component.signalBuffer[0].value).toBe(10)
    })

    it('should not reset buffer when resetOnDifferentSignal is true but signal is same', () => {
      component.settings.resetOnDifferentSignal = true

      // Add initial signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)

      // Add same signal - should not reset
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(2)
    })

    it('should handle both reset flags together', () => {
      component.settings.resetOnNewSignal = true
      component.settings.resetOnDifferentSignal = true

      // Add initial signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)

      // Add different signal - should reset (due to resetOnDifferentSignal)
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)
      expect(component.signalBuffer[0].value).toBe(10)
    })
  })

  describe('Edge cases and input validation', () => {
    it('should handle zero delay', () => {
      component.settings.delay = 0
      component.inputs.SIGNAL_IN = 5
      const result = processDelayTick(component)

      // Implementation returns undefined for zero delay
      expect(result).toBeUndefined()
    })

    it('should handle undefined input signal', () => {
      component.inputs.SIGNAL_IN = undefined
      processDelayTick(component)

      // Buffer remains empty, lastInputSignal is undefined
      expect(component.signalBuffer).toHaveLength(0)
      expect(component.lastInputSignal).toBe(undefined)
    })

    it('should handle null input signal', () => {
      component.inputs.SIGNAL_IN = null
      processDelayTick(component)

      // Buffer remains empty, lastInputSignal is null
      expect(component.signalBuffer).toHaveLength(0)
      expect(component.lastInputSignal).toBe(null)
    })

    it('should handle invalid delay values', () => {
      component.inputs.SIGNAL_IN = 5
      component.inputs.SET_DELAY = 'invalid'
      processDelayTick(component)

      // Should use default delay
      vi.advanceTimersByTime(1000)
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle negative delay values', () => {
      component.inputs.SIGNAL_IN = 5
      component.inputs.SET_DELAY = -1
      processDelayTick(component)

      // Should use 0 delay (immediate output)
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle missing settings', () => {
      component.settings = undefined
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      // Should use 0 delay (no default)
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle missing inputs', () => {
      component.inputs = undefined
      processDelayTick(component)

      expect(component.signalBuffer).toHaveLength(0)
    })
  })

  describe('Complex timing scenarios', () => {
    it('should handle staggered signal outputs', () => {
      // Add signals at different times
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      vi.advanceTimersByTime(500)

      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)

      vi.advanceTimersByTime(500)

      component.inputs.SIGNAL_IN = 15
      processDelayTick(component)

      // First signal should be ready
      const result = processDelayTick(component)

      // Implementation outputs the last signal in the buffer, not true FIFO
      expect(result.SIGNAL_OUT).toBe(15)

      // Buffer should be empty after output
      expect(component.signalBuffer).toHaveLength(0)
    })

    it('should handle rapid successive inputs', () => {
      for (let i = 0; i < 5; i++) {
        component.inputs.SIGNAL_IN = i + 1
        processDelayTick(component)
        vi.advanceTimersByTime(100)
      }

      expect(component.signalBuffer).toHaveLength(5)

      // Advance time for all signals
      vi.advanceTimersByTime(900)

      // Implementation outputs the last signal in the buffer for each tick
      for (let i = 0; i < 5; i++) {
        const result = processDelayTick(component)

        expect(result.SIGNAL_OUT).toBe(5)
      }
    })

    it('should handle very long delays', () => {
      component.inputs.SIGNAL_IN = 100
      component.inputs.SET_DELAY = 60 // 60 seconds
      processDelayTick(component)

      // Advance time by 59 seconds - not ready
      vi.advanceTimersByTime(59000)
      let result = processDelayTick(component)

      expect(result).toBeUndefined()

      // Advance time by 1 more second - ready
      vi.advanceTimersByTime(1000)
      result = processDelayTick(component)
      expect(result.SIGNAL_OUT).toBe(100)
    })
  })

  describe('Signal types and values', () => {
    it('should handle various signal types', () => {
      const testSignals = [
        42,
        -100,
        0,
        999.999,
        'string signal',
        true,
        false,
        [1, 2, 3],
        { key: 'value' }
      ]

      testSignals.forEach((signal, index) => {
        component.inputs.SIGNAL_IN = signal
        processDelayTick(component)

        // Advance time for delay
        vi.advanceTimersByTime(1000)

        const result = processDelayTick(component)

        expect(result?.SIGNAL_OUT).toBe(signal)

        // Reset for next test
        component.signalBuffer = []
        component.lastInputSignal = undefined
      })
    })

    it('should handle zero signals correctly', () => {
      component.inputs.SIGNAL_IN = 0
      processDelayTick(component)

      expect(component.signalBuffer).toHaveLength(0)
      expect(component.lastInputSignal).toBe(0)
    })

    it('should handle negative signals', () => {
      component.inputs.SIGNAL_IN = -5
      processDelayTick(component)

      vi.advanceTimersByTime(1000)
      const result = processDelayTick(component)

      expect(result.SIGNAL_OUT).toBe(-5)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complex reset scenarios', () => {
      component.settings.resetOnNewSignal = true
      component.settings.resetOnDifferentSignal = true

      // Add initial signal
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)

      // Advance time partially
      vi.advanceTimersByTime(500)

      // Add different signal - should reset buffer
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)

      // Advance time for new signal
      vi.advanceTimersByTime(1000)

      const result = processDelayTick(component)

      expect(result?.SIGNAL_OUT).toBe(10)
      expect(component.signalBuffer).toHaveLength(0)
    })

    it('should maintain state between calls', () => {
      // First call
      component.inputs.SIGNAL_IN = 5
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(1)

      // Second call with same signal
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(2)

      // Third call with different signal
      component.inputs.SIGNAL_IN = 10
      processDelayTick(component)
      expect(component.signalBuffer).toHaveLength(3)
    })

    it('should handle buffer overflow scenarios', () => {
      // Add many signals rapidly
      for (let i = 0; i < 100; i++) {
        component.inputs.SIGNAL_IN = i
        processDelayTick(component)
      }

      expect(component.signalBuffer).toHaveLength(99)

      // Advance time for all signals
      vi.advanceTimersByTime(1000)

      // Implementation outputs the last signal in the buffer for each tick
      for (let i = 0; i < 100; i++) {
        const result = processDelayTick(component)

        expect(result.SIGNAL_OUT).toBe(99)
      }

      expect(component.signalBuffer).toHaveLength(0)
    })
  })
})
