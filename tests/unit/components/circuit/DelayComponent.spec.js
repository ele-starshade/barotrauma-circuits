import { describe, it, expect } from 'vitest'
import DelayComponent from '@/components/circuit/DelayComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('DelayComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(DelayComponent, { props: { id: 'delay1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Delay')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="delay"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(DelayComponent, { props: { id: 'delay2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_DELAY"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(DelayComponent, { props: { id: 'delay3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="delay"]').exists()).toBe(true)
  })
})
