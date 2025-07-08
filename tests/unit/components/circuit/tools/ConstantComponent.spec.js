import { describe, it, expect } from 'vitest'
import ConstantComponent from '@/components/circuit/tools/ConstantComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('ConstantComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(ConstantComponent, { props: { id: 'c1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Constant')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
  })

  it('renders in board mode and shows output pin', () => {
    const wrapper = mountWithCircuit(ConstantComponent, { props: { id: 'c2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="VALUE_OUT"]').exists()).toBe(true)
  })
})
