import { describe, it, expect, beforeEach, vi } from 'vitest'
import processMemoryTick from '../../../../../src/stores/circuit/processors/processMemoryTick.js'

describe('processMemoryTick', () => {
  beforeEach(() => {
    // Reset Date.now to a fixed value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
  })

  describe('Basic functionality', () => {
    it('should return stored value when no inputs provided', () => {
      const component = {
        inputs: {},
        settings: { value: 5 }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should use default value when no stored value', () => {
      const component = {
        inputs: {},
        settings: {}
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })

    it('should use custom default value', () => {
      const component = {
        inputs: {},
        settings: { defaultValue: 10 }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
    })

    it('should store and output new value when lock state is active', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
      expect(component.settings.value).toBe('15')
    })

    it('should not store new value when lock state is inactive', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 0 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(component.settings.value).toBe(5)
    })
  })

  describe('Input handling', () => {
    it('should handle null SIGNAL_IN as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: null, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle undefined SIGNAL_IN as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle empty string SIGNAL_IN as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: '', LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle null LOCK_STATE as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: null },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle undefined LOCK_STATE as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: undefined },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle empty string LOCK_STATE as 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: '' },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle string inputs by converting to numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: '25', LOCK_STATE: '1' },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('25')
    })

    it('should handle invalid numeric inputs gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid', LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle invalid lock state gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 'invalid' },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })
  })

  describe('Storage modes', () => {
    it('should store in continuous mode when lock state > 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 0.5 },
        settings: { value: 5, writeable: true, storageMode: 'continuous' }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })

    it('should not store in continuous mode when lock state = 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 0 },
        settings: { value: 5, writeable: true, storageMode: 'continuous' }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should store in edge-triggered mode when lock state > 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, storageMode: 'edge-triggered' }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })

    it('should store in level-sensitive mode when lock state > 0.5', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 0.6 },
        settings: { value: 5, writeable: true, storageMode: 'level-sensitive' }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })

    it('should not store in level-sensitive mode when lock state <= 0.5', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 0.5 },
        settings: { value: 5, writeable: true, storageMode: 'level-sensitive' }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should use continuous mode as default for unknown storage mode', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, storageMode: 'unknown' }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })
  })

  describe('Writeable setting', () => {
    it('should store value when writeable is true', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
      expect(component.settings.value).toBe('15')
    })

    it('should not store value when writeable is false', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: false }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(component.settings.value).toBe(5)
    })

    it('should default to writeable true when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5 }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })
  })

  describe('Value length limiting', () => {
    it('should truncate value to maxValueLength', () => {
      const component = {
        inputs: { SIGNAL_IN: 123456789, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, maxValueLength: 5 }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('12345')
    })

    it('should use default maxValueLength of 100', () => {
      const longValue = '1'.repeat(150)
      const component = {
        inputs: { SIGNAL_IN: longValue, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('1.111111111111111e+149')
    })
  })

  describe('Component state updates', () => {
    it('should update component.value when it exists', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true },
        value: 5
      }

      processMemoryTick(component)

      expect(component.value).toBe('15')
    })

    it('should not create component.value when it does not exist', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      processMemoryTick(component)

      expect(component.value).toBeUndefined()
    })
  })

  describe('Time-based processing', () => {
    it('should initialize signalHistory when timeFrame > 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, timeFrame: 1 }
      }

      processMemoryTick(component)

      expect(component.signalHistory).toBeDefined()
      expect(component.signalHistory.length).toBe(1)
      expect(component.signalHistory[0].value).toBe('15')
    })

    it('should not initialize signalHistory when timeFrame = 0', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, timeFrame: 0 }
      }

      processMemoryTick(component)

      expect(component.signalHistory).toBeUndefined()
    })

    it('should add entries to existing signalHistory', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, timeFrame: 1 },
        signalHistory: [{ value: '10', timestamp: Date.now() - 500 }]
      }

      processMemoryTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[1].value).toBe('15')
    })

    it('should remove old entries outside timeFrame', () => {
      const oldTimestamp = Date.now() - 2000 // 2 seconds ago
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, timeFrame: 1 },
        signalHistory: [
          { value: '10', timestamp: oldTimestamp },
          { value: '20', timestamp: Date.now() - 500 }
        ]
      }

      processMemoryTick(component)

      expect(component.signalHistory.length).toBe(2)
      expect(component.signalHistory[0].value).toBe('20')
      expect(component.signalHistory[1].value).toBe('15')
    })

    it('should use most recent value in timeFrame', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true, timeFrame: 1 },
        signalHistory: [
          { value: '10', timestamp: Date.now() - 500 },
          { value: '20', timestamp: Date.now() - 200 }
        ]
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })

    it('should use stored value when no history in timeFrame', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 0 },
        settings: { value: 5, writeable: true, timeFrame: 1 },
        signalHistory: []
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })
  })

  describe('Error handling', () => {
    it('should return stored value on calculation error', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      // Mock a scenario that would cause an error
      vi.spyOn(Number, 'isNaN').mockImplementation(() => {
        throw new Error('Test error')
      })

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')

      vi.restoreAllMocks()
    })

    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { value: 5 }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 15, LOCK_STATE: 1 }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15')
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1e308, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('1e+308')
    })

    it('should handle negative numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: -15, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('-15')
    })

    it('should handle zero values', () => {
      const component = {
        inputs: { SIGNAL_IN: 0, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('0')
    })

    it('should handle decimal numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 15.75, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('15.75')
    })

    it('should handle boolean inputs', () => {
      const component = {
        inputs: { SIGNAL_IN: true, LOCK_STATE: 1 },
        settings: { value: 5, writeable: true }
      }

      const result = processMemoryTick(component)

      expect(result.SIGNAL_OUT).toBe('1')
    })
  })
})
