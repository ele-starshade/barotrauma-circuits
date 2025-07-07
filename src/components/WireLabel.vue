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

/**
 * Calculates the optimal position for a wire label along the wire's path
 * @param {Object} wire - The wire object containing coordinates and waypoints
 * @param {number} wire.x1 - The x-coordinate of the wire's start point
 * @param {number} wire.y1 - The y-coordinate of the wire's start point
 * @param {number} wire.x2 - The x-coordinate of the wire's end point
 * @param {number} wire.y2 - The y-coordinate of the wire's end point
 * @param {Array<Object>} wire.waypoints - Array of waypoint objects with x and y coordinates
 * @returns {Object} The calculated position for the wire label
 * @returns {number} returns.x - The x-coordinate for the label position
 * @returns {number} returns.y - The y-coordinate for the label position
 *
 * @description
 * This function calculates the midpoint position along a wire's path for optimal label placement.
 * It takes into account the wire's start point, end point, and any intermediate waypoints to
 * determine the exact center position along the entire wire length.
 *
 * The function performs the following operations:
 * - Creates a complete path array including start point, waypoints, and end point
 * - Calculates the length of each segment between consecutive points
 * - Determines the total length of the wire path
 * - Finds the midpoint by traversing segments until reaching half the total length
 * - Interpolates the exact position within the segment containing the midpoint
 *
 * If the wire has no waypoints, the label will be positioned at the geometric center
 * between the start and end points. For wires with waypoints, the label will be placed
 * at the true center of the entire wire path.
 *
 * @example
 * const wire = {
 *   x1: 0, y1: 0,
 *   x2: 100, y2: 100,
 *   waypoints: [{ x: 50, y: 0 }, { x: 50, y: 100 }]
 * }
 * const position = getWireLabelPosition(wire)
 * // Returns: { x: 50, y: 50 } - the center of the wire path
 */
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
