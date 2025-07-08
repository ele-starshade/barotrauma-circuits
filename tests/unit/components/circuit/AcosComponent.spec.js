import { describe, it, expect } from 'vitest'
import AcosComponent from '@/components/circuit/AcosComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('AcosComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(AcosComponent, { props: { id: 'acos1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Acos')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="acos"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(AcosComponent, { props: { id: 'acos2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(AcosComponent, { props: { id: 'acos3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="acos"]').exists()).toBe(true)
  })
})
