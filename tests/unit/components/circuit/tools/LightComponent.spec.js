import { describe, it, expect } from 'vitest'
import LightComponent from '@/components/circuit/tools/LightComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('LightComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(LightComponent, { props: { id: 'l1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Light')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
  })

  it('renders in board mode and shows indicator', () => {
    const wrapper = mountWithCircuit(LightComponent, { props: { id: 'l2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('.light-indicator').exists()).toBe(true)
  })
})
