import { describe, it, expect } from 'vitest'
import OutputSelectorComponent from '@/components/circuit/OutputSelectorComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('OutputSelectorComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(OutputSelectorComponent, { props: { id: 'output-selector1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Output Selector')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="output-selector"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(OutputSelectorComponent, { props: { id: 'output-selector2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('.component-wide').exists()).toBe(true)
    
    // Check input pins
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="MOVE_OUTPUT"]').exists()).toBe(true)
    
    // Check output pins 0-9
    for (let i = 0; i < 10; i++) {
      expect(wrapper.find(`[data-pin-name="SIGNAL_OUT_${i}"]`).exists()).toBe(true)
    }
    
    // Check additional output pin
    expect(wrapper.find('[data-pin-name="SELECTED_OUTPUT_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(OutputSelectorComponent, { props: { id: 'output-selector3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="output-selector"]').exists()).toBe(true)
  })
}) 
