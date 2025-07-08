import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import pako from 'pako'

import parseColor from '../utils/parseColor.js'
import distanceToLineSegment from '../utils/distanceToLineSegment.js'

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
import DelayComponent from '../components/circuit/DelayComponent.vue'
import ExponentiationComponent from '../components/circuit/ExponentiationComponent.vue'
import FactorialComponent from '../components/circuit/FactorialComponent.vue'
import EqualsComponent from '../components/circuit/EqualsComponent.vue'
import FloorComponent from '../components/circuit/FloorComponent.vue'
import InputSelectorComponent from '../components/circuit/InputSelectorComponent.vue'
import MemoryComponent from '../components/circuit/MemoryComponent.vue'
import ModuloComponent from '../components/circuit/ModuloComponent.vue'
import NotComponent from '../components/circuit/NotComponent.vue'
import OrComponent from '../components/circuit/OrComponent.vue'
import OscillatorComponent from '../components/circuit/OscillatorComponent.vue'
import OutputSelectorComponent from '../components/circuit/OutputSelectorComponent.vue'
import RegExComponent from '../components/circuit/RegExComponent.vue'
import RelayComponent from '../components/circuit/RelayComponent.vue'
import RoundComponent from '../components/circuit/RoundComponent.vue'
import SinComponent from '../components/circuit/SinComponent.vue'
import SquareRootComponent from '../components/circuit/SquareRootComponent.vue'
import TanComponent from '../components/circuit/TanComponent.vue'
import WiFiComponent from '../components/circuit/WiFiComponent.vue'
import ButtonComponent from '../components/circuit/tools/ButtonComponent.vue'

import processAbsTick from './circuit/processors/processAbsTick.js'
import processAcosTick from './circuit/processors/processAcosTick.js'
import processAdderTick from './circuit/processors/processAdderTick.js'
import processAndTick from './circuit/processors/processAndTick.js'
import processAsinTick from './circuit/processors/processAsinTick.js'
import processAtanTick from './circuit/processors/processAtanTick.js'
import processCeilTick from './circuit/processors/processCeilTick.js'
import processColorTick from './circuit/processors/processColorTick.js'
import processConcatenationTick from './circuit/processors/processConcatenationTick.js'
import processConstantTick from './circuit/processors/processConstantTick.js'
import processCosTick from './circuit/processors/processCosTick.js'
import processDelayTick from './circuit/processors/processDelayTick.js'
import processDivideTick from './circuit/processors/processDivideTick.js'
import processEqualsTick from './circuit/processors/processEqualsTick.js'
import processExponentiationTick from './circuit/processors/processExponentiationTick.js'
import processFactorialTick from './circuit/processors/processFactorialTick.js'
import processFloorTick from './circuit/processors/processFloorTick.js'
import processGreaterTick from './circuit/processors/processGreaterTick.js'
import processInputSelectorTick from './circuit/processors/processInputSelectorTick.js'
import processMemoryTick from './circuit/processors/processMemoryTick.js'
import processModuloTick from './circuit/processors/processModuloTick.js'
import processMultiplyTick from './circuit/processors/processMultiplyTick.js'
import processNotTick from './circuit/processors/processNotTick.js'
import processOrTick from './circuit/processors/processOrTick.js'
import processOscillatorTick from './circuit/processors/processOscillatorTick.js'
import processOutputSelectorTick from './circuit/processors/processOutputSelectorTick.js'
import processRandomTick from './circuit/processors/processRandomTick.js'
import processRegExTick from './circuit/processors/processRegExTick.js'
import processRelayTick from './circuit/processors/processRelayTick.js'
import processRoundTick from './circuit/processors/processRoundTick.js'
import processSignalCheckTick from './circuit/processors/processSignalCheckTick.js'
import processSinTick from './circuit/processors/processSinTick.js'
import processSquareRootTick from './circuit/processors/processSquareRootTick.js'
import processSubtractTick from './circuit/processors/processSubtractTick.js'
import processTanTick from './circuit/processors/processTanTick.js'
import processWiFiTick from './circuit/processors/processWiFiTick.js'
import processXorTick from './circuit/processors/processXorTick.js'
import processDisplayTick from './circuit/processors/processDisplayTick.js'
import processLightTick from './circuit/processors/processLightTick.js'
import processButtonTick from './circuit/processors/processButtonTick.js'

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
  Cos: CosComponent,
  Delay: DelayComponent,
  Exponentiation: ExponentiationComponent,
  Factorial: FactorialComponent,
  Equals: EqualsComponent,
  Floor: FloorComponent,
  InputSelector: InputSelectorComponent,
  Memory: MemoryComponent,
  Modulo: ModuloComponent,
  Not: NotComponent,
  Or: OrComponent,
  Oscillator: OscillatorComponent,
  OutputSelector: OutputSelectorComponent,
  RegEx: RegExComponent,
  Relay: RelayComponent,
  Round: RoundComponent,
  Sin: SinComponent,
  SquareRoot: SquareRootComponent,
  Tan: TanComponent,
  WiFi: WiFiComponent,
  Button: ButtonComponent
}

