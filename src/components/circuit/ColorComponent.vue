<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="color">
    <ComponentPins class="pins-in" :count="4" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-color" />
      <div class="component-name">Color</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="color" :id="props.id">
    <div class="component-header">Color</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN_R">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN_R', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_R</span>
      </div>
      <div class="component-pin in" data-pin-name="SIGNAL_IN_G">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN_G', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_G</span>
      </div>
      <div class="component-pin in" data-pin-name="SIGNAL_IN_B">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN_B', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_B</span>
      </div>
      <div class="component-pin in" data-pin-name="SIGNAL_IN_A">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN_A', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN_A</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Color Component">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.useHSV" :id="`use-hsv-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`use-hsv-${id}`">
          Use HSV
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
      useHSV: false
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
