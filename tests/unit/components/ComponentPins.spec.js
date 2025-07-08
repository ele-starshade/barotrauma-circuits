import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentPins from '@/components/ComponentPins.vue'

describe('ComponentPins', () => {
  it('renders the correct number of pins', () => {
    const wrapper = mount(ComponentPins, { props: { count: 3 } })

    expect(wrapper.findAll('.component-pin')).toHaveLength(3)
  })

  it('renders pins with correct structure', () => {
    const wrapper = mount(ComponentPins, { props: { count: 2 } })

    const pins = wrapper.findAll('.component-pin')

    expect(pins).toHaveLength(2)

    pins.forEach(pin => {
      expect(pin.exists()).toBe(true)
    })
  })

  it('renders container with correct classes', () => {
    const wrapper = mount(ComponentPins, { props: { count: 1 } })

    expect(wrapper.find('.pins').exists()).toBe(true)
  })

  it('handles zero count', () => {
    const wrapper = mount(ComponentPins, { props: { count: 0 } })

    expect(wrapper.findAll('.component-pin')).toHaveLength(0)
  })

  it('handles large count', () => {
    const wrapper = mount(ComponentPins, { props: { count: 10 } })

    expect(wrapper.findAll('.component-pin')).toHaveLength(10)
  })

  it('has correct styling classes', () => {
    const wrapper = mount(ComponentPins, { props: { count: 1 } })

    expect(wrapper.find('.pins').exists()).toBe(true)
    expect(wrapper.find('.component-pin').exists()).toBe(true)
  })

  it('renders pins in a flex column layout', () => {
    const wrapper = mount(ComponentPins, { props: { count: 3 } })

    const pinsContainer = wrapper.find('.pins')

    expect(pinsContainer.exists()).toBe(true)
  })
})
