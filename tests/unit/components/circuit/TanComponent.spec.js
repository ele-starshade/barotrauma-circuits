import { describe, it, expect } from 'vitest'
import TanComponent from '@/components/circuit/TanComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('TanComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(TanComponent, { props: { id: 'tan1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Tan')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="tan"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(TanComponent, { props: { id: 'tan2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(TanComponent, { props: { id: 'tan3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="tan"]').exists()).toBe(true)
  })
})
