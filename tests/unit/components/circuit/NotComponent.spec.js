import { describe, it, expect } from 'vitest'
import NotComponent from '@/components/circuit/NotComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('NotComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(NotComponent, { props: { id: 'not1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Not')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="not"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(NotComponent, { props: { id: 'not2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(NotComponent, { props: { id: 'not3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="not"]').exists()).toBe(true)
  })
})
