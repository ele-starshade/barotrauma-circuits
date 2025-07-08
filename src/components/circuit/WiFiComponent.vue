<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="wifi">
    <ComponentPins class="pins-in" :count="2" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-wifi" />
      <div class="component-name">WiFi</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="wifi" :id="props.id">
    <div class="component-header">WiFi</div>
    <div class="component-body">
      <div class="component-pin in" data-pin-name="SIGNAL_IN">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_IN')"></div>
        <div class="pin-circle"></div>
        <span>SIGNAL_IN</span>
      </div>
      <div class="component-pin in" data-pin-name="SET_CHANNEL">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SET_CHANNEL')"></div>
        <div class="pin-circle"></div>
        <span>SET_CHANNEL</span>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_OUT')"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="WiFi Component">
      <div class="form-group">
        <label :for="`channel-${id}`">Channel</label>
        <input type="number" class="form-control" v-model.number="localSettings.channel" :id="`channel-${id}`" @change="updateSettings" />
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
    default: 'board'
  },
  settings: {
    type: Object,
    default: () => ({
      channel: 0
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
