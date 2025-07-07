import { describe, it, expect, beforeEach } from 'vitest'
import processOscillatorTick from '../../../../../src/stores/circuit/processors/processOscillatorTick'

describe('processOscillatorTick', () => {
  let component
  const tickInterval = 1000 // 1 second, makes phase calculation easy (phase += freq)

  beforeEach(() => {
    component = {
      id: 'osc',
      type: 'Oscillator',
      inputs: {},
      outputs: [{ componentId: 'out', pin: 'SIGNAL_OUT' }],
      cumulativePhase: 0,
      settings: {
        frequency: 1, // Default to 1Hz
        outputType: 0 // Default to Pulse
      }
    }
  })

  it('should initialize cumulativePhase to 0 if it is not a number', () => {
    component.cumulativePhase = undefined
    processOscillatorTick(component, tickInterval)
    expect(component.cumulativePhase).not.toBeUndefined()
    expect(component.cumulativePhase).toBeTypeOf('number')
  })

  it('should use frequency from settings', () => {
    component.settings.frequency = 2
    processOscillatorTick(component, tickInterval)
    expect(component.cumulativePhase).toBe(2)
  })

  it('should override frequency from SET_FREQUENCY input', () => {
    component.settings.frequency = 2
    component.inputs.SET_FREQUENCY = '3'
    processOscillatorTick(component, tickInterval)
    expect(component.cumulativePhase).toBe(3)
  })

  it('should override outputType from SET_OUTPUTTYPE input', () => {
    component.settings.outputType = 0 // Pulse
    component.inputs.SET_OUTPUTTYPE = '2' // Sine
    const result = processOscillatorTick(component, tickInterval)

    // phase = 1, cyclePhase = 0 -> sin(0) = 0
    expect(result.SIGNAL_OUT).toBeCloseTo(0, 0.001)
  })

  describe('Waveforms', () => {
    it('Pulse (0): should output 1 only when phase crosses an integer', () => {
      component.settings.frequency = 0.4
      component.settings.outputType = 0

      // Tick 1: phase = 0.4, no cycle
      let result = processOscillatorTick(component, tickInterval)

      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.cumulativePhase).toBeCloseTo(0.4, 5)

      // Tick 2: phase = 0.8, no cycle
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.cumulativePhase).toBeCloseTo(0.8, 5)

      // Tick 3: phase = 1.2, cycle!
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBe(1)
      expect(component.cumulativePhase).toBeCloseTo(1.2, 5)

      // Tick 4: phase = 1.6, no cycle
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBe(0)
      expect(component.cumulativePhase).toBeCloseTo(1.6, 5)
    })

    it('Sawtooth (1): should ramp from 0 to 1', () => {
      component.settings.frequency = 0.25
      component.settings.outputType = 1

      let result = processOscillatorTick(component, tickInterval) // phase = 0.25

      expect(result.SIGNAL_OUT).toBeCloseTo(0.25, 0.001)

      result = processOscillatorTick(component, tickInterval) // phase = 0.50
      expect(result.SIGNAL_OUT).toBeCloseTo(0.50, 0.001)

      result = processOscillatorTick(component, tickInterval) // phase = 0.75
      expect(result.SIGNAL_OUT).toBeCloseTo(0.75, 0.001)

      result = processOscillatorTick(component, tickInterval) // phase = 1.00 (wraps to 0)
      expect(result.SIGNAL_OUT).toBeCloseTo(0.00, 0.001)
    })

    it('Sine (2): should output a sine wave', () => {
      component.settings.frequency = 0.25
      component.settings.outputType = 2

      // Phase 0.25 (90 deg) -> sin = 1
      let result = processOscillatorTick(component, tickInterval)

      expect(result.SIGNAL_OUT).toBeCloseTo(1, 0.001)

      // Phase 0.50 (180 deg) -> sin = 0
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBeCloseTo(0, 0.001)

      // Phase 0.75 (270 deg) -> sin = -1
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBeCloseTo(-1, 0.001)

      // Phase 1.00 (360 deg) -> sin = 0
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBeCloseTo(0, 0.001)
    })

    it('Square (3): should be 1 for first half of cycle, 0 for second', () => {
      component.settings.frequency = 0.25
      component.settings.outputType = 3

      // Phase 0.25 (< 0.5) -> 1
      let result = processOscillatorTick(component, tickInterval)

      expect(result.SIGNAL_OUT).toBe(1)

      // Phase 0.50 (>= 0.5) -> 0
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBe(0)

      // Phase 0.75 (>= 0.5) -> 0
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBe(0)

      // Phase 1.00 (wraps to 0, < 0.5) -> 1
      result = processOscillatorTick(component, tickInterval)
      expect(result.SIGNAL_OUT).toBe(1)
    })

    it('Triangle (4): should form a triangle wave from -1 to 1', () => {
      component.settings.frequency = 0.25
      component.settings.outputType = 4

      component.cumulativePhase = 0.0
      let result = processOscillatorTick(component, tickInterval) // Phase becomes 0.25. output = 4*0.25 - 1 = 0

      expect(result.SIGNAL_OUT).toBeCloseTo(0, 0.001)

      // component.cumulativePhase is now 0.25
      result = processOscillatorTick(component, tickInterval) // Phase becomes 0.5. output = -4*0.5 + 3 = 1
      expect(result.SIGNAL_OUT).toBeCloseTo(1, 0.001)

      // component.cumulativePhase is now 0.5
      result = processOscillatorTick(component, tickInterval) // Phase becomes 0.75. output = -4*0.75 + 3 = 0
      expect(result.SIGNAL_OUT).toBeCloseTo(0, 0.001)

      // component.cumulativePhase is now 0.75
      result = processOscillatorTick(component, tickInterval) // Phase becomes 1.0. currentCyclePhase=0. output = 4*0-1 = -1
      expect(result.SIGNAL_OUT).toBeCloseTo(-1, 0.001)
    })
  })
})
