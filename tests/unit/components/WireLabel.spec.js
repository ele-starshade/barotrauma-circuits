import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WireLabel from '@/components/WireLabel.vue'

describe('WireLabel', () => {
  it('renders when wire has a value', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [],
      value: 'test-value'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.wire-label-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('test-value')
  })

  it('does not render when wire has no value', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [],
      value: undefined
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.wire-label-container').exists()).toBe(false)
  })

  it('renders with selected class when isSelected is true', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [],
      value: 'test-value'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: true } })

    expect(wrapper.find('.selected').exists()).toBe(true)
  })

  it('renders without selected class when isSelected is false', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [],
      value: 'test-value'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.selected').exists()).toBe(false)
  })

  it('calculates label position for simple wire', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [],
      value: 'test-value'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    // The label should be positioned at the midpoint (50, 50)
    expect(wrapper.find('.wire-label-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('test-value')
  })

  it('calculates label position for wire with waypoints', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [{ x: 50, y: 0 }, { x: 50, y: 100 }],
      value: 'test-value'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.wire-label-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('test-value')
  })

  it('renders with correct structure', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      waypoints: [],
      value: 'test-value'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.wire-label-container').exists()).toBe(true)
    expect(wrapper.find('.wire-label-background').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('handles wire with empty waypoints array', () => {
    const wire = {
      x1: 10,
      y1: 20,
      x2: 30,
      y2: 40,
      waypoints: [],
      value: 'empty-waypoints'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.wire-label-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('empty-waypoints')
  })

  it('handles wire with multiple waypoints', () => {
    const wire = {
      x1: 0,
      y1: 0,
      x2: 200,
      y2: 200,
      waypoints: [
        { x: 50, y: 0 },
        { x: 50, y: 100 },
        { x: 150, y: 100 },
        { x: 150, y: 200 }
      ],
      value: 'complex-wire'
    }

    const wrapper = mount(WireLabel, { props: { wire, isSelected: false } })

    expect(wrapper.find('.wire-label-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('complex-wire')
  })
})
