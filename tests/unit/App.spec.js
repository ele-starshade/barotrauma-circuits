import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../../src/App.vue'
import { useCircuitStore } from '../../src/stores/circuit'

describe('App.vue Logic', () => {
  let circuit
  let wrapper

  // These are all the actions App.vue can call
  const mockActions = {
    startDraggingComponent: vi.fn(),
    updateGhostComponentPosition: vi.fn(),
    addComponent: vi.fn(),
    clearSelection: vi.fn(),
    selectComponent: vi.fn(),
    startMove: vi.fn(),
    updateMove: vi.fn(),
    endMove: vi.fn(),
    selectWire: vi.fn(),
    addWaypointToSelectedWire: vi.fn(),
    startMoveWaypoint: vi.fn(),
    updateMoveWaypoint: vi.fn(),
    endMoveWaypoint: vi.fn(),
    updateWiring: vi.fn(),
    endWiring: vi.fn(),
    deleteSelection: vi.fn()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    circuit = useCircuitStore()

    // Replace all actions with mocks and reset them
    Object.assign(circuit, mockActions)
    Object.values(mockActions).forEach(mock => mock.mockClear())

    // Set up initial state
    circuit.boardComponents = []
    circuit.wires = []
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Mouse and Keyboard Interactions', () => {
    beforeEach(() => {
      wrapper = mount(App, {
        // We still need to attach to the document body for window events
        // to propagate correctly in some test environments.
        attachTo: document.body,
        global: {
          stubs: {
            ComponentCounter: true,
            AddComponent: true,
            ConstantComponent: true,
            RandomComponent: true,
            Teleport: true
          }
        }
      })
    })

    it('clears selection on board mousedown', () => {
      // .self modifier means we must trigger it on the element itself
      wrapper.find('#circuit-board').trigger('mousedown')
      expect(circuit.clearSelection).toHaveBeenCalledOnce()
    })

    it('deletes selection on "Delete" keydown', async () => {
      const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' })
      window.dispatchEvent(deleteEvent)
      expect(circuit.deleteSelection).toHaveBeenCalledOnce()
    })

    it('delegates mousemove to updateMove when a component is moving', async () => {
      circuit.movingComponentInfo = { id: 'c1' } // Set state
      window.dispatchEvent(new MouseEvent('mousemove'))
      expect(circuit.updateMove).toHaveBeenCalledOnce()
    })

    it('delegates mousemove to updateMoveWaypoint when a waypoint is moving', async () => {
      circuit.movingWaypointInfo = { wireId: 'w1', waypointId: 'wp1' } // Set state
      window.dispatchEvent(new MouseEvent('mousemove'))
      expect(circuit.updateMoveWaypoint).toHaveBeenCalledOnce()
    })

    it('delegates mousemove to updateWiring when wiring', async () => {
      circuit.wiringInfo = { startPinId: 'p1' } // Set state
      window.dispatchEvent(new MouseEvent('mousemove'))
      expect(circuit.updateWiring).toHaveBeenCalledOnce()
    })

    it('delegates mouseup to endMove when a component was moving', async () => {
      circuit.movingComponentInfo = { id: 'c1' } // Set state
      window.dispatchEvent(new MouseEvent('mouseup'))
      expect(circuit.endMove).toHaveBeenCalledOnce()
    })

    it('delegates mouseup to endMoveWaypoint when a waypoint was moving', async () => {
      circuit.movingWaypointInfo = { wireId: 'w1', waypointId: 'wp1' } // Set state
      window.dispatchEvent(new MouseEvent('mouseup'))
      expect(circuit.endMoveWaypoint).toHaveBeenCalledOnce()
    })

    it('delegates mouseup to endWiring when wiring', async () => {
      circuit.wiringInfo = { startPinId: 'p1' } // Set state
      // Mock event target for endWiring logic
      const mockEvent = new MouseEvent('mouseup')
      Object.defineProperty(mockEvent, 'target', { value: document.body, writable: false })
      window.dispatchEvent(mockEvent)
      expect(circuit.endWiring).toHaveBeenCalledOnce()
    })
  })
})
