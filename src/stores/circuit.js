import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import pako from 'pako'

import AdderComponent from '../components/circuit/AdderComponent.vue'
import AndComponent from '../components/circuit/AndComponent.vue'
import ConstantComponent from '../components/circuit/ConstantComponent.vue'
import DisplayComponent from '../components/circuit/DisplayComponent.vue'
import MultiplyComponent from '../components/circuit/MultiplyComponent.vue'
import RandomComponent from '../components/circuit/RandomComponent.vue'
import SubtractComponent from '../components/circuit/SubtractComponent.vue'
import DivideComponent from '../components/circuit/DivideComponent.vue'
import XorComponent from '../components/circuit/XorComponent.vue'
import SignalCheckComponent from '../components/circuit/SignalCheckComponent.vue'
import GreaterComponent from '../components/circuit/GreaterComponent.vue'

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
  Greater: GreaterComponent
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
    selectComponent (componentId) {
      this.selectedComponentId = componentId
      this.selectedWireId = null
    },
    selectWire (wireId) {
      this.selectedWireId = wireId
      this.selectedComponentId = null
    },
    clearSelection () {
      this.selectedComponentId = null
      this.selectedWireId = null
    },
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

    toggleComponentLimit () {
      this.isComponentLimitEnabled = !this.isComponentLimitEnabled
    },

    // --- Component Actions ---
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
    updateGhostComponentPosition (event) {
      if (!this.ghostComponent) return

      const boardRect = document.getElementById('circuit-board').getBoundingClientRect()
      const gridSize = 20
      const x = event.clientX - boardRect.left
      const y = event.clientY - boardRect.top

      this.ghostComponent.x = Math.round((x - this.ghostComponent.width / 2) / gridSize) * gridSize
      this.ghostComponent.y = Math.round((y - this.ghostComponent.height / 2) / gridSize) * gridSize
    },
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

      if (['Adder', 'Subtract', 'Multiply', 'Divide', 'And', 'Greater'].includes(newComponent.name)) {
        newComponent.lastSignalTimestamps = {}
      }

      this.boardComponents.push(newComponent)
      this.ghostComponent = null
      this.resetCircuitState()
    },

    updateComponentValue (componentId, value) {
      const component = this.boardComponents.find(c => c.id === componentId)
      if (component) {
        component.value = value
      }
    },

    updateComponentSettings (componentId, settings) {
      const component = this.boardComponents.find(c => c.id === componentId)
      if (component && component.settings) {
        component.settings = { ...component.settings, ...settings }
      }
    },

    // --- Movement Actions ---
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
    updateMove (event) {
      if (!this.movingComponentInfo) return
      const component = this.boardComponents.find(c => c.id === this.movingComponentInfo.id)
      if (!component) return

      const boardRect = document.getElementById('circuit-board').getBoundingClientRect()
      const gridSize = 20

      component.x = Math.round((event.clientX - boardRect.left - this.movingComponentInfo.offsetX) / gridSize) * gridSize
      component.y = Math.round((event.clientY - boardRect.top - this.movingComponentInfo.offsetY) / gridSize) * gridSize

      this.updateConnectedWires(component.id)
    },
    endMove () {
      this.movingComponentInfo = null
    },

    startMoveWaypoint (wireId, waypointId, event) {
      const wire = this.wires.find(w => w.id === wireId)
      if (!wire) return
      const waypoint = wire.waypoints.find(wp => wp.id === waypointId)
      if (!waypoint) return

      const boardRect = document.getElementById('circuit-board').getBoundingClientRect()

      this.movingWaypointInfo = {
        wireId,
        waypointId,
        offsetX: event.clientX - boardRect.left - waypoint.x,
        offsetY: event.clientY - boardRect.top - waypoint.y
      }
      this.movingComponentInfo = null
    },

    updateMoveWaypoint (event) {
      if (!this.movingWaypointInfo) return
      const { wireId, waypointId, offsetX, offsetY } = this.movingWaypointInfo
      const wire = this.wires.find(w => w.id === wireId)
      if (!wire) return
      const waypoint = wire.waypoints.find(wp => wp.id === waypointId)
      if (!waypoint) return

      const boardRect = document.getElementById('circuit-board').getBoundingClientRect()
      const gridSize = 20

      const newX = event.clientX - boardRect.left - offsetX
      const newY = event.clientY - boardRect.top - offsetY

      waypoint.x = Math.round(newX / gridSize) * gridSize
      waypoint.y = Math.round(newY / gridSize) * gridSize
    },

    endMoveWaypoint () {
      this.movingWaypointInfo = null
    },

    // --- Wiring Actions ---
    startWiring (componentId, pinName) {
      this.movingComponentInfo = null
      this.movingWaypointInfo = null
      this.wiringInfo = {
        startComponentId: componentId,
        startPinName: pinName,
        tempWire: null
      }
    },
    updateWiring (event) {
      if (!this.wiringInfo) return

      if (!this.wiringInfo.tempWire) {
        const startCircleEl = document.querySelector(`#${this.wiringInfo.startComponentId} [data-pin-name="${this.wiringInfo.startPinName}"] .pin-circle`)
        if (!startCircleEl) return
        const startPos = this.getPinPosition(startCircleEl)
        this.wiringInfo.tempWire = { x1: startPos.x, y1: startPos.y, x2: startPos.x, y2: startPos.y }
      }

      const boardRect = document.getElementById('circuit-board').getBoundingClientRect()
      this.wiringInfo.tempWire.x2 = event.clientX - boardRect.left
      this.wiringInfo.tempWire.y2 = event.clientY - boardRect.top
    },
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

        const isInputPinOccupied = this.wires.some(w => w.toId === toId && w.toPin === toPin)

        if (isInputPinOccupied) {
          toast.error('Input pin is already connected.')
          this.wiringInfo = null
          return
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

    addWaypointToSelectedWire (event) {
      if (!this.selectedWireId) return
      const wire = this.wires.find(w => w.id === this.selectedWireId)
      if (!wire) return

      const boardRect = document.getElementById('circuit-board').getBoundingClientRect()
      const x = event.clientX - boardRect.left
      const y = event.clientY - boardRect.top

      const pathPoints = [{ x: wire.x1, y: wire.y1 }, ...wire.waypoints, { x: wire.x2, y: wire.y2 }]

      let closestSegmentIndex = -1
      let minDistance = Infinity

      for (let i = 0; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i]
        const p2 = pathPoints[i + 1]
        const dist = this.distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y)
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
    distanceToLineSegment (px, py, x1, y1, x2, y2) {
      const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2
      if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2
      t = Math.max(0, Math.min(1, t))
      const projectionX = x1 + t * (x2 - x1)
      const projectionY = y1 + t * (y2 - y1)
      return Math.sqrt((px - projectionX) ** 2 + (py - projectionY) ** 2)
    },

    getPinPosition (circleEl) {
      if (!circleEl) return { x: 0, y: 0 }
      const boardEl = document.getElementById('circuit-board')
      if (!boardEl) return { x: 0, y: 0 }

      const boardRect = boardEl.getBoundingClientRect()
      const circleRect = circleEl.getBoundingClientRect()

      const x = circleRect.left - boardRect.left + (circleRect.width / 2)
      const y = circleRect.top - boardRect.top + (circleRect.height / 2)

      return { x, y }
    },
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
          component.value = ''
        }
      })

      // If the simulation is running, force an immediate recalculation.
      if (this.simulationRunning) {
        this.tick()
      }
    },

    startSimulation () {
      if (this.simulationRunning) return
      this.simulationRunning = true
      this.simulationIntervalId = setInterval(() => {
        this.tick()
      }, 100)
    },

    stopSimulation () {
      if (!this.simulationRunning) return
      this.simulationRunning = false
      clearInterval(this.simulationIntervalId)
      this.simulationIntervalId = null
      this.wires.forEach(wire => {
        delete wire.value
      })
    },

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
          const outputPin = (component.name === 'Adder' || component.name === 'And' || component.name === 'Subtract' || component.name === 'Multiply' || component.name === 'Divide' || component.name === 'Xor' || component.name === 'SignalCheck' || component.name === 'Greater') ? 'SIGNAL_OUT' : 'VALUE_OUT'
          const key = `${component.id}:${outputPin}`
          const currentValue = outputValues.get(key)
          let newValue

          if (component.name === 'Constant') {
            newValue = component.value
          } else if (component.name === 'Random') {
            newValue = component.currentOutput
          } else if (component.name === 'Adder') {
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

                newValue = sum
              }
            }
          } else if (component.name === 'And') {
            const { lastSignalTimestamps, settings, inputs } = component
            const in1 = inputs?.SIGNAL_IN_1
            const in2 = inputs?.SIGNAL_IN_2
            const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
            const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

            const in1Truthy = in1 !== undefined && in1 !== '' && in1 !== '0'
            const in2Truthy = in2 !== undefined && in2 !== '' && in2 !== '0'

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
          } else if (component.name === 'Subtract') {
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

                newValue = difference
              }
            }
          } else if (component.name === 'Multiply') {
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

                newValue = product
              }
            }
          } else if (component.name === 'Divide') {
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

                newValue = quotient.toString()
              }
            }
          } else if (component.name === 'Xor') {
            const { lastSignalTimestamps, settings, inputs } = component
            const in1 = inputs?.SIGNAL_IN_1
            const in2 = inputs?.SIGNAL_IN_2
            const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
            const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

            const in1Truthy = in1 !== undefined && in1 !== '' && in1 !== '0'
            const in2Truthy = in2 !== undefined && in2 !== '' && in2 !== '0'

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
          } else if (component.name === 'SignalCheck') {
            const { settings, inputs } = component
            const signalIn = inputs?.SIGNAL_IN
            const targetSignal = inputs?.SET_TARGETSIGNAL ?? settings.target_signal
            const output = inputs?.SET_OUTPUT ?? settings.output

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
          } else if (component.name === 'Greater') {
            const { lastSignalTimestamps, settings, inputs } = component
            const in1 = inputs?.SIGNAL_IN_1
            const in2 = inputs?.SIGNAL_IN_2
            const in1Timestamp = lastSignalTimestamps?.SIGNAL_IN_1
            const in2Timestamp = lastSignalTimestamps?.SIGNAL_IN_2

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
          }

          if (newValue !== undefined && currentValue !== newValue) {
            outputValues.set(key, newValue)
            changedInLoop = true
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
              if (toComponent.inputs[wire.toPin] !== value) {
                toComponent.inputs[wire.toPin] = value
                changedInLoop = true // Input changed, may cause downstream changes.
                if (toComponent.name === 'Adder' || toComponent.name === 'And' || toComponent.name === 'Subtract' || toComponent.name === 'Multiply' || toComponent.name === 'Divide' || toComponent.name === 'Xor' || toComponent.name === 'Greater') {
                  if (!toComponent.lastSignalTimestamps) toComponent.lastSignalTimestamps = {}

                  if ((toComponent.name === 'And' || toComponent.name === 'Greater') && wire.toPin === 'SET_OUTPUT') {
                    if (toComponent.settings.output !== value) {
                      toComponent.settings.output = value
                    }
                  } else {
                    toComponent.lastSignalTimestamps[wire.toPin] = Date.now()
                  }
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
          component.value = component.inputs?.SIGNAL_IN_1 ?? ''
        }
      })
    },

    // --- Import/Export Actions ---
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
