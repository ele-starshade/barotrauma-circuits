<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="delay">
    <ComponentPins class="pins-in" :count="1" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-delay" />
      <div class="component-name">Delay</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="delay" :id="props.id">
    <div class="component-header">Delay</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN', $event)"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN</span>
      </div>
       <div class="component-pin in" data-pin-name="SET_DELAY">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_DELAY', $event)"></div>
        <div class="pin-circle"></div>
        <span>SET_DELAY</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Delay Component">
      <div class="form-group">
        <label :for="`delay-time-${id}`">Delay (seconds)</label>
        <input type="number" class="form-control" v-model.number="localSettings.delay" :id="`delay-time-${id}`" @change="updateSettings" step="0.1" />
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.resetOnNewSignal" :id="`reset-new-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`reset-new-${id}`">
          Reset when signal received
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="localSettings.resetOnDifferentSignal" :id="`reset-diff-${id}`" @change="updateSettings">
        <label class="form-check-label" :for="`reset-diff-${id}`">
          Reset when different signal received
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
      delay: 1.0,
      resetOnNewSignal: false,
      resetOnDifferentSignal: false
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
