import { describe, it, expect } from 'vitest'
import RandomComponent from '@/components/circuit/tools/RandomComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('RandomComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(RandomComponent, { props: { id: 'r1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Random')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
  })

  it('renders in board mode and shows output pin', () => {
    const wrapper = mountWithCircuit(RandomComponent, { props: { id: 'r2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="VALUE_OUT"]').exists()).toBe(true)
  })
})
