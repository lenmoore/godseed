<template>
    <div class="video-player">
        <h3>Playing Videos</h3>
        <div v-if="scene && scene.uploaded_videos">

            <video v-for="video in scene.uploaded_videos" :key="video" :src="video" controls>
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore();
const scene = ref(scenesStore.currentScene);
</script>

<style scoped>
/* Add any necessary styling */
</style>
