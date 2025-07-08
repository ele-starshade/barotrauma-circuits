<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="oscillator">
    <ComponentPins class="pins-in" :count="2" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-oscillator" />
      <div class="component-name">Oscillator</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="oscillator" :id="props.id">
    <div class="component-header">Oscillator</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SET_FREQUENCY">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_FREQUENCY', $event)"></div>
        <div class="pin-circle"></div>
        <span>SET_FREQUENCY</span>
      </div>
      <div class="component-pin in" data-pin-name="SET_OUTPUTTYPE">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_OUTPUTTYPE', $event)"></div>
        <div class="pin-circle"></div>
        <span>SET_OUTPUTTYPE</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Oscillator Component">
      <div class="form-group">
        <label :for="`frequency-${id}`">Frequency (Hz)</label>
        <input type="number" class="form-control" v-model.number="localSettings.frequency" :id="`frequency-${id}`" @change="updateSettings" />
      </div>
      <div class="form-group">
        <label :for="`output-type-${id}`">Output type</label>
        <select class="form-select" v-model.number="localSettings.outputType" :id="`output-type-${id}`" @change="updateSettings">
          <option value="0">Pulse</option>
          <option value="1">Sawtooth</option>
          <option value="2">Sine</option>
          <option value="3">Square</option>
          <option value="4">Triangle</option>
        </select>
      </div>
    </ConfigPanel>
  </Teleport>
</template>

<script setup>
import { useCircuitStore } from '../../stores/circuit'
import ComponentPins from '../ComponentPins.vue'
import ConfigPanel from '../ConfigPanel.vue'
import { reactive, watch, computed } from 'vue'
import { handleWirePinClick } from '../../utils/wiringHandlers'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  settings: {
    type: Object,
    default: () => ({
      frequency: 1,
      outputType: 0 // 0: Pulse, 1: Sawtooth, 2: Sine, 3: Square, 4: Triangle
    })
  }
})

const circuit = useCircuitStore()

const isSelected = computed(() => circuit.selectedComponentId === props.id)

const localSettings = reactive({ ...props.settings })

watch(() => props.settings, (newSettings) => {
  Object.assign(localSettings, newSettings)
}, { deep: true })

function updateSettings () {
  const settingsToUpdate = {
    ...localSettings,
    outputType: Number(localSettings.outputType)
  }

  circuit.updateComponentSettings(props.id, settingsToUpdate)
}
</script>
