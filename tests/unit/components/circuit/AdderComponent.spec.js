import { describe, it, expect } from 'vitest'
import AdderComponent from '@/components/circuit/AdderComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('AdderComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(AdderComponent, { props: { id: 'adder1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Adder')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="adder"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(AdderComponent, { props: { id: 'adder2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(AdderComponent, { props: { id: 'adder3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="adder"]').exists()).toBe(true)
  })
})
