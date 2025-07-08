<template>
  <TopBar />
  <div id="config-panel-container"></div>
  <div
    id="circuit-board-wrapper"
    ref="circuitBoardWrapper"
    @mousedown.middle.prevent="startPan"
  >
    <main
      id="circuit-board"
      @mousedown.self="circuit.clearSelection()"
      @click="onBoardClick"
    >
      <!-- Components on the board -->
      <component
        v-for="component in circuit.boardComponents"
        :key="component.id"
        :id="component.id"
        :is="component.is"
        :style="{ position: 'absolute', left: `${component.x}px`, top: `${component.y}px` }"
        :data-id="component.id"
        :component-data="component"
        :class="{
          'is-moving': circuit.movingComponentInfo && circuit.movingComponentInfo.id === component.id,
          'selected': circuit.selectedComponentId === component.id
        }"
        class="component"
        @mousedown="onComponentMouseDown(component.id, $event)"
      />

      <!-- Wires -->
      <svg id="wire-layer" class="position-absolute" style="pointer-events: none;">
        <g
          v-for="wire in circuit.wires"
          :key="wire.id"
          :class="{ 'selected': circuit.selectedWireId === wire.id }"
          class="wire-group"
        >
          <polyline
            class="wire"
            :class="{ 'animated': circuit.simulationRunning && wire.value !== undefined }"
            :points="getWirePoints(wire)"
          />
          <polyline
            class="wire-hitbox"
            :points="getWirePoints(wire)"
            @mousedown.stop="onWireMouseDown(wire.id, $event)"
          />
          <WireLabel
            v-if="circuit.simulationRunning"
            :wire="wire"
            :is-selected="circuit.selectedWireId === wire.id"
          />
          <circle
            v-if="circuit.selectedWireId === wire.id"
            v-for="waypoint in wire.waypoints"
            :key="waypoint.id"
            class="waypoint"
            :cx="waypoint.x"
            :cy="waypoint.y"
            r="5"
            @mousedown.stop="onWaypointMouseDown(wire.id, waypoint.id, $event)"
          />
        </g>
        <line v-if="circuit.wiringInfo && circuit.wiringInfo.tempWire" class="wire temp" :x1="circuit.wiringInfo.tempWire.x1" :y1="circuit.wiringInfo.tempWire.y1" :x2="circuit.wiringInfo.tempWire.x2" :y2="circuit.wiringInfo.tempWire.y2" />
      </svg>
    </main>
  </div>
  <ComponentTray />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useCircuitStore } from './stores/circuit'

import TopBar from './components/TopBar.vue'
import WireLabel from './components/WireLabel.vue'
import ComponentTray from './components/ComponentTray.vue'

const circuit = useCircuitStore()
const circuitBoardWrapper = ref(null)
const isPanning = ref(false)
const panStart = { x: 0, y: 0 }

/**
 * Starts the panning interaction on the circuit board
 *
 * @param {MouseEvent} event - The mouse event that triggered the pan start
 * @returns {void}
 *
 * @description
 * This function initiates the panning functionality for the circuit board.
 * It sets up the necessary event listeners and visual feedback for the user.
 *
 * The function performs the following operations:
 * - Sets the isPanning flag to true to track the panning state
 * - Records the initial mouse position for calculating pan distance
 * - Changes the cursor to 'grabbing' to provide visual feedback
 * - Adds global mouse event listeners for move and up events
 *
 * After calling this function, the user can drag to pan the circuit board
 * view. The panning will continue until endPan() is called.
 *
 * @example
 * // Start panning when user presses middle mouse button
 * circuitBoardWrapper.addEventListener('mousedown', startPan)
 *
 * // The user can now drag to pan the circuit board
 * // Panning will stop when endPan() is called
 */
function startPan (event) {
  isPanning.value = true
  panStart.x = event.clientX
  panStart.y = event.clientY
  document.body.style.cursor = 'grabbing'
  window.addEventListener('mousemove', pan)
  window.addEventListener('mouseup', endPan)
}

