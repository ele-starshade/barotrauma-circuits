<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="display">
    <font-awesome-icon v-if="props.isTool" :icon="['fas', 'wrench']" class="tool-icon tray" title="Tool Component" />
    <ComponentPins class="pins-in" :count="1" />

    <div class="icon-container">
      <font-awesome-icon :icon="['fas', 'desktop']" class="component-icon fa-sm" />
      <div class="component-name">Display</div>
    </div>

    <ComponentPins class="pins-out" :count="0" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="display" :id="props.id">
    <div class="component-header">
      <span>Display</span>
      <font-awesome-icon :icon="['fas', 'wrench']" class="tool-icon" title="Tool Component" />
    </div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN_1">
        <div class="pin-circle"></div>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_IN_1', $event)"></div>
        <span>SIGNAL_IN_1</span>
      </div>
      <div v-if="component" class="component-value-display">
        {{ component.value ?? 'no signal' }}
      </div>
    </div>
  </div>

</template>

<script setup>
import { computed } from 'vue'
import { useCircuitStore } from '../../../stores/circuit'
import ComponentPins from '../../ComponentPins.vue'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  value: {
    type: [String, null],
    default: null
  },
  isTool: {
    type: Boolean,
    default: false
  }
})

const circuit = useCircuitStore()

function handleWirePinClick (pinName, event) {
  if (props.mode !== 'board') return

  if (circuit.justEndedWiring) {
    circuit.justEndedWiring = false

    return
  }

  if (circuit.wiringInfo) {
    // End wiring, pass the .pin-circle element of this pin
    const pinCircle = event.currentTarget.parentElement.querySelector('.pin-circle')

    circuit.endWiring(pinCircle)
  } else {
    circuit.startWiring(props.id, pinName)
  }
}

const component = computed(() => {
  return circuit.boardComponents.find(c => c.id === props.id)
})
</script>
