<template>
  <div class="config-panel">
    <h5 class="config-panel-header">{{ title }}</h5>
    <div class="config-panel-body">
      <slot></slot>
    </div>
    <div class="config-panel-footer">
      <small>Press <code>Delete</code> to remove.</small>
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
