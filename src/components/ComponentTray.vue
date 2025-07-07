<template>
  <footer id="component-tray">
    <!-- Components Section -->
    <div class="components-section">
      <h3 class="tray-header">Components</h3>
      <div class="components-grid">
        <component
          v-for="component in regularComponents"
          :key="component.name"
          :is="component.is"
          :is-tool="component.isTool"
          draggable="true"
          @dragstart="onDragStart($event, component)"
          mode="tray"
        />
      </div>
    </div>

    <!-- Tools Section -->
    <div class="tools-section">
      <h3 class="tray-header">Tools</h3>
      <div class="tools-list">
        <component
          v-for="component in toolComponents"
          :key="component.name"
          :is="component.is"
          :is-tool="component.isTool"
          draggable="true"
          @dragstart="onDragStart($event, component)"
          mode="tray"
        />
      </div>
    </div>

    <!-- Hints Section -->
    <div class="hints-section">
        <h3 class="tray-header">Hints</h3>
        <ul class="hints-list">
            <li><kbd>Middle Mouse</kbd> to pan the view.</li>
            <li><kbd>Delete</kbd> to delete selected item.</li>
            <li><kbd>Ctrl</kbd> + Click wire to add a waypoint.</li>
        </ul>
    </div>
  </footer>
</template>

<script setup>
import { computed, defineAsyncComponent, shallowRef, markRaw } from 'vue'
import { useCircuitStore } from '../stores/circuit'

const AdderComponent = markRaw(defineAsyncComponent(() => import('./circuit/AdderComponent.vue')))
const AndComponent = markRaw(defineAsyncComponent(() => import('./circuit/AndComponent.vue')))
const ConstantComponent = markRaw(defineAsyncComponent(() => import('./circuit/tools/ConstantComponent.vue')))
const RandomComponent = markRaw(defineAsyncComponent(() => import('./circuit/tools/RandomComponent.vue')))
const DisplayComponent = markRaw(defineAsyncComponent(() => import('./circuit/tools/DisplayComponent.vue')))
const SubtractComponent = markRaw(defineAsyncComponent(() => import('./circuit/SubtractComponent.vue')))
const MultiplyComponent = markRaw(defineAsyncComponent(() => import('./circuit/MultiplyComponent.vue')))
const DivideComponent = markRaw(defineAsyncComponent(() => import('./circuit/DivideComponent.vue')))
const XorComponent = markRaw(defineAsyncComponent(() => import('./circuit/XorComponent.vue')))
const SignalCheckComponent = markRaw(defineAsyncComponent(() => import('./circuit/SignalCheckComponent.vue')))
const GreaterComponent = markRaw(defineAsyncComponent(() => import('./circuit/GreaterComponent.vue')))
const LightComponent = markRaw(defineAsyncComponent(() => import('./circuit/tools/LightComponent.vue')))
const AbsComponent = markRaw(defineAsyncComponent(() => import('./circuit/AbsComponent.vue')))
const AcosComponent = markRaw(defineAsyncComponent(() => import('./circuit/AcosComponent.vue')))
const AsinComponent = markRaw(defineAsyncComponent(() => import('./circuit/AsinComponent.vue')))
const AtanComponent = markRaw(defineAsyncComponent(() => import('./circuit/AtanComponent.vue')))
const CeilComponent = markRaw(defineAsyncComponent(() => import('./circuit/CeilComponent.vue')))
const ColorComponent = markRaw(defineAsyncComponent(() => import('./circuit/ColorComponent.vue')))
const ConcatenationComponent = markRaw(defineAsyncComponent(() => import('./circuit/ConcatenationComponent.vue')))
const CosComponent = markRaw(defineAsyncComponent(() => import('./circuit/CosComponent.vue')))
const DelayComponent = markRaw(defineAsyncComponent(() => import('./circuit/DelayComponent.vue')))
const ExponentiationComponent = markRaw(defineAsyncComponent(() => import('./circuit/ExponentiationComponent.vue')))
const FactorialComponent = markRaw(defineAsyncComponent(() => import('./circuit/FactorialComponent.vue')))
const EqualsComponent = markRaw(defineAsyncComponent(() => import('./circuit/EqualsComponent.vue')))
const FloorComponent = markRaw(defineAsyncComponent(() => import('./circuit/FloorComponent.vue')))
const InputSelectorComponent = markRaw(defineAsyncComponent(() => import('./circuit/InputSelectorComponent.vue')))
const MemoryComponent = markRaw(defineAsyncComponent(() => import('./circuit/MemoryComponent.vue')))
const ModuloComponent = markRaw(defineAsyncComponent(() => import('./circuit/ModuloComponent.vue')))
const NotComponent = markRaw(defineAsyncComponent(() => import('./circuit/NotComponent.vue')))
const OrComponent = markRaw(defineAsyncComponent(() => import('./circuit/OrComponent.vue')))
const OscillatorComponent = markRaw(defineAsyncComponent(() => import('./circuit/OscillatorComponent.vue')))
const OutputSelectorComponent = markRaw(defineAsyncComponent(() => import('./circuit/OutputSelectorComponent.vue')))
const RegExComponent = markRaw(defineAsyncComponent(() => import('./circuit/RegExComponent.vue')))
const RelayComponent = markRaw(defineAsyncComponent(() => import('./circuit/RelayComponent.vue')))
const RoundComponent = markRaw(defineAsyncComponent(() => import('./circuit/RoundComponent.vue')))
const SinComponent = markRaw(defineAsyncComponent(() => import('./circuit/SinComponent.vue')))
const SquareRootComponent = markRaw(defineAsyncComponent(() => import('./circuit/SquareRootComponent.vue')))
const TanComponent = markRaw(defineAsyncComponent(() => import('./circuit/TanComponent.vue')))
const WiFiComponent = markRaw(defineAsyncComponent(() => import('./circuit/WiFiComponent.vue')))

