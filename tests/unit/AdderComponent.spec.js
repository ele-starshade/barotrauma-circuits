import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdderComponent from '../../src/components/circuit/AdderComponent.vue'
import { useCircuitStore } from '../../src/stores/circuit'

// Mock the ComponentPins dependency
vi.mock('../../src/components/ComponentPins.vue', () => ({
  default: {
    template: '<div class="mock-component-pins"></div>',
    props: ['count']
  }
}))

describe('AdderComponent.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the graphical tray version when mode is "tray"', () => {
    const wrapper = mount(AdderComponent, {
      props: { mode: 'tray' }
    })
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('.component.text-based').exists()).toBe(false)
    expect(wrapper.text()).toContain('Adder')
  })

  it('renders the text-based board version by default', () => {
    const wrapper = mount(AdderComponent, {
      props: { id: 'adder-1' }
    })
    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('.component.graphical').exists()).toBe(false)
    expect(wrapper.text()).toContain('Adder')
    expect(wrapper.text()).toContain('SIGNAL_IN_1')
    expect(wrapper.text()).toContain('SUM_OUT')
  })

  it('calls startWiring when a pin is clicked in board mode', async () => {
    const circuit = useCircuitStore()
    const startWiringSpy = vi.spyOn(circuit, 'startWiring')

    const wrapper = mount(AdderComponent, {
      props: { id: 'adder-1', mode: 'board' }
    })

    await wrapper.find('[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').trigger('mousedown')

    expect(startWiringSpy).toHaveBeenCalledOnce()
    expect(startWiringSpy).toHaveBeenCalledWith('adder-1', 'SIGNAL_IN_1')
  })

  it('does not call startWiring in tray mode', async () => {
    const circuit = useCircuitStore()
    const startWiringSpy = vi.spyOn(circuit, 'startWiring')

    mount(AdderComponent, {
      props: { mode: 'tray' }
    })

    // There's nothing to click, but this confirms the spy is not called
    expect(startWiringSpy).not.toHaveBeenCalled()
  })

  describe('Configuration Panel', () => {
    it('does not render the config panel by default', () => {
      const wrapper = mount(AdderComponent, {
        props: { id: 'adder-1', mode: 'board' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.config-panel').exists()).toBe(false)
    })

    it('renders the config panel when the component is selected', () => {
      const circuit = useCircuitStore()
      circuit.selectedComponentId = 'adder-1' // Manually select the component

      const wrapper = mount(AdderComponent, {
        props: { id: 'adder-1', mode: 'board' },
        global: {
          stubs: {
            // Use a stub for Teleport to check its content
            Teleport: {
              template: '<div><slot /></div>'
            }
          }
        }
      })

      const panel = wrapper.find('.config-panel')
      expect(panel.exists()).toBe(true)
      expect(panel.text()).toContain('Adder Component')
      expect(panel.text()).toContain('Clamp max')
    })
  })
})
