import { describe, it, expect } from 'vitest'
import EqualsComponent from '@/components/circuit/EqualsComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('EqualsComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(EqualsComponent, { props: { id: 'equals1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Equals')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="equals"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(EqualsComponent, { props: { id: 'equals2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(EqualsComponent, { props: { id: 'equals3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="equals"]').exists()).toBe(true)
  })
})
