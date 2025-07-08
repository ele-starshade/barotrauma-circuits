import { describe, it, expect } from 'vitest'
import AbsComponent from '@/components/circuit/AbsComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('AbsComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(AbsComponent, { props: { id: 'abs1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Abs')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="abs"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(AbsComponent, { props: { id: 'abs2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })
}) 
