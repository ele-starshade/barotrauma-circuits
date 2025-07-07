import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import pako from 'pako'

import parseColor from '../utils/parseColor.js'
import distanceToLineSegment from '../utils/distanceToLineSegment.js'
import hsvToRgb from '../utils/hsvToRgb.js'

import AdderComponent from '../components/circuit/AdderComponent.vue'
import AndComponent from '../components/circuit/AndComponent.vue'
import ConstantComponent from '../components/circuit/tools/ConstantComponent.vue'
import DisplayComponent from '../components/circuit/tools/DisplayComponent.vue'
import MultiplyComponent from '../components/circuit/MultiplyComponent.vue'
import RandomComponent from '../components/circuit/tools/RandomComponent.vue'
import SubtractComponent from '../components/circuit/SubtractComponent.vue'
import DivideComponent from '../components/circuit/DivideComponent.vue'
import XorComponent from '../components/circuit/XorComponent.vue'
import SignalCheckComponent from '../components/circuit/SignalCheckComponent.vue'
import GreaterComponent from '../components/circuit/GreaterComponent.vue'
import LightComponent from '../components/circuit/tools/LightComponent.vue'
import AbsComponent from '../components/circuit/AbsComponent.vue'
import AcosComponent from '../components/circuit/AcosComponent.vue'
import AsinComponent from '../components/circuit/AsinComponent.vue'
import AtanComponent from '../components/circuit/AtanComponent.vue'
import CeilComponent from '../components/circuit/CeilComponent.vue'
import ColorComponent from '../components/circuit/ColorComponent.vue'
import ConcatenationComponent from '../components/circuit/ConcatenationComponent.vue'
import CosComponent from '../components/circuit/CosComponent.vue'

const componentMap = {
  Adder: AdderComponent,
  And: AndComponent,
  Constant: ConstantComponent,
  Display: DisplayComponent,
  Multiply: MultiplyComponent,
  Random: RandomComponent,
  Subtract: SubtractComponent,
  Divide: DivideComponent,
  Xor: XorComponent,
  SignalCheck: SignalCheckComponent,
  Greater: GreaterComponent,
  Light: LightComponent,
  Abs: AbsComponent,
  Acos: AcosComponent,
  Asin: AsinComponent,
  Atan: AtanComponent,
  Ceil: CeilComponent,
  Color: ColorComponent,
  Concatenation: ConcatenationComponent,
  Cos: CosComponent
}

const toast = useToast()

