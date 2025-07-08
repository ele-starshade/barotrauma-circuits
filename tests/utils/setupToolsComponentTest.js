import { setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'

// Call in each test file's setup
export function setupPinia () {
  beforeEach(() => {
    setActivePinia(createTestingPinia({ createSpy: () => () => {} }))
  })
}

// Mounts a component with a minimal mock circuit store
export function mountWithCircuit (component, options = {}) {
  setActivePinia(createTestingPinia({ createSpy: () => () => {} }))

  return shallowMount(component, {
    global: {
      stubs: ['font-awesome-icon', 'Teleport', 'ComponentPins', 'ConfigPanel']
    },
    ...options
  })
}
