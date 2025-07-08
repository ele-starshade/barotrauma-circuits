<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="light">
    <font-awesome-icon v-if="props.isTool" :icon="['fas', 'wrench']" class="tool-icon tray" title="Tool Component" />
    <ComponentPins class="pins-in" :count="3" />

    <div class="icon-container">
      <font-awesome-icon :icon="['fas', 'lightbulb']" class="component-icon" />
      <div class="component-name">Light</div>
    </div>

    <ComponentPins class="pins-out" :count="0" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="light" :id="props.id">
    <div class="component-header">
      <span>Light</span>
      <font-awesome-icon :icon="['fas', 'wrench']" class="tool-icon" title="Tool Component" />
    </div>
    <div class="component-body">
      <div class="light-indicator" :style="{ backgroundColor: finalColor, boxShadow: lightGlow }"></div>
      <div class="component-pin in" data-pin-name="TOGGLE_STATE">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'TOGGLE_STATE', $event)"></div>
        <div class="pin-circle"></div>
        <span>TOGGLE_STATE</span>
      </div>
      <div class="component-pin in" data-pin-name="SET_STATE">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_STATE', $event)"></div>
        <div class="pin-circle"></div>
        <span>SET_STATE</span>
      </div>
      <div class="component-pin in" data-pin-name="SET_COLOR">
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SET_COLOR', $event)"></div>
        <div class="pin-circle"></div>
        <span>SET_COLOR</span>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Light Component">
      <div class="form-group">
        <label :for="`color-${id}`">Color</label>
        <input
          :id="`color-${id}`"
          type="color"
          class="form-control"
          v-model="displayColor"
          :disabled="isColorOverridden"
        >
      </div>
      <div class="form-group form-check">
        <input
          :id="`isOn-${id}`"
          type="checkbox"
          class="form-check-input"
          v-model="displayIsOn"
          :disabled="isStateOverridden"
        >
        <label class="form-check-label" :for="`isOn-${id}`">State</label>
      </div>
    </ConfigPanel>
  </Teleport>
</template>

<script setup>
import { useCircuitStore } from '../../../stores/circuit'
import ComponentPins from '../../ComponentPins.vue'
import ConfigPanel from '../../ConfigPanel.vue'
import { reactive, watch, computed } from 'vue'
import { handleWirePinClick } from '../../../utils/wiringHandlers'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  settings: {
    type: Object,
    default: () => ({
      color: '#ffffff', // white
      isOn: false
    })
  },
  isTool: {
    type: Boolean,
    default: true
  }
})

const circuit = useCircuitStore()

const isSelected = computed(() => circuit.selectedComponentId === props.id)
const componentData = computed(() => circuit.boardComponents.find(c => c.id === props.id))

const finalColor = computed(() => {
  if (componentData.value?.isOn) {
    return componentData.value.color || localSettings.color
  }

  return '#000000' // Off color
})

const lightGlow = computed(() => {
  if (componentData.value?.isOn) {
    const color = componentData.value.color || localSettings.color

    return `0 0 15px ${color}`
  }

  return 'none'
})

const localSettings = reactive({ ...props.settings })

watch(() => props.settings, (newSettings) => {
  Object.assign(localSettings, newSettings)
}, { deep: true })

function updateSettings () {
  circuit.updateComponentSettings(props.id, { ...localSettings })
}

const isColorOverridden = computed(() => {
  // A color is overridden if the SET_COLOR input exists on the component's data from the store
  return componentData.value?.inputs?.SET_COLOR !== undefined
})

const displayColor = computed({
  get () {
    // If overridden, show the live color from the component's root `color` property.
    // Otherwise, show the color from the editable `localSettings`.
    if (isColorOverridden.value) {
      // Fallback to black to prevent errors if the live color isn't immediately available
      return componentData.value?.color || '#000000'
    }

    return localSettings.color
  },
  set (newValue) {
    // This function is only called when the input is not disabled.
    if (!isColorOverridden.value) {
      localSettings.color = newValue
      updateSettings()
    }
  }
})

const isStateOverridden = computed(() => {
  return componentData.value?.inputs?.SET_STATE !== undefined || componentData.value?.inputs?.TOGGLE_STATE !== undefined
})

const displayIsOn = computed({
  get () {
    if (isStateOverridden.value) {
      return componentData.value?.isOn
    }

    return localSettings.isOn
  },
  set (newValue) {
    if (!isStateOverridden.value) {
      localSettings.isOn = newValue
      updateSettings()
    }
  }
})
</script>

<style scoped>
.light-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 10px auto;
  border: 2px solid #555;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.component-body {
  display: flex;
  flex-direction: column;
}
.component-pin {
  justify-content: flex-start;
}
</style>