/**
 * Handles the panning movement of the circuit board
 *
 * @param {MouseEvent} event - The mouse event containing current cursor position
 * @returns {void}
 *
 * @description
 * This function updates the circuit board's scroll position based on mouse movement
 * during a panning operation. It calculates the distance moved since the last update
 * and applies the inverse movement to the scroll position to create the panning effect.
 *
 * The function performs the following operations:
 * - Checks if panning is currently active (early return if not)
 * - Calculates the delta movement in both X and Y directions
 * - Updates the circuit board's scroll position by the negative delta values
 * - Updates the pan start position for the next movement calculation
 *
 * This function is called repeatedly during mouse movement while panning is active.
 * The negative delta values create the effect that the circuit board moves in the
 * opposite direction of the mouse movement, which is the expected behavior for
 * panning interactions.
 *
 * @example
 * // This function is typically called by the mousemove event listener
 * // during an active panning operation
 * window.addEventListener('mousemove', pan)
 *
 * // The circuit board will scroll in response to mouse movement
 * // until endPan() is called to stop the panning operation
 */
function pan (event) {
  if (!isPanning.value) return

  const dx = event.clientX - panStart.x
  const dy = event.clientY - panStart.y

  circuitBoardWrapper.value.scrollLeft -= dx
  circuitBoardWrapper.value.scrollTop -= dy
  panStart.x = event.clientX
  panStart.y = event.clientY
}

/**
 * Ends the panning operation and cleans up event listeners
 *
 * @returns {void}
 *
 * @description
 * This function terminates an active panning operation and performs cleanup
 * operations to restore the application to its normal state. It resets the
 * panning flag, restores the default cursor, and removes the event listeners
 * that were added during the startPan() function.
 *
 * The function performs the following operations:
 * - Sets the isPanning flag to false to indicate panning has ended
 * - Restores the document cursor to its default state
 * - Removes the mousemove event listener that was handling pan movement
 * - Removes the mouseup event listener that triggers this function
 *
 * This function is typically called when the user releases the middle mouse
 * button after starting a panning operation. It ensures that the circuit
 * board returns to its normal interaction state and prevents any lingering
 * event listeners from continuing to respond to mouse movements.
 *
 * @example
 * // This function is typically called by the mouseup event listener
 * // when the user releases the middle mouse button during panning
 * window.addEventListener('mouseup', endPan)
 *
 * // After calling this function, the circuit board will no longer
 * // respond to mouse movement for panning until startPan() is called again
 */
function endPan () {
  isPanning.value = false
  document.body.style.cursor = 'default'
  window.removeEventListener('mousemove', pan)
  window.removeEventListener('mouseup', endPan)
}

/**
 * Handles mouse down events on circuit components
 *
 * @param {string} componentId - The unique identifier of the component that was clicked
 * @param {MouseEvent} event - The mouse down event object
 * @returns {void}
 *
 * @description
 * This function is called when a user clicks on a component on the circuit board.
 * It performs two main operations:
 * 1. Selects the clicked component by calling circuit.selectComponent()
 * 2. Initiates a move operation for the component by calling circuit.startMove()
 *
 * This function enables the interactive behavior of components on the circuit board,
 * allowing users to select components and begin moving them by clicking and dragging.
 * The function works in conjunction with the mouse move and mouse up event handlers
 * to provide a complete drag-and-drop experience for component manipulation.
 *
 * This function is typically bound to the mousedown event on individual component
 * elements and coordinates with the circuit store to manage component selection
 * and movement states.
 *
 * @example
 * // This function is typically called by the mousedown event listener
 * // when a user clicks on a component
 * <component @mousedown="onComponentMouseDown(component.id, $event)">
 *
 * // After calling this function, the component will be selected
 * // and ready for movement if the user continues to drag
 */
