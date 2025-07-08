import { describe, it, expect } from 'vitest'
import DisplayComponent from '@/components/circuit/tools/DisplayComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('DisplayComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(DisplayComponent, { props: { id: 'd1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Display')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
  })

  it('renders in board mode and shows input pin', () => {
    const wrapper = mountWithCircuit(DisplayComponent, { props: { id: 'd2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_1"]').exists()).toBe(true)
  })
})