const circuit = useCircuitStore()

/**
 * Handles the drag start event for components in the component tray
 * @param {DragEvent} event - The drag event object containing drag information
 * @param {Object} component - The component object being dragged
 * @returns {void}
 *
 * @description
 * This function initiates the drag-and-drop operation for components from the component tray
 * to the circuit board. It sets up the drag operation with the appropriate visual feedback
 * and notifies the circuit store about the dragging state.
 *
 * The function performs the following operations:
 * - Sets the drag effect to 'copy' to indicate the component will be copied to the board
 * - Calls the circuit store's startDraggingComponent method to initialize the drag state
 * - Passes both the component data and the drag event to the store for processing
 *
 * This function is typically called when a user starts dragging a component from the
 * component tray. The drag operation will continue until the component is dropped
 * on the circuit board or the drag is cancelled.
 *
 * @example
 * // This function is called by the dragstart event on tray components
 * <component @dragstart="onDragStart($event, component)" />
 *
 * // The component can now be dragged to the circuit board
 * // The circuit store will handle the drag state and visual feedback
 */
function onDragStart (event, component) {
  event.dataTransfer.effectAllowed = 'copy'
  circuit.startDraggingComponent(component, event)
}

const trayComponents = shallowRef([
  {
    name: 'Adder',
    is: AdderComponent,
    settings: {
      clampMax: 999999,
      clampMin: -999999,
      timeframe: 0.0
    }
  },
  {
    name: 'And',
    is: AndComponent,
    settings: {
      timeframe: 0.0,
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200
    }
  },
  {
    name: 'Subtract',
    is: SubtractComponent,
    settings: {
      clampMax: 999999.0,
      clampMin: -999999.0,
      timeframe: 0.0
    }
  },
  {
    name: 'Multiply',
    is: MultiplyComponent,
    settings: {
      clampMax: 999999.0,
      clampMin: -999999.0,
      timeframe: 0.0
    }
  },
  {
    name: 'Divide',
    is: DivideComponent,
    settings: {
      clampMax: 999999.0,
      clampMin: -999999.0,
      timeframe: 0.0
    }
  },
  {
    name: 'Xor',
    is: XorComponent,
    settings: {
      timeframe: 0.0,
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200
    }
  },
  {
    name: 'SignalCheck',
    is: SignalCheckComponent,
    settings: {
      target_signal: '1',
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200
    }
  },
  {
    name: 'Greater',
    is: GreaterComponent,
    settings: {
      timeframe: 0.0,
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200
    }
  },
  {
    name: 'Constant',
    is: ConstantComponent,
    value: '0',
    isTool: true
  },
  {
    name: 'Random',
    is: RandomComponent,
    settings: {
      min: 0,
      max: 1,
      period: 1000
    },
    isTool: true
  },
  {
    name: 'Display',
    is: DisplayComponent,
    value: null,
    isTool: true
  },
  {
    name: 'Light',
    is: LightComponent,
    settings: {
      color: '#ffffff',
      isOn: false
    },
    isTool: true
  },
  {
    name: 'Abs',
    is: AbsComponent,
    value: ''
  },
  {
    name: 'Acos',
    is: AcosComponent,
    value: '',
    settings: {
      useRadians: false
    }
  },
  {
    name: 'Asin',
    is: AsinComponent,
    value: '',
    settings: {
      useRadians: false
    }
  },
  {
    name: 'Atan',
    is: AtanComponent,
    value: '',
    settings: {
      useRadians: false
    }
  },
  {
    name: 'Ceil',
    is: CeilComponent,
    value: ''
  },
  {
    name: 'Color',
    is: ColorComponent,
    value: '',
    settings: {
      useHSV: false
    }
  },
  {
    name: 'Concatenation',
    is: ConcatenationComponent,
    value: '',
    settings: {
      maxOutputLength: 200,
      separator: '',
      timeframe: 0.0
    }
  },
  {
    name: 'Cos',
    is: CosComponent,
    value: '',
    settings: {
      useRadians: false
    }
  },
  {
    name: 'Delay',
    is: DelayComponent,
    value: '',
    settings: {
      delay: 1.0,
      resetOnNewSignal: false,
      resetOnDifferentSignal: false
    }
  },
  {
    name: 'Exponentiation',
    is: ExponentiationComponent,
    value: '',
    settings: {
      exponent: 1.0
    }
  },
  {
    name: 'Factorial',
    is: FactorialComponent,
    value: ''
  },
  {
    name: 'Equals',
    is: EqualsComponent,
    settings: {
      maxOutputLength: 200,
      output: '1',
      falseOutput: '0',
      timeframe: 0.0
    }
  },
  {
    name: 'Floor',
    is: FloorComponent,
    value: ''
  },
  {
    name: 'InputSelector',
    is: InputSelectorComponent,
    settings: {
      selectedConnection: 0,
      wrapAround: true,
      skipEmptyConnections: true
    }
  },
  {
    name: 'Memory',
    is: MemoryComponent,
    settings: {
      maxValueLength: 200,
      value: '',
      writeable: true
    }
  },
  {
    name: 'Modulo',
    is: ModuloComponent,
    settings: {
      modulus: 1
    }
  },
  {
    name: 'Not',
    is: NotComponent,
    settings: {
      continuousOutput: false
    }
  },
  {
    name: 'Or',
    is: OrComponent,
    settings: {
      timeframe: 0.00,
      maxOutputLength: 200,
      output: '1',
      falseOutput: '0'
    }
  },
  {
    name: 'Oscillator',
    is: OscillatorComponent,
    settings: {
      frequency: 1,
      outputType: 0
    }
  },
  {
    name: 'OutputSelector',
    is: OutputSelectorComponent,
    settings: {
      selectedConnection: 0,
      wrapAround: true,
      skipEmptyConnections: true
    }
  },
  {
    name: 'RegEx',
    is: RegExComponent,
    settings: {
      expression: '',
      output: '1',
      falseOutput: '0',
      maxOutputLength: 200,
      useCaptureGroup: false,
      outputEmptyCaptureGroup: false,
      continuousOutput: true
    }
  },
  {
    name: 'Relay',
    is: RelayComponent,
    settings: {
      isOn: true
    }
  },
  {
    name: 'Round',
    is: RoundComponent
  },
  {
    name: 'Sin',
    is: SinComponent,
    settings: {
      useRadians: false
    }
  },
  {
    name: 'SquareRoot',
    is: SquareRootComponent
  },
  {
    name: 'Tan',
    is: TanComponent,
    settings: {
      useRadians: false
    }
  },
  {
    name: 'WiFi',
    is: WiFiComponent
  }
])

