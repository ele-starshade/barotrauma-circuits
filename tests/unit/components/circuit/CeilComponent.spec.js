import { describe, it, expect } from 'vitest'
import CeilComponent from '@/components/circuit/CeilComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('CeilComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(CeilComponent, { props: { id: 'ceil1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Ceil')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="ceil"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(CeilComponent, { props: { id: 'ceil2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(CeilComponent, { props: { id: 'ceil3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="ceil"]').exists()).toBe(true)
  })
}) 
