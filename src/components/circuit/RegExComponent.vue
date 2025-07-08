<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="regex">
    <ComponentPins class="pins-in" :count="2" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-regex" />
      <div class="component-name">RegEx</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="regex" :id="props.id">
    <div class="component-header">RegEx</div>
    <div class="component-body">
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
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="RegEx Component">
      <div class="form-group">
        <label :for="`expression-${id}`">Expression</label>
        <input type="text" class="form-control" v-model="localSettings.expression" :id="`expression-${id}`" @change="updateSettings" />
      </div>
      <div class="form-group">
        <label :for="`output-${id}`">Output</label>
        <input type="text" class="form-control" v-model="localSettings.output" :id="`output-${id}`" @change="updateSettings" />
      </div>
      <div class="form-group">
        <label :for="`false-output-${id}`">False output</label>
        <input type="text" class="form-control" v-model="localSettings.falseOutput" :id="`false-output-${id}`" @change="updateSettings" />
      </div>
      <div class="form-group">
        <label :for="`max-output-length-${id}`">Max output length</label>
        <input type="number" class="form-control" v-model.number="localSettings.maxOutputLength" :id="`max-output-length-${id}`" @change="updateSettings" />
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.useCaptureGroup" :id="`use-capture-group-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`use-capture-group-${id}`">
          Use capture group
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.outputEmptyCaptureGroup" :id="`output-empty-capture-group-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`output-empty-capture-group-${id}`">
          Output empty capture group
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.continuousOutput" :id="`continuous-output-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`continuous-output-${id}`">
          Continuous output
        </label>
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
    default: 'board'
  },
  settings: {
    type: Object,
    default: () => ({
      expression: '',
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200,
      useCaptureGroup: false,
      outputEmptyCaptureGroup: false,
      continuousOutput: true
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
