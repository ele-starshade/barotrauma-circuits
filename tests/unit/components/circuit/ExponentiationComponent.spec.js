import { describe, it, expect } from 'vitest'
import ExponentiationComponent from '@/components/circuit/ExponentiationComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('ExponentiationComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(ExponentiationComponent, { props: { id: 'exp1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Exponentiation')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="exponentiation"]').exists()).toBe(true)
  })

  it('renders in board mode and shows all pins', () => {
    const wrapper = mountWithCircuit(ExponentiationComponent, { props: { id: 'exp2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_EXPONENT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(ExponentiationComponent, { props: { id: 'exp3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="exponentiation"]').exists()).toBe(true)
  })
}) 
