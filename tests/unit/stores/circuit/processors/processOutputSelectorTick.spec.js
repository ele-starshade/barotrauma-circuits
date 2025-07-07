import { describe, it, expect, beforeEach } from 'vitest'
import processOutputSelectorTick from '../../../../../src/stores/circuit/processors/processOutputSelectorTick'

describe('processOutputSelectorTick', () => {
  let component
  let wires

  beforeEach(() => {
    component = {
      id: 'output-selector',
      inputs: {},
      settings: {
        wrapAround: false,
        skipEmptyConnections: false
      },
      selectedConnection: 0,
      lastMoveSignal: 0
    }
    wires = []
  })

  it('should route SIGNAL_IN to the currently selected output', () => {
    component.selectedConnection = 3
    component.inputs.SIGNAL_IN = 'data'
    const result = processOutputSelectorTick(component, wires)

    expect(result.SIGNAL_OUT_3).toBe('data')
    expect(result.SIGNAL_OUT_0).toBeUndefined()
    expect(result.SELECTED_OUTPUT_OUT).toBe(3)
  })

  it('should change selection with SET_OUTPUT', () => {
    component.inputs.SIGNAL_IN = 'data'
    component.inputs.SET_OUTPUT = '5'
    const result = processOutputSelectorTick(component, wires)

    expect(component.selectedConnection).toBe(5)
    expect(result.SIGNAL_OUT_5).toBe('data')
    expect(result.SELECTED_OUTPUT_OUT).toBe(5)
  })

  it('should ignore invalid SET_OUTPUT values', () => {
    component.inputs.SET_OUTPUT = 'foo'
    processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(0) // Remains unchanged

    component.inputs.SET_OUTPUT = '15'
    processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(0) // Remains unchanged
  })

  it('should move selection with MOVE_OUTPUT', () => {
    component.inputs.MOVE_OUTPUT = '1'
    let result = processOutputSelectorTick(component, wires)

    expect(component.selectedConnection).toBe(1)
    expect(result.SELECTED_OUTPUT_OUT).toBe(1)

    // Should not move again if MOVE_OUTPUT is the same
    result = processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(1)

    // Should move again after signal goes to 0
    component.inputs.MOVE_OUTPUT = '0'
    processOutputSelectorTick(component, wires)
    component.inputs.MOVE_OUTPUT = '-1'
    result = processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(0)
  })

  it('should clamp MOVE_OUTPUT if wrapAround is false', () => {
    component.selectedConnection = 9
    component.inputs.MOVE_OUTPUT = '1'
    processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(9) // Clamped at 9
  })

  it('should wrap around with MOVE_OUTPUT if wrapAround is true', () => {
    component.settings.wrapAround = true
    component.selectedConnection = 9
    component.inputs.MOVE_OUTPUT = '1'
    processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(0) // Wraps to 0
  })

  it('should skip empty connections with MOVE_OUTPUT if skipEmptyConnections is true', () => {
    wires = [
      { fromId: 'output-selector', fromPinName: 'SIGNAL_OUT_0' },
      { fromId: 'output-selector', fromPinName: 'SIGNAL_OUT_3' },
      { fromId: 'output-selector', fromPinName: 'SIGNAL_OUT_5' }
    ]
    component.settings.skipEmptyConnections = true
    component.selectedConnection = 0
    component.inputs.MOVE_OUTPUT = '1'
    processOutputSelectorTick(component, wires)
    expect(component.selectedConnection).toBe(3) // Skips 1, 2
  })

  it('should set selected output to undefined if SIGNAL_IN is missing', () => {
    component.selectedConnection = 4
    const result = processOutputSelectorTick(component, wires)

    expect(result.SIGNAL_OUT_4).toBeUndefined()
    expect(result.SELECTED_OUTPUT_OUT).toBe(4)
  })
})
