<template>
    <div ref="canvas" class="godseed-player">
        <div
            v-for="scene in sortedScenes"
            :key="scene._id"
            :style="{
                left: scene.coordX + 'px',
                top: scene.coordY + 'px',
                zIndex: scene.zIndex,
            }"
            class="scene"
        >
            <video
                v-for="(video, index) in scene.displayVideos"
                :key="index"
                :style="{
                    width: scene.displayWidth + 'px',
                    height: scene.displayHeight + 'px',
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
    await scenesStore.fetchScenes()
    await scenesStore.fetchParameters()
    normalParameterId.value = scenesStore.parameters.find(param => param.name === 'normal')._id

    activeParameters.value = (scenesStore.parameters)
        .filter(param => param.is_active)

    console.log('active parameters', activeParameters.value)
    // Filter scenes by era and prepare display videos for each scene
    scenes.value = scenesStore.scenes
        .filter(scene => scene.era.name === eraName.value)
        .map(scene => ({
            ...scene,
            displayVideos: getFilteredVideos(scene)
        }))

    console.log('Final scenes: ', scenes.value)
})

// Computed property to sort scenes by zIndex
const sortedScenes = computed(() => {
    return scenes.value.sort((a, b) => a.zIndex - b.zIndex)
})

// Get filtered videos based on the active parameters
const getFilteredVideos = (scene) => {
    // Create a map of videos by name for quick lookup and replacement
    console.log(scene.variations)
    const normalVideos = scene.variations?.find(variation => variation.parameter === normalParameterId.value)
    console.log('normal videos', normalVideos)
    console.log('Scene-> ', scene)
    const displayVideos = normalVideos.video_rows

    console.log('displayVideos: ', displayVideos)

    scene.variations.forEach(variation => {
        const parameter = activeParameters.value.find(param => param._id === variation.parameter)
        if (parameter) {

            console.log('replacing a video for param ', parameter.name)
            variation.video_rows.forEach(row => {
                const videoToReplace = displayVideos.find(v => v.name === row.name)
                if (videoToReplace) {
                    videoToReplace.video = row.replacement_video || videoToReplace.video
                }
            })
        } else {
            // add the original video
            variation.video_rows.forEach(row => {
                const videoToReplace = displayVideos.find(v => v.name === row.name)
                if (videoToReplace) {
                    videoToReplace.video = row.original_video || videoToReplace.video
                }
            })
        }
    })


    return displayVideos
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
    object-fit: contain;
    pointer-events: none; /* Prevent interaction with videos */
}
</style>
