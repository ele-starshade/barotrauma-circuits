import { describe, it, expect } from 'vitest'
import ModuloComponent from '@/components/circuit/ModuloComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('ModuloComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(ModuloComponent, { props: { id: 'modulo1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Modulo')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="modulo"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(ModuloComponent, { props: { id: 'modulo2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_MODULUS"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(ModuloComponent, { props: { id: 'modulo3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="modulo"]').exists()).toBe(true)
  })
})
