<template>
  <div class="pins">
    <div v-for="i in count" :key="i" class="component-pin"></div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, required: true }
})
</script>

<style scoped>
.pins {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
}

.component-pin {
  width: 10px;
  height: 10px;
  background-color: #718096;
  border-radius: 2px;
  cursor: none;
  pointer-events: none;
}
</style>
