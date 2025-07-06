<template>
  <div class="simulation-controls">
    <div class="d-flex align-items-center">
      <div v-if="circuit.simulationRunning" class="indicator-container d-flex align-items-center text-success">
        <font-awesome-icon :icon="['fas', 'gear']" spin />
        <span class="indicator-text ms-2">Running...</span>
      </div>
      <button class="btn btn-danger btn-sm ms-3" @click="circuit.stopSimulation()" v-if="circuit.simulationRunning">
        Stop Simulation
        <font-awesome-icon class="ms-2" :icon="['fas', 'stop']" />
      </button>
      <button class="btn btn-success btn-sm" @click="circuit.startSimulation()" v-else>
        Start Simulation
        <font-awesome-icon class="ms-2" :icon="['fas', 'play']" />
      </button>
    </div>
    <div class="d-flex align-items-center">
      <button class="btn btn-secondary btn-sm" @click="circuit.exportState()">
        Export
        <font-awesome-icon class="ms-2" :icon="['fas', 'file-export']" />
      </button>
      <button class="btn btn-secondary btn-sm ms-2" @click="handleImport">
        Import
        <font-awesome-icon class="ms-2" :icon="['fas', 'file-import']" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCircuitStore } from '../stores/circuit'

const circuit = useCircuitStore()

function handleImport () {
  const encodedString = prompt('Please paste the circuit data string:')
  if (encodedString) {
    circuit.importState(encodedString)
  }
}
</script>

<style scoped>
.indicator-text {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
