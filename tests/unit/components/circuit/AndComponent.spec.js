import { describe, it, expect } from 'vitest'
import AndComponent from '@/components/circuit/AndComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('AndComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(AndComponent, { props: { id: 'and1', mode: 'tray' } })

    expect(wrapper.text()).toContain('And')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="and"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(AndComponent, { props: { id: 'and2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(AndComponent, { props: { id: 'and3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="and"]').exists()).toBe(true)
  })
})
