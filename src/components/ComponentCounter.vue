<template>
  <div class="component-counter">
    <span>Components: {{ componentCount }}
      <span v-if="circuit.isComponentLimitEnabled">/ {{ circuit.componentLimit }}</span>
    </span>
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="limitSwitch"
        :checked="circuit.isComponentLimitEnabled"
        @change="circuit.toggleComponentLimit()"
      >
      <label class="form-check-label" for="limitSwitch">Limit</label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCircuitStore } from '../stores/circuit'

const circuit = useCircuitStore()
const componentCount = computed(() => circuit.boardComponents.filter(c => !c.isTool).length)
</script>