export const useCircuitStore = defineStore('circuit', {
  state: () => ({
    boardComponents: [],
    wires: [],

    // Interaction states
    wiringInfo: null, // e.g. { startComponentId: '..', startPinName: '..' }
    movingComponentInfo: null, // e.g., { id: 'component-0', offsetX: 20, offsetY: 30 }
    movingWaypointInfo: null, // e.g., { wireId: '..', waypointId: '..', offsetX: .., offsetY: ..}
    ghostComponent: null, // e.g. { is: ..., name: ..., x: ..., y: ..., width: ..., height: ... }
    selectedComponentId: null,
    selectedWireId: null,

    isComponentLimitEnabled: true,
    componentLimit: parseInt(import.meta.env.VITE_COMPONENT_LIMIT) || 64,

    simulationRunning: false,
    simulationIntervalId: null,

    // Counters for unique IDs
    componentIdCounter: 0,
    wireIdCounter: 0,
    waypointIdCounter: 0
  }),

  getters: {
    // We can add getters later if we need to compute derived state
  },

  actions: {
    // --- Selection Actions ---
    /**
     * Selects a component on the circuit board
     * @param {string} componentId - The unique identifier of the component to select
     */
    selectComponent (componentId) {
      this.selectedComponentId = componentId
      this.selectedWireId = null
    },
    /**
     * Selects a wire on the circuit board
     * @param {string} wireId - The unique identifier of the wire to select
     */
    selectWire (wireId) {
      this.selectedWireId = wireId
      this.selectedComponentId = null
    },
    /**
     * Clears the current selection of components and wires on the circuit board
     */
    clearSelection () {
      this.selectedComponentId = null
      this.selectedWireId = null
    },
    /**
     * Deletes the currently selected component or wire from the circuit board
     *
     * If a component is selected, it removes the component and all wires connected to it.
     * If a wire is selected, it removes only that specific wire.
     * After deletion, clears the selection and resets the circuit state.
     *
     * @returns {void}
     */
    deleteSelection () {
      if (this.selectedComponentId) {
        const componentId = this.selectedComponentId

        // Remove component
        this.boardComponents = this.boardComponents.filter(c => c.id !== componentId)
        // Remove connected wires
        this.wires = this.wires.filter(w => w.fromId !== componentId && w.toId !== componentId)
      } else if (this.selectedWireId) {
        // Remove wire
        this.wires = this.wires.filter(w => w.id !== this.selectedWireId)
      }

      this.clearSelection()
      this.resetCircuitState()
    },
    /**
     * Toggles the component limit feature on the circuit board
     *
     * This action switches the component limit between enabled and disabled states.
     * When enabled, the circuit board may enforce restrictions on the number of components
     * that can be placed, depending on the implementation details of the limit feature.
     *
     * @returns {void}
     */
    toggleComponentLimit () {
      this.isComponentLimitEnabled = !this.isComponentLimitEnabled
    },

    // --- Component Actions ---
    /**
     * Initiates the dragging process for a component from the component tray
     *
     * Creates a ghost component that follows the mouse cursor during drag operations.
     * The ghost component maintains the original component's properties including
     * dimensions, settings, values, and tool status. The component is initially
     * positioned off-screen until the drag operation begins.
     *
     * @param {Object} component - The component object to be dragged
     * @param {string} component.is - The component's identifier
     * @param {string} component.name - The component's display name
     * @param {number} component.value - The component's current value (optional)
     * @param {Object} component.settings - The component's configuration settings (optional)
     * @param {boolean} component.isTool - Whether the component is a tool component (optional)
     * @param {Event} event - The mouse event that triggered the drag operation
     * @returns {void}
     */
    startDraggingComponent (component, event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const { is, name, value, settings, isTool } = component

      this.ghostComponent = {
        is,
        name,
        width: rect.width,
        height: rect.height,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        x: -9999, // Initially position off-screen
        y: -9999
      }

      if (value !== undefined) {
        this.ghostComponent.value = value
      }

      if (settings) {
        this.ghostComponent.settings = { ...settings }
      }

      if (isTool) {
        this.ghostComponent.isTool = isTool
      }
    },

    /**
     * Updates the position of the ghost component during drag operations
     *
     * Calculates the new position of the ghost component based on the current mouse
     * position, taking into account the circuit board's position and borders.
     * The component is snapped to a grid system for precise positioning.
     *
     * @param {Event} event - The mouse event containing the current cursor position
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Retrieves the circuit board element and its bounding rectangle
     * - Calculates the board's border offsets for accurate positioning
     * - Determines the mouse position relative to the board
     * - Snaps the ghost component to a 20px grid for alignment
     * - Updates the ghost component's x and y coordinates
     *
     * The function only operates when a ghost component exists and is being
     * dragged. The grid snapping ensures components are placed in consistent
     * positions for better visual organization.
     */
    updateGhostComponentPosition (event) {
      if (!this.ghostComponent) return

      const boardEl = document.getElementById('circuit-board')
      const boardRect = boardEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)

      const gridSize = 20
      const x = event.clientX - boardRect.left - borderLeft
      const y = event.clientY - boardRect.top - borderTop

      this.ghostComponent.x = Math.round((x - this.ghostComponent.width / 2) / gridSize) * gridSize
      this.ghostComponent.y = Math.round((y - this.ghostComponent.height / 2) / gridSize) * gridSize
    },

    /**
     * Adds a new component to the circuit board from the ghost component
     *
     * Creates a new component instance based on the current ghost component
     * and adds it to the board. Performs validation checks for component limits
     * and initializes component-specific properties based on the component type.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that a ghost component exists
     * - Checks component limits for non-tool components
     * - Creates a new component object with basic properties (id, type, position, dimensions)
     * - Copies optional properties like value, settings, and tool status
     * - Initializes component-specific properties based on component type:
     *   - Random: Sets lastExecution and currentOutput
     *   - Light: Sets isOn, color, and lastToggleState
     *   - Math/Logic components: Initializes lastSignalTimestamps
     * - Adds the new component to the boardComponents array
     * - Clears the ghost component after successful addition
     *
     * The function handles different component types with their specific
     * initialization requirements and maintains the component limit system
     * for non-tool components.
     */
    addComponent () {
      if (!this.ghostComponent) return

      const nonToolComponents = this.boardComponents.filter(c => !c.isTool).length

      if (this.isComponentLimitEnabled && !this.ghostComponent.isTool && nonToolComponents >= this.componentLimit) {
        toast.error('Component limit reached. Cannot add more components.')
        this.ghostComponent = null

        return
      }

      const newComponent = {
        id: `component-${this.componentIdCounter++}`,
        is: this.ghostComponent.is,
        name: this.ghostComponent.name,
        x: this.ghostComponent.x,
        y: this.ghostComponent.y,
        width: this.ghostComponent.width,
        height: this.ghostComponent.height
      }

      if (this.ghostComponent.value !== undefined) {
        newComponent.value = this.ghostComponent.value
      }

      if (this.ghostComponent.settings) {
        newComponent.settings = { ...this.ghostComponent.settings }
      }

      if (this.ghostComponent.isTool) {
        newComponent.isTool = this.ghostComponent.isTool
      }

      if (newComponent.name === 'Random') {
        newComponent.lastExecution = 0
        newComponent.currentOutput = 0
      }

      if (newComponent.name === 'Light') {
        newComponent.isOn = newComponent.settings.isOn
        newComponent.color = newComponent.settings.color
        newComponent.lastToggleState = undefined
      }

      if (['Adder', 'Subtract', 'Multiply', 'Divide', 'And', 'Greater'].includes(newComponent.name)) {
        newComponent.lastSignalTimestamps = {}
      }

      if (newComponent.name === 'Abs') {
        // Abs component has no specific state to initialize here
      }

      if (newComponent.name === 'Acos') {
        // Acos component has no specific state to initialize here
      }

      if (newComponent.name === 'Asin') {
        // Asin component has no specific state to initialize here
      }

      if (newComponent.name === 'Atan') {
        // Atan component has no specific state to initialize here
      }

      if (newComponent.name === 'Ceil') {
        // Ceil component has no specific state to initialize here
      }

      if (newComponent.name === 'Color') {
        newComponent.lastSignalTimestamps = {}
      }

      if (newComponent.name === 'Concatenation') {
        newComponent.lastSignalTimestamps = {}
      }

      if (newComponent.name === 'Cos') {
        // Cos component has no specific state to initialize here
      }

      this.boardComponents.push(newComponent)
      this.ghostComponent = null
      this.resetCircuitState()
    },

    /**
     * Adds a new component to the circuit board based on the current ghost component
     *
     * This function creates a new component instance from the ghost component data and adds it to the board.
     * It handles various component-specific initializations such as:
     * - Setting up Random component execution tracking
     * - Configuring Light component state and color
     * - Initializing signal timestamp tracking for mathematical/logical components
     *
     * The function also enforces component limits for non-tool components and validates
     * that the ghost component exists before proceeding.
     *
     * @returns {void}
     *
     * @throws {Error} When ghost component is null or undefined
     *
     * @example
     * // Add a new Constant component
     * circuitStore.addComponent()
     *
     * @description
     * This method is typically called when a user drops a component from the component tray
     * onto the circuit board. It transforms the ghost component (preview) into a permanent
     * component on the board with all necessary properties and state initialized.
     */
    updateComponentValue (componentId, value) {
      const component = this.boardComponents.find(c => c.id === componentId)

      if (component) {
        component.value = value
      }
    },

    /**
     * Updates the value of a specific component on the circuit board
     *
     * This function finds a component by its unique identifier and updates its value property.
     * The value update is typically used for components that need to maintain state or
     * configuration data, such as Constant components or other components with editable values.
     *
     * @param {string} componentId - The unique identifier of the component to update
     * @param {*} value - The new value to assign to the component
     * @returns {void}
     *
     * @example
     * // Update a Constant component's output value
     * circuitStore.updateComponentValue('component-123', 'Hello World')
     *
     * @description
     * This method is commonly used in conjunction with component configuration panels
     * or other UI elements that allow users to modify component properties. The function
     * performs a safe update by first finding the component and then updating its value
     * only if the component exists on the board.
     */
    updateComponentSettings (componentId, settings) {
      const component = this.boardComponents.find(c => c.id === componentId)

      if (component && component.settings) {
        component.settings = { ...component.settings, ...settings }
      }
    },

    // --- Movement Actions ---
    /**
     * Initiates the movement of a component on the circuit board
     *
     * Captures the initial mouse position and component offset when starting to move
     * a component. This function sets up the necessary state for tracking component
     * movement during drag operations.
     *
     * @param {string} componentId - The unique identifier of the component to move
     * @param {Event} event - The mouse event that triggered the movement
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Finds the component element in the DOM using the component ID
     * - Calculates the offset between the mouse position and component position
     * - Stores the movement information in the store state for tracking
     * - Clears any existing waypoint movement state
     *
     * The function is typically called on mousedown events when a user starts
     * dragging a component on the circuit board.
     *
     * @example
     * // Start moving a component
     * circuitStore.startMove('component-123', mouseEvent)
     */
    startMove (componentId, event) {
      const componentEl = document.querySelector(`[data-id="${componentId}"]`)

      if (componentEl) {
        const rect = componentEl.getBoundingClientRect()

        this.movingComponentInfo = {
          id: componentId,
          offsetX: event.clientX - rect.left,
          offsetY: event.clientY - rect.top
        }
        this.movingWaypointInfo = null
      }
    },

    /**
     * Updates the position of a component during movement on the circuit board
     *
     * Calculates and applies the new position of a component based on the current
     * mouse position, taking into account the component's offset and grid snapping.
     * Updates the component's position and refreshes connected wires to maintain
     * proper visual connections.
     *
     * @param {Event} event - The mouse event containing the current cursor position
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that a component is currently being moved
     * - Finds the component in the board components array
     * - Calculates the board's border offsets for accurate positioning
     * - Determines the mouse position relative to the circuit board
     * - Snaps the component to a 20px grid for consistent alignment
     * - Updates the component's x and y coordinates
     * - Refreshes all wires connected to the moved component
     *
     * The function only operates when a component movement is in progress
     * (movingComponentInfo exists). Grid snapping ensures components are
     * positioned consistently for better visual organization.
     *
     * @example
     * // Update component position during drag
     * circuitStore.updateMove(mouseEvent)
     */
    updateMove (event) {
      if (!this.movingComponentInfo) return

      const component = this.boardComponents.find(c => c.id === this.movingComponentInfo.id)

      if (!component) return

      const boardEl = document.getElementById('circuit-board')
      const boardRect = boardEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)
      const gridSize = 20

      const mouseXOnBoard = event.clientX - boardRect.left - borderLeft
      const mouseYOnBoard = event.clientY - boardRect.top - borderTop

      component.x = Math.round((mouseXOnBoard - this.movingComponentInfo.offsetX) / gridSize) * gridSize
      component.y = Math.round((mouseYOnBoard - this.movingComponentInfo.offsetY) / gridSize) * gridSize

      this.updateConnectedWires(component.id)
    },

    /**
     * Ends the component movement operation
     *
     * Clears the movingComponentInfo state to indicate that no component
     * is currently being moved. This function is called when the mouse
     * button is released after dragging a component.
     *
     * @returns {void}
     *
     * @description
     * This function performs a simple state cleanup operation:
     * - Sets movingComponentInfo to null, effectively ending the move operation
     * - Allows the component to be selected and moved again in future operations
     *
     * The function is typically called in response to mouseup events
     * after a successful component drag operation.
     *
     * @example
     * // End component movement when mouse is released
     * circuitStore.endMove()
     */
    endMove () {
      this.movingComponentInfo = null
    },

    /**
     * Initiates the movement of a waypoint on a wire
     *
     * Sets up the state for dragging a waypoint by calculating the offset between
     * the mouse position and the waypoint position. This allows for smooth dragging
     * of wire waypoints while maintaining their relative position to the cursor.
     *
     * @param {string} wireId - The unique identifier of the wire containing the waypoint
     * @param {string} waypointId - The unique identifier of the waypoint to move
     * @param {Event} event - The mouse event that triggered the waypoint movement
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Locates the specified wire and waypoint in the circuit
     * - Calculates the board's border offsets for accurate positioning
     * - Determines the mouse position relative to the circuit board
     * - Computes the offset between the mouse and waypoint positions
     * - Stores the movement information in movingWaypointInfo state
     * - Clears any existing component movement state
     *
     * The function is typically called in response to mousedown events
     * on wire waypoints to initiate drag operations.
     *
     * @example
     * // Start moving a waypoint when mouse is pressed on it
     * circuitStore.startMoveWaypoint('wire-1', 'waypoint-2', mouseEvent)
     */
    startMoveWaypoint (wireId, waypointId, event) {
      const wire = this.wires.find(w => w.id === wireId)

      if (!wire) return

      const waypoint = wire.waypoints.find(wp => wp.id === waypointId)

      if (!waypoint) return

      const boardEl = document.getElementById('circuit-board')
      const boardRect = boardEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)

      const mousePosOnBoardX = event.clientX - boardRect.left - borderLeft
      const mousePosOnBoardY = event.clientY - boardRect.top - borderTop

      this.movingWaypointInfo = {
        wireId,
        waypointId,
        offsetX: mousePosOnBoardX - waypoint.x,
        offsetY: mousePosOnBoardY - waypoint.y
      }
      this.movingComponentInfo = null
    },

    /**
     * Updates the position of a wire waypoint during drag operations
     *
     * Calculates the new position of a waypoint based on the current mouse position,
     * taking into account the circuit board's position and borders. The waypoint
     * is snapped to a grid system for precise positioning.
     *
     * @param {Event} event - The mouse event containing the current cursor position
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that waypoint movement is currently in progress
     * - Locates the specified wire and waypoint in the circuit
     * - Calculates the board's border offsets for accurate positioning
     * - Determines the mouse position relative to the board
     * - Applies the stored offset to maintain relative positioning
     * - Snaps the waypoint to a 20px grid for alignment
     * - Updates the waypoint's x and y coordinates
     *
     * The function only operates when movingWaypointInfo state is active,
     * indicating an ongoing waypoint drag operation. The grid snapping ensures
     * waypoints are positioned consistently for better visual organization.
     *
     * @example
     * // Update waypoint position during mouse movement
     * circuitStore.updateMoveWaypoint(mouseEvent)
     */
    updateMoveWaypoint (event) {
      if (!this.movingWaypointInfo) return

      const { wireId, waypointId, offsetX, offsetY } = this.movingWaypointInfo
      const wire = this.wires.find(w => w.id === wireId)

      if (!wire) return

      const waypoint = wire.waypoints.find(wp => wp.id === waypointId)

      if (!waypoint) return

      const boardEl = document.getElementById('circuit-board')
      const boardRect = boardEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)
      const gridSize = 20

      const mouseXOnBoard = event.clientX - boardRect.left - borderLeft
      const mouseYOnBoard = event.clientY - boardRect.top - borderTop

      const newX = mouseXOnBoard - offsetX
      const newY = mouseYOnBoard - offsetY

      waypoint.x = Math.round(newX / gridSize) * gridSize
      waypoint.y = Math.round(newY / gridSize) * gridSize
    },

    /**
     * Ends the waypoint movement operation and cleans up the movement state
     *
     * Resets the movingWaypointInfo state to null, effectively terminating
     * any ongoing waypoint drag operation. This function is typically called
     * when the user releases the mouse button after dragging a waypoint.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Clears the movingWaypointInfo state object
     * - Terminates the waypoint movement tracking
     * - Allows the circuit to return to its normal interaction state
     *
     * The function is designed to be called as part of the mouse event handling
     * sequence, specifically when the mouse button is released after dragging
     * a waypoint. It ensures clean state management and prevents any lingering
     * movement tracking.
     *
     * @example
     * // End waypoint movement when mouse button is released
     * circuitStore.endMoveWaypoint()
     */
    endMoveWaypoint () {
      this.movingWaypointInfo = null
    },

    // --- Wiring Actions ---
    /**
     * Initiates the wiring process between component pins
     *
     * Sets up the initial state for creating a wire connection between two component pins.
     * Clears any existing component or waypoint movement states and initializes the
     * wiring information with the starting component and pin details.
     *
     * @param {string} componentId - The unique identifier of the component containing the starting pin
     * @param {string} pinName - The name of the pin where the wire connection begins
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Clears any ongoing component movement operations
     * - Clears any ongoing waypoint movement operations
     * - Initializes the wiringInfo state object with:
     *   - startComponentId: The ID of the component where wiring begins
     *   - startPinName: The name of the pin where wiring begins
     *   - tempWire: Initially set to null, will be created during updateWiring
     *
     * The function prepares the circuit for wire creation by establishing the
     * starting point of the connection. The actual wire visualization and
     * connection completion are handled by updateWiring and endWiring functions.
     *
     * @example
     * // Start wiring from a component's output pin
     * circuitStore.startWiring('component-1', 'VALUE_OUT')
     *
     * // Start wiring from a component's input pin
     * circuitStore.startWiring('component-2', 'SIGNAL_IN')
     */
    startWiring (componentId, pinName) {
      this.movingComponentInfo = null
      this.movingWaypointInfo = null
      this.wiringInfo = {
        startComponentId: componentId,
        startPinName: pinName,
        tempWire: null
      }
    },

    /**
     * Updates the temporary wire visualization during the wiring process
     *
     * Creates and updates a temporary wire that follows the mouse cursor during
     * wire creation. The wire starts from the selected pin and extends to the
     * current mouse position, providing real-time visual feedback for wire placement.
     *
     * @param {Event} event - The mouse event containing the current cursor position
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that wiring is in progress by checking wiringInfo state
     * - Creates a temporary wire object if one doesn't exist, starting from the
     *   selected pin's position
     * - Calculates the board's border offsets for accurate positioning
     * - Updates the temporary wire's end point to follow the mouse cursor
     * - Provides real-time visual feedback during wire creation
     *
     * The function ensures the temporary wire accurately represents the potential
     * connection path from the starting pin to the current mouse position, allowing
     * users to see exactly where the wire will be placed before completing the
     * connection.
     *
     * @example
     * // Update wire visualization as mouse moves
     * document.addEventListener('mousemove', (event) => {
     *   circuitStore.updateWiring(event)
     * })
     */
    updateWiring (event) {
      if (!this.wiringInfo) return

      if (!this.wiringInfo.tempWire) {
        const startCircleEl = document.querySelector(`#${this.wiringInfo.startComponentId} [data-pin-name="${this.wiringInfo.startPinName}"] .pin-circle`)

        if (!startCircleEl) return

        const startPos = this.getPinPosition(startCircleEl)

        this.wiringInfo.tempWire = { x1: startPos.x, y1: startPos.y, x2: startPos.x, y2: startPos.y }
      }

      const boardEl = document.getElementById('circuit-board')
      const boardRect = boardEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)

      this.wiringInfo.tempWire.x2 = event.clientX - boardRect.left - borderLeft
      this.wiringInfo.tempWire.y2 = event.clientY - boardRect.top - borderTop
    },

    /**
     * Completes the wire creation process by connecting the temporary wire to a target pin
     *
     * Validates the connection between output and input pins, creates a permanent wire
     * object, and adds it to the circuit board. Handles various validation scenarios
     * including pin type compatibility, existing connections, and signal pin constraints.
     *
     * @param {Element|null} endCircleEl - The target pin circle element to connect to, or null if no valid target
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that wiring is in progress and a temporary wire exists
     * - Determines the direction of the connection (output to input)
     * - Validates pin compatibility (output pins can only connect to input pins)
     * - Checks for existing connections on signal input pins to prevent conflicts
     * - Creates a permanent wire object with calculated positions and metadata
     * - Adds the wire to the circuit board's wire collection
     * - Cleans up the temporary wiring state
     *
     * The function ensures proper circuit connectivity by enforcing pin type rules
     * and preventing duplicate connections on signal input pins. It creates a
     * permanent wire object that includes positioning data and connection metadata
     * for the simulation system.
     *
     * @example
     * // Complete wire creation when mouse is released on a valid pin
     * pinElement.addEventListener('mouseup', (event) => {
     *   circuitStore.endWiring(event.target)
     * })
     */
    endWiring (endCircleEl) {
      if (!this.wiringInfo || !this.wiringInfo.tempWire) {
        this.wiringInfo = null

        return
      }

      const startPinEl = document.querySelector(`#${this.wiringInfo.startComponentId} [data-pin-name="${this.wiringInfo.startPinName}"]`)
      const endPinEl = endCircleEl ? endCircleEl.closest('.component-pin') : null

      const startIsOut = startPinEl.classList.contains('out')
      const endIsOut = endPinEl ? endPinEl.classList.contains('out') : false

      if (startIsOut !== endIsOut) {
        const outPinEl = startIsOut ? startPinEl : endPinEl
        const inPinEl = !startIsOut ? startPinEl : endPinEl

        // Ensure both pins exist before proceeding
        if (!outPinEl || !inPinEl) {
          this.wiringInfo = null

          return
        }

        const toId = inPinEl.closest('.component').dataset.id
        const toPin = inPinEl.dataset.pinName

        const isSignalInPin = toPin.startsWith('SIGNAL_IN')

        if (isSignalInPin) {
          const isInputPinOccupied = this.wires.some(w => w.toId === toId && w.toPin === toPin)

          if (isInputPinOccupied) {
            toast.error('Input pin is already connected.')
            this.wiringInfo = null

            return
          }
        }

        const outCircleEl = outPinEl.querySelector('.pin-circle')
        const inCircleEl = inPinEl.querySelector('.pin-circle')

        const outPos = this.getPinPosition(outCircleEl)
        const inPos = this.getPinPosition(inCircleEl)

        this.wires.push({
          id: `wire-${this.wireIdCounter++}`,
          fromId: outPinEl.closest('.component').dataset.id,
          fromPin: outPinEl.dataset.pinName,
          toId: inPinEl.closest('.component').dataset.id,
          toPin: inPinEl.dataset.pinName,
          x1: outPos.x,
          y1: outPos.y,
          x2: inPos.x,
          y2: inPos.y,
          waypoints: []
        })
        this.resetCircuitState()
      }

      this.wiringInfo = null
    },

    /**
     * Adds a waypoint to the currently selected wire at the specified mouse position
     *
     * Calculates the closest line segment on the selected wire and inserts a new waypoint
     * at the mouse position. The waypoint is positioned between the two closest path points
     * to maintain the wire's visual structure.
     *
     * @param {Event} event - The mouse event containing the cursor position
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that a wire is currently selected
     * - Locates the selected wire in the wires array
     * - Calculates the board's border offsets for accurate positioning
     * - Determines the mouse position relative to the circuit board
     * - Creates a path array including start point, waypoints, and end point
     * - Finds the closest line segment to the mouse position
     * - Inserts a new waypoint at the mouse position in the closest segment
     *
     * The function only operates when a wire is selected (selectedWireId exists).
     * The new waypoint is assigned a unique identifier and inserted at the optimal
     * position to maintain the wire's visual flow.
     *
     * @example
     * // Add a waypoint to the selected wire at mouse position
     * circuitStore.addWaypointToSelectedWire(mouseEvent)
     */
    addWaypointToSelectedWire (event) {
      if (!this.selectedWireId) return

      const wire = this.wires.find(w => w.id === this.selectedWireId)

      if (!wire) return

      const boardEl = document.getElementById('circuit-board')
      const boardRect = boardEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)

      const x = event.clientX - boardRect.left - borderLeft
      const y = event.clientY - boardRect.top - borderTop

      const pathPoints = [{ x: wire.x1, y: wire.y1 }, ...wire.waypoints, { x: wire.x2, y: wire.y2 }]

      let closestSegmentIndex = -1
      let minDistance = Infinity

      for (let i = 0; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i]
        const p2 = pathPoints[i + 1]
        const dist = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y)

        if (dist < minDistance) {
          minDistance = dist
          closestSegmentIndex = i
        }
      }

      if (closestSegmentIndex !== -1) {
        wire.waypoints.splice(closestSegmentIndex, 0, {
          id: `waypoint-${this.waypointIdCounter++}`,
          x,
          y
        })
      }
    },

    // --- Helper / Utility Actions ---
    /**
     * Retrieves the position of a pin element relative to the circuit board
     *
     * Calculates the absolute position of a pin circle element within the circuit
     * board coordinate system, taking into account the board's position and borders.
     * This function is essential for accurately positioning wires and maintaining
     * proper connections between components.
     *
     * @param {HTMLElement} circleEl - The pin circle element to get the position for
     * @returns {Object} An object containing the x and y coordinates relative to the circuit board
     * @returns {number} returns.x - The x coordinate of the pin center
     * @returns {number} returns.y - The y coordinate of the pin center
     *
     * @description
     * This function performs the following operations:
     * - Validates that the circle element exists
     * - Retrieves the circuit board element and its bounding rectangle
     * - Gets the pin circle's bounding rectangle
     * - Calculates the board's border offsets for accurate positioning
     * - Computes the pin's center position relative to the board
     * - Returns the calculated coordinates as an object
     *
     * If the circle element or board element is not found, the function returns
     * default coordinates (0, 0) to prevent errors in the calling code.
     *
     * @example
     * // Get the position of a pin circle element
     * const pinEl = document.querySelector('.pin-circle')
     * const position = circuitStore.getPinPosition(pinEl)
     * console.log(`Pin position: ${position.x}, ${position.y}`)
     */
    getPinPosition (circleEl) {
      if (!circleEl) return { x: 0, y: 0 }

      const boardEl = document.getElementById('circuit-board')

      if (!boardEl) return { x: 0, y: 0 }

      const boardRect = boardEl.getBoundingClientRect()
      const circleRect = circleEl.getBoundingClientRect()
      const style = window.getComputedStyle(boardEl)
      const borderLeft = parseFloat(style.borderLeftWidth)
      const borderTop = parseFloat(style.borderTopWidth)

      const x = circleRect.left - boardRect.left - borderLeft + (circleRect.width / 2)
      const y = circleRect.top - boardRect.top - borderTop + (circleRect.height / 2)

      return { x, y }
    },

    /**
     * Updates the positions of all wires connected to a specific component
     *
     * Recalculates and updates the start and end positions of wires that are
     * connected to the specified component. This ensures that wire connections
     * remain visually accurate when components are moved or repositioned.
     *
     * @param {string} componentId - The unique identifier of the component whose connected wires should be updated
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Iterates through all wires in the circuit
     * - Identifies wires that are connected to the specified component (either as source or destination)
     * - For each connected wire, locates the corresponding pin element in the DOM
     * - Retrieves the pin's circle element and calculates its current position
     * - Updates the wire's start coordinates (x1, y1) for source connections
     * - Updates the wire's end coordinates (x2, y2) for destination connections
     *
     * The function uses DOM queries to find pin elements based on component ID and pin name,
     * then leverages the getPinPosition method to calculate accurate pin coordinates.
     * This ensures that wire connections remain visually connected to the correct
     * pin positions even after component movement or repositioning.
     *
     * @example
     * // Update wire positions after moving a component
     * circuitStore.updateConnectedWires('component-123')
     */
    updateConnectedWires (componentId) {
      this.wires.forEach(wire => {
        if (wire.fromId === componentId) {
          const pinEl = document.querySelector(`[data-id="${wire.fromId}"] [data-pin-name="${wire.fromPin}"]`)

          if (pinEl) {
            const circleEl = pinEl.querySelector('.pin-circle')
            const pos = this.getPinPosition(circleEl)

            wire.x1 = pos.x
            wire.y1 = pos.y
          }
        }

        if (wire.toId === componentId) {
          const pinEl = document.querySelector(`[data-id="${wire.toId}"] [data-pin-name="${wire.toPin}"]`)

          if (pinEl) {
            const circleEl = pinEl.querySelector('.pin-circle')
            const pos = this.getPinPosition(circleEl)

            wire.x2 = pos.x
            wire.y2 = pos.y
          }
        }
      })
    },

    // --- Simulation ---
    /**
     * Resets the circuit state to its initial configuration
     *
     * Clears all wire values, component inputs, and volatile state data to prepare
     * the circuit for a fresh simulation run. This function ensures that all
     * components start from a clean state and removes any accumulated data from
     * previous simulation cycles.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Clears all wire values by removing the 'value' property from each wire
     * - Resets component inputs by clearing the 'inputs' object for each component
     * - Removes signal timestamps to reset component timing state
     * - Resets Random components by clearing last execution time and current output
     * - Clears Display component values to show empty state
     * - Resets Light components to their initial settings (on/off state and color)
     * - Forces an immediate simulation tick if the simulation is currently running
     *
     * The function is typically called when:
     * - A component is deleted from the circuit
     * - The user wants to reset the simulation state
     * - The circuit needs to be cleared for a new simulation run
     *
     * @example
     * // Reset circuit state after deleting a component
     * circuitStore.resetCircuitState()
     *
     * // Reset circuit state before starting a new simulation
     * circuitStore.resetCircuitState()
     * circuitStore.startSimulation()
     */
    resetCircuitState () {
      // Clear wire values
      this.wires.forEach(wire => {
        delete wire.value
      })

      // Clear component inputs and volatile state
      this.boardComponents.forEach(component => {
        if (component.inputs) {
          component.inputs = {}
        }

        if (component.lastSignalTimestamps) {
          component.lastSignalTimestamps = {}
        }

        if (component.name === 'Random') {
          component.lastExecution = 0
          component.currentOutput = 0
        }

        if (component.name === 'Display') {
          component.value = null
        }

        if (component.name === 'Light') {
          component.isOn = component.settings.isOn
          component.color = component.settings.color
          component.lastToggleState = undefined
        }
      })

      // If the simulation is running, force an immediate recalculation.
      if (this.simulationRunning) {
        this.tick()
      }
    },

    /**
     * Starts the circuit simulation
     *
     * Initiates a continuous simulation loop that updates the circuit state
     * at regular intervals. The simulation runs every 100ms and continues
     * until explicitly stopped. If the simulation is already running,
     * this function does nothing.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Checks if the simulation is already running to prevent duplicate starts
     * - Sets the simulationRunning flag to true
     * - Creates an interval that calls the tick() function every 100ms
     * - Stores the interval ID for later cleanup
     *
     * The simulation will continue running until stopSimulation() is called
     * or the component is unmounted. The tick() function handles all the
     * circuit logic updates including signal propagation and component
     * state changes.
     *
     * @example
     * // Start the circuit simulation
     * circuitStore.startSimulation()
     *
     * // The simulation will now run continuously until stopped
     * // circuitStore.stopSimulation()
     */
    startSimulation () {
      if (this.simulationRunning) return

      this.simulationRunning = true
      this.simulationIntervalId = setInterval(() => {
        this.tick()
      }, 100)
    },

    /**
     * Stops the circuit simulation
     *
     * Terminates the running simulation loop and cleans up associated resources.
     * If no simulation is currently running, this function does nothing.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Checks if the simulation is currently running
     * - Sets the simulationRunning flag to false
     * - Clears the simulation interval to stop the tick loop
     * - Resets the simulationIntervalId to null
     * - Removes all wire values to clean up the circuit state
     *
     * After calling this function, the circuit will no longer update automatically
     * and all wire values will be cleared. The circuit can be restarted by calling
     * startSimulation() again.
     *
     * @example
     * // Stop the circuit simulation
     * circuitStore.stopSimulation()
     *
     * // The simulation is now stopped and wire values are cleared
     * // circuitStore.startSimulation() // Restart if needed
     */
    stopSimulation () {
      if (!this.simulationRunning) return

      this.simulationRunning = false
      clearInterval(this.simulationIntervalId)
      this.simulationIntervalId = null
      this.wires.forEach(wire => {
        delete wire.value
      })
    },

    /**
     * Executes a single simulation tick for the circuit
     *
     * Processes the circuit simulation by updating component states and propagating
     * signals through the circuit until stability is reached. This function handles
     * both value-generating components (like Random) and signal-processing components
     * (like Adder, And, etc.) in a multi-stage approach.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations in sequence:
     *
     * Stage 1 - Component State Updates:
     * - Updates internal state of components that generate values (e.g., Random)
     * - Handles timing-based value generation for components with periods
     * - Maintains execution timestamps to control update frequency
     *
     * Stage 2 - Signal Propagation:
     * - Iteratively processes all components until circuit stability is achieved
     * - Uses a maximum iteration limit to prevent infinite loops
     * - Tracks output values for each component to detect changes
     * - Calls component-specific processing methods for different component types
     * - Continues until no further changes occur in the circuit state
     *
     * The function supports various component types including:
     * - Constant: Provides fixed output values
     * - Random: Generates random values based on configured period and range
     * - Adder: Adds two input signals
     * - And: Performs logical AND operation
     * - Subtract: Subtracts input signals
     * - Multiply: Multiplies input signals
     * - Divide: Divides input signals
     * - Xor: Performs logical XOR operation
     * - SignalCheck: Validates signal values
     * - Greater: Compares input signals
     *
     * @example
     * // Execute a single simulation tick
     * circuitStore.tick()
     *
     * // The circuit state has been updated and signals propagated
     * // This is typically called automatically by startSimulation()
     */
    tick () {
      // Stage 1: Update internal state of components that generate values.
      this.boardComponents.forEach(component => {
        if (component.name === 'Random') {
          const now = Date.now()

          if (now - (component.lastExecution || 0) >= component.settings.period) {
            const min = component.settings.min
            const max = component.settings.max
            const randomValue = Math.floor(Math.random() * (max - min + 1)) + min

            component.currentOutput = randomValue
            component.lastExecution = now
          }
        }
      })

      // Stage 2: Iteratively propagate signals until the circuit is stable.
      const MAX_ITERATIONS = this.boardComponents.length + 5 // Generous limit to prevent infinite loops
      let iterations = 0
      let changedInLoop = true
      const outputValues = new Map()

      while (iterations < MAX_ITERATIONS && changedInLoop) {
        changedInLoop = false

        // First, determine the output of each component based on its current inputs.
        this.boardComponents.forEach(component => {
          const outputPin = (component.name === 'Adder' || component.name === 'And' || component.name === 'Subtract' || component.name === 'Multiply' || component.name === 'Divide' || component.name === 'Xor' || component.name === 'SignalCheck' || component.name === 'Greater' || component.name === 'Abs' || component.name === 'Acos' || component.name === 'Asin' || component.name === 'Atan' || component.name === 'Ceil' || component.name === 'Color' || component.name === 'Concatenation' || component.name === 'Cos') ? 'SIGNAL_OUT' : 'VALUE_OUT'
          const key = `${component.id}:${outputPin}`
          const currentValue = outputValues.get(key)
          let newValue

          switch (component.name) {
            case 'Constant': newValue = this._processConstantTick(component); break
            case 'Random': newValue = this._processRandomTick(component); break
            case 'Adder': newValue = this._processAdderTick(component); break
            case 'And': newValue = this._processAndTick(component); break
            case 'Subtract': newValue = this._processSubtractTick(component); break
            case 'Multiply': newValue = this._processMultiplyTick(component); break
            case 'Divide': newValue = this._processDivideTick(component); break
            case 'Xor': newValue = this._processXorTick(component); break
            case 'SignalCheck': newValue = this._processSignalCheckTick(component); break
            case 'Greater': newValue = this._processGreaterTick(component); break
            case 'Abs': newValue = this._processAbsTick(component); break
            case 'Acos': newValue = this._processAcosTick(component); break
            case 'Asin': newValue = this._processAsinTick(component); break
            case 'Atan': newValue = this._processAtanTick(component); break
            case 'Ceil': newValue = this._processCeilTick(component); break
            case 'Color': newValue = this._processColorTick(component); break
            case 'Concatenation': newValue = this._processConcatenationTick(component); break
            case 'Cos': newValue = this._processCosTick(component); break
          }

          if (newValue !== undefined && currentValue !== newValue) {
            outputValues.set(key, newValue)
            changedInLoop = true
          }
        })

        // Handle components that don't produce output but change state (e.g., Light)
        this.boardComponents.forEach(component => {
          if (component.name === 'Light') {
            const { inputs, settings } = component
            let newIsOn = component.isOn
            let newColor = component.color

            // Handle state inputs
            const setState = inputs?.SET_STATE
            const toggleState = inputs?.TOGGLE_STATE

            if (setState !== undefined) {
              // eslint-disable-next-line eqeqeq
              newIsOn = setState != 0
            } else if (toggleState !== undefined) {
              if (toggleState !== component.lastToggleState) {
                // eslint-disable-next-line eqeqeq
                if (toggleState != 0) {
                  newIsOn = !component.isOn
                }
              }
            } else {
              // Not wired for state, use settings
              newIsOn = settings.isOn
            }

            component.lastToggleState = toggleState

            // Handle SET_COLOR
            const setColor = inputs?.SET_COLOR

            if (setColor !== undefined) {
              const parsed = parseColor(setColor)

              if (parsed) {
                newColor = parsed
              }
            } else {
              // If not overridden by a wire, use the component's own setting
              newColor = settings.color
            }

            // Update component state if changed
            if (newIsOn !== component.isOn) {
              component.isOn = newIsOn
              changedInLoop = true
            }

            if (newColor !== component.color) {
              component.color = newColor
              changedInLoop = true
            }
          }
        })

        // Then, propagate all known outputs through wires to update component inputs.
        this.wires.forEach(wire => {
          const fromKey = `${wire.fromId}:${wire.fromPin}`

          if (outputValues.has(fromKey)) {
            const value = outputValues.get(fromKey)
            const toComponent = this.boardComponents.find(c => c.id === wire.toId)

            if (toComponent) {
              if (!toComponent.inputs) toComponent.inputs = {}

              const isSignalIn = wire.toPin.startsWith('SIGNAL_IN')

              if (isSignalIn) {
                if (toComponent.inputs[wire.toPin] !== value) {
                  toComponent.inputs[wire.toPin] = value
                  changedInLoop = true // Input changed, may cause downstream changes.
                }
              } else {
                // For non-signal pins, we allow multiple connections,
                // but only the last signal received should be processed.
                // We'll handle this by assigning the value directly,
                // and the order of processing will determine the final value.
                toComponent.inputs[wire.toPin] = value
                changedInLoop = true
              }

              if (toComponent.name === 'Adder' || toComponent.name === 'And' || toComponent.name === 'Subtract' || toComponent.name === 'Multiply' || toComponent.name === 'Divide' || toComponent.name === 'Xor' || toComponent.name === 'Greater' || toComponent.name === 'Concatenation') {
                if (!toComponent.lastSignalTimestamps) toComponent.lastSignalTimestamps = {}

                if ((toComponent.name === 'And' || toComponent.name === 'Greater' || toComponent.name === 'Xor') && wire.toPin === 'SET_OUTPUT') {
                  // Do nothing here, the value is read directly from inputs in the simulation tick
                } else {
                  toComponent.lastSignalTimestamps[wire.toPin] = Date.now()
                }
              }
            }
          }
        })

        iterations++
      }

      // Stage 3: Finalize state for rendering.
      this.wires.forEach(wire => {
        const fromKey = `${wire.fromId}:${wire.fromPin}`

        if (outputValues.has(fromKey)) {
          wire.value = outputValues.get(fromKey)
        } else {
          delete wire.value
        }
      })

      this.boardComponents.forEach(component => {
        if (component.name === 'Display') {
          component.value = component.inputs?.SIGNAL_IN_1 ?? null
        }
      })
    },

    /**
     * Processes a single simulation tick for the Constant component
     *
     * Returns the constant value configured for this component. The Constant
     * component maintains a fixed output value that doesn't change during
     * simulation, making it useful for providing static signals to other
     * components in the circuit.
     *
     * @param {Object} component - The Constant component to process
     * @param {string} component.id - The unique identifier of the component
     * @param {string} component.name - The component type name ('Constant')
     * @param {string|number} component.value - The constant value to output
     * @returns {string|number} The constant value that should be output by this component
     *
     * @description
     * This function is called during each simulation tick to determine the
     * output value of a Constant component. Unlike other components that
     * process inputs or generate dynamic values, the Constant component
     * simply returns its configured value unchanged.
     *
     * The returned value will be propagated to any components connected
     * to this Constant component's output pin.
     *
     * @example
     * // Process a Constant component with value "5"
     * const component = { id: 'const-1', name: 'Constant', value: '5' }
     * const output = circuitStore._processConstantTick(component)
     * console.log(output) // "5"
     */
    _processConstantTick (component) {
      return component.value
    },

    /**
     * Processes a single simulation tick for the Random component
     *
     * Returns the current random output value generated by this component. The Random
     * component generates new values at specified intervals based on its configuration,
     * and this function returns the most recently generated value during simulation.
     *
     * @param {Object} component - The Random component to process
     * @param {string} component.id - The unique identifier of the component
     * @param {string} component.name - The component type name ('Random')
     * @param {number} component.currentOutput - The most recently generated random value
     * @param {Object} component.settings - The component's configuration settings
     * @param {number} component.settings.min - The minimum value for random generation
     * @param {number} component.settings.max - The maximum value for random generation
     * @param {number} component.settings.period - The time interval between value generations in milliseconds
     * @param {number} component.lastExecution - The timestamp of the last value generation
     * @returns {number} The current random output value that should be output by this component
     *
     * @description
     * This function is called during each simulation tick to determine the
     * output value of a Random component. The Random component generates new
     * values at specified intervals (controlled by the period setting), and
     * this function returns the most recently generated value.
     *
     * The actual value generation occurs in the main tick() function, which
     * updates the component's currentOutput property when the period has elapsed.
     * This function simply returns that pre-calculated value for signal propagation.
     *
     * The returned value will be propagated to any components connected
     * to this Random component's output pin.
     *
     * @example
     * // Process a Random component with current output value 42
     * const component = {
     *   id: 'random-1',
     *   name: 'Random',
     *   currentOutput: 42,
     *   settings: { min: 1, max: 100, period: 1000 },
     *   lastExecution: 1640995200000
     * }
     * const output = circuitStore._processRandomTick(component)
     * console.log(output) // 42
     */
    _processRandomTick (component) {
      return component.currentOutput
    },

    /**
     * Processes a single simulation tick for the Subtract component
     *
     * Performs subtraction of two input signals and returns the result. The component
     * subtracts the second input from the first input, with optional clamping and
     * timeframe validation to ensure signal synchronization.
     *
     * @param {Object} component - The Subtract component to process
     * @param {string} component.id - The unique identifier of the component
     * @param {string} component.name - The component type name ('Subtract')
     * @param {Object} component.inputs - The current input values for the component
     * @param {number|string} component.inputs.SIGNAL_IN_1 - The first input signal (minuend)
     * @param {number|string} component.inputs.SIGNAL_IN_2 - The second input signal (subtrahend)
     * @param {Object} component.lastSignalTimestamps - Timestamps of when each input was last received
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of the first input signal
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of the second input signal
     * @param {Object} component.settings - The component's configuration settings
     * @param {number} component.settings.timeframe - Maximum time difference allowed between input signals (0.0 = no limit)
     * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
     * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
     * @returns {number|undefined} The result of subtracting SIGNAL_IN_2 from SIGNAL_IN_1, or undefined if inputs are invalid
     *
     * @description
     * This function processes a Subtract component during each simulation tick. It performs
     * the following operations:
     *
     * 1. Validates that both input signals are present and have valid timestamps
     * 2. Checks if the time difference between input signals is within the configured timeframe
     * 3. Converts input values to numbers (defaulting to 0 for invalid values)
     * 4. Performs the subtraction operation (SIGNAL_IN_1 - SIGNAL_IN_2)
     * 5. Applies optional clamping to keep the result within specified bounds
     * 6. Returns the calculated result for signal propagation
     *
     * The function ensures signal synchronization by validating timestamps and timeframes,
     * preventing processing of stale or mismatched input signals. If the timeframe is set
     * to 0.0, no time validation is performed.
     *
     * The returned value will be propagated to any components connected to this
     * Subtract component's output pin.
     *
     * @example
     * // Process a Subtract component with inputs 10 and 3
     * const component = {
     *   id: 'subtract-1',
     *   name: 'Subtract',
     *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
     *   settings: { timeframe: 100, clampMin: 0, clampMax: 100 }
     * }
     * const result = circuitStore._processSubtractTick(component)
     * console.log(result) // 7
     */
    _processAdderTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

      if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          const num1 = parseFloat(in1) || 0
          const num2 = parseFloat(in2) || 0
          let sum = num1 + num2

          if (settings.clampMax !== undefined) sum = Math.min(sum, settings.clampMax)

          if (settings.clampMin !== undefined) sum = Math.max(sum, settings.clampMin)

          return sum
        }
      }
    },

    /**
     * Processes a single tick for an And component during circuit simulation
     *
     * Evaluates logical AND operation between two input signals with configurable
     * output values and timing constraints. The component outputs different values
     * based on whether both inputs are truthy (non-zero, non-empty, non-undefined)
     * within a specified timeframe.
     *
     * @param {Object} component - The And component to process
     * @param {Object} component.inputs - The input signal values
     * @param {*} component.inputs.SIGNAL_IN_1 - First input signal value
     * @param {*} component.inputs.SIGNAL_IN_2 - Second input signal value
     * @param {Object} component.lastSignalTimestamps - Timestamps of last signal updates
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of first input signal
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of second input signal
     * @param {Object} component.settings - Component configuration settings
     * @param {number} component.settings.timeframe - Maximum time difference allowed between signals (0.0 = no limit)
     * @param {string} component.settings.output - Output value when both inputs are truthy
     * @param {string} component.settings.falseOutput - Output value when condition is not met
     * @param {number} component.settings.maxOutputLength - Maximum length of output string
     * @returns {string} The output value based on logical AND evaluation, or empty string if condition not met
     *
     * @description
     * This function performs the following operations:
     * 1. Validates that input signals have valid timestamps
     * 2. Checks if the time difference between input signals is within the configured timeframe
     * 3. Evaluates whether both inputs are truthy (non-zero, non-empty, non-undefined)
     * 4. Returns the configured output value if both inputs are truthy within timeframe
     * 5. Returns the configured falseOutput value if condition is not met
     * 6. Truncates output to maxOutputLength if specified
     *
     * The function ensures signal synchronization by validating timestamps and timeframes,
     * preventing processing of stale or mismatched input signals. If the timeframe is set
     * to 0.0, no time validation is performed.
     *
     * Truthy evaluation considers values that are not undefined, empty strings, or zero.
     * The returned value will be propagated to any components connected to this
     * And component's output pin.
     *
     * @example
     * // Process an And component with truthy inputs
     * const component = {
     *   id: 'and-1',
     *   name: 'And',
     *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 'hello' },
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
     *   settings: { timeframe: 100, output: 'TRUE', falseOutput: 'FALSE', maxOutputLength: 10 }
     * }
     * const result = circuitStore._processAndTick(component)
     * console.log(result) // 'TRUE'
     */
    _processAndTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2
      let newValue

      // eslint-disable-next-line eqeqeq
      const in1Truthy = in1 != undefined && in1 != '' && in1 != 0
      // eslint-disable-next-line eqeqeq
      const in2Truthy = in2 != undefined && in2 != '' && in2 != 0

      let conditionMet = false

      if (in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          conditionMet = (in1Truthy && in2Truthy)
        }
      } else if (in1Timestamp || in2Timestamp) {
        conditionMet = (in1Truthy && in2Truthy)
      }

      if (conditionMet) {
        newValue = settings.output
      } else {
        newValue = settings.falseOutput
      }

      if (newValue !== undefined && newValue !== '') {
        newValue = String(newValue).substring(0, settings.maxOutputLength)
      } else {
        // Ensure we send an empty string if falseOutput is empty, rather than undefined
        newValue = ''
      }

      return newValue
    },

    /**
     * Processes a single tick for a Subtract component in the circuit simulation
     *
     * Calculates the difference between two input signals within a specified timeframe.
     * The component subtracts the second input from the first input and applies optional
     * clamping to keep the result within configured minimum and maximum bounds.
     *
     * @param {Object} component - The Subtract component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number|string} component.inputs.SIGNAL_IN_1 - The first input signal (minuend)
     * @param {number|string} component.inputs.SIGNAL_IN_2 - The second input signal (subtrahend)
     * @param {Object} component.lastSignalTimestamps - Timestamps of when each input was last received
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of first input signal
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of second input signal
     * @param {Object} component.settings - Configuration settings for the component
     * @param {number} component.settings.timeframe - Maximum time difference (ms) between inputs to process
     * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
     * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
     * @returns {number|undefined} The calculated difference, or undefined if conditions aren't met
     *
     * @description
     * This function performs the following operations:
     * - Validates that both input signals are present and have valid timestamps
     * - Checks if the time difference between inputs is within the configured timeframe
     * - Converts input values to numbers and calculates the difference (SIGNAL_IN_1 - SIGNAL_IN_2)
     * - Applies optional clamping to keep the result within min/max bounds
     * - Returns the calculated difference or undefined if processing conditions aren't met
     *
     * The function only processes the subtraction when both inputs are available and
     * their timestamps are within the specified timeframe. If timeframe is set to 0.0,
     * the time constraint is ignored and processing occurs whenever both inputs are present.
     *
     * @example
     * // Process a Subtract component with inputs 10 and 3
     * const component = {
     *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 3 },
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
     *   settings: { timeframe: 100, clampMax: 20, clampMin: -10 }
     * }
     * const result = circuitStore._processSubtractTick(component)
     * console.log(result) // 7
     */
    _processSubtractTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

      if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          const num1 = parseFloat(in1) || 0
          const num2 = parseFloat(in2) || 0
          let difference = num1 - num2

          if (settings.clampMax !== undefined) difference = Math.min(difference, settings.clampMax)

          if (settings.clampMin !== undefined) difference = Math.max(difference, settings.clampMin)

          return difference
        }
      }
    },

    /**
     * Processes a Multiply component during a simulation tick
     *
     * Multiplies two input signals and applies optional clamping to the result.
     * The function only processes when both inputs are available and their timestamps
     * are within the configured timeframe.
     *
     * @param {Object} component - The Multiply component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number} [component.inputs.SIGNAL_IN_1] - First input signal value
     * @param {number} [component.inputs.SIGNAL_IN_2] - Second input signal value
     * @param {Object} component.lastSignalTimestamps - Timestamps of when signals were last received
     * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_1] - Timestamp of first input signal
     * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_2] - Timestamp of second input signal
     * @param {Object} component.settings - Component configuration settings
     * @param {number} [component.settings.timeframe] - Maximum time difference allowed between inputs (0.0 = no limit)
     * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
     * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
     * @returns {number|undefined} The calculated product, or undefined if conditions aren't met
     *
     * @description
     * This function performs the following operations:
     * - Validates that both input signals are present and have valid timestamps
     * - Checks if the time difference between inputs is within the configured timeframe
     * - Converts input values to numbers and calculates the product (SIGNAL_IN_1 * SIGNAL_IN_2)
     * - Applies optional clamping to keep the result within min/max bounds
     * - Returns the calculated product or undefined if processing conditions aren't met
     *
     * The function only processes the multiplication when both inputs are available and
     * their timestamps are within the specified timeframe. If timeframe is set to 0.0,
     * the time constraint is ignored and processing occurs whenever both inputs are present.
     *
     * @example
     * // Process a Multiply component with inputs 5 and 3
     * const component = {
     *   inputs: { SIGNAL_IN_1: 5, SIGNAL_IN_2: 3 },
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
     *   settings: { timeframe: 100, clampMax: 20, clampMin: -10 }
     * }
     * const result = circuitStore._processMultiplyTick(component)
     * console.log(result) // 15
     */
    _processMultiplyTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

      if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          const num1 = parseFloat(in1) || 0
          const num2 = parseFloat(in2) || 0
          let product = num1 * num2

          if (settings.clampMax !== undefined) product = Math.min(product, settings.clampMax)

          if (settings.clampMin !== undefined) product = Math.max(product, settings.clampMin)

          return product
        }
      }
    },

    /**
     * Processes a single tick for a Divide component in the circuit simulation
     *
     * Calculates the quotient of two input signals when both inputs are available
     * and their timestamps are within the configured timeframe. The function handles
     * division by zero protection and optional value clamping.
     *
     * @param {Object} component - The Divide component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number} [component.inputs.SIGNAL_IN_1] - First input signal value
     * @param {number} [component.inputs.SIGNAL_IN_2] - Second input signal value (divisor)
     * @param {Object} component.lastSignalTimestamps - Timestamps of when each input was last received
     * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_1] - Timestamp of first input signal
     * @param {number} [component.lastSignalTimestamps.SIGNAL_IN_2] - Timestamp of second input signal
     * @param {Object} component.settings - Component configuration settings
     * @param {number} [component.settings.timeframe] - Maximum time difference allowed between inputs
     * @param {number} [component.settings.clampMax] - Maximum value to clamp the result to
     * @param {number} [component.settings.clampMin] - Minimum value to clamp the result to
     * @returns {string|undefined} The calculated quotient as a string, or undefined if conditions aren't met
     *
     * @description
     * This function performs the following operations:
     * - Validates that both input signals are present and have valid timestamps
     * - Checks if the time difference between inputs is within the configured timeframe
     * - Converts input values to numbers and calculates the quotient (SIGNAL_IN_1 / SIGNAL_IN_2)
     * - Protects against division by zero by returning 0 when the divisor is zero
     * - Applies optional clamping to keep the result within min/max bounds
     * - Returns the calculated quotient as a string or undefined if processing conditions aren't met
     *
     * The function only processes the division when both inputs are available and
     * their timestamps are within the specified timeframe. If timeframe is set to 0.0,
     * the time constraint is ignored and processing occurs whenever both inputs are present.
     * Division by zero is handled gracefully by returning 0 instead of throwing an error.
     *
     * @example
     * // Process a Divide component with inputs 10 and 2
     * const component = {
     *   inputs: { SIGNAL_IN_1: 10, SIGNAL_IN_2: 2 },
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
     *   settings: { timeframe: 100, clampMax: 10, clampMin: -5 }
     * }
     * const result = circuitStore._processDivideTick(component)
     * console.log(result) // "5"
     */
    _processDivideTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

      if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          const num1 = parseFloat(in1) || 0
          const num2 = parseFloat(in2) || 0
          let quotient = num2 !== 0 ? num1 / num2 : 0 // Avoid division by zero

          if (settings.clampMax !== undefined) quotient = Math.min(quotient, settings.clampMax)

          if (settings.clampMin !== undefined) quotient = Math.max(quotient, settings.clampMin)

          return quotient.toString()
        }
      }
    },

    /**
     * Processes a single tick for an XOR component in the circuit simulation
     *
     * Evaluates the XOR logic operation on two input signals and determines the appropriate
     * output based on whether the inputs have different truthiness values. The function
     * supports time-based signal validation and configurable output values.
     *
     * @param {Object} component - The XOR component to process
     * @param {Object} component.inputs - The input signals for the component
     * @param {*} component.inputs.SIGNAL_IN_1 - The first input signal
     * @param {*} component.inputs.SIGNAL_IN_2 - The second input signal
     * @param {*} component.inputs.SET_OUTPUT - Optional override for the output value when condition is met
     * @param {Object} component.lastSignalTimestamps - Timestamps of when each input signal was last received
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of the first input signal
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of the second input signal
     * @param {Object} component.settings - Configuration settings for the component
     * @param {number} component.settings.timeframe - Maximum time difference (ms) between inputs to consider them synchronized (0.0 disables time constraint)
     * @param {string} component.settings.output - Default output value when XOR condition is met
     * @param {string} component.settings.falseOutput - Output value when XOR condition is not met
     * @param {number} component.settings.maxOutputLength - Maximum length for the output string
     * @returns {string} The processed output value, or empty string if no valid output
     *
     * @description
     * This function performs the following operations:
     * - Extracts input signals and their timestamps from the component
     * - Determines the truthiness of each input (truthy if not undefined, not empty string, and not 0)
     * - Validates input timing if both timestamps are present and timeframe is configured
     * - Evaluates XOR logic: condition is met when inputs have different truthiness values
     * - Selects appropriate output based on whether the XOR condition is met
     * - Applies output length restrictions and string conversion
     * - Returns the final output value or empty string
     *
     * The XOR logic works as follows:
     * - If both inputs are truthy or both are falsy → condition not met (falseOutput)
     * - If one input is truthy and the other is falsy → condition met (output)
     *
     * Time validation ensures inputs are processed within the specified timeframe.
     * If timeframe is 0.0, time constraints are ignored and processing occurs
     * whenever at least one input is available.
     *
     * @example
     * // Process an XOR component with truthy and falsy inputs
     * const component = {
     *   inputs: { SIGNAL_IN_1: "hello", SIGNAL_IN_2: 0 },
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1640995200000, SIGNAL_IN_2: 1640995200001 },
     *   settings: { timeframe: 100, output: "XOR_TRUE", falseOutput: "XOR_FALSE", maxOutputLength: 10 }
     * }
     * const result = circuitStore._processXorTick(component)
     * console.log(result) // "XOR_TRUE"
     */
    _processXorTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2
      let newValue

      // eslint-disable-next-line eqeqeq
      const in1Truthy = in1 != undefined && in1 != '' && in1 != 0
      // eslint-disable-next-line eqeqeq
      const in2Truthy = in2 != undefined && in2 != '' && in2 != 0

      let conditionMet = false

      if (in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          if (in1Truthy !== in2Truthy) {
            conditionMet = true
          }
        }
      } else if (in1Timestamp || in2Timestamp) {
        if (in1Truthy !== in2Truthy) {
          conditionMet = true
        }
      }

      if (conditionMet) {
        newValue = inputs?.SET_OUTPUT ?? settings.output
      } else {
        newValue = settings.falseOutput
      }

      if (newValue !== undefined && newValue !== '') {
        newValue = String(newValue).substring(0, settings.maxOutputLength)
      } else {
        newValue = ''
      }

      return newValue
    },

    /**
     * Processes a single tick for the SignalCheck component
     *
     * Compares an input signal against a target signal and outputs a configured value
     * based on whether the signals match. This component is useful for signal validation
     * and conditional output generation in circuit logic.
     *
     * @param {Object} component - The SignalCheck component to process
     * @param {Object} component.settings - The component's configuration settings
     * @param {string} component.settings.target_signal - The target signal to compare against
     * @param {string} component.settings.output - The output value when signals match
     * @param {string} component.settings.falseOutput - The output value when signals don't match
     * @param {number} component.settings.maxOutputLength - Maximum length for output strings
     * @param {Object} component.inputs - The current input values for the component
     * @param {*} component.inputs.SIGNAL_IN - The input signal to check
     * @param {string} [component.inputs.SET_TARGETSIGNAL] - Override for target signal (optional)
     * @param {string} [component.inputs.SET_OUTPUT] - Override for output value when signals match (optional)
     * @returns {string} The output value based on signal comparison, or empty string if no input
     *
     * @description
     * This function performs the following operations:
     * - Extracts the input signal and target signal from component inputs and settings
     * - Compares the input signal against the target signal for exact equality
     * - Returns the configured output value if signals match, or falseOutput if they don't
     * - Truncates the output to the maximum configured length
     * - Returns an empty string if no input signal is provided
     *
     * The function supports dynamic overrides through input pins:
     * - SET_TARGETSIGNAL: Overrides the default target signal from settings
     * - SET_OUTPUT: Overrides the default output value when signals match
     *
     * @example
     * // Process a SignalCheck component with matching signals
     * const component = {
     *   settings: { target_signal: "HIGH", output: "VALID", falseOutput: "INVALID", maxOutputLength: 10 },
     *   inputs: { SIGNAL_IN: "HIGH" }
     * }
     * const result = circuitStore._processSignalCheckTick(component)
     * console.log(result) // "VALID"
     *
     * @example
     * // Process a SignalCheck component with non-matching signals
     * const component = {
     *   settings: { target_signal: "HIGH", output: "VALID", falseOutput: "INVALID", maxOutputLength: 10 },
     *   inputs: { SIGNAL_IN: "LOW" }
     * }
     * const result = circuitStore._processSignalCheckTick(component)
     * console.log(result) // "INVALID"
     */
    _processSignalCheckTick (component) {
      const { settings, inputs } = component
      const signalIn = inputs?.SIGNAL_IN
      const targetSignal = inputs?.SET_TARGETSIGNAL ?? settings.target_signal
      const output = inputs?.SET_OUTPUT ?? settings.output
      let newValue

      if (signalIn !== undefined) {
        if (signalIn === targetSignal) {
          newValue = output
        } else {
          newValue = settings.falseOutput
        }
      }

      if (newValue !== undefined && newValue !== '') {
        newValue = String(newValue).substring(0, settings.maxOutputLength)
      } else {
        newValue = ''
      }

      return newValue
    },

    /**
     * Processes a Greater component tick to compare two input signals within a timeframe
     *
     * Evaluates whether the first input signal is greater than the second input signal,
     * considering timing constraints and returning appropriate output values based on
     * the comparison result and configured settings.
     *
     * @param {Object} component - The Greater component to process
     * @param {Object} component.lastSignalTimestamps - Timestamps of when signals were last received
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_1 - Timestamp of first input signal
     * @param {number} component.lastSignalTimestamps.SIGNAL_IN_2 - Timestamp of second input signal
     * @param {Object} component.settings - Component configuration settings
     * @param {number} component.settings.timeframe - Maximum time difference allowed between signals (0.0 = no limit)
     * @param {string} component.settings.output - Output value when condition is met
     * @param {string} component.settings.falseOutput - Output value when condition is not met
     * @param {number} component.settings.maxOutputLength - Maximum length of output string
     * @param {Object} component.inputs - Current input signal values
     * @param {string|number} component.inputs.SIGNAL_IN_1 - First input signal value
     * @param {string|number} component.inputs.SIGNAL_IN_2 - Second input signal value
     * @param {string} [component.inputs.SET_OUTPUT] - Optional override for output when condition is met
     * @returns {string} The output value based on the comparison result, truncated to maxOutputLength
     *
     * @description
     * This function performs the following operations:
     * - Extracts input signals and their timestamps from the component
     * - Validates that both input signals and timestamps are available
     * - Calculates the time difference between signal arrivals
     * - Checks if the time difference is within the configured timeframe (or if timeframe is 0.0 for no limit)
     * - Converts input signals to numbers and compares them numerically
     * - Returns the configured output value if SIGNAL_IN_1 > SIGNAL_IN_2, otherwise returns falseOutput
     * - Supports dynamic output override through the SET_OUTPUT input pin
     * - Truncates the output to the maximum configured length
     * - Returns an empty string if no valid comparison can be made
     *
     * The function supports dynamic overrides through input pins:
     * - SET_OUTPUT: Overrides the default output value when the condition is met
     *
     * @example
     * // Process a Greater component with valid signals and timeframe
     * const component = {
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1000, SIGNAL_IN_2: 1050 },
     *   settings: { timeframe: 100, output: "GREATER", falseOutput: "NOT_GREATER", maxOutputLength: 10 },
     *   inputs: { SIGNAL_IN_1: "15", SIGNAL_IN_2: "10" }
     * }
     * const result = circuitStore._processGreaterTick(component)
     * console.log(result) // "GREATER"
     *
     * @example
     * // Process a Greater component with signals outside timeframe
     * const component = {
     *   lastSignalTimestamps: { SIGNAL_IN_1: 1000, SIGNAL_IN_2: 1200 },
     *   settings: { timeframe: 100, output: "GREATER", falseOutput: "NOT_GREATER", maxOutputLength: 10 },
     *   inputs: { SIGNAL_IN_1: "15", SIGNAL_IN_2: "10" }
     * }
     * const result = circuitStore._processGreaterTick(component)
     * console.log(result) // "NOT_GREATER"
     */
    _processGreaterTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2
      let newValue
      let conditionMet = false

      if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          const num1 = parseFloat(in1) || 0
          const num2 = parseFloat(in2) || 0

          if (num1 > num2) {
            conditionMet = true
          }
        }
      }

      if (conditionMet) {
        newValue = inputs?.SET_OUTPUT ?? settings.output
      } else {
        newValue = settings.falseOutput
      }

      if (newValue !== undefined && newValue !== '') {
        newValue = String(newValue).substring(0, settings.maxOutputLength)
      } else {
        newValue = ''
      }

      return newValue
    },

    /**
     * Processes a single tick for an Abs component in the circuit simulation
     *
     * Calculates the absolute value of an input signal.
     *
     * @param {Object} component - The Abs component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number|string} component.inputs.SIGNAL_IN - The input signal
     * @returns {number|undefined} The absolute value of the input, or undefined if the input is not valid
     */
    _processAbsTick (component) {
      const signalIn = component.inputs?.SIGNAL_IN

      if (signalIn !== undefined) {
        const num = parseFloat(signalIn) || 0

        return Math.abs(num)
      }
    },

    /**
     * Processes a single tick for an Acos component in the circuit simulation
     *
     * The Acos Component is an electrical component that performs the inverse cosine
     * function; cos-1(x). It outputs the angle whose cosine is equal to the input.
     *
     * @param {Object} component - The Acos component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number|string} component.inputs.SIGNAL_IN - The input signal, clamped to [-1, 1]
     * @param {Object} component.settings - The component's configuration settings
     * @param {boolean} component.settings.useRadians - If set to true, the trigonometric function uses radians instead of degrees.
     * @returns {number|undefined} The arccosine of the input, or undefined if the input is not valid
     *
     * @example
     * // Input 0.5, useRadians: false (default) -> Output: 60 (degrees)
     * const component = {
     *   inputs: { SIGNAL_IN: 0.5 },
     *   settings: { useRadians: false }
     * }
     * const result = circuitStore._processAcosTick(component)
     * console.log(result) // 60.00000000000001
     *
     * @example
     * // Input 0.5, useRadians: true -> Output: 1.047... (radians)
     * const component = {
     *   inputs: { SIGNAL_IN: 0.5 },
     *   settings: { useRadians: true }
     * }
     * const result = circuitStore._processAcosTick(component)
     * console.log(result) // 1.0471975511965979
     *
     * @example
     * // Input clamped to 1, output in degrees
     * const component = {
     *   inputs: { SIGNAL_IN: 5 },
     *   settings: { useRadians: false }
     * }
     * const result = circuitStore._processAcosTick(component)
     * console.log(result) // 0
     */
    _processAcosTick (component) {
      const signalIn = component.inputs?.SIGNAL_IN

      if (signalIn !== undefined) {
        let num = parseFloat(signalIn) || 0

        // Clamp the input value to the valid range for acos [-1, 1]
        num = Math.max(-1, Math.min(1, num))

        let angle = Math.acos(num)

        if (!component.settings.useRadians) {
          angle = angle * (180 / Math.PI)
        }

        return angle
      }
    },

    /**
     * Processes a single tick for an Asin component in the circuit simulation
     *
     * The Asin Component is an electrical component that performs the inverse sine
     * function; sin-1(x). It outputs the angle whose sine is equal to the input.
     *
     * @param {Object} component - The Asin component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number|string} component.inputs.SIGNAL_IN - The input signal, clamped to [-1, 1]
     * @param {Object} component.settings - The component's configuration settings
     * @param {boolean} component.settings.useRadians - If set to true, the trigonometric function uses radians instead of degrees.
     * @returns {number|undefined} The arcsine of the input, or undefined if the input is not valid
     */
    _processAsinTick (component) {
      const signalIn = component.inputs?.SIGNAL_IN

      if (signalIn !== undefined) {
        let num = parseFloat(signalIn) || 0

        // Clamp the input value to the valid range for asin [-1, 1]
        num = Math.max(-1, Math.min(1, num))

        let angle = Math.asin(num)

        if (!component.settings.useRadians) {
          angle = angle * (180 / Math.PI)
        }

        return angle
      }
    },

    /**
     * Processes a single tick for an Atan component in the circuit simulation
     *
     * Outputs the angle whose tangent is equal to the input. If the "SIGNAL_IN_X"
     * and "SIGNAL_IN_Y" connections are used, the input is interpreted as a
     * vector and the angle calculated using Atan2.
     *
     * @param {Object} component - The Atan component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number|string} [component.inputs.SIGNAL_IN] - The primary input signal for atan
     * @param {number|string} [component.inputs.SIGNAL_IN_Y] - The y-coordinate for atan2
     * @param {number|string} [component.inputs.SIGNAL_IN_X] - The x-coordinate for atan2
     * @param {Object} component.settings - The component's configuration settings
     * @param {boolean} component.settings.useRadians - If set to true, the trigonometric function uses radians instead of degrees.
     * @returns {number|undefined} The arctangent of the input, or undefined if inputs are not valid
     */
    _processAtanTick (component) {
      const { inputs, settings } = component
      const signalIn = inputs?.SIGNAL_IN
      const signalY = inputs?.SIGNAL_IN_Y
      const signalX = inputs?.SIGNAL_IN_X

      let angle

      if (signalY !== undefined && signalX !== undefined) {
        // Atan2 mode
        const y = parseFloat(signalY) || 0
        const x = parseFloat(signalX) || 0

        angle = Math.atan2(y, x)
      } else if (signalIn !== undefined) {
        // Atan mode
        const num = parseFloat(signalIn) || 0

        angle = Math.atan(num)
      } else {
        return undefined
      }

      if (!settings.useRadians) {
        angle = angle * (180 / Math.PI)
      }

      return angle
    },

    /**
     * Processes a single tick for a Ceil component in the circuit simulation
     *
     * Outputs the smallest integer value that is bigger than or equal to the input.
     *
     * @param {Object} component - The Ceil component to process
     * @param {Object} component.inputs - The input signal values
     * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal
     * @returns {number|undefined} The ceiling of the input, or undefined if the input is not valid
     */
    _processCeilTick (component) {
      const signalIn = component.inputs?.SIGNAL_IN

      if (signalIn !== undefined) {
        const num = parseFloat(signalIn) || 0

        return Math.ceil(num)
      }
    },

    /**
     * Processes a single tick for a Color component in the circuit simulation.
     *
     * Outputs a combined color signal for light control.
     *
     * @param {Object} component - The Color component to process.
     * @returns {string|undefined} The combined color string (e.g., "r,g,b,a"), or undefined.
     */
    _processColorTick (component) {
      const { inputs, settings } = component

      const rIn = inputs?.SIGNAL_IN_R
      const gIn = inputs?.SIGNAL_IN_G
      const bIn = inputs?.SIGNAL_IN_B
      const aIn = inputs?.SIGNAL_IN_A

      if (rIn === undefined && gIn === undefined && bIn === undefined && aIn === undefined) {
        return undefined // No inputs, no output
      }

      let r, g, b
      const a = Math.max(0, Math.min(255, parseInt(aIn, 10) || 0))

      if (settings.useHSV) {
        const h = Math.max(0, Math.min(360, parseFloat(rIn) || 0))
        const s = Math.max(0, Math.min(1, parseFloat(gIn) || 0))
        const v = Math.max(0, Math.min(1, parseFloat(bIn) || 0))
        const rgb = hsvToRgb(h, s, v)

        r = rgb.r
        g = rgb.g
        b = rgb.b
      } else {
        r = Math.max(0, Math.min(255, parseInt(rIn, 10) || 0))
        g = Math.max(0, Math.min(255, parseInt(gIn, 10) || 0))
        b = Math.max(0, Math.min(255, parseInt(bIn, 10) || 0))
      }

      return `${r},${g},${b},${a}`
    },

    /**
     * Processes a single tick for a Concatenation component in the circuit simulation.
     *
     * Joins two input signals together with an optional separator.
     *
     * @param {Object} component - The Concatenation component to process.
     * @returns {string|undefined} The concatenated string, or undefined.
     */
    _processConcatenationTick (component) {
      const { lastSignalTimestamps, settings, inputs } = component
      const in1 = inputs?.SIGNAL_IN_1
      const in2 = inputs?.SIGNAL_IN_2
      const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
      const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

      if (in1 !== undefined && in2 !== undefined && in1Timestamp && in2Timestamp) {
        const timeDiff = Math.abs(in1Timestamp - in2Timestamp)

        if (settings.timeframe === 0.0 || timeDiff <= settings.timeframe) {
          const s1 = String(in1 ?? '')
          const s2 = String(in2 ?? '')
          const result = s1 + settings.separator + s2

          return result.substring(0, settings.maxOutputLength)
        }
      }
    },

    /**
     * Processes a single tick for a Cos component in the circuit simulation.
     *
     * Outputs the cosine of the input signal.
     *
     * @param {Object} component - The Cos component to process.
     * @returns {number|undefined} The cosine of the input, or undefined.
     */
    _processCosTick (component) {
      const signalIn = component.inputs?.SIGNAL_IN

      if (signalIn !== undefined) {
        let num = parseFloat(signalIn) || 0

        if (!component.settings.useRadians) {
          // Input is in degrees, convert to radians for Math.cos
          num = num * (Math.PI / 180)
        }

        return Math.cos(num)
      }
    },

    // --- Import/Export Actions ---
    /**
     * Exports the current circuit state to the clipboard as a compressed, base64-encoded string
     *
     * Serializes the circuit board components and wires, compresses the data using pako,
     * encodes it as base64, and copies the result to the system clipboard. This allows
     * users to save and share circuit designs by pasting the encoded string.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Creates a state object containing boardComponents and wires arrays
     * - Serializes the state object to JSON string format
     * - Compresses the JSON string using pako.deflate for efficient storage
     * - Converts the compressed binary data to a binary string
     * - Encodes the binary string as base64 for clipboard compatibility
     * - Copies the encoded string to the system clipboard
     * - Displays success/error notifications to the user
     *
     * The exported string can be imported later using the importState() method
     * to restore the exact circuit configuration.
     *
     * @example
     * // Export the current circuit state to clipboard
     * circuitStore.exportState()
     *
     * // The circuit state is now copied to clipboard as an encoded string
     * // Users can paste this string to share or save their circuit design
     *
     * @throws {Error} May throw errors if clipboard access is denied or compression fails
     */
    exportState () {
      try {
        const stateToSave = {
          boardComponents: this.boardComponents,
          wires: this.wires
        }
        const jsonString = JSON.stringify(stateToSave)
        const compressed = pako.deflate(jsonString)
        const binaryString = Array.from(compressed).map(c => String.fromCharCode(c)).join('')
        const encoded = btoa(binaryString)

        navigator.clipboard.writeText(encoded)
        toast.success('Circuit state copied to clipboard!')
      } catch (error) {
        toast.error('Failed to export circuit state.')
        console.error('Export failed:', error)
      }
    },

    /**
     * Imports a circuit state from a compressed, base64-encoded string
     *
     * Decodes and decompresses a previously exported circuit state string, then
     * restores the circuit board components and wires to their saved configuration.
     * This function is the counterpart to exportState() and allows users to load
     * shared or saved circuit designs.
     *
     * @param {string} encodedString - The base64-encoded, compressed circuit state string to import
     * @returns {void}
     *
     * @description
     * This function performs the following operations:
     * - Validates that the encoded string is not empty
     * - Decodes the base64 string to binary data
     * - Converts the binary string to a Uint8Array for decompression
     * - Decompresses the data using pako.inflate to restore the JSON string
     * - Parses the JSON to extract the circuit state object
     * - Validates that the imported data contains required boardComponents and wires arrays
     * - Maps component names to their corresponding Vue components using componentMap
     * - Restores the circuit state by updating boardComponents and wires arrays
     * - Recalculates ID counters to ensure proper sequencing for new components/wires
     * - Displays success/error notifications to the user
     *
     * The function handles various error conditions including:
     * - Empty or invalid import strings
     * - Corrupted or malformed data
     * - Missing required data structures
     * - Decompression or parsing failures
     *
     * @example
     * // Import a circuit state from a previously exported string
     * const exportedString = "eJzT0wMAAAMA..." // Base64 encoded string
     * circuitStore.importState(exportedString)
     *
     * // The circuit state is now restored to the imported configuration
     * // All components and wires are positioned and connected as saved
     *
     * @throws {Error} May throw errors if the import string is corrupted, malformed, or in an unsupported format
     */
    importState (encodedString) {
      if (!encodedString) {
        toast.error('Import string is empty.')

        return
      }

      try {
        const binaryString = atob(encodedString)
        const bytes = new Uint8Array(binaryString.length)

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const decompressed = pako.inflate(bytes, { to: 'string' })
        const newState = JSON.parse(decompressed)

        if (newState.boardComponents && newState.wires) {
          newState.boardComponents.forEach(component => {
            if (componentMap[component.name]) {
              component.is = componentMap[component.name]
            }
          })

          this.boardComponents = newState.boardComponents
          this.wires = newState.wires
          this.componentIdCounter = this.boardComponents.reduce((max, c) => Math.max(max, parseInt(c.id.split('-')[1]) || 0), -1) + 1
          this.wireIdCounter = this.wires.reduce((max, w) => Math.max(max, parseInt(w.id.split('-')[1]) || 0), -1) + 1
          this.waypointIdCounter = this.wires.reduce((max, w) => w.waypoints.reduce((maxWp, wp) => Math.max(maxWp, parseInt(wp.id.split('-')[1]) || 0), max), -1) + 1
          toast.success('Circuit state imported successfully!')
        } else {
          toast.error('Invalid import data format.')
        }
      } catch (error) {
        toast.error('Failed to import circuit state. The data may be corrupted or in an old format.')
        console.error('Import failed:', error)
      }
    }
  }
})
