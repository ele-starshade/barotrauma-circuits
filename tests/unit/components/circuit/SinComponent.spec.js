import { describe, it, expect } from 'vitest'
import SinComponent from '@/components/circuit/SinComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('SinComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(SinComponent, { props: { id: 'sin1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Sin')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="sin"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(SinComponent, { props: { id: 'sin2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(SinComponent, { props: { id: 'sin3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="sin"]').exists()).toBe(true)
  })
})