function onComponentMouseDown (componentId, event) {
  circuit.selectComponent(componentId)
  circuit.startMove(componentId, event)
}

/**
 * Converts a wire object into a string of coordinate points for SVG rendering
 *
 * @param {Object} wire - The wire object containing start, end, and waypoint coordinates
 * @param {number} wire.x1 - The x-coordinate of the wire's starting point
 * @param {number} wire.y1 - The y-coordinate of the wire's starting point
 * @param {number} wire.x2 - The x-coordinate of the wire's ending point
 * @param {number} wire.y2 - The y-coordinate of the wire's ending point
 * @param {Array<Object>} wire.waypoints - Array of waypoint objects with x and y coordinates
 * @returns {string} A space-separated string of coordinate pairs in "x,y" format
 *
 * @description
 * This function takes a wire object and converts it into a string representation
 * suitable for use in SVG polyline or polygon elements. It creates an ordered
 * sequence of all points along the wire's path, including the start point,
 * any intermediate waypoints, and the end point.
 *
 * The function performs the following operations:
 * - Creates an array starting with the wire's start coordinates (x1, y1)
 * - Spreads any waypoints into the middle of the array
 * - Adds the wire's end coordinates (x2, y2) to complete the path
 * - Converts each point object to a "x,y" string format
 * - Joins all coordinate strings with spaces to create the final result
 *
 * This function is typically used when rendering wires on the circuit board
 * to provide the points attribute for SVG elements that need to display
 * the wire's complete path including any bends or waypoints.
 *
 * @example
 * // Convert a simple straight wire
 * const wire = { x1: 10, y1: 20, x2: 50, y2: 20, waypoints: [] }
 * const points = getWirePoints(wire)
 * // Returns: "10,20 50,20"
 *
 * // Convert a wire with waypoints
 * const wireWithWaypoints = {
 *   x1: 10, y1: 20,
 *   x2: 100, y2: 80,
 *   waypoints: [{ x: 30, y: 40 }, { x: 70, y: 60 }]
 * }
 * const points = getWirePoints(wireWithWaypoints)
 * // Returns: "10,20 30,40 70,60 100,80"
 */
function getWirePoints (wire) {
  const points = [
    { x: wire.x1, y: wire.y1 },
    ...wire.waypoints,
    { x: wire.x2, y: wire.y2 }
  ]

  return points.map(p => `${p.x},${p.y}`).join(' ')
}

/**
 * Handles mouse down events on wire elements
 *
 * @param {string} wireId - The unique identifier of the wire that was clicked
 * @param {MouseEvent} event - The mouse event that triggered this function
 * @returns {void}
 *
 * @description
 * This function handles mouse interactions with wire elements on the circuit board.
 * It provides two different behaviors depending on whether the Ctrl key is held
 * during the click event.
 *
 * The function performs the following operations:
 * - Selects the wire that was clicked by calling circuit.selectWire()
 * - If the Ctrl key is pressed during the click, adds a waypoint to the selected wire
 *   at the click location by calling circuit.addWaypointToSelectedWire()
 *
 * This function is typically called when a user clicks on a wire element in the
 * circuit board interface. The wire selection allows for subsequent operations
 * like deletion or modification, while the Ctrl+click behavior provides a quick
 * way to add waypoints for wire routing.
 *
 * @example
 * // Handle a regular click on a wire
 * onWireMouseDown('wire-123', mouseEvent)
 * // Wire is selected, no waypoint added
 *
 * // Handle a Ctrl+click on a wire
 * const ctrlEvent = new MouseEvent('mousedown', { ctrlKey: true })
 * onWireMouseDown('wire-123', ctrlEvent)
 * // Wire is selected and a waypoint is added at the click location
 */
function onWireMouseDown (wireId, event) {
  circuit.selectWire(wireId)
  if (event.ctrlKey) {
    circuit.addWaypointToSelectedWire(event)
  }
}

