import { describe, it, expect } from 'vitest'
import SubtractComponent from '@/components/circuit/SubtractComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('SubtractComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(SubtractComponent, { props: { id: 'subtract1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Subtract')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="subtract"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(SubtractComponent, { props: { id: 'subtract2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(SubtractComponent, { props: { id: 'subtract3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="subtract"]').exists()).toBe(true)
  })
})
