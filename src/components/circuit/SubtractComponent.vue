<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="subtract">
    <ComponentPins class="pins-in" :count="2" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-subtract" />
      <div class="component-name">Subtract</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="subtract" :id="props.id">
    <div class="component-header">Subtract</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN_1">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_IN_1')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_1</span>
      </div>
      <div class="component-pin in" data-pin-name="SIGNAL_IN_2">
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_IN_2')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_2</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Subtract Component">
      <div class="form-group">
        <label :for="`clamp-max-${id}`" title="The output of the item is restricted below this value.">Clamp max</label>
        <input :id="`clamp-max-${id}`" type="number" class="form-control" v-model.number="localSettings.clampMax" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`clamp-min-${id}`" title="The output of the item is restricted above this value.">Clamp min</label>
        <input :id="`clamp-min-${id}`" type="number" class="form-control" v-model.number="localSettings.clampMin" @input="updateSettings">
      </div>
      <div class="form-group">
        <label :for="`timeframe-${id}`" title="The item must have received signals to both inputs within this timeframe to output the result. If set to 0, the inputs must be received at the same time">Timeframe</label>
        <input :id="`timeframe-${id}`" type="number" class="form-control" v-model.number="localSettings.timeframe" @input="updateSettings">
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
      clampMax: 999999.0,
      clampMin: -999999.0,
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

function handleStartWiring (pinName) {
  // We only allow wiring on the board, not in the tray.
  if (props.mode === 'board') {
    circuit.startWiring(props.id, pinName)
  }
}
</script>
