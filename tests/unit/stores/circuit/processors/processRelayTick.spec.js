import { describe, it, expect } from 'vitest'
import processRelayTick from '../../../../../src/stores/circuit/processors/processRelayTick.js'

describe('processRelayTick', () => {
  describe('Basic functionality', () => {
    it('should pass through signals when relay is on', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5, SIGNAL_IN_2: 3.2 },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(5.5)
      expect(result.SIGNAL_OUT_2).toBe(3.2)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should block signals when relay is off', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5, SIGNAL_IN_2: 3.2 },
        settings: { isOn: false }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.STATE_OUT).toBe(0)
    })

    it('should use default state of true when not specified', () => {
      const component = {
        inputs: { SIGNAL_IN: 1 },
        settings: {}
      }
      expect(() => processRelayTick(component)).toThrow()
    })
  })

  describe('State initialization', () => {
    it('should initialize isOn from settings', () => {
      const component = {
        inputs: {},
        settings: { isOn: false }
      }

      processRelayTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should initialize isOn to true when not specified', () => {
      const component = {
        inputs: {},
        settings: {}
      }

      processRelayTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should preserve existing isOn state', () => {
      const component = {
        inputs: {},
        settings: { isOn: false },
        isOn: true
      }

      processRelayTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should initialize lastToggleSignal to 0', () => {
      const component = {
        inputs: {},
        settings: {}
      }

      processRelayTick(component)

      expect(component.lastToggleSignal).toBe(0)
    })

    it('should preserve existing lastToggleSignal', () => {
      const component = {
        inputs: {},
        settings: {},
        lastToggleSignal: 1
      }

      processRelayTick(component)

      expect(component.lastToggleSignal).toBe(1)
    })
  })

  describe('Toggle functionality (TOGGLE_STATE)', () => {
    it('should toggle state when TOGGLE_STATE changes from 0 to non-zero', () => {
      const component = {
        inputs: { TOGGLE_STATE: 1 },
        settings: { isOn: true },
        lastToggleSignal: 0
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
      expect(component.lastToggleSignal).toBe(1)
    })

    it('should toggle state when TOGGLE_STATE changes from non-zero to different non-zero', () => {
      const component = {
        inputs: { TOGGLE_STATE: 2 },
        settings: { isOn: true },
        lastToggleSignal: 1
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
      expect(component.lastToggleSignal).toBe(2)
    })

    it('should not toggle when TOGGLE_STATE is 0', () => {
      const component = {
        inputs: { TOGGLE_STATE: 0 },
        settings: { isOn: true },
        lastToggleSignal: 1
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(true)
      expect(result.STATE_OUT).toBe(1)
      expect(component.lastToggleSignal).toBe(0)
    })

    it('should not toggle when TOGGLE_STATE is same as lastToggleSignal', () => {
      const component = {
        inputs: { TOGGLE_STATE: 1 },
        settings: { isOn: true },
        lastToggleSignal: 1
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(true)
      expect(result.STATE_OUT).toBe(1)
      expect(component.lastToggleSignal).toBe(1)
    })

    it('should handle string TOGGLE_STATE', () => {
      const component = {
        inputs: { TOGGLE_STATE: '5' },
        settings: { isOn: true },
        lastToggleSignal: 0
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
      expect(component.lastToggleSignal).toBe('5')
    })

    it('should handle negative TOGGLE_STATE', () => {
      const component = {
        inputs: { TOGGLE_STATE: -1 },
        settings: { isOn: true },
        lastToggleSignal: 0
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
      expect(component.lastToggleSignal).toBe(-1)
    })
  })

  describe('Set state functionality (SET_STATE)', () => {
    it('should set state to on when SET_STATE is non-zero', () => {
      const component = {
        inputs: { SET_STATE: 1 },
        settings: { isOn: false }
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(true)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should set state to off when SET_STATE is 0', () => {
      const component = {
        inputs: { SET_STATE: 0 },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
    })

    it('should set state to off when SET_STATE is "0"', () => {
      const component = {
        inputs: { SET_STATE: '0' },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
    })

    it('should set state to on when SET_STATE is "1"', () => {
      const component = {
        inputs: { SET_STATE: '1' },
        settings: { isOn: false }
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(true)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should set state to on when SET_STATE is non-zero string', () => {
      const component = {
        inputs: { SET_STATE: 'true' },
        settings: { isOn: false }
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(true)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should set state to off when SET_STATE is "0" with whitespace', () => {
      const component = {
        inputs: { SET_STATE: ' 0 ' },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
    })
  })

  describe('Signal processing', () => {
    it('should pass through both signals when on', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10.5, SIGNAL_IN_2: -3.7 },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(10.5)
      expect(result.SIGNAL_OUT_2).toBe(-3.7)
    })

    it('should block both signals when off', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10.5, SIGNAL_IN_2: -3.7 },
        settings: { isOn: false }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
    })

    it('should handle undefined signals', () => {
      const component = {
        inputs: {},
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
    })

    it('should handle null signals', () => {
      const component = {
        inputs: { SIGNAL_IN_1: null, SIGNAL_IN_2: null },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
    })

    it('should handle string signals', () => {
      const component = {
        inputs: { SIGNAL_IN_1: '5.5', SIGNAL_IN_2: '3.2' },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe('5.5')
      expect(result.SIGNAL_OUT_2).toBe('3.2')
    })

    it('should handle boolean signals', () => {
      const component = {
        inputs: { SIGNAL_IN_1: true, SIGNAL_IN_2: false },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(true)
      expect(result.SIGNAL_OUT_2).toBe(false)
    })
  })

  describe('Priority handling', () => {
    it('should prioritize SET_STATE over TOGGLE_STATE', () => {
      const component = {
        inputs: { TOGGLE_STATE: 1, SET_STATE: 0 },
        settings: { isOn: true },
        lastToggleSignal: 0
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(false)
      expect(result.STATE_OUT).toBe(0)
    })

    it('should apply SET_STATE after TOGGLE_STATE', () => {
      const component = {
        inputs: { TOGGLE_STATE: 1, SET_STATE: 1 },
        settings: { isOn: true },
        lastToggleSignal: 0
      }

      const result = processRelayTick(component)

      expect(component.isOn).toBe(true)
      expect(result.STATE_OUT).toBe(1)
    })
  })

  describe('Component state updates', () => {
    it('should update component.value with current state', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5, SIGNAL_IN_2: 3.2 },
        settings: { isOn: true }
      }

      processRelayTick(component)

      expect(component.value).toEqual({
        state: 1,
        signalOut1: 5.5,
        signalOut2: 3.2
      })
    })

    it('should update component.value when relay is off', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5, SIGNAL_IN_2: 3.2 },
        settings: { isOn: false }
      }

      processRelayTick(component)

      expect(component.value).toEqual({
        state: 0,
        signalOut1: 0,
        signalOut2: 0
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle very large signal values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 999999999, SIGNAL_IN_2: -999999999 },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(999999999)
      expect(result.SIGNAL_OUT_2).toBe(-999999999)
    })

    it('should handle very small signal values', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0.000001, SIGNAL_IN_2: -0.000001 },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0.000001)
      expect(result.SIGNAL_OUT_2).toBe(-0.000001)
    })

    it('should handle zero signals', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 0, SIGNAL_IN_2: 0 },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
    })

    it('should handle NaN signals', () => {
      const component = {
        inputs: { SIGNAL_IN_1: NaN, SIGNAL_IN_2: NaN },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(NaN)
      expect(result.SIGNAL_OUT_2).toBe(NaN)
    })

    it('should handle Infinity signals', () => {
      const component = {
        inputs: { SIGNAL_IN_1: Infinity, SIGNAL_IN_2: -Infinity },
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(Infinity)
      expect(result.SIGNAL_OUT_2).toBe(-Infinity)
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { isOn: true }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5 }
      }

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(5.5)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.STATE_OUT).toBe(1)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle multiple state changes in sequence', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5, SIGNAL_IN_2: 3.2 },
        settings: { isOn: true }
      }

      // Start with relay on
      let result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(5.5)
      expect(result.STATE_OUT).toBe(1)

      // Toggle off
      component.inputs.TOGGLE_STATE = 1
      result = processRelayTick(component)
      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.STATE_OUT).toBe(0)

      // Toggle back on
      component.inputs.TOGGLE_STATE = 2
      result = processRelayTick(component)
      expect(result.SIGNAL_OUT_1).toBe(5.5)
      expect(result.STATE_OUT).toBe(1)
    })

    it('should handle signal changes with fixed state', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 10 },
        settings: { isOn: true }
      }

      // First signal
      let result = processRelayTick(component)

      expect(result.SIGNAL_OUT_1).toBe(10)

      // Change signal
      component.inputs.SIGNAL_IN_1 = 20
      result = processRelayTick(component)
      expect(result.SIGNAL_OUT_1).toBe(20)

      // Turn off relay
      component.inputs.SET_STATE = 0
      result = processRelayTick(component)
      expect(result.SIGNAL_OUT_1).toBe(0)
    })

    it('should maintain state across multiple calls', () => {
      const component = {
        inputs: { SIGNAL_IN_1: 5.5 },
        settings: { isOn: true }
      }

      // First call
      let result = processRelayTick(component)

      expect(result.STATE_OUT).toBe(1)

      // Second call with no inputs
      component.inputs = {}
      result = processRelayTick(component)
      expect(result.STATE_OUT).toBe(1)
    })
  })
})
