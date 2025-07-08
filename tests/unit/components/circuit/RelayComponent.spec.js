import { describe, it, expect } from 'vitest'
import RelayComponent from '@/components/circuit/RelayComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('RelayComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(RelayComponent, { props: { id: 'relay1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Relay')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="relay"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(RelayComponent, { props: { id: 'relay2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="TOGGLE_STATE"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_STATE"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="STATE_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(RelayComponent, { props: { id: 'relay3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="relay"]').exists()).toBe(true)
  })
})
