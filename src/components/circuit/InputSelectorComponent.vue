<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="input_selector">
    <ComponentPins class="pins-in" :count="7" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-input-selector" />
      <div class="component-name">Input Selector</div>
    </div>

    <ComponentPins class="pins-out" :count="2" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="input_selector" :id="props.id">
    <div class="component-header">Input Selector</div>
    <div class="component-body">
      <!-- Input pins 0-9 -->
      <div v-for="i in 10" :key="`in-${i-1}`" class="component-pin in" :data-pin-name="`SIGNAL_IN_${i-1}`">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring(`SIGNAL_IN_${i-1}`)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_{{i-1}}</span>
      </div>
      <!-- Control pins -->
      <div class="component-pin in" data-pin-name="SET_INPUT">
         <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SET_INPUT')"></div>
        <div class="pin-circle"></div>
        <span>SET_INPUT</span>
      </div>
       <div class="component-pin in" data-pin-name="MOVE_INPUT">
         <div class="new-wire-zone" @mousedown.stop="handleStartWiring('MOVE_INPUT')"></div>
        <div class="pin-circle"></div>
        <span>MOVE_INPUT</span>
      </div>
      <!-- Output pins -->
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
       <div class="component-pin out" data-pin-name="SELECTED_INPUT_OUT">
        <span>SELECTED_INPUT_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SELECTED_INPUT_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Input Selector Component">
      <div class="form-group">
        <label :for="`selected-connection-${id}`">Selected connection</label>
        <input type="number" class="form-control" v-model.number="localSettings.selectedConnection" :id="`selected-connection-${id}`" @change="updateSettings" min="0" max="9" />
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.wrapAround" :id="`wrap-around-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`wrap-around-${id}`">
          Wrap around
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.skipEmptyConnections" :id="`skip-empty-${id}`" @change="updateSettings">
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

function handleStartWiring (pinName) {
  if (props.mode === 'board') {
    circuit.startWiring(props.id, pinName)
  }
}
</script>
