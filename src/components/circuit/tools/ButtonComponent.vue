<template>
  <!-- Tray Version (Graphical) -->
  <div v-if="mode === 'tray'" v-bind="$attrs" class="component graphical" data-component-type="button">
    <font-awesome-icon v-if="props.isTool" :icon="['fas', 'wrench']" class="tool-icon tray" title="Tool Component" />
    <ComponentPins class="pins-in" :count="0" />

    <div class="icon-container">
      <div class="component-icon-sprite icon-button" />
      <div class="component-name">Button</div>
    </div>

    <ComponentPins class="pins-out" :count="1" />
  </div>

  <!-- Board Version (Text-based) -->
  <div v-else v-bind="$attrs" class="component text-based" data-component-type="button" :id="props.id">
    <div class="component-header">
      <span>Button</span>
      <font-awesome-icon :icon="['fas', 'wrench']" class="tool-icon" title="Tool Component" />
    </div>
    <div class="component-body">
      <div class="button-container">
        <button 
          class="circuit-button" 
          @click="pressButton"
          :class="{ 'pressed': isPressed }"
        >
          Press
        </button>
      </div>
      <div class="component-pin out" data-pin-name="SIGNAL_OUT">
        <span>SIGNAL_OUT</span>
        <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick('SIGNAL_OUT', $event)"></div>
        <div class="pin-circle"></div>
      </div>
    </div>
  </div>

  <Teleport to="#config-panel-container" v-if="isSelected && mode === 'board'">
    <ConfigPanel title="Button Component">
      <div class="form-group">
        <label for="button-output">Output Value</label>
        <input
          id="button-output"
          type="text"
          class="form-control"
          :value="component?.settings?.output || '1'"
          @input="updateOutput($event.target.value)"
          placeholder="1"
        />
      </div>
    </ConfigPanel>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCircuitStore } from '../../../stores/circuit'
import ComponentPins from '../../ComponentPins.vue'
import ConfigPanel from '../../ConfigPanel.vue'

const props = defineProps({
  id: String,
  mode: {
    type: String,
    default: 'board' // 'board' or 'tray'
  },
  isTool: {
    type: Boolean,
    default: false
  }
})

const circuit = useCircuitStore()
const isPressed = ref(false)

const component = computed(() => {
  return circuit.components.find(c => c.id === props.id)
})

const isSelected = computed(() => {
  return circuit.selectedComponent?.id === props.id
})

function handleWirePinClick(pinName, event) {
  // Tool components use local wiring handler
  if (circuit.isWiring) {
    circuit.connectWire(pinName, props.id, event)
  } else {
    circuit.startWiring(props.id, pinName, event)
  }
}

function pressButton() {
  if (!component.value) return
  
  const outputValue = component.value.settings?.output || '1'
  
  // Set pressed state
  isPressed.value = true
  
  // Send output signal
  circuit.sendSignal(props.id, 'SIGNAL_OUT', outputValue)
  
  // Reset pressed state after a short delay
  setTimeout(() => {
    isPressed.value = false
    // Send 0 or empty signal after button release
    circuit.sendSignal(props.id, 'SIGNAL_OUT', '0')
  }, 100)
}

function updateOutput(value) {
  if (!component.value) return
  
  circuit.updateComponentSettings(props.id, {
    ...component.value.settings,
    output: value
  })
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
}

.circuit-button {
  background-color: var(--background-light);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  color: var(--text-normal);
  cursor: pointer;
  transition: all 0.1s ease;
  min-width: 80px;
  min-height: 32px;
}

.circuit-button:hover {
  background-color: var(--background-lighter);
  border-color: var(--accent-color);
}

.circuit-button:active,
.circuit-button.pressed {
  background-color: var(--accent-color);
  color: white;
  transform: translateY(1px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.circuit-button:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.2);
}
</style> 
