import { describe, it, expect } from 'vitest'
import OscillatorComponent from '@/components/circuit/OscillatorComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('OscillatorComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(OscillatorComponent, { props: { id: 'oscillator1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Oscillator')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="oscillator"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(OscillatorComponent, { props: { id: 'oscillator2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_FREQUENCY"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUTTYPE"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(OscillatorComponent, { props: { id: 'oscillator3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="oscillator"]').exists()).toBe(true)
  })
})
