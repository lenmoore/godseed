<template>
    <div v-if="scene" class="uploaded-videos-manager border p-4 bg-gray-800 rounded-lg relative h-96">
        <div class="mt-4">
            Upload videos
            <input
                class="text-gray-300 bg-gray-700 rounded-lg border border-gray-600 p-2"
                multiple
                type="file"
                @change="handleVideoUpload"
            />
        </div>
        <h3 class="font-bold text-gray-200 mt-4">Scene videos</h3>
        <small>Hover to see preview. Scroll to see the rest of them</small>
        <ul v-if="scene.uploaded_videos" class="space-y-2 overflow-y-scroll h-40 text-xs">
            <li
                v-for="video in scene.uploaded_videos"
                :key="video"
                class="relative font-mono text-blue-400 hover:underline"
                @mouseenter="showPreview(video, $event)"
                @mouseleave="hidePreview"
            >
                {{ video }}
            </li>
        </ul>
        <div
            v-if="previewVideo"
            class="absolute-video-wrapper"
        >
            <video
                :src="`${apiBaseUrl}${previewVideo}`"
                autoplay
                class=""
                muted
                playsinline
                type="video/mp4"
                width="300"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useScenesStore } from '@/stores/sceneStore'

const scenesStore = useScenesStore()
const scene = computed(() => scenesStore.currentScene)

const apiBaseUrl = import.meta.env.VITE_SERVER_URL
const previewVideo = ref(null)
const previewPosition = ref({ top: 0, left: 0 })

const handleVideoUpload = async (event) => {
    if (!scene.value) return

    const files = event.target.files
    try {
        for (let file of files) {
            const videoUrl = await scenesStore.uploadVideo(file)
            scene.value.uploaded_videos.push(videoUrl)
        }
        await scenesStore.updateScene(scene.value._id, scene.value)
    } catch (error) {
        console.error('Failed to upload videos:', error)
    }
}

const showPreview = (video, event) => {
    previewVideo.value = video
    const rect = event.target.getBoundingClientRect()
    previewPosition.value = {
        top: 300,
        left: 0
    }
}

const hidePreview = () => {
    previewVideo.value = null
}
</script>

<style scoped>

.absolute-video-wrapper {
    position: absolute;
    top: 40vh;
    //background-color: darkgreen;
    left: 0;
    padding: 1rem;
    border-radius: 0.5rem;
    color: white;
}
</style>
