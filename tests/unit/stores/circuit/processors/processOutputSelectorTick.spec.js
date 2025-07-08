import { describe, it, expect } from 'vitest'
import processOutputSelectorTick from '../../../../../src/stores/circuit/processors/processOutputSelectorTick.js'

describe('processOutputSelectorTick', () => {
  describe('Basic functionality', () => {
    it('should route input signal to selected output channel', () => {
      const component = {
        inputs: { SIGNAL_IN: 5.5 },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(0)
      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(5.5)
      expect(result.SIGNAL_OUT_3).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should use default settings when not provided', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(3.2)
      expect(result.SELECTED_OUTPUT_OUT).toBe(0)
    })

    it('should handle string input signals', () => {
      const component = {
        inputs: { SIGNAL_IN: '7.8' },
        settings: { selectedConnection: 1 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_1).toBe(7.8)
      expect(result.SELECTED_OUTPUT_OUT).toBe(1)
    })

    it('should output 0 for all channels when no input signal', () => {
      const component = {
        inputs: {},
        settings: { selectedConnection: 3 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(0)
      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SIGNAL_OUT_3).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })
  })

  describe('Channel selection (SET_OUTPUT)', () => {
    it('should change selected channel with SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 4.2, SET_OUTPUT: 3 },
        settings: { selectedConnection: 1 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SIGNAL_OUT_3).toBe(4.2)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })

    it('should handle string SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.5, SET_OUTPUT: '5' },
        settings: { selectedConnection: 0 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_5).toBe(2.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(5)
    })

    it('should ignore null SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, SET_OUTPUT: null },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore undefined SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, SET_OUTPUT: undefined },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore empty string SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, SET_OUTPUT: '' },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore invalid SET_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, SET_OUTPUT: 'invalid' },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })
  })

  describe('Channel movement (MOVE_OUTPUT)', () => {
    it('should increment channel with positive MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7, MOVE_OUTPUT: 1 },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SIGNAL_OUT_3).toBe(3.7)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })

    it('should decrement channel with negative MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.7, MOVE_OUTPUT: -1 },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_1).toBe(3.7)
      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(1)
    })

    it('should handle string MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.1, MOVE_OUTPUT: '2' },
        settings: { selectedConnection: 1 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_3).toBe(2.1)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })

    it('should ignore zero MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, MOVE_OUTPUT: 0 },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore null MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, MOVE_OUTPUT: null },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore undefined MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, MOVE_OUTPUT: undefined },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore empty string MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, MOVE_OUTPUT: '' },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should ignore invalid MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, MOVE_OUTPUT: 'invalid' },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })
  })

  describe('Channel validation and wrapping', () => {
    describe('With wrapAround enabled (default)', () => {
      it('should wrap around when channel goes below 0', () => {
        const component = {
          inputs: { SIGNAL_IN: 2.5, MOVE_OUTPUT: -1 },
          settings: { selectedConnection: 0, wrapAround: true, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_4).toBe(2.5)
        expect(result.SELECTED_OUTPUT_OUT).toBe(4)
      })

      it('should wrap around when channel goes above channelCount', () => {
        const component = {
          inputs: { SIGNAL_IN: 2.5, MOVE_OUTPUT: 1 },
          settings: { selectedConnection: 4, wrapAround: true, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_0).toBe(2.5)
        expect(result.SELECTED_OUTPUT_OUT).toBe(0)
      })

      it('should handle multiple wraps', () => {
        const component = {
          inputs: { SIGNAL_IN: 1.8, SET_OUTPUT: 12 },
          settings: { selectedConnection: 0, wrapAround: true, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_2).toBe(1.8)
        expect(result.SELECTED_OUTPUT_OUT).toBe(2)
      })

      it('should handle negative channel numbers', () => {
        const component = {
          inputs: { SIGNAL_IN: 3.2, SET_OUTPUT: -3 },
          settings: { selectedConnection: 0, wrapAround: true, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_2).toBe(3.2)
        expect(result.SELECTED_OUTPUT_OUT).toBe(2)
      })
    })

    describe('With wrapAround disabled', () => {
      it('should clamp to 0 when channel goes below 0', () => {
        const component = {
          inputs: { SIGNAL_IN: 2.5, MOVE_OUTPUT: -1 },
          settings: { selectedConnection: 0, wrapAround: false, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_0).toBe(2.5)
        expect(result.SELECTED_OUTPUT_OUT).toBe(0)
      })

      it('should clamp to max channel when channel goes above channelCount', () => {
        const component = {
          inputs: { SIGNAL_IN: 2.5, MOVE_OUTPUT: 1 },
          settings: { selectedConnection: 4, wrapAround: false, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_4).toBe(2.5)
        expect(result.SELECTED_OUTPUT_OUT).toBe(4)
      })

      it('should clamp large positive numbers', () => {
        const component = {
          inputs: { SIGNAL_IN: 1.8, SET_OUTPUT: 15 },
          settings: { selectedConnection: 0, wrapAround: false, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_4).toBe(1.8)
        expect(result.SELECTED_OUTPUT_OUT).toBe(4)
      })

      it('should clamp large negative numbers', () => {
        const component = {
          inputs: { SIGNAL_IN: 3.2, SET_OUTPUT: -10 },
          settings: { selectedConnection: 0, wrapAround: false, channelCount: 5 }
        }

        const result = processOutputSelectorTick(component)

        expect(result.SIGNAL_OUT_0).toBe(3.2)
        expect(result.SELECTED_OUTPUT_OUT).toBe(0)
      })
    })
  })

  describe('Channel count handling', () => {
    it('should use default channel count of 10', () => {
      const component = {
        inputs: { SIGNAL_IN: 4.5, SET_OUTPUT: 8 },
        settings: { selectedConnection: 0 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_8).toBe(4.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(8)
      // Should have outputs 0-9
      expect(result.SIGNAL_OUT_9).toBe(0)
      expect(result.SIGNAL_OUT_10).toBeUndefined()
    })

    it('should handle custom channel count', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.3, SET_OUTPUT: 3 },
        settings: { selectedConnection: 0, channelCount: 5 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_3).toBe(2.3)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
      // Should have outputs 0-4
      expect(result.SIGNAL_OUT_4).toBe(0)
      expect(result.SIGNAL_OUT_5).toBeUndefined()
    })

    it('should handle single channel', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.7 },
        settings: { selectedConnection: 0, channelCount: 1 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(1.7)
      expect(result.SELECTED_OUTPUT_OUT).toBe(0)
      expect(result.SIGNAL_OUT_1).toBeUndefined()
    })
  })

  describe('Input signal handling', () => {
    it('should handle null input signal', () => {
      const component = {
        inputs: { SIGNAL_IN: null },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should handle undefined input signal', () => {
      const component = {
        inputs: { SIGNAL_IN: undefined },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should handle empty string input signal', () => {
      const component = {
        inputs: { SIGNAL_IN: '' },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should handle invalid input signal', () => {
      const component = {
        inputs: { SIGNAL_IN: 'invalid' },
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should handle zero input signal', () => {
      const component = {
        inputs: { SIGNAL_IN: 0 },
        settings: { selectedConnection: 3 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_3).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })

    it('should handle negative input signal', () => {
      const component = {
        inputs: { SIGNAL_IN: -2.5 },
        settings: { selectedConnection: 1 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_1).toBe(-2.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(1)
    })

    it('should handle large numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 999999.999 },
        settings: { selectedConnection: 4 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_4).toBe(999999.999)
      expect(result.SELECTED_OUTPUT_OUT).toBe(4)
    })
  })

  describe('Priority handling', () => {
    it('should prioritize SET_OUTPUT over MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.5, SET_OUTPUT: 4, MOVE_OUTPUT: 2 },
        settings: { selectedConnection: 1 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_4).toBe(3.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(4)
    })

    it('should apply SET_OUTPUT first, then MOVE_OUTPUT', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.8, SET_OUTPUT: 2, MOVE_OUTPUT: 1 },
        settings: { selectedConnection: 0 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_3).toBe(2.8)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { selectedConnection: 2 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(0)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(0)
    })

    it('should handle calculation errors gracefully', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.5, SET_OUTPUT: 3 },
        settings: { selectedConnection: 1 }
      }

      // Mock a scenario that would cause an error
      const originalNumber = Number

      Number = () => { throw new Error('Test error') }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_1).toBe(0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(1)

      Number = originalNumber
    })
  })

  describe('Edge cases', () => {
    it('should handle floating point channel numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 1.5, SET_OUTPUT: 2.7 },
        settings: { selectedConnection: 0 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_2).toBe(1.5)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)
    })

    it('should handle very large channel numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.2, SET_OUTPUT: 999999 },
        settings: { selectedConnection: 0, wrapAround: true, channelCount: 5 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_4).toBe(3.2)
      expect(result.SELECTED_OUTPUT_OUT).toBe(4)
    })

    it('should handle very negative channel numbers', () => {
      const component = {
        inputs: { SIGNAL_IN: 4.1, SET_OUTPUT: -999999 },
        settings: { selectedConnection: 0, wrapAround: true, channelCount: 5 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_1).toBe(4.1)
      expect(result.SELECTED_OUTPUT_OUT).toBe(1)
    })

    it('should handle zero channel count', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.5 },
        settings: { selectedConnection: 0, channelCount: 0 }
      }

      const result = processOutputSelectorTick(component)

      expect(result.SELECTED_OUTPUT_OUT).toBe(0)
      expect(result.SIGNAL_OUT_0).toBeUndefined()
    })
  })

  describe('Integration scenarios', () => {
    it('should handle dynamic channel switching', () => {
      const component = {
        inputs: { SIGNAL_IN: 5.0 },
        settings: { selectedConnection: 0, wrapAround: true, channelCount: 3 }
      }

      // Start at channel 0
      let result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_0).toBe(5.0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(0)

      // Move to channel 1
      component.inputs.MOVE_OUTPUT = 1
      result = processOutputSelectorTick(component)
      expect(result.SIGNAL_OUT_1).toBe(5.0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(1)

      // Move to channel 2
      component.inputs.MOVE_OUTPUT = 1
      result = processOutputSelectorTick(component)
      expect(result.SIGNAL_OUT_2).toBe(5.0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(2)

      // Wrap around to channel 0
      component.inputs.MOVE_OUTPUT = 1
      result = processOutputSelectorTick(component)
      expect(result.SIGNAL_OUT_0).toBe(5.0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(0)
    })

    it('should handle signal changes with fixed channel', () => {
      const component = {
        inputs: { SIGNAL_IN: 2.0 },
        settings: { selectedConnection: 3 }
      }

      // First signal
      let result = processOutputSelectorTick(component)

      expect(result.SIGNAL_OUT_3).toBe(2.0)

      // Change signal
      component.inputs.SIGNAL_IN = 7.5
      result = processOutputSelectorTick(component)
      expect(result.SIGNAL_OUT_3).toBe(7.5)

      // Remove signal
      component.inputs.SIGNAL_IN = null
      result = processOutputSelectorTick(component)
      expect(result.SIGNAL_OUT_3).toBe(0)
    })

    it('should handle multiple input changes in one tick', () => {
      const component = {
        inputs: { SIGNAL_IN: 3.0, SET_OUTPUT: 2, MOVE_OUTPUT: 1 },
        settings: { selectedConnection: 0 }
      }

      const result = processOutputSelectorTick(component)

      // SET_OUTPUT should set to 2, then MOVE_OUTPUT should move to 3
      expect(result.SIGNAL_OUT_3).toBe(3.0)
      expect(result.SELECTED_OUTPUT_OUT).toBe(3)
    })
  })
})