const regularComponents = computed(() =>
  trayComponents.value.filter(c => !c.isTool)
)

const toolComponents = computed(() =>
  trayComponents.value.filter(c => c.isTool)
)
</script>

<style scoped>
#component-tray {
  display: grid;
  /* Proportions: 50% Components, 40% Tools, 10% Hints as requested */
  grid-template-columns: 5.5fr 3fr 1.5fr;
  background-color: var(--background-medium);
  border-top: 2px solid var(--background-light);
  gap: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  padding: 1rem;
  box-sizing: border-box; /* Include padding in height calculation */
}

.components-section,
.tools-section,
.hints-section {
  display: grid;
  grid-template-rows: auto 1fr; /* Header takes its content height, list fills the rest */
  min-width: 0; /* Prevent grid children from overflowing */
  min-height: 0; /* Allow grid children to shrink for scrolling */
}

.components-section,
.tools-section {
  border-right: 1px solid var(--background-light);
  padding-right: 1rem;
}

.components-grid,
.tools-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  overflow-y: auto;
  min-height: 0; /* Crucial for enabling scroll in a grid/flex item */
  scrollbar-gutter: stable; /* Prevents layout jank */
}

.hints-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  overflow-y: auto;
  min-height: 0;
  scrollbar-gutter: stable;
}

.hints-list li {
  margin-bottom: 0.5rem;
}

.hints-list kbd {
  background-color: var(--background-dark);
  border-radius: 3px;
  border: 1px solid var(--background-darker);
  color: var(--text-normal);
  font-family: monospace;
  padding: 0.2em 0.4em;
  font-weight: bold;
}

.tray-header {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--background-light);
  padding-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
