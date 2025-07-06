<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="constant">
    <font-awesome-icon v-if="props.isTool" :icon="['fas', 'wrench']" class="tool-icon tray" title="Tool Component" />
    <ComponentPins class="pins-in" :count="0" />

    <div class="icon-container">
      <font-awesome-icon :icon="['fas', 'hashtag']" class="component-icon" />
      <div class="component-name">Constant</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="constant" :id="props.id">
    <div class="component-header">
      <span>Constant</span>
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
    <ConfigPanel title="Constant Component">
      <div class="form-group">
        <label for="signal-value">Output Signal</label>
        <input
          id="signal-value"
          type="text"
          class="form-control"
          :value="component.value"
          @input="updateValue($event.target.value)"
        />
      </div>
    </ConfigPanel>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useCircuitStore } from '../../../stores/circuit'
import ComponentPins from '../../ComponentPins.vue'
import ConfigPanel from '../../ConfigPanel.vue'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  value: {
    type: String,
    default: '0'
  },
  isTool: {
    type: Boolean,
    default: false
  }
})

const circuit = useCircuitStore()

function handleStartWiring (pinName) {
  // We only allow wiring on the board, not in the tray.
  if (props.mode === 'board') {
    circuit.startWiring(props.id, pinName)
  }
}

const isSelected = computed(() => circuit.selectedComponentId === props.id)

const component = computed(() => {
  return circuit.boardComponents.find(c => c.id === props.id)
})

function updateValue (value) {
  circuit.updateComponentValue(props.id, value)
}
</script>
