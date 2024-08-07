<template>
    <div class="video-player p-6 bg-gray-800 shadow-md rounded-lg border relative">
        <h3 class="text-xl font-bold text-gray-200 mb-4">Playing Videos</h3>
        <div v-if="scene && scene.uploaded_videos" class="relative w-full h-0 pb-9/16" style="width: 600px;">
            <video
                v-for="video in scene.uploaded_videos"
                :key="video"
                :src="`http://localhost:3000${video}`"
                autoplay
                class="absolute top-0 left-0 w-full h-full object-contain rounded-lg border border-gray-700"
                loop
                muted
                playsinline
            >
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore()
const scene = computed(() => scenesStore.currentScene)
</script>

<style scoped>
/* Add any necessary styling */
</style>
