import { describe, it, expect } from 'vitest'
import OrComponent from '@/components/circuit/OrComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('OrComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(OrComponent, { props: { id: 'or1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Or')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="or"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(OrComponent, { props: { id: 'or2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(OrComponent, { props: { id: 'or3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="or"]').exists()).toBe(true)
  })
})
