import { describe, it, expect } from 'vitest'
import InputSelectorComponent from '@/components/circuit/InputSelectorComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('InputSelectorComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(InputSelectorComponent, { props: { id: 'input-selector1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Input Selector')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="input-selector"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(InputSelectorComponent, { props: { id: 'input-selector2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    
    // Check input pins 0-9
    for (let i = 0; i < 10; i++) {
      expect(wrapper.find(`[data-pin-name="SIGNAL_IN_${i}"]`).exists()).toBe(true)
    }
    
    // Check control pins
    expect(wrapper.find('[data-pin-name="SET_INPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="MOVE_INPUT"]').exists()).toBe(true)
    
    // Check output pins
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SELECTED_INPUT_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(InputSelectorComponent, { props: { id: 'input-selector3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="input-selector"]').exists()).toBe(true)
  })
}) 
