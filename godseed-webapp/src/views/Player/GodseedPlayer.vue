<template>
    <div>
        <div v-if="!currentStateIsCreated" class="instructions">
            <p>Choose parameters by inserting jacks. Then, press the blue button to seed your world.</p>
        </div>
        <div v-else-if="showConfirmDestroyWorld" class="instructions confirm-destroy">
            <div>
                To create a new world, you must <strong>destroy the old one</strong>.
            </div>
            <div>Add parameters by inserting jacks.</div>
            <div>
                <strong>Press the button again</strong> to confirm.
            </div>
        </div>

        <div
            v-if="currentStateIsCreated"
            ref="canvas"
            :class="widthClass"
            class="godseed-player"
            style="background-color: #181818; !important;"
        >
            <div
                v-for="(scene, index) in scenes"
                :key="scene._id"
                :class="['scene', isGravityDownActive ? `gravity-down-${index % 5}` : '',
                gravityUpIsActive && scene.gravity === true ? `gravity-up-${index % 5 + 1}` : ''
            ]"
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

    </div>

</template>

<script setup>
import { useScenesStore } from '@/stores/sceneStore.js'
import { useRoute } from 'vue-router'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
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
const gravityUpIsActive = ref(false)
const widthClass = computed(() => {
    console.log(eraName)
    if (eraName.value.toString() === '1920') {
        return 'full-hd'
    } else if (eraName.value.toString() === '2560') {
        return 'two-k'
    } else {
        return ''
    }
})

const specialParameters = {
    light_mode: (isActive) => {
        document.documentElement.style.filter = isActive ? 'invert(1)' : 'invert(0)'
    },
    gravity_up: (isActive) => {
        gravityUpIsActive.value = isActive
    }
    // Add more special parameters here in the future
}

const showConfirmDestroyWorld = ref(false)
const createConfirmed = ref(false)

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
        createConfirmed.value = status.data.state.createConfirmed
        currentStateIsCreated.value = status.data.state.created
        showConfirmDestroyWorld.value = status.data.state.showConfirm

        await scenesStore.fetchParameters()
        updateActiveParameters()

        await nextTick() // Ensure DOM updates before scenes load
    }, 200)
})

// Function to update active parameters
const updateActiveParameters = () => {
    activeParameters.value = scenesStore.parameters.filter(param => param.is_active)
    applySpecialEffects()
}

// Function to update scenes based on the current active parameters
const updateScenes = () => {
    scenes.value = scenesStore.scenes
        .filter(scene => scene.era?.name === eraName.value)
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
        const isActive = activeParameters.value.some(param => param.name.includes(paramName))
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
    width: 2560px; /* 2K width */
    height: 1440px; /* 2K height */
    overflow: hidden;

    &.two-k {
        width: 2560px; /* 2K width */
        height: 1440px; /* 2K height */
    }

    &.full-hd {
        width: 1920px; /* Full HD width */
        height: 1080px; /* Full HD height */
    }
}

.scene {
    position: absolute;
    bottom: 0; /* Start from the bottom */
    transition: transform 10s ease-in-out; /* Smooth downward movement */
}

.scene-video {
    object-fit: cover;
    pointer-events: none; /* Prevent interaction with videos */
}

.instructions {
    font-size: 6rem;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;

    strong {
        color: red;
    }

    div {
        padding-bottom: 1rem;
    }

    flex-direction: column;
}

.confirm-destroy {
    position: absolute;
    z-index: 999999;
    background-color: rgba(0, 0, 0, 0.5);
}

.generating-wrapper {
    color: red;
    font-size: 6rem;
}

@keyframes float-1 {
    0% {
        transform: translateY(0);
    }
    20% {
        transform: translateY(2px);
    }
    35% {
        transform: translateY(4px);
    }
    50% {
        transform: translateY(7px);
    }
    65% {
        transform: translateY(8px);
    }
    80% {
        transform: translateY(11px);
    }
    100% {
        transform: translateY(13px);
    }
}

@keyframes float-2 {
    0% {
        transform: translateY(0);
    }
    12% {
        transform: translateY(1px);
    }
    22% {
        transform: translateY(2px);
    }
    44% {
        transform: translateY(3px);
    }
    65% {
        transform: translateY(4px);
    }
    89% {
        transform: translateY(15px);
    }
    100% {
        transform: translateY(60px);
    }
}

@keyframes float-3 {
    0% {
        transform: translateY(0);
    }
    3% {
        transform: translateY(8px);
    }
    20% {
        transform: translateY(9px);
    }
    45% {
        transform: translateY(3px);
    }
    60% {
        transform: translateY(4px);
    }
    75% {
        transform: translateY(50px);
    }
    100% {
        transform: translateY(66px);
    }
}

@keyframes float-4 {
    0% {
        transform: translateY(0);
    }
    20% {
        transform: translateY(4px);
    }
    40% {
        transform: translateY(9px);
    }
    60% {
        transform: translateY(11px);
    }
    80% {
        transform: translateY(14px);
    }
    100% {
        transform: translateY(18px);
    }
}

@keyframes float-5 {
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(1px);
    }
    50% {
        transform: translateY(2px);
    }
    75% {
        transform: translateY(3px);
    }
    100% {
        transform: translateY(4px);
    }
}


.gravity-up {
    animation: float 30s ease-in-out infinite; /* Apply the float animation */
}

.gravity-up-1 {
    animation: float-1 30s ease-in-out infinite;
}

.gravity-up-2 {
    animation: float-2 32s ease-in-out infinite;
}

.gravity-up-3 {
    animation: float-3 28s ease-in-out infinite;
}

.gravity-up-4 {
    animation: float-4 35s ease-in-out infinite;
}

.gravity-up-5 {
    animation: float-5 31s ease-in-out infinite;
}

</style>
