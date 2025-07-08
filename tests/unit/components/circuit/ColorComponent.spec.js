import { describe, it, expect } from 'vitest'
import ColorComponent from '@/components/circuit/ColorComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('ColorComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(ColorComponent, { props: { id: 'color1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Color')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="color"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(ColorComponent, { props: { id: 'color2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_R"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_G"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_B"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN_A"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(ColorComponent, { props: { id: 'color3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="color"]').exists()).toBe(true)
  })
})
