<script setup lang="ts">
import { ref, computed, CSSProperties } from 'vue'
import { isDesktop } from 'vue-device-detect'

const props = defineProps({
  width: { type: String, default: '200px' },
  height: { type: String, default: '200px' },
  activeHover: { type: Boolean, default: false },
  activeClick: { type: Boolean, default: false },
  activeDrag: { type: Boolean, default: true }, // Set true for testing
  /* 'right' means pulling the right side toward you (clockwise) */
  flipSide: { type: String as () => 'left' | 'right' | 'up' | 'down', default: 'right' },
})

const side = ref<'front' | 'back'>('front')
const rotation = ref(0)
const startTouchX = ref(0)
const isDragging = ref(false)

// Base rotation: Front is 0, Back is 180 or -180 depending on flipSide
const baseRotation = computed(() => {
  if (side.value === 'back') {
    return props.flipSide === 'right' ? 180 : -180
  }
  return 0
})

const cardStyle = computed((): CSSProperties => {
  return {
    transform: props.flipSide === 'right' || props.flipSide === 'left' ? `rotateY(${rotation.value}deg)` : `rotateX(${rotation.value}deg)`,
    transition: isDragging.value ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    position: 'relative'
  }
})

// Mobile handlers only
function onTouchStart(e: TouchEvent) {
  if (!props.activeDrag) return
  isDragging.value = true
  startTouchX.value = e.touches[0].screenX
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return

  // For vertical flip, use Y-axis movement
  if (props.flipSide === 'up' || props.flipSide === 'down') {
    const currentY = e.touches[0].screenY
    const deltaY = currentY - startTouchX.value

    const directionMultiplier = props.flipSide === 'down' ? 1 : -1
    const sensitivity = directionMultiplier * 180 / 200 // 200px for full flip

    let moveIncrement = deltaY * sensitivity * directionMultiplier
    let newRotation = baseRotation.value + moveIncrement

    if (side.value === 'front') {
      if (props.flipSide === 'down') rotation.value = Math.max(0, Math.min(180, newRotation))
      else rotation.value = Math.max(-180, Math.min(0, newRotation))
    } else {
      if (props.flipSide === 'down') rotation.value = Math.min(180, Math.max(0, newRotation))
      else rotation.value = Math.min(0, Math.max(-180, newRotation))
    }
    return
  }

  // For horizontal flip, use X-axis movement
  const currentX = e.touches[0].screenX
  const deltaX = currentX - startTouchX.value

  const directionMultiplier = props.flipSide === 'right' ? 1 : -1
  const sensitivity = directionMultiplier * 180 / 200 // 200px for full flip

  let moveIncrement = deltaX * sensitivity * directionMultiplier
  let newRotation = baseRotation.value + moveIncrement

  if (side.value === 'front') {
    if (props.flipSide === 'right') rotation.value = Math.max(0, Math.min(180, newRotation))
    else rotation.value = Math.max(-180, Math.min(0, newRotation))
  } else {
    if (props.flipSide === 'right') rotation.value = Math.min(180, Math.max(0, newRotation))
    else rotation.value = Math.max(-180, Math.min(0, newRotation))
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  // Snap logic: if past 90 degrees, go to back. Otherwise, back to front.
  if (rotation.value > 90 || rotation.value < -90) {
    side.value = 'back'
    rotation.value = props.flipSide === 'right' ? 180 : -180
  } else {
    side.value = 'front'
    rotation.value = 0
  }
}

// Desktop and mobile handler
function onClick() {
  if (!props.activeClick) return
  side.value = side.value === 'front' ? 'back' : 'front'
  rotation.value = side.value === 'back' ? props.flipSide === 'right' ? 180 : -180 : 0
}

// Desktop handlers only
function onMouseEnter() {
  if (!props.activeHover || !isDesktop) return
  side.value = 'back'
  rotation.value = 180
}

function onMouseLeave() {
  if (!props.activeHover || !isDesktop) return
  side.value = 'front'
  rotation.value = 0
}
</script>

<template>
  <div
    class="flip-card"
    :style="{ width, height }"
    @click="onClick"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      class="flip-card-inner"
      :style="cardStyle"
    >
      <div class="flip-card-face front"><slot name="front"></slot></div>
      <div class="flip-card-face back"><slot name="back"></slot></div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/flipcard.css';
</style>
