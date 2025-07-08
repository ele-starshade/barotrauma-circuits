import { describe, it, expect } from 'vitest'
import RegExComponent from '@/components/circuit/RegExComponent.vue'
import { mountWithCircuit } from '~/utils/setupToolsComponentTest'

describe('RegExComponent', () => {
  it('renders in tray mode', () => {
    const wrapper = mountWithCircuit(RegExComponent, { props: { id: 'regex1', mode: 'tray' } })

    expect(wrapper.text()).toContain('RegEx')
    expect(wrapper.find('.component.graphical').exists()).toBe(true)
    expect(wrapper.find('[data-component-type="regex"]').exists()).toBe(true)
  })

  it('renders in board mode and shows pins', () => {
    const wrapper = mountWithCircuit(RegExComponent, { props: { id: 'regex2', mode: 'board' } })

    expect(wrapper.find('.component.text-based').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_IN"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SET_OUTPUT"]').exists()).toBe(true)
    expect(wrapper.find('[data-pin-name="SIGNAL_OUT"]').exists()).toBe(true)
  })

  it('has correct component type attribute', () => {
    const wrapper = mountWithCircuit(RegExComponent, { props: { id: 'regex3', mode: 'board' } })

    expect(wrapper.find('[data-component-type="regex"]').exists()).toBe(true)
  })
}) 