const toast = useToast()

export const useCircuitStore = defineStore('circuit', {
  state: () => ({
    boardComponents: [],
    wires: [],

    // Interaction states
    wiringInfo: null, // e.g. { startComponentId: '..', startPinName: '..' }
    justEndedWiring: false,
    movingComponentInfo: null, // e.g., { id: 'component-0', offsetX: 20, offsetY: 30 }
    movingWaypointInfo: null, // e.g., { wireId: '..', waypointId: '..', offsetX: .., offsetY: ..}
    selectedComponentId: null,
    selectedWireId: null,

    isComponentLimitEnabled: true,
    componentLimit: parseInt(import.meta.env.VITE_COMPONENT_LIMIT) || 64,

    simulationRunning: false,
    simulationIntervalId: null,
    tickInterval: 50, // ms, 20 ticks per second

    // Counters for unique IDs
    componentIdCounter: 0,
    wireIdCounter: 0,
    waypointIdCounter: 0,
    componentOutputs: {},
    wifiChannels: {},

    // Click-to-place state
    pendingPlacementComponent: null
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
     * Adds a new component to the circuit board at the specified coordinates (click-to-place only).
     *
     * @param {Object} component - The component object to add
     * @param {number} x - X coordinate on the board
     * @param {number} y - Y coordinate on the board
     * @returns {void}
     *
     * @description
     * This function creates a new component instance from the provided data and adds it to the board.
     * It handles various component-specific initializations such as:
     * - Setting up Random component execution tracking
     * - Configuring Light component state and color
     * - Initializing signal timestamp tracking for mathematical/logical components
     *
     * The function only supports click-to-place mode. Drag-and-drop from the tray is not supported.
     *
     * @example
     * // Add a new Constant component at (x, y)
     * circuitStore.addComponent(component, x, y)
     */
    addComponent (component = null, x = null, y = null) {
      let newComponentData

      if (component && x !== null && y !== null) {
        // Click-to-place mode
        newComponentData = {
          id: `component-${this.componentIdCounter++}`,
          is: component.is,
          name: component.name,
          x,
          y,
          width: component.width,
          height: component.height,
          ...(component.value !== undefined ? { value: component.value } : {}),
          ...(component.settings ? { settings: { ...component.settings } } : {}),
          ...(component.isTool ? { isTool: component.isTool } : {})
        }
      } else {
        return
      }

      // (existing per-component initialization logic goes here, using newComponentData)
      const newComponent = { ...newComponentData }

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

      if (newComponent.name === 'Delay') {
        newComponent.pendingSignals = []
        newComponent.lastSignalIn = undefined
        newComponent.lastProcessedTimestamp = 0
        newComponent.lastSignalTimestamps = {}
      }

      if (newComponent.name === 'Exponentiation') {
        newComponent.lastSignalTimestamps = {}
      }

      if (newComponent.name === 'Factorial') {
        // Factorial component has no specific state to initialize here
      }

      if (newComponent.name === 'Equals') {
        newComponent.lastSignalTimestamps = {}
      }

      if (newComponent.name === 'Floor') {
        // Floor component has no specific state to initialize here
      }

      if (newComponent.name === 'InputSelector') {
        newComponent.lastSignalTimestamps = {}
        newComponent.lastMoveSignal = 0
      }

      if (newComponent.name === 'Memory') {
        newComponent.value = newComponent.settings.value
      }

      if (newComponent.name === 'Modulo') {
        // Modulo component has no specific state to initialize here
      }

      if (newComponent.name === 'Not') {
        newComponent.value = 0
      }

      if (newComponent.name === 'Or') {
        // Or component has no specific state to initialize here
      }

      if (newComponent.name === 'Oscillator') {
        newComponent.cumulativePhase = 0
        newComponent.value = 0 // For debugging sticky pulse
      }

      if (newComponent.name === 'OutputSelector') {
        newComponent.selectedConnection = newComponent.settings.selectedConnection
        newComponent.lastMoveSignal = 0
      }

      if (newComponent.name === 'RegEx') {
        newComponent.value = newComponent.settings.falseOutput
      }

      if (newComponent.name === 'Relay') {
        newComponent.isOn = newComponent.settings.isOn
        newComponent.lastToggleSignal = 0
      }

      if (newComponent.name === 'Round') {
        // Round component has no specific state to initialize here
      }

      if (newComponent.name === 'Sin') {
        // Sin component has no specific state to initialize here
      }

      if (newComponent.name === 'SquareRoot') {
        // SquareRoot component has no specific state to initialize here
      }

      if (newComponent.name === 'Tan') {
        // Tan component has no specific state to initialize here
      }

      if (newComponent.name === 'WiFi') {
        // WiFi component has no specific state to initialize here
      }

      if (newComponent.name === 'Button') {
        // Button component has no specific state to initialize here
      }

      this.boardComponents.push(newComponent)
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
      if (this.wiringInfo) return // Prevent starting a new wire if already wiring

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
      this.justEndedWiring = true
      setTimeout(() => { this.justEndedWiring = false }, 0)
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
      }, this.tickInterval)
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
          let newValues

          switch (component.name) {
            case 'Constant': newValues = processConstantTick(component); break
            case 'Random': newValues = processRandomTick(component); break
            case 'Adder': newValues = processAdderTick(component); break
            case 'And': newValues = processAndTick(component); break
            case 'Subtract': newValues = processSubtractTick(component); break
            case 'Multiply': newValues = processMultiplyTick(component); break
            case 'Divide': newValues = processDivideTick(component); break
            case 'Xor': newValues = processXorTick(component); break
            case 'SignalCheck': newValues = processSignalCheckTick(component); break
            case 'Greater': newValues = processGreaterTick(component); break
            case 'Abs': newValues = processAbsTick(component); break
            case 'Acos': newValues = processAcosTick(component); break
            case 'Asin': newValues = processAsinTick(component); break
            case 'Atan': newValues = processAtanTick(component); break
            case 'Ceil': newValues = processCeilTick(component); break
            case 'Floor': newValues = processFloorTick(component); break
            case 'Color': newValues = processColorTick(component); break
            case 'Concatenation': newValues = processConcatenationTick(component); break
            case 'Cos': newValues = processCosTick(component); break
            case 'Delay': newValues = processDelayTick(component); break
            case 'Exponentiation': newValues = processExponentiationTick(component); break
            case 'Factorial': newValues = processFactorialTick(component); break
            case 'Equals': newValues = processEqualsTick(component); break
            case 'InputSelector': newValues = processInputSelectorTick(component, this.wires); break
            case 'Memory': newValues = processMemoryTick(component); break
            case 'Modulo': newValues = processModuloTick(component); break
            case 'Not': newValues = processNotTick(component); break
            case 'Or': newValues = processOrTick(component); break
            case 'Oscillator': newValues = processOscillatorTick(component, this.tickInterval); break
            case 'OutputSelector': newValues = processOutputSelectorTick(component, this.wires); break
            case 'RegEx': newValues = processRegExTick(component); break
            case 'Relay': newValues = processRelayTick(component); break
            case 'Round': newValues = processRoundTick(component); break
            case 'Sin': newValues = processSinTick(component); break
            case 'SquareRoot': newValues = processSquareRootTick(component); break
            case 'Tan': newValues = processTanTick(component); break
            case 'WiFi': newValues = processWiFiTick(component, this.wifiChannels); break
            case 'Button': newValues = processButtonTick(component); break
            case 'Display': processDisplayTick(component); break
            case 'Light': processLightTick(component); break
          }

          if (newValues) {
            for (const pinName in newValues) {
              const key = `${component.id}:${pinName}`
              const currentValue = outputValues.get(key)
              const newValue = newValues[pinName]

              if (newValue !== undefined && currentValue !== newValue) {
                outputValues.set(key, newValue)
                changedInLoop = true
              }
            }
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

              if (toComponent.name === 'Adder' || toComponent.name === 'And' || toComponent.name === 'Subtract' || toComponent.name === 'Multiply' || toComponent.name === 'Divide' || toComponent.name === 'Xor' || toComponent.name === 'Greater' || toComponent.name === 'Concatenation' || toComponent.name === 'Delay') {
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

      // Stage 2.5: Broadcast WiFi signals for the *next* tick
      const nextWifiChannels = {} // Start with a clean slate for this tick's broadcasts

      this.boardComponents.forEach(component => {
        if (component.name === 'WiFi') {
          const { settings, inputs } = component
          const channelOverride = inputs?.SET_CHANNEL
          const channel = channelOverride !== undefined ? Number(channelOverride) : settings.channel
          const signalIn = inputs?.SIGNAL_IN

          if (signalIn !== undefined) {
            nextWifiChannels[channel] = signalIn
          }
        }
      })
      this.wifiChannels = nextWifiChannels

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

      // After calculating all potential outputs, update the state
      this.componentOutputs = new Map(outputValues)
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
    },

    /**
     * Starts placement mode for a component from the tray
     * @param {Object} component - The component object to place
     */
    startPlacement (component) {
      this.pendingPlacementComponent = component
    },
    /**
     * Places the pending component at the given board coordinates
     * @param {number} x - X coordinate on the board
     * @param {number} y - Y coordinate on the board
     */
    placePendingComponent (x, y) {
      if (!this.pendingPlacementComponent) return

      const component = this.pendingPlacementComponent

      this.pendingPlacementComponent = null
      this.addComponent(component, x, y)
    }
  }
})
