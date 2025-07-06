<template>
  <footer id="component-tray" class="p-3">
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
  </footer>
</template>

<script setup>
import { computed, defineAsyncComponent, shallowRef } from 'vue'
import { useCircuitStore } from '../stores/circuit'

const AdderComponent = defineAsyncComponent(() => import('./circuit/AdderComponent.vue'))
const AndComponent = defineAsyncComponent(() => import('./circuit/AndComponent.vue'))
const ConstantComponent = defineAsyncComponent(() => import('./circuit/ConstantComponent.vue'))
const RandomComponent = defineAsyncComponent(() => import('./circuit/RandomComponent.vue'))
const DisplayComponent = defineAsyncComponent(() => import('./circuit/DisplayComponent.vue'))
const SubtractComponent = defineAsyncComponent(() => import('./circuit/SubtractComponent.vue'))
const MultiplyComponent = defineAsyncComponent(() => import('./circuit/MultiplyComponent.vue'))
const DivideComponent = defineAsyncComponent(() => import('./circuit/DivideComponent.vue'))
const XorComponent = defineAsyncComponent(() => import('./circuit/XorComponent.vue'))

const circuit = useCircuitStore()

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
      max: 100,
      period: 1000
    },
    isTool: true
  },
  {
    name: 'Display',
    is: DisplayComponent,
    value: '',
    isTool: true
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
  grid-template-columns: 2fr 1fr;
  background-color: var(--background-medium);
  border-top: 2px solid var(--background-light);
  gap: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 175px;
  overflow-y: hidden;
  padding: 1rem;
}

.components-section {
  border-right: 1px solid;
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tools-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 175px;
  border-radius: 4px;
}

.tools-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.tray-header {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid;
  padding-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
