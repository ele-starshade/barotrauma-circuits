import { describe, it, expect } from 'vitest'
import GreaterComponent from '@/components/circuit/GreaterComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('GreaterComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(GreaterComponent, { props: { id: 'greater1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Greater')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="greater"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(GreaterComponent, { props: { id: 'greater2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(GreaterComponent, { props: { id: 'greater3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="greater"]').exists()).toBe(true)
  })
})
