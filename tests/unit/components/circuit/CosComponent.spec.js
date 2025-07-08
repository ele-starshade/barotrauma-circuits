import { describe, it, expect } from 'vitest'
import CosComponent from '@/components/circuit/CosComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('CosComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(CosComponent, { props: { id: 'cos1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Cos')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="cos"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(CosComponent, { props: { id: 'cos2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(CosComponent, { props: { id: 'cos3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="cos"]').exists()).toBe(true)
  })
})
