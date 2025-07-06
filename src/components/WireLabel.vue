<template>
  <foreignObject
    v-if="wire.value !== undefined"
    :x="labelPosition.x - labelWidth / 2"
    :y="labelPosition.y - 12"
    :width="labelWidth"
    height="24"
    class="wire-label-container"
  >
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      class="wire-label-background"
      :class="{ 'selected': isSelected }"
    >
      <span ref="textSpan">{{ wire.value }}</span>
    </div>
  </foreignObject>
</template>

<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue'

const props = defineProps({
  wire: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const textSpan = ref(null)
const measuredWidth = ref(0)
const minWidth = 30
const padding = 10
const borderWidth = 4

const labelWidth = computed(() => {
  const contentWidth = measuredWidth.value + padding + borderWidth
  return Math.max(contentWidth, minWidth)
})

function getWireLabelPosition (wire) {
  const points = [
    { x: wire.x1, y: wire.y1 },
    ...wire.waypoints,
    { x: wire.x2, y: wire.y2 }
  ]

  const segmentLengths = []
  let totalLength = 0

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    segmentLengths.push(length)
    totalLength += length
  }

  const midPointLength = totalLength / 2
  let lengthTraversed = 0

  for (let i = 0; i < segmentLengths.length; i++) {
    const segmentLength = segmentLengths[i]
    if (lengthTraversed + segmentLength >= midPointLength) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const remainingLength = midPointLength - lengthTraversed

      if (segmentLength === 0) {
        return { x: p1.x, y: p1.y }
      }

      const ratio = remainingLength / segmentLength
      const midX = p1.x + (p2.x - p1.x) * ratio
      const midY = p1.y + (p2.y - p1.y) * ratio
      return { x: midX, y: midY }
    }
    lengthTraversed += segmentLength
  }

  return { x: wire.x1, y: wire.y1 }
}

const labelPosition = computed(() => getWireLabelPosition(props.wire))

const measureWidth = () => {
  if (textSpan.value) {
    measuredWidth.value = textSpan.value.offsetWidth
  }
}

onMounted(measureWidth)
onUpdated(measureWidth)
</script>
