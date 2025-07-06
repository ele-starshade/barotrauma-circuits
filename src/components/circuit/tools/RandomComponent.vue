<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="random">
    <font-awesome-icon v-if="props.isTool" :icon="['fas', 'wrench']" class="tool-icon tray" title="Tool Component" />
    <ComponentPins class="pins-in" :count="0" />

    <div class="icon-container">
      <font-awesome-icon :icon="['fas', 'dice']" class="component-icon" />
      <div class="component-name">Random</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="random" :id="props.id">
    <div class="component-header">
      <span>Random</span>
      <font-awesome-icon :icon="['fas', 'wrench']" class="tool-icon" title="Tool Component" />
    </div>
    <div class="component-body">
      <div class="component-pin out" data-pin-name="VALUE_OUT">
        <span>VALUE_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('VALUE_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Random Component">
      <div class="form-group">
        <label :for="`min-${id}`">Min</label>
        <input :id="`min-${id}`" type="number" class="form-control" v-model.number="localSettings.min" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`max-${id}`">Max</label>
        <input :id="`max-${id}`" type="number" class="form-control" v-model.number="localSettings.max" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`period-${id}`">Period (ms)</label>
        <input :id="`period-${id}`" type="number" class="form-control" v-model.number="localSettings.period" @input="updateSettings">
      </div>
    </ConfigPanel>
  </Teleport>
</template>

<script setup>
import { useCircuitStore } from '../../../stores/circuit'
import ComponentPins from '../../ComponentPins.vue'
import ConfigPanel from '../../ConfigPanel.vue'
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  settings: {
    type: Object,
    default: () => ({ min: 0, max: 1, period: 1000 })
  },
  isTool: {
    type: Boolean,
    default: false
  }
})

const circuit = useCircuitStore()

const isSelected = computed(() => circuit.selectedComponentId === props.id)

const localSettings = reactive({ ...props.settings })

watch(() => props.settings, (newSettings) => {
  Object.assign(localSettings, newSettings)
}, { deep: true })

function updateSettings () {
  circuit.updateComponentSettings(props.id, {
    min: Number(localSettings.min),
    max: Number(localSettings.max),
    period: Number(localSettings.period)
  })
}

function handleStartWiring (pinName) {
  // We only allow wiring on the board, not in the tray.
  if (props.mode === 'board') {
    circuit.startWiring(props.id, pinName)
  }
}
</script>
