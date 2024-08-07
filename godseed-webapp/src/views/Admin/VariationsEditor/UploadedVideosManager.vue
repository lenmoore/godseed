<template>
    <div class="uploaded-videos-manager" v-if="scene">
        <h3>Your Uploaded Videos</h3>
        <ul v-if="scene.uploaded_videos">
            <li v-for="video in scene.uploaded_videos" :key="video">
                {{ video }}
            </li>
        </ul>
        <div>
            <input type="file" multiple @change="handleVideoUpload" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useScenesStore } from '@/stores/sceneStore';

const scenesStore = useScenesStore();

// Make sure `scene` is only accessed when `currentScene` is set
const scene = computed(() => scenesStore.currentScene);

const handleVideoUpload = async (event) => {
    if (!scene.value) return;

    const files = event.target.files;
    try {
        for (let file of files) {
            const videoUrl = await scenesStore.uploadVideo(file);
            scene.value.uploaded_videos.push(videoUrl);
        }
        await scenesStore.updateScene(scene.value._id, scene.value);
    } catch (error) {
        console.error('Failed to upload videos:', error);
    }
};
</script>

<style scoped>
/* Add any necessary styling */
</style>
