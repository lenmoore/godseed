<template>
    <div v-if="scene" class="uploaded-videos-manager border p-4 bg-gray-800 rounded-lg relative">
        <h3 class="text-xl font-bold text-gray-200 mb-4">Your Uploaded Videos</h3>
        <ul v-if="scene.uploaded_videos" class="space-y-2">
            <li
                v-for="video in scene.uploaded_videos"
                :key="video"
                class="relative cursor-pointer text-blue-400 hover:underline"
                @mouseenter="showPreview(video, $event)"
                @mouseleave="hidePreview"
            >
                {{ video }}

            </li>
        </ul>
        <div
            v-if="previewVideo"
            class="absolute z-10 p-2 bg-gray-900 rounded-lg shadow-lg"
        >
            <video
                :src="`http://localhost:3000${previewVideo}`"
                autoplay
                class="rounded-lg border border-gray-700"
                muted
                playsinline
                width="300"
            >
                Your browser does not support the video tag.
            </video>
        </div>

        <div class="mt-4">
            <input
                class="text-gray-300 bg-gray-700 rounded-lg border border-gray-600 p-2"
                multiple
                type="file"
                @change="handleVideoUpload"
            />
        </div>
        <!-- Floating video preview -->

    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useScenesStore } from '@/stores/sceneStore'

const scenesStore = useScenesStore()
const scene = computed(() => scenesStore.currentScene)

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
/* Add any necessary styling */
</style>
