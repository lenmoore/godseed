<template>
    <div ref="canvas" class="godseed-player">
        <div
            v-for="scene in scenes"
            :key="scene._id"
            :style="{
                left: scene.coordX + 'px',
                top: scene.coordY + 'px',
                zIndex: scene.zIndex,
                width: scene.displayWidth + 'px',
                height: scene.displayHeight + 'px',
                position: 'absolute',
                border: '1px solid green',
            }"
            class="scene"
        >
            <video
                v-for="(video, index) in scene.displayVideos"
                :key="index"
                :style="{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                }"
                autoplay
                class="scene-video"
                loop
                muted
                playsinline
            >
                <source :src="`${apiBaseUrl}${video.video}`" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</template>

<script setup>
import { useScenesStore } from '@/stores/sceneStore.js'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

const apiBaseUrl = import.meta.env.VITE_SERVER_URL
const route = useRoute()
const eraName = ref(route.params.eraName)
const scenesStore = useScenesStore()
const scenes = ref([])
const activeParameters = ref([])
const normalParameterId = ref('')

onMounted(async () => {
    console.log(apiBaseUrl)
    await scenesStore.fetchScenes()
    await scenesStore.fetchParameters()
    normalParameterId.value = scenesStore.parameters.find(param => param.name === 'normal')._id

    // Initial fetch and setting of active parameters
    updateActiveParameters()

    // Initial filter of scenes by era
    updateScenes()

    // Refresh parameters every 10 seconds
    setInterval(async () => {
        await scenesStore.fetchParameters()
        updateActiveParameters()
        updateScenes()
    }, 10000) // 10 seconds
})

// Function to update active parameters
const updateActiveParameters = () => {
    activeParameters.value = (scenesStore.parameters)
        .filter(param => param.is_active)
}

// Function to update scenes based on the current active parameters
const updateScenes = () => {
    scenes.value = scenesStore.scenes
        .filter(scene => scene.era.name === eraName.value)
        .map(scene => ({
            ...scene,
            displayVideos: getFilteredVideos(scene)
        }))
}

// Computed property to sort scenes by zIndex
const sortedScenes = computed(() => {
    return scenes.value.sort((a, b) => a.zIndex - b.zIndex)
})

// Get filtered videos based on the active parameters
const getFilteredVideos = (scene) => {
    const normalVideos = scene.variations?.find(variation => variation.parameter === normalParameterId.value)

    if (normalVideos) {

        const displayVideos = normalVideos.video_rows || []

        scene.variations.forEach(variation => {
            const parameter = activeParameters.value.find(param => param._id === variation.parameter)
            if (parameter) {
                variation.video_rows?.forEach(row => {
                    const videoToReplace = displayVideos?.find(v => v.name === row.name)
                    if (videoToReplace) {
                        videoToReplace.video = row.replacement_video || videoToReplace.video
                    }
                    if (row.original_video.length === 0) {
                        displayVideos.push({ name: row.name, video: row.replacement_video })
                    }
                })
            } else {
                variation.video_rows?.forEach(row => {
                    const videoToReplace = displayVideos?.find(v => v.name === row.name)
                    if (videoToReplace) {
                        videoToReplace.video = row.original_video || videoToReplace.video
                    }
                    if (row.original_video.length === 0) {
                        displayVideos.push({ name: row.name, video: row.replacement_video })
                    }
                })
            }
        })
        return displayVideos
    }


    return []
}

</script>

<style scoped>
.godseed-player {
    position: relative;
    width: 3840px; /* UHD width */
    height: 2160px; /* UHD height */
    overflow: hidden;
}

.scene {
    position: absolute;
}

.scene-video {
    object-fit: cover;
    pointer-events: none; /* Prevent interaction with videos */
}
</style>
