import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ComponentCounter from '../../src/components/ComponentCounter.vue'
import { useCircuitStore } from '../../src/stores/circuit'

describe('ComponentCounter.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the component count correctly', () => {
    const circuit = useCircuitStore()
    circuit.boardComponents = [{}, {}, {}] // 3 components

    const wrapper = mount(ComponentCounter)
    expect(wrapper.text()).toContain('Components: 3')
  })

  it('displays the limit when isComponentLimitEnabled is true', () => {
    const circuit = useCircuitStore()
    circuit.isComponentLimitEnabled = true
    circuit.componentLimit = 64
    circuit.boardComponents = [{}, {}] // 2 components

    const wrapper = mount(ComponentCounter)
    expect(wrapper.text()).toContain('Components: 2 / 64')
  })

  it('does not display the limit when isComponentLimitEnabled is false', () => {
    const circuit = useCircuitStore()
    circuit.isComponentLimitEnabled = false
    circuit.componentLimit = 64
    circuit.boardComponents = [{}] // 1 component

    const wrapper = mount(ComponentCounter)
    expect(wrapper.text()).toContain('Components: 1')
    expect(wrapper.text()).not.toContain('/')
  })

  it('calls the toggleComponentLimit action when the switch is clicked', async() => {
    const circuit = useCircuitStore()
    const toggleSpy = vi.spyOn(circuit, 'toggleComponentLimit')

    const wrapper = mount(ComponentCounter)
    await wrapper.find('input[type="checkbox"]').trigger('change')

    expect(toggleSpy).toHaveBeenCalled()
  })
})
