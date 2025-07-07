<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="memory">
    <ComponentPins class="pins-in" :count="2" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-memory" />
      <div class="component-name">Memory</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="memory" :id="props.id">
    <div class="component-header">Memory</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_IN')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN</span>
      </div>
      <div class="component-pin in" data-pin-name="LOCK_STATE">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('LOCK_STATE')"></div>
        <div class="pin-circle"></div>
        <span>LOCK_STATE</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
       <div class="component-value-display" v-if="localSettings.value">
        {{ localSettings.value }}
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Memory Component">
        <div class="form-group">
            <label :for="`value-${id}`">Value</label>
            <input class="form-control" type="text" v-model="localSettings.value" :id="`value-${id}`" @change="updateSettings">
        </div>
        <div class="form-group">
            <label :for="`max-value-length-${id}`">Max Value Length</label>
            <input class="form-control" type="number" v-model.number="localSettings.maxValueLength" :id="`max-value-length-${id}`" @change="updateSettings">
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="localSettings.writeable" :id="`writeable-${id}`" @change="updateSettings">
          <label class="form-check-label" :for="`writeable-${id}`">
            Writeable
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
      maxValueLength: 200,
      value: '',
      writeable: true
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