/**
 * Handles mouse down events on wire waypoint elements
 *
 * @param {string} wireId - The unique identifier of the wire containing the waypoint
 * @param {string} waypointId - The unique identifier of the waypoint that was clicked
 * @param {MouseEvent} event - The mouse event that triggered this function
 * @returns {void}
 *
 * @description
 * This function initiates the waypoint movement interaction when a user clicks on
 * a wire waypoint. It delegates the movement logic to the circuit store's
 * startMoveWaypoint method, which handles the initial setup for dragging the waypoint.
 *
 * The function performs the following operations:
 * - Calls circuit.startMoveWaypoint() with the wire ID, waypoint ID, and mouse event
 * - This typically sets up the movingWaypointInfo state in the circuit store
 * - Prepares the waypoint for dragging operations that will be handled by other
 *   event listeners (mousemove, mouseup)
 *
 * This function is typically called when a user clicks on a waypoint circle in the
 * wire layer of the circuit board. The waypoint movement allows users to adjust
 * the routing of wires by repositioning intermediate points along the wire path.
 *
 * @example
 * // Handle a click on a wire waypoint
 * onWaypointMouseDown('wire-123', 'waypoint-456', mouseEvent)
 * // Waypoint movement is initiated and ready for dragging
 */
function onWaypointMouseDown (wireId, waypointId, event) {
  circuit.startMoveWaypoint(wireId, waypointId, event)
}

/**
 * Handles mouse movement events across the circuit board
 *
 * @param {MouseEvent} event - The mouse event containing current cursor position and state
 * @returns {void}
 *
 * @description
 * This function processes mouse movement events and delegates the appropriate actions
 * based on the current interaction state of the circuit board. It acts as a central
 * coordinator for various mouse-based interactions including waypoint movement,
 * component movement, and wire creation.
 *
 * The function performs the following operations in order of priority:
 * - Early return if panning is active to prevent interference with pan operations
 * - Early return if a ghost component is being displayed (typically during drag-and-drop)
 * - Updates waypoint movement if a waypoint is currently being dragged
 * - Updates component movement if a component is currently being dragged
 * - Updates wire creation if currently in wiring mode
 *
 * This function is called continuously during mouse movement and ensures that only
 * one type of interaction is active at a time through its conditional logic.
 *
 * @example
 * // Handle mouse movement during waypoint dragging
 * // movingWaypointInfo is set in the circuit store
 * onMouseMove(mouseEvent)
 * // Waypoint position is updated based on mouse position
 *
 * // Handle mouse movement during component dragging
 * // movingComponentInfo is set in the circuit store
 * onMouseMove(mouseEvent)
 * // Component position is updated based on mouse position
 *
 * // Handle mouse movement during wire creation
 * // wiringInfo is set in the circuit store
 * onMouseMove(mouseEvent)
 * // Temporary wire preview is updated based on mouse position
 */
function onMouseMove (event) {
  if (isPanning.value) return

  if (circuit.movingWaypointInfo) {
    circuit.updateMoveWaypoint(event)
  } else if (circuit.movingComponentInfo) {
    circuit.updateMove(event)
  } else if (circuit.wiringInfo) {
    circuit.updateWiring(event)
  }
}

/**
 * Handles mouse up events and finalizes various circuit board interactions
 *
 * @param {MouseEvent} event - The mouse event containing target information and position
 * @returns {void}
 *
 * @description
 * This function processes mouse up events and completes the appropriate circuit board
 * interactions based on the current state. It acts as the final step in various
 * interaction workflows including wire creation, component movement, and waypoint
 * movement.
 *
 * The function performs the following operations in order of priority:
 * - Completes wire creation if currently in wiring mode by finding the target pin
 *   and calling the circuit store's endWiring method
 * - Finalizes component movement if a component is currently being dragged
 * - Finalizes waypoint movement if a waypoint is currently being dragged
 *
 * This function ensures that all interactive operations are properly completed
 * when the user releases the mouse button, maintaining the integrity of the
 * circuit board state.
 *
 * @example
 * // Complete wire creation when user releases mouse over a pin
 * // wiringInfo is set in the circuit store
 * onMouseUp(mouseEvent)
 * // Wire is created if target is a valid pin, otherwise wiring is cancelled
 *
 * // Complete component movement when user releases mouse
 * // movingComponentInfo is set in the circuit store
 * onMouseUp(mouseEvent)
 * // Component position is finalized and movement state is cleared
 *
 * // Complete waypoint movement when user releases mouse
 * // movingWaypointInfo is set in the circuit store
 * onMouseUp(mouseEvent)
 * // Waypoint position is finalized and movement state is cleared
 */
