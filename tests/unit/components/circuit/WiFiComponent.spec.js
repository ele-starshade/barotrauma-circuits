import { describe, it, expect } from 'vitest'
import WiFiComponent from '@/components/circuit/WiFiComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('WiFiComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(WiFiComponent, { props: { id: 'wifi1', mode: 'tray' } })

    expect(wrapper.text()).toContain('WiFi')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="wifi"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(WiFiComponent, { props: { id: 'wifi2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_CHANNEL"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(WiFiComponent, { props: { id: 'wifi3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="wifi"]').exists()).toBe(true)
  })
})
