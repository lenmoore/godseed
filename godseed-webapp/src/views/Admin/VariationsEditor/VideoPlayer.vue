<template>
    <div class="video-player p-6 rounded-lg border relative">
        <div v-if="scene && displayedVideos.length" class="relative w-full h-0 pb-9 " style="width: 600px;">
            <video
                v-for="video in displayedVideos"
                :key="video"
                autoplay
                class="absolute top-0 left-0 object-contain "
                loop
                muted
                playsinline
                style="border: 1px solid pink; height: auto; width: 100%;"
            >
                <source
                    :src="`${apiBaseUrl}${video}`" type="video/mp4"
                >
            </video>
        </div>

        <div class="display-params">
            <h4 class="text-lg font-bold text-gray-200">Display parameters</h4>
            <small>
                Press submit - params change in the server -> you can see them in the real player
            </small>
            <br>
            <br>

            <div v-for="parameter in allParameters" :key="parameter._id" class="parameter-input">
                <label class="text-gray-200 font-mono">
                    <input v-model="parameter.is_active" class="mr-2" type="checkbox">
                    {{ parameter.name }}
                </label>
            </div>
            <button
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                @click="submitChanges"
            >
                Update in server
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore()

const apiBaseUrl = import.meta.env.VITE_SERVER_URL

const scene = computed(() => scenesStore.currentScene)

// Array of all parameters except 'normal'
const allParameters = computed(() =>
    scenesStore.parameters.filter(param => param.name !== 'normal')
)

// Ref for displayed videos
const displayedVideos = ref([])

// Function to update displayed videos based on active parameters
const updateDisplayedVideos = () => {
    const normalVariation = scenesStore.variations.find(variation => variation.parameter.name === 'normal')
    if (!normalVariation) {
        displayedVideos.value = []
        return
    }

    const activeParameters = allParameters.value.filter(param => param.is_active)
    const activeVariations = scenesStore.variations.filter(variation =>
        activeParameters.find(param => param._id === variation.parameter._id)
    )

    console.log(activeVariations)
    let videos = normalVariation.video_rows.map(row => ({ name: row.name, video: row.original_video }))

    activeVariations.forEach(variation => {
        variation.video_rows.forEach(row => {
            const videoToReplace = videos.find(v => v.name === row.name)
            if (videoToReplace) {
                videoToReplace.video = row.replacement_video || videoToReplace.video
            }
            if (row.original_video.length === 0) {
                videos.push({ name: row.name, video: row.replacement_video })
            }
        })
    })

    // Update the ref for displayed videos
    displayedVideos.value = videos.map(v => v.video)
}

// Watch for changes in allParameters to update displayed videos
watch(allParameters, updateDisplayedVideos, { deep: true })

// Initial call to populate displayed videos
updateDisplayedVideos()
const submitChanges = async () => {
    try {
        await scenesStore.updateParametersBatch(allParameters.value)
        alert('Parameters updated successfully')
    } catch (error) {
        console.error('Failed to update parameters:', error)
        alert('Failed to update parameters')
    }
}
</script>

<style lang="scss" scoped>
.video-player {
    display: flex;

    small {
        font-weight: bold;
    }
}

.display-params {
    background-color: darkgreen;
    padding: 1rem;
}

.parameter-input {
    font-family: monospace;
    font-size: 0.8rem;
}

.relative.w-full.h-0.pb-9 {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
