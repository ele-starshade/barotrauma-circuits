<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="equals">
    <ComponentPins class="pins-in" :count="2" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-equals" />
      <div class="component-name">Equals</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="equals" :id="props.id">
    <div class="component-header">Equals</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN_1">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN_1', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_1</span>
      </div>
      <div class="component-pin in" data-pin-name="SIGNAL_IN_2">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN_2', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_2</span>
      </div>
       <div class="component-pin in" data-pin-name="SET_OUTPUT">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_OUTPUT', $event)"></div>
        <div class="pin-circle"></div>
        <span>SET_OUTPUT</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Equals Component">
        <div class="form-group">
            <label :for="`output-${id}`">Output</label>
            <input class="form-control" type="text" v-model="localSettings.output" :id="`output-${id}`" @change="updateSettings">
        </div>
        <div class="form-group">
            <label :for="`false-output-${id}`">False Output</label>
            <input class="form-control" type="text" v-model="localSettings.falseOutput" :id="`false-output-${id}`" @change="updateSettings">
        </div>
        <div class="form-group">
            <label :for="`timeframe-${id}`">Timeframe</label>
            <input class="form-control" type="number" v-model.number="localSettings.timeframe" :id="`timeframe-${id}`" @change="updateSettings" step="0.1">
        </div>
        <div class="form-group">
            <label :for="`max-output-length-${id}`">Max Output Length</label>
            <input class="form-control" type="number" v-model.number="localSettings.maxOutputLength" :id="`max-output-length-${id}`" @change="updateSettings">
        </div>
    </ConfigPanel>
  </Teleport>
</template>

<script setup>
import { useCircuitStore } from '../../stores/circuit'
import ComponentPins from '../ComponentPins.vue'
import ConfigPanel from '../ConfigPanel.vue'
import { handleWirePinClick } from '../../utils/wiringHandlers'
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  settings: {
    type: Object,
    default: () => ({
      maxOutputLength: 200,
      output: '1',
      falseOutput: '0',
      timeframe: 0.0
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
  circuit.updateComponentSettings(props.id, { ...localSettings })
}
</script>
