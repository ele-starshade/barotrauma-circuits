import { describe, it, expect } from 'vitest'
import SquareRootComponent from '@/components/circuit/SquareRootComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('SquareRootComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(SquareRootComponent, { props: { id: 'sqrt1', mode: 'tray' } })

    expect(wrapper.text()).toContain('Square Root')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="square-root"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(SquareRootComponent, { props: { id: 'sqrt2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(SquareRootComponent, { props: { id: 'sqrt3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="square-root"]').exists()).toBe(true)
  })
}) 
