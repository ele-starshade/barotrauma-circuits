import { describe, it, expect, beforeEach, vi } from 'vitest'
import processDelayTick from '../../../../../src/stores/circuit/processors/processDelayTick'

describe('processDelayTick', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should delay a signal by the specified amount', () => {
    const component = {
      inputs: { SIGNAL_IN: 'A' },
      lastSignalTimestamps: { SIGNAL_IN: Date.now() },
      settings: { delay: 1 },
      pendingSignals: [],
      lastProcessedTimestamp: 0
    }

    // First tick, enqueue the signal
    const result1 = processDelayTick(component)

    expect(result1.SIGNAL_OUT).toBeUndefined()
    expect(component.pendingSignals).toHaveLength(1)

    // Advance time by 1 second
    vi.advanceTimersByTime(1000)

    // Second tick, dequeue the signal
    const result2 = processDelayTick(component)

    expect(result2.SIGNAL_OUT).toBe('A')
    expect(component.pendingSignals).toHaveLength(0)
  })

  it('should use SET_DELAY input if available', () => {
    const component = {
      inputs: { SIGNAL_IN: 'B', SET_DELAY: 2 },
      lastSignalTimestamps: { SIGNAL_IN: Date.now() },
      settings: { delay: 1 },
      pendingSignals: [],
      lastProcessedTimestamp: 0
    }

    processDelayTick(component)
    vi.advanceTimersByTime(1000)
    const result1 = processDelayTick(component)

    expect(result1.SIGNAL_OUT).toBeUndefined() // Not ready yet

    vi.advanceTimersByTime(1000)
    const result2 = processDelayTick(component)

    expect(result2.SIGNAL_OUT).toBe('B')
  })

  it('should reset pending signals if resetOnNewSignal is true', () => {
    const component = {
      inputs: { SIGNAL_IN: 'A' },
      lastSignalTimestamps: { SIGNAL_IN: Date.now() },
      settings: { delay: 1, resetOnNewSignal: true },
      pendingSignals: [{ value: 'X', releaseTime: Date.now() + 500 }],
      lastProcessedTimestamp: 0
    }

    processDelayTick(component)
    expect(component.pendingSignals).toHaveLength(1)
    expect(component.pendingSignals[0].value).toBe('A')
  })

  it('should reset pending signals on different signal if resetOnDifferentSignal is true', () => {
    const component = {
      inputs: { SIGNAL_IN: 'B' },
      lastSignalTimestamps: { SIGNAL_IN: Date.now() },
      settings: { delay: 1, resetOnDifferentSignal: true },
      pendingSignals: [{ value: 'X', releaseTime: Date.now() + 500 }],
      lastSignalIn: 'A',
      lastProcessedTimestamp: 0
    }

    processDelayTick(component)
    expect(component.pendingSignals).toHaveLength(1)
    expect(component.pendingSignals[0].value).toBe('B')
  })

  it('should not process the same signal twice', () => {
    const component = {
      inputs: { SIGNAL_IN: 'C' },
      lastSignalTimestamps: { SIGNAL_IN: 12345 },
      settings: { delay: 1 },
      pendingSignals: [],
      lastProcessedTimestamp: 12345
    }

    processDelayTick(component)
    expect(component.pendingSignals).toHaveLength(0)
  })
})
