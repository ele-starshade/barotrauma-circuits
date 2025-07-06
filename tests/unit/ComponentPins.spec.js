import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentPins from '../../src/components/ComponentPins.vue'

describe('ComponentPins.vue', () => {
  it('renders the correct number of pins', () => {
    const wrapper = mount(ComponentPins, {
      props: { count: 5 }
    })
    const pins = wrapper.findAll('.component-pin')
    expect(pins).toHaveLength(5)
  })

  it('renders no pins when count is zero', () => {
    const wrapper = mount(ComponentPins, {
      props: { count: 0 }
    })
    const pins = wrapper.findAll('.component-pin')
    expect(pins).toHaveLength(0)
  })
})
