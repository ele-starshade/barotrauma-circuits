<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="output-selector">
    <ComponentPins class="pins-in" :count="3" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-output-selector" />
      <div class="component-name">Output Selector</div>
    </div>

    <ComponentPins class="pins-out" :count="7" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based component-wide" data-component-type="output-selector" :id="props.id">
    <div class="component-header">Output Selector</div>
    <div class="component-body">
      <div class="pins-container-in">
        <div class="component-pin in" data-pin-name="SIGNAL_IN">
          <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN', $event)"></div>
          <div class="pin-circle"></div>
          <span>SIGNAL_IN</span>
        </div>
        <div class="component-pin in" data-pin-name="SET_OUTPUT">
          <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_OUTPUT', $event)"></div>
          <div class="pin-circle"></div>
          <span>SET_OUTPUT</span>
        </div>
        <div class="component-pin in" data-pin-name="MOVE_OUTPUT">
          <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'MOVE_OUTPUT', $event)"></div>
          <div class="pin-circle"></div>
          <span>MOVE_OUTPUT</span>
        </div>
      </div>
      <div class="pins-container-out">
        <div v-for="i in 10" :key="i" class="component-pin out" :data-pin-name="`SIGNAL_OUT_${i - 1}`">
          <span>{{ `SIGNAL_OUT_${i - 1}` }}</span>
          <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, `SIGNAL_OUT_${i - 1}`, $event)"></div>
          <div class="pin-circle"></div>
        </div>
        <div class="component-pin out" data-pin-name="SELECTED_OUTPUT_OUT">
          <span>SELECTED_OUTPUT_OUT</span>
          <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SELECTED_OUTPUT_OUT', $event)"></div>
          <div class="pin-circle"></div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Output Selector Component">
      <div class="form-group">
        <label :for="`selected-connection-${id}`">Selected connection</label>
        <input type="number" class="form-control" v-model.number="localSettings.selectedConnection"
          :id="`selected-connection-${id}`" @change="updateSettings" min="0" max="9" />
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.wrapAround" :id="`wrap-around-${id}`"
          @change="updateSettings">
        <label class="form-check-label" :for="`wrap-around-${id}`">
          Wrap around
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.skipEmptyConnections"
          :id="`skip-empty-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`skip-empty-${id}`">
          Skip empty connections
        </label>
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
      selectedConnection: 0,
      wrapAround: true,
      skipEmptyConnections: true
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
