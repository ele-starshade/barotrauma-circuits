import { describe, it, expect } from 'vitest'
import SignalCheckComponent from '@/components/circuit/SignalCheckComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('SignalCheckComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(SignalCheckComponent, { props: { id: 'signalcheck1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Signal Check')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="signalcheck"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(SignalCheckComponent, { props: { id: 'signalcheck2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_TARGETSIGNAL"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(SignalCheckComponent, { props: { id: 'signalcheck3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="signalcheck"]').exists()).toBe(true)
  })
})
