import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useCircuitStore } from '../../src/stores/circuit'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    error: vi.fn()
  })
}))

describe('Circuit Store', () => {
  beforeEach(() => {
    // Reset the store's state before each test
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with correct default values', () => {
    const circuit = useCircuitStore()

    expect(circuit.boardComponents).toEqual([])
    expect(circuit.wires).toEqual([])
    expect(circuit.wiringInfo).toBeNull()
    expect(circuit.movingComponentInfo).toBeNull()
    expect(circuit.ghostComponent).toBeNull()
    expect(circuit.selectedComponentId).toBeNull()
    expect(circuit.selectedWireId).toBeNull()
    expect(circuit.isComponentLimitEnabled).toBe(true)
    expect(circuit.componentLimit).toBe(2)
    expect(circuit.componentIdCounter).toBe(0)
    expect(circuit.wireIdCounter).toBe(0)
    expect(circuit.waypointIdCounter).toBe(0)
  })

  it('adds a component to the board', () => {
    const circuit = useCircuitStore()

    // 1. Set up the ghost component
    circuit.ghostComponent = {
      is: 'TestComponent',
      name: 'Test',
      x: 100,
      y: 120,
      width: 150,
      height: 50
    }

    // 2. Call the action
    circuit.addComponent()

    // 3. Assert that the component was added
    expect(circuit.boardComponents).toHaveLength(1)
    const addedComponent = circuit.boardComponents[0]
    expect(addedComponent.is).toBe('TestComponent')
    expect(addedComponent.name).toBe('Test')
    expect(addedComponent.x).toBe(100)
    expect(addedComponent.y).toBe(120)
    expect(addedComponent.width).toBe(150)
    expect(addedComponent.height).toBe(50)
    expect(addedComponent.id).toBe('component-0')

    // 4. Assert that the ghost component was cleared
    expect(circuit.ghostComponent).toBeNull()
  })

  it('does not add a component if the limit is reached', () => {
    const circuit = useCircuitStore()
    circuit.componentLimit = 1
    circuit.boardComponents = [{ id: 'component-1' }]
    circuit.ghostComponent = { is: 'TestComponent' }

    circuit.addComponent()

    expect(circuit.boardComponents).toHaveLength(1)
    expect(circuit.ghostComponent).toBeNull()
  })

  it('starts moving a component', () => {
    const circuit = useCircuitStore()
    const mockEl = { getBoundingClientRect: () => ({ left: 50, top: 50 }) }
    vi.spyOn(document, 'querySelector').mockReturnValue(mockEl)

    circuit.startMove('component-1', { clientX: 100, clientY: 100 })

    expect(circuit.movingComponentInfo).not.toBeNull()
    expect(circuit.movingComponentInfo.id).toBe('component-1')
    expect(circuit.movingComponentInfo.offsetX).toBe(50)
    expect(circuit.movingComponentInfo.offsetY).toBe(50)
  })

  it('stops moving a component', () => {
    const circuit = useCircuitStore()
    circuit.movingComponentInfo = { id: 'component-1' }
    circuit.endMove()
    expect(circuit.movingComponentInfo).toBeNull()
  })

  it('starts wiring', () => {
    const circuit = useCircuitStore()
    circuit.startWiring('component-1', 'PIN_A')
    expect(circuit.wiringInfo).not.toBeNull()
    expect(circuit.wiringInfo.startComponentId).toBe('component-1')
    expect(circuit.wiringInfo.startPinName).toBe('PIN_A')
  })

  it('updates a component position during move', () => {
    const circuit = useCircuitStore()
    circuit.boardComponents = [{ id: 'component-1', x: 0, y: 0 }]
    circuit.movingComponentInfo = { id: 'component-1', offsetX: 10, offsetY: 10 }
    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    circuit.updateMove({ clientX: 100, clientY: 100 })

    expect(circuit.boardComponents[0].x).toBe(100)
    expect(circuit.boardComponents[0].y).toBe(100)
  })

  it('updates the temporary wire during wiring', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = { startComponentId: 'c1', startPinName: 'p1' }
    const mockPin = { getBoundingClientRect: () => ({ left: 10, top: 10, width: 10, height: 10 }) }
    vi.spyOn(document, 'querySelector').mockReturnValue(mockPin)
    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    circuit.updateWiring({ clientX: 100, clientY: 100 })

    expect(circuit.wiringInfo.tempWire).not.toBeNull()
    expect(circuit.wiringInfo.tempWire.x2).toBe(100)
    expect(circuit.wiringInfo.tempWire.y2).toBe(100)
  })

  it('creates a wire when ending wiring on a valid pin', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = { startComponentId: 'c1', startPinName: 'p1' }

    // Mock start pin structure
    const startComponent = document.createElement('div')
    startComponent.dataset.id = 'c1'
    const startPin = document.createElement('div')
    startPin.dataset.pinName = 'p1'
    startPin.classList.add('out') // Make it an output pin
    const startPinCircle = document.createElement('div')
    startPinCircle.classList.add('pin-circle')
    startPin.appendChild(startPinCircle)
    startComponent.appendChild(startPin)

    // Mock end pin structure
    const endComponent = document.createElement('div')
    endComponent.dataset.id = 'c2'
    const endPin = document.createElement('div')
    endPin.dataset.pinName = 'p2'
    const endPinCircle = document.createElement('div')
    endPinCircle.classList.add('pin-circle')
    endPin.appendChild(endPinCircle)
    endComponent.appendChild(endPin)

    // Mock querySelector
    vi.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === '#c1 [data-pin-name="p1"]') return startPin
      if (selector.includes('pin-circle')) return startPinCircle // for updateWiring
      return null
    })

    // Mock closest on the start pin
    vi.spyOn(startPin, 'closest').mockImplementation(selector => {
      if (selector === '.component') return startComponent
      return null
    })

    // Mock closest on the end pin circle
    vi.spyOn(endPinCircle, 'closest').mockImplementation(selector => {
      if (selector === '.component-pin') return endPin
      if (selector === '.component') return endComponent
      return null
    })
    // and on the end pin
    vi.spyOn(endPin, 'closest').mockImplementation(selector => {
      if (selector === '.component') return endComponent
      return null
    })

    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    // Call updateWiring to set tempWire
    circuit.updateWiring({ clientX: 100, clientY: 100 })

    circuit.endWiring(endPinCircle)

    expect(circuit.wires).toHaveLength(1)
    const wire = circuit.wires[0]
    expect(wire.fromId).toBe('c1')
    expect(wire.fromPin).toBe('p1')
    expect(wire.toId).toBe('c2')
    expect(wire.toPin).toBe('p2')
    expect(circuit.wiringInfo).toBeNull()
  })

  it('cancels wiring when ending on an invalid target', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = { startComponentId: 'c1', startPinName: 'p1' }

    circuit.endWiring(null)

    expect(circuit.wires).toHaveLength(0)
    expect(circuit.wiringInfo).toBeNull()
  })

  it('toggles the component limit', () => {
    const circuit = useCircuitStore()
    expect(circuit.isComponentLimitEnabled).toBe(true)
    circuit.toggleComponentLimit()
    expect(circuit.isComponentLimitEnabled).toBe(false)
    circuit.toggleComponentLimit()
    expect(circuit.isComponentLimitEnabled).toBe(true)
  })

  it('selects a component', () => {
    const circuit = useCircuitStore()
    circuit.selectComponent('component-1')
    expect(circuit.selectedComponentId).toBe('component-1')
    expect(circuit.selectedWireId).toBeNull()
  })

  it('selects a wire', () => {
    const circuit = useCircuitStore()
    circuit.selectWire('wire-1')
    expect(circuit.selectedWireId).toBe('wire-1')
    expect(circuit.selectedComponentId).toBeNull()
  })

  it('clears the selection', () => {
    const circuit = useCircuitStore()
    circuit.selectedComponentId = 'component-1'
    circuit.selectedWireId = 'wire-1'
    circuit.clearSelection()
    expect(circuit.selectedComponentId).toBeNull()
    expect(circuit.selectedWireId).toBeNull()
  })

  it('deletes the selected component and connected wires', () => {
    const circuit = useCircuitStore()
    circuit.boardComponents = [
      { id: 'component-1' },
      { id: 'component-2' }
    ]
    circuit.wires = [
      { id: 'wire-1', fromId: 'component-1', toId: 'component-2' },
      { id: 'wire-2', fromId: 'component-2', toId: 'component-3' }
    ]
    circuit.selectComponent('component-1')
    circuit.deleteSelection()
    expect(circuit.boardComponents).toHaveLength(1)
    expect(circuit.boardComponents[0].id).toBe('component-2')
    expect(circuit.wires).toHaveLength(1)
    expect(circuit.wires[0].id).toBe('wire-2')
    expect(circuit.selectedComponentId).toBeNull()
  })

  it('deletes the selected wire', () => {
    const circuit = useCircuitStore()
    circuit.wires = [
      { id: 'wire-1' },
      { id: 'wire-2' }
    ]
    circuit.selectWire('wire-1')
    circuit.deleteSelection()
    expect(circuit.wires).toHaveLength(1)
    expect(circuit.wires[0].id).toBe('wire-2')
    expect(circuit.selectedWireId).toBeNull()
  })

  it('starts moving a waypoint', () => {
    const circuit = useCircuitStore()
    const waypoint = { id: 'wp1', x: 50, y: 50 }
    circuit.wires = [{ id: 'wire-1', waypoints: [waypoint] }]
    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    circuit.startMoveWaypoint('wire-1', 'wp1', { clientX: 60, clientY: 60 })

    expect(circuit.movingWaypointInfo).toEqual({
      wireId: 'wire-1',
      waypointId: 'wp1',
      offsetX: 10,
      offsetY: 10
    })
  })

  it('updates a waypoint position during move', () => {
    const circuit = useCircuitStore()
    const waypoint = { id: 'wp1', x: 50, y: 50 }
    circuit.wires = [{ id: 'wire-1', waypoints: [waypoint] }]
    circuit.movingWaypointInfo = { wireId: 'wire-1', waypointId: 'wp1', offsetX: 10, offsetY: 10 }
    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    circuit.updateMoveWaypoint({ clientX: 100, clientY: 100 })

    expect(waypoint.x).toBe(100)
    expect(waypoint.y).toBe(100)
  })

  it('stops moving a waypoint', () => {
    const circuit = useCircuitStore()
    circuit.movingWaypointInfo = { wireId: 'wire-1', waypointId: 'wp1', offsetX: 10, offsetY: 10 }
    circuit.endMoveWaypoint()
    expect(circuit.movingWaypointInfo).toBeNull()
  })

  it('adds a waypoint to a selected wire', () => {
    const circuit = useCircuitStore()
    circuit.selectedWireId = 'wire-1'
    circuit.wires = [{ id: 'wire-1', x1: 0, y1: 0, x2: 100, y2: 100, waypoints: [] }]
    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    // Click event at (50, 50)
    circuit.addWaypointToSelectedWire({ clientX: 50, clientY: 50 })

    expect(circuit.wires[0].waypoints).toHaveLength(1)
    expect(circuit.wires[0].waypoints[0].x).toBe(50)
    expect(circuit.wires[0].waypoints[0].y).toBe(50)
  })

  it('calculates distance to a line segment correctly', () => {
    const circuit = useCircuitStore()
    // Test case 1: Point on the line
    let distance = circuit.distanceToLineSegment(5, 5, 0, 0, 10, 10)
    expect(distance).toBe(0)

    // Test case 2: Point off the line
    distance = circuit.distanceToLineSegment(5, 0, 0, 0, 10, 0)
    expect(distance).toBe(0) // Whoops, point is on the line here too. Let's fix that. (5, 5) -> dist 5
    distance = circuit.distanceToLineSegment(5, 5, 0, 0, 10, 0)
    expect(distance).toBe(5)

    // Test case 3: Point past the end of the segment
    distance = circuit.distanceToLineSegment(15, 0, 0, 0, 10, 0)
    expect(distance).toBe(5)
  })

  it('updates connected wires when a component moves', () => {
    const circuit = useCircuitStore()
    circuit.wires = [
      { id: 'w1', fromId: 'c1', fromPin: 'p1_out', toId: 'c2', toPin: 'p2_in', x1: 0, y1: 0, x2: 10, y2: 10 },
      { id: 'w2', fromId: 'c3', fromPin: 'p3_out', toId: 'c1', toPin: 'p1_in', x1: 20, y1: 20, x2: 30, y2: 30 }
    ]

    const mockBoard = { getBoundingClientRect: () => ({ left: 0, top: 0 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    const getMockPinEl = (left, top) => ({
      querySelector: () => ({
        getBoundingClientRect: () => ({ left, top, width: 10, height: 10 })
      })
    })

    vi.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === '[data-id="c1"] [data-pin-name="p1_out"]') return getMockPinEl(50, 50)
      if (selector === '[data-id="c1"] [data-pin-name="p1_in"]') return getMockPinEl(60, 60)
      if (selector === '[data-id="c2"] [data-pin-name="p2_in"]') return getMockPinEl(10, 10)
      if (selector === '[data-id="c3"] [data-pin-name="p3_out"]') return getMockPinEl(20, 20)
      return null
    })

    circuit.updateConnectedWires('c1')

    const wire1 = circuit.wires.find(w => w.id === 'w1')
    const wire2 = circuit.wires.find(w => w.id === 'w2')

    // Wire 1's "from" should be updated, "to" should be unchanged
    expect(wire1.x1).toBe(55) // new
    expect(wire1.y1).toBe(55) // new
    expect(wire1.x2).toBe(10) // original
    expect(wire1.y2).toBe(10) // original

    // Wire 2's "to" should be updated, "from" should be unchanged
    expect(wire2.x1).toBe(20) // original
    expect(wire2.y1).toBe(20) // original
    expect(wire2.x2).toBe(65) // new
    expect(wire2.y2).toBe(65) // new
  })

  it('starts dragging a new component from the tray', () => {
    const circuit = useCircuitStore()
    const componentToDrag = { is: 'ConstantComponent', name: 'Constant' }
    const mockEvent = {
      currentTarget: {
        getBoundingClientRect: () => ({ left: 10, top: 10, width: 80, height: 40 })
      },
      clientX: 25,
      clientY: 15
    }

    circuit.startDraggingComponent(componentToDrag, mockEvent)

    expect(circuit.ghostComponent).toEqual({
      is: 'ConstantComponent',
      name: 'Constant',
      width: 80,
      height: 40,
      offsetX: 15,
      offsetY: 5,
      x: -9999,
      y: -9999
    })
  })

  it('updates ghost component position during drag', () => {
    const circuit = useCircuitStore()
    circuit.ghostComponent = { width: 80, height: 40, x: 0, y: 0 }
    const mockBoard = { getBoundingClientRect: () => ({ left: 100, top: 100 }) }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockBoard)

    circuit.updateGhostComponentPosition({ clientX: 200, clientY: 150 })

    // x: (200 - 100 - 80/2) / 20 = (100-40)/20 = 3 -> 3 * 20 = 60
    expect(circuit.ghostComponent.x).toBe(60)
    // y: (150 - 100 - 40/2) / 20 = (50-20)/20 = 1.5 -> round(1.5) = 2 -> 2 * 20 = 40
    expect(circuit.ghostComponent.y).toBe(40)
  })

  // --- Branch Coverage Tests ---
  it('does not start move if component element is not found', () => {
    const circuit = useCircuitStore()
    vi.spyOn(document, 'querySelector').mockReturnValue(null)
    circuit.startMove('non-existent-id', {})
    expect(circuit.movingComponentInfo).toBeNull()
  })

  it('does not update move if not moving a component', () => {
    const circuit = useCircuitStore()
    circuit.boardComponents = [{ id: 'c1', x: 0, y: 0 }]
    circuit.movingComponentInfo = null // Not moving
    circuit.updateMove({ clientX: 100, clientY: 100 })
    expect(circuit.boardComponents[0].x).toBe(0) // Position should not change
  })

  it('does not start moving a waypoint if wire or waypoint is not found', () => {
    const circuit = useCircuitStore()
    circuit.wires = [{ id: 'w1', waypoints: [{ id: 'wp1' }] }]
    // Try with non-existent wire
    circuit.startMoveWaypoint('w-non-existent', 'wp1', {})
    expect(circuit.movingWaypointInfo).toBeNull()
    // Try with non-existent waypoint
    circuit.startMoveWaypoint('w1', 'wp-non-existent', {})
    expect(circuit.movingWaypointInfo).toBeNull()
  })

  it('does not update waypoint move if not moving a waypoint', () => {
    const circuit = useCircuitStore()
    const waypoint = { id: 'wp1', x: 50, y: 50 }
    circuit.wires = [{ id: 'w1', waypoints: [waypoint] }]
    circuit.movingWaypointInfo = null // Not moving
    circuit.updateMoveWaypoint({ clientX: 100, clientY: 100 })
    expect(waypoint.x).toBe(50) // Position should not change
  })

  it('does not update wiring if not wiring', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = null // Not wiring
    circuit.updateWiring({})
    // No assertion needed, just checking it doesn't crash
  })

  it('does not update ghost position if not dragging', () => {
    const circuit = useCircuitStore()
    circuit.ghostComponent = null
    circuit.updateGhostComponentPosition({})
    // No assertion, just checking it doesn't crash
  })

  it('does not add component if ghost component is null', () => {
    const circuit = useCircuitStore()
    const initialComponentCount = circuit.boardComponents.length
    circuit.ghostComponent = null
    circuit.addComponent()
    expect(circuit.boardComponents.length).toBe(initialComponentCount)
  })

  it('handles moving a non-existent component', () => {
    const circuit = useCircuitStore()
    circuit.movingComponentInfo = { id: 'non-existent' }
    circuit.updateMove({})
    // No assertion, just checking it doesn't crash
  })

  it('handles moving a non-existent waypoint', () => {
    const circuit = useCircuitStore()
    circuit.wires = [{ id: 'w1', waypoints: [] }]
    circuit.movingWaypointInfo = { wireId: 'w1', waypointId: 'non-existent' }
    circuit.updateMoveWaypoint({})
    // No assertion, just checking it doesn't crash
  })

  it('handles wiring from a non-existent pin', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = { startComponentId: 'c1', startPinName: 'p1', tempWire: null }
    vi.spyOn(document, 'querySelector').mockReturnValue(null)
    circuit.updateWiring({})
    // The property should still be null, not updated
    expect(circuit.wiringInfo.tempWire).toBeNull()
  })

  it('does not end wiring if not wiring', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = null
    circuit.endWiring(null)
    expect(circuit.wires.length).toBe(0)

    circuit.wiringInfo = { tempWire: null }
    circuit.endWiring(null)
    expect(circuit.wires.length).toBe(0)
  })

  it('does not add waypoint if no wire is selected', () => {
    const circuit = useCircuitStore()
    circuit.selectedWireId = null
    circuit.addWaypointToSelectedWire({})
    // No assertion, just checking it doesn't crash
  })

  it('handles distance calculation for a zero-length segment', () => {
    const circuit = useCircuitStore()
    const distance = circuit.distanceToLineSegment(10, 10, 5, 5, 5, 5)
    expect(distance).toBeCloseTo(7.07) // sqrt((10-5)^2 + (10-5)^2) = sqrt(50)
  })

  it('handles getting pin position for non-existent elements', () => {
    const circuit = useCircuitStore()
    // Test with null element
    let pos = circuit.getPinPosition(null)
    expect(pos).toEqual({ x: 0, y: 0 })

    // Test with missing board
    vi.spyOn(document, 'getElementById').mockReturnValue(null)
    pos = circuit.getPinPosition(document.createElement('div'))
    expect(pos).toEqual({ x: 0, y: 0 })
  })

  it('does not update move if waypoint is not found in wire', () => {
    const circuit = useCircuitStore()
    circuit.wires = [{ id: 'w1', waypoints: [{ id: 'wp-real', x: 10, y: 10 }] }]
    circuit.movingWaypointInfo = { wireId: 'w1', waypointId: 'wp-fake', offsetX: 0, offsetY: 0 }
    circuit.updateMoveWaypoint({ clientX: 100, clientY: 100 })
    expect(circuit.wires[0].waypoints[0].x).toBe(10)
  })

  it('does not create a wire if connecting two pins of the same type', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = { startComponentId: 'c1', startPinName: 'p1', tempWire: { x1: 0, y1: 0, x2: 0, y2: 0 } }
    const startComponent = document.createElement('div'); startComponent.dataset.id = 'c1'
    const startPin = document.createElement('div'); startPin.dataset.pinName = 'p1'; startPin.classList.add('out')
    startComponent.appendChild(startPin)
    vi.spyOn(startPin, 'closest').mockReturnValue(startComponent)
    const endComponent = document.createElement('div'); endComponent.dataset.id = 'c2'
    const endPin = document.createElement('div'); endPin.dataset.pinName = 'p2'; endPin.classList.add('out')
    const endPinCircle = document.createElement('div')
    endPin.appendChild(endPinCircle)
    endComponent.appendChild(endPin)
    vi.spyOn(endPin, 'closest').mockReturnValue(endComponent)
    vi.spyOn(endPinCircle, 'closest').mockImplementation((selector) => {
      if (selector === '.component-pin') return endPin
      return null
    })
    vi.spyOn(document, 'querySelector').mockReturnValue(startPin)
    circuit.endWiring(endPinCircle)
    expect(circuit.wires).toHaveLength(0)
  })

  it('cancels wiring if ending on a non-pin element', () => {
    const circuit = useCircuitStore()
    circuit.wiringInfo = { startComponentId: 'c1', startPinName: 'p1', tempWire: { x1: 0, y1: 0, x2: 0, y2: 0 } }
    // Make start pin an INPUT pin this time
    const startPin = document.createElement('div')
    vi.spyOn(document, 'querySelector').mockReturnValue(startPin)

    // Mock the target element to not be a pin
    const notAPinCircle = document.createElement('div')
    vi.spyOn(notAPinCircle, 'closest').mockReturnValue(null)

    circuit.endWiring(notAPinCircle)

    expect(circuit.wires).toHaveLength(0)
    expect(circuit.wiringInfo).toBeNull() // Wiring should be cancelled
  })

  it('does not add waypoint if selected wire id is not in wires array', () => {
    const circuit = useCircuitStore()
    circuit.selectedWireId = 'non-existent-wire'
    circuit.wires = [{ id: 'some-other-wire', x1: 0, y1: 0, x2: 100, y2: 100, waypoints: [] }]
    circuit.addWaypointToSelectedWire({})
    expect(circuit.wires[0].waypoints).toHaveLength(0)
  })
})
