<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
    <div>
        <h1>Vue Flip Card Example</h1>
        <FlipCard active-drag active-click active-hover flip-side="up">
            <template #front>
                <p>Front Side</p>
            </template>
            <template #back>
                <p>Back Side</p>
            </template>
        </FlipCard>
    </div>
</template>
