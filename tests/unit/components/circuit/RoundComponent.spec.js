import { describe, it, expect } from 'vitest'
import RoundComponent from '@/components/circuit/RoundComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('RoundComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(RoundComponent, { props: { id: 'round1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Round')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="round"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(RoundComponent, { props: { id: 'round2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(RoundComponent, { props: { id: 'round3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="round"]').exists()).toBe(true)
  })
})
