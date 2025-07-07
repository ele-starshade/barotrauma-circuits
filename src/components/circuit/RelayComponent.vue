<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="relay">
    <ComponentPins class="pins-in" :count="4" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-relay" />
      <div class="component-name">Relay</div>
    </div>

    <ComponentPins class="pins-out" :count="3" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="relay" :id="props.id">
    <div class="component-header">Relay</div>
    <div class="component-body">
      <div class="pins-container-in">
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
        <div class="component-pin in" data-pin-name="TOGGLE_STATE">
          <div class="new-wire-zone" @mousedown.stop="handleStartWiring('TOGGLE_STATE')"></div>
          <div class="pin-circle"></div>
          <span>TOGGLE_STATE</span>
        </div>
        <div class="component-pin in" data-pin-name="SET_STATE">
          <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SET_STATE')"></div>
          <div class="pin-circle"></div>
          <span>SET_STATE</span>
        </div>
      </div>
      <div class="pins-container-out">
        <div class="component-pin out" data-pin-name="SIGNAL_OUT_1">
          <span>SIGNAL_OUT_1</span>
          <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT_1')"></div>
          <div class="pin-circle"></div>
        </div>
        <div class="component-pin out" data-pin-name="SIGNAL_OUT_2">
          <span>SIGNAL_OUT_2</span>
          <div class="new-wire-zone" @mousedown.stop="handleStartWiring('SIGNAL_OUT_2')"></div>
          <div class="pin-circle"></div>
        </div>
        <div class="component-pin out" data-pin-name="STATE_OUT">
          <span>STATE_OUT</span>
          <div class="new-wire-zone" @mousedown.stop="handleStartWiring('STATE_OUT')"></div>
          <div class="pin-circle"></div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Relay Component">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.isOn" :id="`is-on-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`is-on-${id}`">
          Is on
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
    default: 'board'
  },
  settings: {
    type: Object,
    default: () => ({
      isOn: true
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
