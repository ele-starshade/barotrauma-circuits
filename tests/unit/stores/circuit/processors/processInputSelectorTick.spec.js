import { describe, it, expect, beforeEach } from 'vitest'
import processInputSelectorTick from '../../../../../src/stores/circuit/processors/processInputSelectorTick'

describe('processInputSelectorTick', () => {
  let component

  beforeEach(() => {
    // Deep copy to ensure test isolation
    component = JSON.parse(JSON.stringify({
      id: 'test-selector',
      inputs: {
        SIGNAL_IN_0: 'A',
        SIGNAL_IN_1: 'B',
        SIGNAL_IN_2: 'C'
      },
      settings: {
        selectedConnection: 1,
        wrapAround: false,
        skipEmptyConnections: false
      },
      lastMoveSignal: 0
    }))
  })

  it('should output the signal from the currently selected connection', () => {
    const result = processInputSelectorTick(component, [])

    expect(result.SIGNAL_OUT).toBe('B')
    expect(result.SELECTED_INPUT_OUT).toBe(1)
  })

  it('should change selection with SET_INPUT', () => {
    component.inputs.SET_INPUT = 2
    const result = processInputSelectorTick(component, [])

    expect(result.SIGNAL_OUT).toBe('C')
    expect(result.SELECTED_INPUT_OUT).toBe(2)
    expect(component.settings.selectedConnection).toBe(2)
  })

  it('should move selection with MOVE_INPUT', () => {
    component.inputs.MOVE_INPUT = 1
    const result = processInputSelectorTick(component, [])

    expect(result.SIGNAL_OUT).toBe('C') // Moved from 1 to 2
    expect(result.SELECTED_INPUT_OUT).toBe(2)
    expect(component.settings.selectedConnection).toBe(2)
  })

  it('should not move past the last input if wrapAround is false', () => {
    component.settings.selectedConnection = 9
    component.inputs.MOVE_INPUT = 1
    const result = processInputSelectorTick(component, [])

    expect(result.SELECTED_INPUT_OUT).toBe(9)
  })

  it('should wrap around when moving past the last input if wrapAround is true', () => {
    component.settings.selectedConnection = 9
    component.settings.wrapAround = true
    component.inputs.MOVE_INPUT = 1
    const result = processInputSelectorTick(component, [])

    expect(result.SELECTED_INPUT_OUT).toBe(0)
  })

  it('should skip empty connections when moving if skipEmptyConnections is true', () => {
    // SIGNAL_IN_1 is connected, SIGNAL_IN_2 is not, SIGNAL_IN_3 is.
    component.settings.selectedConnection = 1
    component.settings.skipEmptyConnections = true
    component.inputs = {
      SIGNAL_IN_0: 'A',
      SIGNAL_IN_1: 'B',
      // No SIGNAL_IN_2
      SIGNAL_IN_3: 'D',
      MOVE_INPUT: 1
    }

    const wires = [
      { toId: 'test-selector', toPin: 'SIGNAL_IN_1' },
      { toId: 'test-selector', toPin: 'SIGNAL_IN_3' }
    ]
    const result = processInputSelectorTick(component, wires)

    // Should skip 2 and go to 3
    expect(result.SELECTED_INPUT_OUT).toBe(3)
  })
})
