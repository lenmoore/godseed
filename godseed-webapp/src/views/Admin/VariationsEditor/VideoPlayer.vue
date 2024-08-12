<template>
    <div class="video-player p-6 rounded-lg border relative">
        <div v-if="scene && filteredVideos.length" class="relative w-full h-0 pb-9 " style="width: 600px;">
            <video
                v-for="video in filteredVideos"
                :key="video"
                :src="`${apiBaseUrl}${video}`"
                autoplay
                class="absolute top-0 left-0 object-contain "
                loop
                muted
                playsinline
                style="border: 1px solid pink; height: auto; width: 100%;"
            >
                Your browser does not support the video tag.
            </video>
        </div>

        <div class="display-params">
            <h4 class="text-lg font-bold text-gray-200">Display parameters</h4>
            <small>
                This is just like putting the wires in the globe. Wire in = checkbox ticked :)
                <br>
                If you press submit, the changes get saved on the server. If you just toggle them, you toggle the views
                locally.
            </small>
            <br>
            <br>
            <div v-for="parameter in activeParameters" :key="parameter._id" class="parameter-input">
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
import { computed } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore()

const apiBaseUrl = import.meta.env.VITE_SERVER_URL

const scene = computed(() => scenesStore.currentScene)

const activeParameters = computed(() => scenesStore.parameters.filter(param => param.name !== 'normal'))

const filteredVideos = computed(() => {
    const normalVariation = scenesStore.variations.find(variation => variation.parameter.name === 'normal')
    const activeVariations = scenesStore.variations.filter(variation =>
        activeParameters.value.some(param => param.is_active && param._id === variation.parameter._id)
    )

    if (!normalVariation) return []

    let videos = normalVariation.video_rows.map(row => ({ name: row.name, video: row.original_video }))

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
