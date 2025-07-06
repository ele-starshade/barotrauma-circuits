<template>
  <div class="config-panel">
    <h5 class="config-panel-header">{{ title }}</h5>
    <div class="config-panel-body">
      <slot></slot>
    </div>
    <div class="config-panel-footer">
      <small>Press <kbd>Delete</kbd> to remove.</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.config-panel-footer small {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.config-panel-footer kbd {
  background-color: var(--background-dark);
  border-radius: 3px;
  border: 1px solid var(--background-darker);
  color: var(--text-normal);
  font-family: monospace;
  padding: 0.2em 0.4em;
  font-weight: bold;
}
</style>
