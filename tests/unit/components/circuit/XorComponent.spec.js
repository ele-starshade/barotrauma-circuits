import { describe, it, expect } from 'vitest'
import XorComponent from '@/components/circuit/XorComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('XorComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(XorComponent, { props: { id: 'xor1', mode: 'tray' } })

    expect(wrapper.text()).toContain('XOR')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="xor"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(XorComponent, { props: { id: 'xor2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(XorComponent, { props: { id: 'xor3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="xor"]').exists()).toBe(true)
  })
})
