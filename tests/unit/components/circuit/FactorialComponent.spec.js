import { describe, it, expect } from 'vitest'
import FactorialComponent from '@/components/circuit/FactorialComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('FactorialComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(FactorialComponent, { props: { id: 'factorial1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Factorial')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="factorial"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(FactorialComponent, { props: { id: 'factorial2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(FactorialComponent, { props: { id: 'factorial3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="factorial"]').exists()).toBe(true)
  })
}) 
