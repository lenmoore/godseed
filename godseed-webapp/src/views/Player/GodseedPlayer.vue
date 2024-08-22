<template>
    <div ref="canvas" class="godseed-player">
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
                border: '1px solid red'
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
                <!-- Use video URL as key -->
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</template>

<script setup>
import { useScenesStore } from '@/stores/sceneStore.js'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

const apiBaseUrl = import.meta.env.VITE_SERVER_URL
const route = useRoute()
const eraName = ref(route.params.eraName)
const scenesStore = useScenesStore()
const scenes = ref([])
const activeParameters = ref([])
const normalParameterId = ref('')

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
            })

            if (count === 4) {
                count = 1
            }
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

const isGravityDownActive = ref(false) // State to control the gravity effect

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
        console.log('updating parameters')
        await scenesStore.fetchParameters()
        updateActiveParameters()
        updateScenes()
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
</style>

<style>
/* Gravity animation 1 - Start from initial position, gentle fall and settle at bottom */
@keyframes gravityDown-1 {
    0% {
        transform: translateY(0) translateX(0); /* Start at the current position */
    }
    70% {
        transform: translateY(calc(100vh - 100%)) translateX(10px); /* Fall down to the bottom */
        animation-timing-function: ease-in;
    }
    80% {
        transform: translateY(calc(100vh - 130%)) translateX(15px); /* Gentle bounce up */
        animation-timing-function: ease-out;
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(10px); /* Settle at the bottom */
    }
}

/* Gravity animation 2 - Faster fall, stronger bounce, settle at bottom */
@keyframes gravityDown-2 {
    0% {
        transform: translateY(0) translateX(-10px); /* Start at the current position */
    }
    60% {
        transform: translateY(calc(100vh - 100%)) translateX(-20px); /* Fall down to the bottom */
        animation-timing-function: ease-in;
    }
    75% {
        transform: translateY(calc(100vh - 140%)) translateX(-25px); /* Stronger bounce up */
        animation-timing-function: ease-out;
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(-20px); /* Settle at the bottom */
    }
}

/* Gravity animation 3 - Slow fall, multiple small bounces, settle at bottom */
@keyframes gravityDown-3 {
    0% {
        transform: translateY(0) translateX(5px); /* Start at the current position */
    }
    65% {
        transform: translateY(calc(100vh - 100%)) translateX(0px); /* Fall down to the bottom */
        animation-timing-function: ease-in;
    }
    70% {
        transform: translateY(calc(100vh - 120%)) translateX(5px); /* First small bounce */
        animation-timing-function: ease-out;
    }
    80% {
        transform: translateY(calc(100vh - 110%)) translateX(0px); /* Second small bounce */
        animation-timing-function: ease-out;
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(0px); /* Settle at the bottom */
    }
}

/* Gravity animation 4 - Quick fall, long bounce, settle at bottom */
@keyframes gravityDown-4 {
    0% {
        transform: translateY(0) translateX(-5px); /* Start at the current position */
    }
    75% {
        transform: translateY(calc(100vh - 100%)) translateX(15px); /* Fall down to the bottom */
        animation-timing-function: ease-in;
    }
    85% {
        transform: translateY(calc(100vh - 150%)) translateX(-15px); /* Strong bounce up */
        animation-timing-function: ease-out;
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(15px); /* Settle at the bottom */
    }
}

/* Apply different durations, delays, and timing for each animation */
.gravity-down-1 {
    animation: gravityDown-1 14s ease-in-out forwards;
}

.gravity-down-2 {
    animation: gravityDown-2 10s ease-in-out forwards 2s;
}

.gravity-down-3 {
    animation: gravityDown-3 16s ease-in-out forwards 1s;
}

.gravity-down-4 {
    animation: gravityDown-4 12s ease-in-out forwards 3s;
}

</style>