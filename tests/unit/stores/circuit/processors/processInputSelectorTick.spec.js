import { describe, it, expect } from 'vitest'
import processInputSelectorTick from '../../../../../src/stores/circuit/processors/processInputSelectorTick.js'

describe('processInputSelectorTick', () => {
  describe('Basic functionality', () => {
    it('should select channel 0 by default when no inputs provided', () => {
      const component = {
        inputs: {},
        settings: {}
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should output signal from selected channel', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15
        },
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should use default settings when not provided', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })
  })

  describe('Direct channel selection (SET_INPUT)', () => {
    it('should select channel based on SET_INPUT value', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: 2
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
      expect(result.SELECTED_INPUT_OUT).toBe(2)
    })

    it('should handle string SET_INPUT by converting to number', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SET_INPUT: '1'
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should ignore invalid SET_INPUT values', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SET_INPUT: 'invalid'
        },
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should ignore null SET_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SET_INPUT: null
        },
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should ignore undefined SET_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SET_INPUT: undefined
        },
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should ignore empty string SET_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SET_INPUT: ''
        },
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })
  })

  describe('Channel movement (MOVE_INPUT)', () => {
    it('should move to next channel with positive MOVE_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          MOVE_INPUT: 1
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should move to previous channel with negative MOVE_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          MOVE_INPUT: -1
        },
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should handle string MOVE_INPUT by converting to number', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          MOVE_INPUT: '1'
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should ignore MOVE_INPUT of 0', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          MOVE_INPUT: 0
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should ignore null MOVE_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          MOVE_INPUT: null
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should ignore undefined MOVE_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          MOVE_INPUT: undefined
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should ignore empty string MOVE_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          MOVE_INPUT: ''
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should handle invalid MOVE_INPUT as 0', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          MOVE_INPUT: 'invalid'
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })
  })

  describe('Channel validation and wrapping', () => {
    it('should wrap around to 0 when moving past last channel with wrapAround true', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          MOVE_INPUT: 1
        },
        settings: {
          selectedConnection: 2,
          wrapAround: true,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should wrap around to last channel when moving before 0 with wrapAround true', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          MOVE_INPUT: -1
        },
        settings: {
          selectedConnection: 0,
          wrapAround: true,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
      expect(result.SELECTED_INPUT_OUT).toBe(2)
    })

    it('should clamp to last channel when moving past last channel with wrapAround false', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          MOVE_INPUT: 1
        },
        settings: {
          selectedConnection: 2,
          wrapAround: false,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
      expect(result.SELECTED_INPUT_OUT).toBe(2)
    })

    it('should clamp to 0 when moving before 0 with wrapAround false', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          MOVE_INPUT: -1
        },
        settings: {
          selectedConnection: 0,
          wrapAround: false,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should handle multiple wraps correctly', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: 5
        },
        settings: {
          selectedConnection: 0,
          wrapAround: true,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(15)
      expect(result.SELECTED_INPUT_OUT).toBe(2)
    })

    it('should handle negative wraps correctly', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: -2
        },
        settings: {
          selectedConnection: 0,
          wrapAround: true,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should floor channel numbers', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: 1.7
        },
        settings: {
          selectedConnection: 0,
          channelCount: 3
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(10)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })
  })

  describe('Signal handling', () => {
    it('should handle null signal as 0', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: null,
          SIGNAL_IN_1: 10
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should handle undefined signal as 0', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: undefined,
          SIGNAL_IN_1: 10
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should handle empty string signal as 0', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: '',
          SIGNAL_IN_1: 10
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should pass through non-null signals as-is', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 'test',
          SIGNAL_IN_1: 10
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe('test')
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should pass through boolean signals as-is', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: true,
          SIGNAL_IN_1: 10
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(true)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })
  })

  describe('Priority handling', () => {
    it('should prioritize SET_INPUT over MOVE_INPUT', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: 2,
          MOVE_INPUT: 1
        },
        settings: {
          selectedConnection: 0
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(2)
    })
  })

  describe('Error handling', () => {
    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: {
          selectedConnection: 1
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(1)
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })
  })

  describe('Custom channel count', () => {
    it('should respect custom channel count', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: 2
        },
        settings: {
          selectedConnection: 0,
          channelCount: 2
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })

    it('should wrap around with custom channel count', () => {
      const component = {
        inputs: {
          SIGNAL_IN_0: 5,
          SIGNAL_IN_1: 10,
          SIGNAL_IN_2: 15,
          SET_INPUT: 3
        },
        settings: {
          selectedConnection: 0,
          channelCount: 3,
          wrapAround: true
        }
      }

      const result = processInputSelectorTick(component)

      expect(result.SIGNAL_OUT).toBe(5)
      expect(result.SELECTED_INPUT_OUT).toBe(0)
    })
  })
})
