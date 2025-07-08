import { describe, it, expect } from 'vitest'
import MemoryComponent from '@/components/circuit/MemoryComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('MemoryComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(MemoryComponent, { props: { id: 'memory1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Memory')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="memory"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(MemoryComponent, { props: { id: 'memory2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="LOCK_STATE"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(MemoryComponent, { props: { id: 'memory3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="memory"]').exists()).toBe(true)
  })
})
