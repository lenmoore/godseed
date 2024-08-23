<template>
    <div v-if="!currentStateIsCreated && !isGenerating" class="instructions">
        <p>Choose parameters by inserting jacks. Then, press the [colour] button to seed your world.</p>
    </div>
    <div v-else-if="isGenerating" class="generating-wrapper">
        <p>Generating...</p>
    </div>
    <div v-else ref="canvas" class="godseed-player">
        <div
            v-for="(scene, index) in scenes"
            :key="scene._id"
            :class="['scene', isGravityDownActive ? `gravity-down-${index % 5}` : '' ]"
            :style="{
        left: scene.coordX + 'px',
        top: scene.coordY + 'px',
        zIndex: scene.zIndex,
        width: scene.displayWidth + 'px',
        height: scene.displayHeight + 'px',
        position: 'absolute',
      }"
        >
            <video
                v-for="(video, index) in scene.displayVideos"
                :key="video.video"
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
                <source :key="video.video" :src="`${apiBaseUrl}${video.video}`" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</template>

<script setup>
import { useScenesStore } from '@/stores/sceneStore.js'
import { useRoute } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'
import http from '@/stores/http.js'

const apiBaseUrl = import.meta.env.VITE_SERVER_URL
const route = useRoute()
const eraName = ref(route.params.eraName)
const scenesStore = useScenesStore()
const scenes = ref([])
const activeParameters = ref([])
const normalParameterId = ref('')
const isGravityDownActive = ref(false) // State to control the gravity effect
const currentStateIsCreated = ref(false)
const isGenerating = ref(false) // State to control the "Generating..." text

const specialParameters = {
    light_mode: (isActive) => {
        document.documentElement.style.filter = isActive ? 'invert(1)' : 'invert(0)'
    },
    gravity_down: (isActive) => {
        if (isActive) {
            let count = 1
            document.querySelectorAll('.scene').forEach(scene => {
                scene.classList.add(`gravity-down-${count}`)
                count++

                console.log(scene)
                if (count === 4) {
                    count = 1
                }
                scene.classList.add(`gravity-down-${count}`)
                count++
            })

        } else {
            document.querySelectorAll('.scene').forEach(scene => {
                scene.classList.remove('gravity-down-1')
                scene.classList.remove('gravity-down-2')
                scene.classList.remove('gravity-down-3')
                scene.classList.remove('gravity-down-4')
            })
        }
    }
    // Add more special parameters here in the future
}

onMounted(async () => {
    console.log(apiBaseUrl)
    await scenesStore.fetchScenes()
    await scenesStore.fetchParameters()
    normalParameterId.value = scenesStore.parameters.find(param => param.name === 'normal')._id

    // Initial fetch and setting of active parameters
    updateActiveParameters()

    // Initial filter of scenes by era
    updateScenes()

    // Refresh parameters every 3 seconds
    setInterval(async () => {
        console.log('Fetching if status is created')
        const status = await http.get('/arduino/status')
        const wasCreated = currentStateIsCreated.value
        currentStateIsCreated.value = status.data.state.created

        if (currentStateIsCreated.value && !wasCreated) {
            // If the state just changed to created, show "Generating..." for 10 seconds
            isGenerating.value = true
            await nextTick() // Ensure DOM updates with "Generating..."
            setTimeout(async () => {
                isGenerating.value = false
                await nextTick() // Ensure DOM updates before scenes load
                updateScenes() // Update scenes based on the current state
            }, 10000) // 10 seconds
        } else if (!currentStateIsCreated.value) {
            isGenerating.value = false
        }

        await scenesStore.fetchParameters()
        updateActiveParameters()
    }, 3000) // 3 seconds
})

// Function to update active parameters
const updateActiveParameters = () => {
    activeParameters.value = scenesStore.parameters.filter(param => param.is_active)
    applySpecialEffects()
}

// Function to update scenes based on the current active parameters
const updateScenes = () => {
    scenes.value = scenesStore.scenes
        .filter(scene => scene.era.name === eraName.value)
        .map(scene => ({
            ...scene,
            displayVideos: getFilteredVideos(scene)
        }))
    // Force videos to change in the template
    scenes.value = [...scenes.value]
}

// Function to apply special effects based on active parameters
const applySpecialEffects = () => {
    for (const [paramName, effectFn] of Object.entries(specialParameters)) {
        const isActive = activeParameters.value.some(param => param.name === paramName)
        effectFn(isActive)
    }
}

// Get filtered videos based on the active parameters
const getFilteredVideos = (scene) => {
    const normalVideos = scene.variations?.find(variation => variation.parameter === normalParameterId.value)

    if (normalVideos) {
        const displayVideos = normalVideos.video_rows ? [...normalVideos.video_rows.map(
            (videoRow) => ({ ...videoRow, video: videoRow.original_video })
        )] : []

        console.log(displayVideos)
        activeParameters.value.forEach(param => {
            const variation = scene.variations?.find(variation => variation.parameter === param._id)
            if (variation) {
                variation.video_rows.forEach(row => {
                    const videoToReplace = displayVideos.find(v => v.name === row.name)
                    if (videoToReplace) {
                        videoToReplace.video = row.replacement_video || videoToReplace.video
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

// Watch for changes in active parameters to apply effects
watch(activeParameters, applySpecialEffects, { deep: true })

</script>

<style scoped>
.godseed-player {
    border: 1px solid rgba(255, 255, 255, 0.25);
    position: relative;
    width: 3840px; /* UHD width */
    height: 2160px; /* UHD height */
    overflow: hidden;
}

.scene {
    position: absolute;
    bottom: 0; /* Start from the bottom */
    transition: transform 10s linear; /* Smooth downward movement */
}

.scene-video {
    object-fit: cover;
    pointer-events: none; /* Prevent interaction with videos */
}

.instructions {
    font-size: 6rem;
}

.generating-wrapper {
    color: red;
    font-size: 6rem;
}
</style>
