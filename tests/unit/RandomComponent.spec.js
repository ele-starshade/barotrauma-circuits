import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RandomComponent from '../../src/components/circuit/RandomComponent.vue'
import { useCircuitStore } from '../../src/stores/circuit'

// Mock the ComponentPins dependency
vi.mock('../../src/components/ComponentPins.vue', () => ({
  default: {
    template: '<div class="mock-component-pins"></div>',
    props: ['count']
  }
}))

describe('RandomComponent.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the graphical tray version when mode is "tray"', () => {
    const wrapper = mount(RandomComponent, {
      props: { mode: 'tray' }
    })
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('.component.text-based').exists()).toBe(false)
    expect(wrapper.text()).toContain('Random')
  })

  it('renders the text-based board version by default', () => {
    const wrapper = mount(RandomComponent, {
      props: { id: 'rand-1' }
    })
    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('.component.graphical').exists()).toBe(false)
    expect(wrapper.text()).toContain('Random')
    expect(wrapper.text()).toContain('VALUE_OUT')
  })

  it('calls startWiring when a pin is clicked in board mode', async () => {
    const circuit = useCircuitStore()
    const startWiringSpy = vi.spyOn(circuit, 'startWiring')

    const wrapper = mount(RandomComponent, {
      props: { id: 'rand-1', mode: 'board' }
    })

    await wrapper.find('[data-pin-name="VALUE_OUT"] .new-wire-zone').trigger('mousedown')

    expect(startWiringSpy).toHaveBeenCalledOnce()
    expect(startWiringSpy).toHaveBeenCalledWith('rand-1', 'VALUE_OUT')
  })
})
