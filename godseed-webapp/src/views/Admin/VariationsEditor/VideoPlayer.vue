<template>
    <div class="video-player p-6 rounded-lg border relative">
        <h3 class="text-xl font-bold text-gray-200 mb-4">Playing Videos</h3>
        <div v-if="scene && filteredVideos.length" class="relative w-full h-0 pb-9/16" style="width: 600px;">
            <video
                v-for="video in filteredVideos"
                :key="video"
                :src="`http://localhost:3000${video}`"
                autoplay
                class="absolute top-0 left-0 object-contain rounded-lg border border-gray-700"
                loop
                muted
                playsinline
            >
                Your browser does not support the video tag.
            </video>
        </div>

        <div class="absolute right-0 top-0 p-4 bg-gray-800 rounded-lg">
            <h4 class="text-lg font-bold text-gray-200">Display parameters</h4>
            <small>
                This is just like putting the wires in the globe. Wire in = checkbox ticked :)
            </small>
            <br>
            <small>
                If you press submit, the changes get saved on the server. It's ok :)
            </small>
            <div v-for="parameter in activeParameters" :key="parameter._id" class="mb-2">
                <label class="text-gray-200">
                    <input v-model="parameter.is_active" class="mr-2" type="checkbox">
                    {{ parameter.name }}
                </label>
            </div>
            <button
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                @click="submitChanges"
            >
                Submit
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore()

// Make scene reactive to changes in scenesStore.currentScene
const scene = computed(() => scenesStore.currentScene)

// Filter out "normal" and only return other parameters
const activeParameters = computed(() => scenesStore.parameters.filter(param => param.name !== 'normal'))

// Compute the videos based on active parameters with "normal" as the base
const filteredVideos = computed(() => {
    const normalVariation = scenesStore.variations.find(variation => variation.parameter.name === 'normal')
    const activeVariations = scenesStore.variations.filter(variation =>
        activeParameters.value.some(param => param.is_active && param._id === variation.parameter._id)
    )

    if (!normalVariation) return []

    // Start with the normal variation videos
    let videos = normalVariation.video_rows.map(row => ({ name: row.name, video: row.original_video }))

    // Replace normal videos with active variations where applicable
    activeVariations.forEach(variation => {
        variation.video_rows.forEach(row => {
            const videoToReplace = videos.find(v => v.name === row.name)
            if (videoToReplace) {
                videoToReplace.video = row.replacement_video || videoToReplace.video
            }
        })
    })

    return videos.map(v => v.video)
})

// Function to submit the parameter changes
const submitChanges = async () => {
    try {
        await scenesStore.updateParametersBatch(activeParameters.value)
        alert('Parameters updated successfully')
    } catch (error) {
        console.error('Failed to update parameters:', error)
        alert('Failed to update parameters')
    }
}
</script>

<style scoped>
/* Add any necessary styling */
</style>
