import { describe, it, expect } from 'vitest'
import AsinComponent from '@/components/circuit/AsinComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('AsinComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(AsinComponent, { props: { id: 'asin1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Asin')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="asin"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(AsinComponent, { props: { id: 'asin2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(AsinComponent, { props: { id: 'asin3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="asin"]').exists()).toBe(true)
  })
})
