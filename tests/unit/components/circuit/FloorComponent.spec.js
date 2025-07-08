import { describe, it, expect } from 'vitest'
import FloorComponent from '@/components/circuit/FloorComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('FloorComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(FloorComponent, { props: { id: 'floor1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Floor')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="floor"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(FloorComponent, { props: { id: 'floor2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(FloorComponent, { props: { id: 'floor3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="floor"]').exists()).toBe(true)
  })
}) 
