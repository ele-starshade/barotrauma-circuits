<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="square-root">
    <ComponentPins class="pins-in" :count="1" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-square-root" />
      <div class="component-name">Square Root</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="square-root" :id="props.id">
    <div class="component-header">Square Root</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_IN')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCircuitStore } from '../../stores/circuit'
import ComponentPins from '../ComponentPins.vue'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board'
  }
})

const circuit = useCircuitStore()

function handleStartWiring (pinName) {
  if (props.mode === 'board') {
    circuit.startWiring(props.id, pinName)
  }
}
</script>