function onMouseUp (event) {
  if (circuit.wiringInfo) {
    const endPinEl = event.target.closest('.component-pin')
    const endCircleEl = endPinEl ? endPinEl.querySelector('.pin-circle') : null

    circuit.endWiring(endCircleEl)
  } else if (circuit.movingComponentInfo) {
    circuit.endMove()
  } else if (circuit.movingWaypointInfo) {
    circuit.endMoveWaypoint()
  }
}

/**
 * Handles keyboard events for the circuit board
 *
 * @param {KeyboardEvent} event - The keyboard event containing key information and target
 * @returns {void}
 *
 * @description
 * This function processes keyboard events and performs appropriate actions based on
 * the pressed key. It acts as the main keyboard event handler for the circuit board,
 * providing keyboard shortcuts for common operations.
 *
 * The function performs the following operations:
 * - Checks if the event target is an input field or textarea to avoid interfering
 *   with text input operations
 * - Handles Delete and Backspace keys to delete the currently selected component
 *   or wire from the circuit board
 *
 * This function ensures that keyboard shortcuts work consistently across the
 * circuit board while respecting text input areas and maintaining the integrity
 * of the circuit board state.
 *
 * @example
 * // Delete selected component when user presses Delete key
 * // selectedComponentId is set in the circuit store
 * handleKeyDown(keyboardEvent)
 * // Selected component is removed from the circuit board
 *
 * // Delete selected component when user presses Backspace key
 * // selectedComponentId is set in the circuit store
 * handleKeyDown(keyboardEvent)
 * // Selected component is removed from the circuit board
 *
 * // Ignore keyboard events when user is typing in input fields
 * handleKeyDown(keyboardEvent)
 * // No action is taken, allowing normal text input behavior
 */
function handleKeyDown (event) {
  const targetTagName = event.target.tagName

  if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') {
    return
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    circuit.deleteSelection()
  }
}

function onBoardClick (event) {
  if (circuit.pendingPlacementComponent) {
    // Get click coordinates relative to the board, accounting for border
    const boardEl = event.currentTarget
    const boardRect = boardEl.getBoundingClientRect()
    const style = window.getComputedStyle(boardEl)
    const borderLeft = parseFloat(style.borderLeftWidth)
    const borderTop = parseFloat(style.borderTopWidth)
    let x = event.clientX - boardRect.left - borderLeft
    let y = event.clientY - boardRect.top - borderTop

    // Center the component at the click location
    const comp = circuit.pendingPlacementComponent
    const width = comp.width || 120
    const height = comp.height || 90

    x = x - width / 2
    y = y - height / 2

    circuit.placePendingComponent(x, y)
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('keydown', handleKeyDown)

  // Center the view
  if (circuitBoardWrapper.value) {
    const wrapper = circuitBoardWrapper.value

    wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2
    wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) / 2
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mousemove', pan)
  window.removeEventListener('mouseup', endPan)
})
</script>

<style>
#circuit-board-wrapper {
  width: 100vw;
  height: calc(100vh - 150px - 50px);
  overflow: auto;
  cursor: grab;
}
#circuit-board {
  width: 300vw;
  height: 300vh;
  border: 25px solid rgba(255, 0, 0, 0.5);
  position: relative;
}
#wire-layer {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
