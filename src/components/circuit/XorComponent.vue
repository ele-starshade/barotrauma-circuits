<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="xor">
    <ComponentPins class="pins-in" :count="3" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-xor" />
      <div class="component-name">XOR</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="xor" :id="props.id">
    <div class="component-header">XOR</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN_1">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_IN_1')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_1</span>
      </div>
      <div class="component-pin in" data-pin-name="SIGNAL_IN_2">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_IN_2')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_2</span>
      </div>
      <div class="component-pin in" data-pin-name="SET_OUTPUT">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SET_OUTPUT')"></div>
        <div class="pin-circle"></div>
        <span>SET_OUTPUT</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="XOR Component">
      <div class="form-group">
        <label :for="`timeframe-${id}`" title="The item must have received signals to both inputs within this timeframe to output the result. If set to 0, the inputs must be received at the same time">Timeframe</label>
        <input :id="`timeframe-${id}`" type="number" class="form-control" v-model.number="localSettings.timeframe" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`max-output-length-${id}`" title="The maximum length of the output string.">Max Output Length</label>
        <input :id="`max-output-length-${id}`" type="number" class="form-control" v-model.number="localSettings.maxOutputLength" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`output-${id}`" title="The signal sent when the condition is met.">Output</label>
        <input :id="`output-${id}`" type="text" class="form-control" v-model="effectiveOutput" @input="updateSettings" :disabled="isOutputOverridden">
      </div>
      <div class="form-group">
        <label :for="`false-output-${id}`" title="The signal sent when the condition is not met (if empty, no signal is sent).">False output</label>
        <input :id="`false-output-${id}`" type="text" class="form-control" v-model="localSettings.falseOutput" @input="updateSettings">
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
  componentData: {
    type: Object,
    default: () => ({})
  },
  settings: {
    type: Object,
    default: () => ({
      timeframe: 0.0,
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
</script>
