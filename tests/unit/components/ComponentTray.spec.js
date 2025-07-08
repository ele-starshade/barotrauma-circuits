import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import ComponentTray from '@/components/ComponentTray.vue'
import { createPinia, setActivePinia } from 'pinia'

// Suppress Vue warnings for async components and Teleport
config.global.config = config.global.config || {}
config.global.config.warnHandler = () => {}

// Global stubs for all async components, font-awesome-icon, and Teleport
const stubComponent = { template: '<div />' }

config.global.stubs = {
  'font-awesome-icon': stubComponent,
  Teleport: stubComponent,
  // All possible async components in the tray
  AdderComponent: stubComponent,
  AndComponent: stubComponent,
  ConstantComponent: stubComponent,
  RandomComponent: stubComponent,
  DisplayComponent: stubComponent,
  SubtractComponent: stubComponent,
  MultiplyComponent: stubComponent,
  DivideComponent: stubComponent,
  XorComponent: stubComponent,
  SignalCheckComponent: stubComponent,
  GreaterComponent: stubComponent,
  LightComponent: stubComponent,
  AbsComponent: stubComponent,
  AcosComponent: stubComponent,
  AsinComponent: stubComponent,
  AtanComponent: stubComponent,
  CeilComponent: stubComponent,
  ColorComponent: stubComponent,
  ConcatenationComponent: stubComponent,
  CosComponent: stubComponent,
  DelayComponent: stubComponent,
  ExponentiationComponent: stubComponent,
  FactorialComponent: stubComponent,
  EqualsComponent: stubComponent,
  FloorComponent: stubComponent,
  InputSelectorComponent: stubComponent,
  MemoryComponent: stubComponent,
  ModuloComponent: stubComponent,
  NotComponent: stubComponent,
  OrComponent: stubComponent,
  OscillatorComponent: stubComponent,
  OutputSelectorComponent: stubComponent,
  RegExComponent: stubComponent,
  RelayComponent: stubComponent,
  RoundComponent: stubComponent,
  SinComponent: stubComponent,
  SquareRootComponent: stubComponent,
  TanComponent: stubComponent,
  WiFiComponent: stubComponent
}

describe('ComponentTray', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders the component tray structure', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.find('#component-tray').exists()).toBe(true)
    expect(wrapper.find('.components-section').exists()).toBe(true)
    expect(wrapper.find('.tools-section').exists()).toBe(true)
    expect(wrapper.find('.hints-section').exists()).toBe(true)
  })

  it('renders section headers', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.text()).toContain('Components')
    expect(wrapper.text()).toContain('Tools')
    expect(wrapper.text()).toContain('Hints')
  })

  it('renders hints list', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.text()).toContain('Middle Mouse')
    expect(wrapper.text()).toContain('Delete')
    expect(wrapper.text()).toContain('Ctrl')
    expect(wrapper.find('.hints-list').exists()).toBe(true)
  })

  it('renders components grid', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.find('.components-grid').exists()).toBe(true)
  })

  it('renders tools list', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.find('.tools-list').exists()).toBe(true)
  })

  it('separates regular components from tools', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.find('.components-section .components-grid').exists()).toBe(true)
    expect(wrapper.find('.tools-section .tools-list').exists()).toBe(true)
  })

  it('has correct grid layout structure', () => {
    const wrapper = mount(ComponentTray)
    const tray = wrapper.find('#component-tray')

    expect(tray.exists()).toBe(true)
    // Note: CSS grid is applied via styles, not class attributes, so we only check for the element
  })

  it('renders keyboard shortcuts in hints', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.find('kbd').exists()).toBe(true)
    expect(wrapper.findAll('kbd').length).toBeGreaterThan(0)
  })

  it('has proper styling classes for sections', () => {
    const wrapper = mount(ComponentTray)

    expect(wrapper.find('.components-section').exists()).toBe(true)
    expect(wrapper.find('.tools-section').exists()).toBe(true)
    expect(wrapper.find('.hints-section').exists()).toBe(true)
  })
})
