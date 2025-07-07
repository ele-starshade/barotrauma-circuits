<template>
  <header id="top-bar">
    <!-- Left Section: File Controls & Limit Toggle -->
    <div class="top-bar-section left">
      <button class="btn btn-secondary btn-sm" @click="circuit.exportState()">
        Export
        <font-awesome-icon class="ms-2" :icon="['fas', 'file-export']" />
      </button>
      <button class="btn btn-secondary btn-sm ms-2" @click="handleImport">
        Import
        <font-awesome-icon class="ms-2" :icon="['fas', 'file-import']" />
      </button>
      <div class="form-check form-switch ms-3">
        <input
          id="limitSwitch"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="circuit.isComponentLimitEnabled"
          @change="circuit.toggleComponentLimit()"
        >
        <label class="form-check-label" for="limitSwitch">Limit Components</label>
      </div>
    </div>

    <!-- Center Section: Component Counter -->
    <div class="top-bar-section center">
      <div class="component-counter">
        <span>Components: {{ componentCount }}
          <span v-if="circuit.isComponentLimitEnabled">/ {{ circuit.componentLimit }}</span>
        </span>
      </div>
    </div>

    <!-- Right Section: Simulation Controls -->
    <div class="top-bar-section right">
      <div v-if="circuit.simulationRunning" class="indicator-container d-flex align-items-center text-success">
        <font-awesome-icon :icon="['fas', 'gear']" spin />
        <span class="indicator-text ms-2">Running...</span>
      </div>
      <button v-if="circuit.simulationRunning" class="btn btn-danger btn-sm ms-3" @click="circuit.stopSimulation()">
        Stop Simulation
        <font-awesome-icon class="ms-2" :icon="['fas', 'stop']" />
      </button>
      <button v-else class="btn btn-success btn-sm" @click="circuit.startSimulation()">
        Start Simulation
        <font-awesome-icon class="ms-2" :icon="['fas', 'play']" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useCircuitStore } from '../stores/circuit'

const circuit = useCircuitStore()

// Logic from ComponentCounter.vue
const componentCount = computed(() => circuit.boardComponents.filter(c => !c.isTool).length)

/**
 * Handles the import of circuit data from a user-provided encoded string
 * @returns {void}
 *
 * @description
 * This function prompts the user to input an encoded circuit data string and
 * attempts to import the circuit state if a valid string is provided. It uses
 * the browser's built-in prompt dialog to collect the encoded data from the user.
 *
 * The function performs the following operations:
 * - Displays a prompt dialog asking the user to paste the circuit data string
 * - Checks if the user provided a non-empty string
 * - Calls the circuit store's importState method with the provided string
 * - Does nothing if the user cancels the prompt or provides an empty string
 *
 * This function is typically called when the user clicks an import button
 * in the top bar interface. The imported circuit data will replace the current
 * circuit state if the import is successful.
 *
 * @example
 * // Call this function when user clicks import button
 * handleImport()
 *
 * // User will see a prompt dialog asking for circuit data
 * // If they paste a valid encoded string, the circuit will be imported
 * // If they cancel or provide empty input, nothing happens
 */
function handleImport () {
  const encodedString = prompt('Please paste the circuit data string:')

  if (encodedString) {
    circuit.importState(encodedString)
  }
}
</script>

<style scoped>
#top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-medium);
  border-bottom: 2px solid var(--background-light);
  padding: 0.5rem 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  z-index: 1000;
  box-sizing: border-box;
}

.top-bar-section {
  display: flex;
  align-items: center;
  flex-basis: 33.33%;
}

.top-bar-section.left {
  justify-content: flex-start;
}

.top-bar-section.center {
  justify-content: center;
}

.top-bar-section.right {
  justify-content: flex-end;
}

/* Copied from SimulationControls.vue for the running indicator */
.indicator-text {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
