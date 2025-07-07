<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="signalcheck">
    <ComponentPins class="pins-in" :count="3" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-signal-check" />
      <div class="component-name">Signal Check</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="signalcheck" :id="props.id">
    <div class="component-header">Signal Check</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_IN')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN</span>
      </div>
      <div class="component-pin in" data-pin-name="SET_TARGETSIGNAL">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SET_TARGETSIGNAL')"></div>
        <div class="pin-circle"></div>
        <span>TARGET_SIGNAL</span>
      </div>
       <div class="component-pin in" data-pin-name="SET_OUTPUT">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SET_OUTPUT')"></div>
        <div class="pin-circle"></div>
        <span>SET_OUTPUT</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Signal Check Component">
      <div class="form-group">
        <label :for="`target-signal-${id}`" title="The signal to compare the input against.">Target Signal</label>
        <input :id="`target-signal-${id}`" type="text" class="form-control" v-model="localSettings.target_signal" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`output-${id}`" title="The signal sent when the input matches the target signal.">Output</label>
        <input :id="`output-${id}`" type="text" class="form-control" v-model="effectiveOutput" @input="updateSettings" :disabled="isOutputOverridden">
      </div>
      <div class="form-group">
        <label :for="`false-output-${id}`" title="The signal sent when the input does not match (if empty, no signal is sent).">False output</label>
        <input :id="`false-output-${id}`" type="text" class="form-control" v-model="localSettings.falseOutput" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`max-output-length-${id}`" title="The maximum length of the output strings. Warning: Large values can lead to high memory usage or networking issues.">Max Output Length</label>
        <input :id="`max-output-length-${id}`" type="number" class="form-control" v-model.number="localSettings.maxOutputLength" @input="updateSettings">
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
  componentData: {
    type: Object,
    default: () => ({})
  },
  settings: {
    type: Object,
    default: () => ({
      target_signal: '1',
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200
    })
  }
})

const circuit = useCircuitStore()

const isSelected = computed(() => circuit.selectedComponentId === props.id)

const isOutputOverridden = computed(() => props.componentData?.inputs?.SET_OUTPUT !== undefined)

const effectiveOutput = computed({
  get: () => {
    if (isOutputOverridden.value) {
      return props.componentData.inputs.SET_OUTPUT
    }

    return localSettings.output
  },
  set: (newValue) => {
    if (!isOutputOverridden.value) {
      localSettings.output = newValue
    }
  }
})

const localSettings = reactive({ ...props.settings })

watch(() => props.settings, (newSettings) => {
  Object.assign(localSettings, newSettings)
}, { deep: true })

function updateSettings () {
  circuit.updateComponentSettings(props.id, { ...localSettings })
}

function handleStartWiring (pinName) {
  // We only allow wiring on the board, not in the tray.
  if (props.mode === 'board') {
    circuit.startWiring(props.id, pinName)
  }
}
</script>
