<template>
  <main
    id="circuit-board"
    class="vh-100"
    @drop="onDrop"
    @dragover.prevent="onDragOver"
    @dragend="onDragEnd"
    @mousedown.self="circuit.clearSelection()"
  >
    <SimulationControls />
    <ComponentCounter />
    <div id="config-panel-container"></div>
    <!-- Ghost component for drag-and-drop -->
    <component
      v-if="circuit.ghostComponent"
      :is="circuit.ghostComponent.is"
      :style="{
        position: 'absolute',
        left: `${circuit.ghostComponent.x}px`,
        top: `${circuit.ghostComponent.y}px`,
        opacity: 0.7,
        pointerEvents: 'none',
      }"
      mode="board"
    />
    <!-- Components on the board -->
    <component
      v-for="component in circuit.boardComponents"
      :key="component.id"
      :id="component.id"
      :is="component.is"
      :style="{ position: 'absolute', left: `${component.x}px`, top: `${component.y}px` }"
      :data-id="component.id"
      :class="{
        'is-moving': circuit.movingComponentInfo && circuit.movingComponentInfo.id === component.id,
        'selected': circuit.selectedComponentId === component.id
      }"
      class="component"
      @mousedown="onComponentMouseDown(component.id, $event)"
    />

    <!-- Wires -->
    <svg id="wire-layer" class="position-absolute w-100 h-100" style="pointer-events: none;">
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

  <ComponentTray />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useCircuitStore } from './stores/circuit'

import ComponentCounter from './components/ComponentCounter.vue'
import SimulationControls from './components/SimulationControls.vue'
import WireLabel from './components/WireLabel.vue'
import ComponentTray from './components/ComponentTray.vue'

const circuit = useCircuitStore()

function onDragOver (event) {
  circuit.updateGhostComponentPosition(event)
}

function onDragEnd () {
  // Clear the ghost component if the drag is cancelled
  circuit.ghostComponent = null
}

function onDrop (event) {
  event.preventDefault()
  circuit.addComponent()
}

function onComponentMouseDown (componentId, event) {
  circuit.selectComponent(componentId)
  circuit.startMove(componentId, event)
}

function getWirePoints (wire) {
  const points = [
    { x: wire.x1, y: wire.y1 },
    ...wire.waypoints,
    { x: wire.x2, y: wire.y2 }
  ]
  return points.map(p => `${p.x},${p.y}`).join(' ')
}

function onWireMouseDown (wireId, event) {
  circuit.selectWire(wireId)
  if (event.ctrlKey) {
    circuit.addWaypointToSelectedWire(event)
  }
}

function onWaypointMouseDown (wireId, waypointId, event) {
  circuit.startMoveWaypoint(wireId, waypointId, event)
}

function onMouseMove (event) {
  if (circuit.ghostComponent) return
  if (circuit.movingWaypointInfo) {
    circuit.updateMoveWaypoint(event)
  } else if (circuit.movingComponentInfo) {
    circuit.updateMove(event)
  } else if (circuit.wiringInfo) {
    circuit.updateWiring(event)
  }
}

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

function handleKeyDown (event) {
  const targetTagName = event.target.tagName
  if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') {
    return
  }
  if (event.key === 'Delete' || event.key === 'Backspace') {
    circuit.deleteSelection()
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
