<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="abs">
    <ComponentPins class="pins-in" :count="1" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-abs" />
      <div class="component-name">Abs</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="abs" :id="props.id">
    <div class="component-header">Abs</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCircuitStore } from '../../stores/circuit'
import ComponentPins from '../ComponentPins.vue'
import { handleWirePinClick } from '../../utils/wiringHandlers'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  }
})

const circuit = useCircuitStore()

</script>
