import { describe, it, expect } from 'vitest'
import MultiplyComponent from '@/components/circuit/MultiplyComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('MultiplyComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(MultiplyComponent, { props: { id: 'multiply1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Multiply')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="multiply"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(MultiplyComponent, { props: { id: 'multiply2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(MultiplyComponent, { props: { id: 'multiply3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="multiply"]').exists()).toBe(true)
  })
})
