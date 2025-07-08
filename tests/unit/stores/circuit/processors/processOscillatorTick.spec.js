import { describe, it, expect } from 'vitest'
import processOscillatorTick from '../../../../../src/stores/circuit/processors/processOscillatorTick.js'

describe('processOscillatorTick', () => {
  const defaultTickInterval = 50 // 50ms tick interval (20 FPS like Barotrauma)

  describe('Basic functionality', () => {
    it('should initialize cumulativePhase to 0 when not present', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.05) // 1Hz * 50ms = 0.05
    })

    it('should initialize cumulativePhase to 0 when NaN', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: NaN
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.05)
    })

    it('should use default frequency of 1 when not specified', () => {
      const component = {
        inputs: {},
        settings: { outputType: 0 }
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.05)
      expect(result.SIGNAL_OUT).toBeDefined()
    })

    it('should use default outputType of 0 when not specified', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1 }
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0) // Pulse at start should be 0
    })
  })

  describe('Frequency handling', () => {
    it('should use frequency from settings', () => {
      const component = {
        inputs: {},
        settings: { frequency: 2, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.1) // 2Hz * 50ms = 0.1
    })

    it('should override frequency with SET_FREQUENCY input', () => {
      const component = {
        inputs: { SET_FREQUENCY: 3 },
        settings: { frequency: 1, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBeCloseTo(0.15, 10) // 3Hz * 50ms = 0.15
    })

    it('should handle string frequency input', () => {
      const component = {
        inputs: { SET_FREQUENCY: '2.5' },
        settings: { frequency: 1, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.125) // 2.5Hz * 50ms = 0.125
    })

    it('should clamp frequency to minimum of 0.1', () => {
      const component = {
        inputs: { SET_FREQUENCY: 0.05 },
        settings: { frequency: 1, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.005) // 0.1Hz * 50ms = 0.005
    })

    it('should clamp frequency to maximum of 10', () => {
      const component = {
        inputs: { SET_FREQUENCY: 15 },
        settings: { frequency: 1, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.5) // 10Hz * 50ms = 0.5
    })

    it('should handle invalid frequency from settings', () => {
      const component = {
        inputs: {},
        settings: { frequency: NaN, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.05) // Should use 1Hz default
    })

    it('should handle invalid frequency input', () => {
      const component = {
        inputs: { SET_FREQUENCY: 'invalid' },
        settings: { frequency: 2, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.1) // Should use settings frequency
    })

    it('should ignore null SET_FREQUENCY', () => {
      const component = {
        inputs: { SET_FREQUENCY: null },
        settings: { frequency: 2, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.1) // Should use settings frequency
    })

    it('should ignore undefined SET_FREQUENCY', () => {
      const component = {
        inputs: { SET_FREQUENCY: undefined },
        settings: { frequency: 2, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.1) // Should use settings frequency
    })

    it('should ignore empty string SET_FREQUENCY', () => {
      const component = {
        inputs: { SET_FREQUENCY: '' },
        settings: { frequency: 2, outputType: 0 }
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.1) // Should use settings frequency
    })
  })

  describe('Output type handling', () => {
    it('should use outputType from settings', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 1 }, // Sawtooth
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0.05) // Sawtooth at phase 0.05
    })

    it('should override outputType with SET_OUTPUTTYPE input', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: 2 }, // Sine
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBeCloseTo(Math.sin(0.05 * 2 * Math.PI), 5)
    })

    it('should handle string outputType input', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: '3' }, // Square
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(1) // Square wave at phase 0.05 < 0.5
    })

    it('should clamp outputType to valid range', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: 6 },
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0) // Should use default outputType 0
    })

    it('should handle negative outputType', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: -1 },
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0) // Should use default outputType 0
    })

    it('should handle invalid outputType from settings', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: NaN },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0) // Should use default outputType 0
    })

    it('should handle invalid outputType input', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: 'invalid' },
        settings: { frequency: 1, outputType: 1 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0.05) // Should use settings outputType 1
    })

    it('should ignore null SET_OUTPUTTYPE', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: null },
        settings: { frequency: 1, outputType: 1 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0.05) // Should use settings outputType 1
    })

    it('should ignore undefined SET_OUTPUTTYPE', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: undefined },
        settings: { frequency: 1, outputType: 1 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0.05) // Should use settings outputType 1
    })

    it('should ignore empty string SET_OUTPUTTYPE', () => {
      const component = {
        inputs: { SET_OUTPUTTYPE: '' },
        settings: { frequency: 1, outputType: 1 },
        cumulativePhase: 0
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0.05) // Should use settings outputType 1
    })
  })

  describe('Waveform generation', () => {
    describe('Pulse waveform (type 0)', () => {
      it('should output 0 at start of cycle', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 0 },
          cumulativePhase: 0
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBe(0)
      })

      it('should output 1 when crossing integer boundary', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 0 },
          cumulativePhase: 0.99
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBe(1)
      })

      it('should output 0 when frequency is 0', () => {
        const component = {
          inputs: { SET_FREQUENCY: 0 },
          settings: { frequency: 1, outputType: 0 },
          cumulativePhase: 0.99
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBe(0)
      })
    })

    describe('Sawtooth waveform (type 1)', () => {
      it('should output phase value directly', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 1 },
          cumulativePhase: 0.25
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeCloseTo(0.3, 3) // 0.25 + 0.05
      })

      it('should wrap around at 1.0', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 1 },
          cumulativePhase: 0.99
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeCloseTo(0.04, 3) // (0.99 + 0.05) % 1.0
      })
    })

    describe('Sine waveform (type 2)', () => {
      it('should output sine wave values', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 2 },
          cumulativePhase: 0
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeCloseTo(Math.sin(0.05 * 2 * Math.PI), 5)
      })

      it('should output values between -1 and 1', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 2 },
          cumulativePhase: 0.25
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
        expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
      })
    })

    describe('Square waveform (type 3)', () => {
      it('should output 1 in first half of cycle', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 3 },
          cumulativePhase: 0.25
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBe(1) // 0.3 < 0.5
      })

      it('should output 0 in second half of cycle', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 3 },
          cumulativePhase: 0.75
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBe(0) // 0.766 > 0.5
      })
    })

    describe('Triangle waveform (type 4)', () => {
      it('should output rising slope in first half', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 4 },
          cumulativePhase: 0.25
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeCloseTo(0.2, 3) // (0.3 * 4) - 1
      })

      it('should output falling slope in second half', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 4 },
          cumulativePhase: 0.75
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeCloseTo(-0.2, 3) // -(0.8 * 4) + 3
      })

      it('should output values between -1 and 1', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 4 },
          cumulativePhase: 0.5
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBeGreaterThanOrEqual(-1)
        expect(result.SIGNAL_OUT).toBeLessThanOrEqual(1)
      })
    })

    describe('Invalid output type', () => {
      it('should output 0 for invalid output type', () => {
        const component = {
          inputs: {},
          settings: { frequency: 1, outputType: 5 },
          cumulativePhase: 0
        }

        const result = processOscillatorTick(component, defaultTickInterval)

        expect(result.SIGNAL_OUT).toBe(0)
      })
    })
  })

  describe('Phase advancement', () => {
    it('should advance phase by frequency * tickInterval', () => {
      const component = {
        inputs: {},
        settings: { frequency: 2, outputType: 0 },
        cumulativePhase: 0.5
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.6) // 0.5 + (2 * 0.05)
    })

    it('should handle different tick intervals', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      processOscillatorTick(component, 32) // 32ms tick interval

      expect(component.cumulativePhase).toBe(0.032) // 1Hz * 32ms = 0.032 (this one is correct as it uses 32ms)
    })

    it('should handle phase wrapping correctly', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 1 },
        cumulativePhase: 0.99
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      // Should wrap around: (0.99 + 0.05) % 1.0 = 0.04
      expect(result.SIGNAL_OUT).toBeCloseTo(0.04, 3)
    })
  })

  describe('Error handling', () => {
    it('should return 0 on calculation error', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      // Mock a scenario that would cause an error
      const originalSin = Math.sin

      Math.sin = () => { throw new Error('Test error') }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBe(0)

      Math.sin = originalSin
    })

    it('should handle missing inputs gracefully', () => {
      const component = {
        settings: { frequency: 1, outputType: 0 }
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBeDefined()
    })

    it('should handle missing settings gracefully', () => {
      const component = {
        inputs: {}
      }

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBeDefined()
    })

    it('should handle completely empty component', () => {
      const component = {}

      const result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('should handle very high frequency', () => {
      const component = {
        inputs: { SET_FREQUENCY: 10 },
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.5) // 10Hz * 50ms = 0.5
    })

    it('should handle very low frequency', () => {
      const component = {
        inputs: { SET_FREQUENCY: 0.1 },
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.005) // 0.1Hz * 50ms = 0.005
    })

    it('should handle zero frequency', () => {
      const component = {
        inputs: { SET_FREQUENCY: 0 },
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.005) // Should be clamped to 0.1Hz
    })

    it('should handle negative frequency', () => {
      const component = {
        inputs: { SET_FREQUENCY: -1 },
        settings: { frequency: 1, outputType: 0 },
        cumulativePhase: 0
      }

      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.005) // Should be clamped to 0.1Hz
    })
  })

  describe('Integration scenarios', () => {
    it('should handle multiple ticks correctly', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 1 }, // Sawtooth
        cumulativePhase: 0
      }

      // First tick
      let result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.05, 3)
      expect(component.cumulativePhase).toBe(0.05)

      // Second tick
      result = processOscillatorTick(component, defaultTickInterval)
      expect(result.SIGNAL_OUT).toBeCloseTo(0.1, 3)
      expect(component.cumulativePhase).toBe(0.1)

      // Third tick
      result = processOscillatorTick(component, defaultTickInterval)
      expect(result.SIGNAL_OUT).toBeCloseTo(0.15, 3)
      expect(component.cumulativePhase).toBe(0.15)
    })

    it('should handle frequency changes during operation', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 1 },
        cumulativePhase: 0.5
      }

      // First tick with frequency 1
      processOscillatorTick(component, defaultTickInterval)

      expect(component.cumulativePhase).toBe(0.55)

      // Change frequency
      component.inputs.SET_FREQUENCY = 2
      processOscillatorTick(component, defaultTickInterval)
      expect(component.cumulativePhase).toBe(0.65) // 0.55 + (2 * 0.05)
    })

    it('should handle output type changes during operation', () => {
      const component = {
        inputs: {},
        settings: { frequency: 1, outputType: 1 }, // Sawtooth
        cumulativePhase: 0.25
      }

      // First tick with sawtooth
      let result = processOscillatorTick(component, defaultTickInterval)

      expect(result.SIGNAL_OUT).toBeCloseTo(0.3, 3)

      // Change to square wave
      component.inputs.SET_OUTPUTTYPE = 3
      result = processOscillatorTick(component, defaultTickInterval)
      expect(result.SIGNAL_OUT).toBe(1) // Square wave at phase 0.35 < 0.5
    })
  })
})
