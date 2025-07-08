import { describe, it, expect } from 'vitest'
import DivideComponent from '@/components/circuit/DivideComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('DivideComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(DivideComponent, { props: { id: 'divide1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Divide')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="divide"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(DivideComponent, { props: { id: 'divide2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(DivideComponent, { props: { id: 'divide3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="divide"]').exists()).toBe(true)
  })
})
