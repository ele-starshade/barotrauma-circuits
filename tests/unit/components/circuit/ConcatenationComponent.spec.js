import { describe, it, expect } from 'vitest'
import ConcatenationComponent from '@/components/circuit/ConcatenationComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('ConcatenationComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(ConcatenationComponent, { props: { id: 'concat1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Concatenation')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="concatenation"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(ConcatenationComponent, { props: { id: 'concat2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_2"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(ConcatenationComponent, { props: { id: 'concat3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="concatenation"]').exists()).toBe(true)
  })
})
