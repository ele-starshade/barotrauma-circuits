import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfigPanel from '@/components/ConfigPanel.vue'

describe('ConfigPanel', () => {
  it('renders with correct title', () => {
    const wrapper = mount(ConfigPanel, { props: { title: 'Test Panel' } })

    expect(wrapper.text()).toContain('Test Panel')
    expect(wrapper.find('.config-panel-header').exists()).toBe(true)
  })

  it('renders panel structure', () => {
    const wrapper = mount(ConfigPanel, { props: { title: 'Test' } })

    expect(wrapper.find('.config-panel').exists()).toBe(true)
    expect(wrapper.find('.config-panel-header').exists()).toBe(true)
    expect(wrapper.find('.config-panel-body').exists()).toBe(true)
    expect(wrapper.find('.config-panel-footer').exists()).toBe(true)
  })

  it('renders slot content in body', () => {
    const wrapper = mount(ConfigPanel, {
      props: { title: 'Test' },
      slots: {
        default: '<div class="test-content">Test Content</div>'
      }
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Content')
  })

  it('renders delete hint in footer', () => {
    const wrapper = mount(ConfigPanel, { props: { title: 'Test' } })

    expect(wrapper.text()).toContain('Press')
    expect(wrapper.text()).toContain('Delete')
    expect(wrapper.text()).toContain('to remove')
    expect(wrapper.find('kbd').exists()).toBe(true)
  })

  it('has correct styling classes', () => {
    const wrapper = mount(ConfigPanel, { props: { title: 'Test' } })

    expect(wrapper.find('.config-panel').exists()).toBe(true)
    expect(wrapper.find('.config-panel-header').exists()).toBe(true)
    expect(wrapper.find('.config-panel-body').exists()).toBe(true)
    expect(wrapper.find('.config-panel-footer').exists()).toBe(true)
  })

  it('renders keyboard shortcut with kbd element', () => {
    const wrapper = mount(ConfigPanel, { props: { title: 'Test' } })

    const kbdElement = wrapper.find('kbd')

    expect(kbdElement.exists()).toBe(true)
    expect(kbdElement.text()).toBe('Delete')
  })

  it('handles different title props', () => {
    const wrapper = mount(ConfigPanel, { props: { title: 'Custom Title' } })

    expect(wrapper.text()).toContain('Custom Title')
  })
})
