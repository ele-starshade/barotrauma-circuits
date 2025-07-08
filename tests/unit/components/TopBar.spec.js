import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopBar from '@/components/TopBar.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock FontAwesome
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<span class="fa-icon"></span>',
    props: ['icon']
  }
}))

describe('TopBar', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders export and import buttons', () => {
    const wrapper = mount(TopBar)

    expect(wrapper.text()).toContain('Export')
    expect(wrapper.text()).toContain('Import')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders component limit toggle', () => {
    const wrapper = mount(TopBar)

    expect(wrapper.text()).toContain('Limit Components')
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('renders component counter', () => {
    const wrapper = mount(TopBar)

    expect(wrapper.text()).toContain('Components:')
    expect(wrapper.find('.component-counter').exists()).toBe(true)
  })

  it('renders simulation controls', () => {
    const wrapper = mount(TopBar)

    expect(wrapper.text()).toContain('Start Simulation')
    expect(wrapper.find('.top-bar-section.right').exists()).toBe(true)
  })

  it('shows running indicator when simulation is running', async () => {
    const wrapper = mount(TopBar)
    
    // Mock the circuit store to simulate running state
    const circuitStore = wrapper.vm.circuit
    circuitStore.simulationRunning = true
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Running...')
    expect(wrapper.text()).toContain('Stop Simulation')
    expect(wrapper.find('.indicator-container').exists()).toBe(true)
  })

  it('shows start button when simulation is not running', () => {
    const wrapper = mount(TopBar)

    expect(wrapper.text()).toContain('Start Simulation')
    expect(wrapper.find('.btn-success').exists()).toBe(true)
  })

  it('has correct layout structure', () => {
    const wrapper = mount(TopBar)

    expect(wrapper.find('#top-bar').exists()).toBe(true)
    expect(wrapper.find('.top-bar-section.left').exists()).toBe(true)
    expect(wrapper.find('.top-bar-section.center').exists()).toBe(true)
    expect(wrapper.find('.top-bar-section.right').exists()).toBe(true)
  })

  it('calls exportState when export button is clicked', async () => {
    const wrapper = mount(TopBar)
    const circuitStore = wrapper.vm.circuit
    const exportSpy = vi.spyOn(circuitStore, 'exportState')

    await wrapper.find('button').trigger('click')

    expect(exportSpy).toHaveBeenCalled()
  })

  it('calls startSimulation when start button is clicked', async () => {
    const wrapper = mount(TopBar)
    const circuitStore = wrapper.vm.circuit
    const startSpy = vi.spyOn(circuitStore, 'startSimulation')

    await wrapper.find('.btn-success').trigger('click')

    expect(startSpy).toHaveBeenCalled()
  })
}) 
