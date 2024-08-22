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

/* Gravity animation 1 - Gentle fall, minimal bounce, significant horizontal drift */
@keyframes gravityDown-1 {
    0% {
        transform: translateY(0) translateX(0); /* Start at the current position */
    }
    20% {
        transform: translateY(20vh) translateX(100px); /* Start falling with horizontal drift */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    60% {
        transform: translateY(80vh) translateX(-150px); /* Continue falling */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    80% {
        transform: translateY(calc(100vh - 100%)) translateX(100px); /* Reach the bottom */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    90% {
        transform: translateY(calc(100vh - 105%)) translateX(90px); /* Small bounce up */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(90px); /* Settle at the bottom */
    }
}

/* Gravity animation 2 - Slightly faster fall, subtle bounce, larger horizontal drift */
@keyframes gravityDown-2 {
    0% {
        transform: translateY(0) translateX(0);
    }
    25% {
        transform: translateY(25vh) translateX(-200px); /* Fall with a noticeable horizontal shift */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    55% {
        transform: translateY(75vh) translateX(200px); /* Continue falling */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    80% {
        transform: translateY(calc(100vh - 100%)) translateX(-150px); /* Reach the bottom */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    90% {
        transform: translateY(calc(100vh - 103%)) translateX(-140px); /* Smaller bounce */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(-140px); /* Settle at the bottom */
    }
}

/* Gravity animation 3 - Slow, smooth fall with slight horizontal drift and minimal bounce */
@keyframes gravityDown-3 {
    0% {
        transform: translateY(0) translateX(0);
    }
    30% {
        transform: translateY(30vh) translateX(150px); /* Slow fall with smooth horizontal drift */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    65% {
        transform: translateY(80vh) translateX(-100px); /* Continue falling */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    85% {
        transform: translateY(calc(100vh - 100%)) translateX(80px); /* Reach the bottom */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    95% {
        transform: translateY(calc(100vh - 102%)) translateX(70px); /* Very small bounce */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(70px); /* Settle at the bottom */
    }
}

/* Gravity animation 4 - Quick fall, small bounce, with more prominent horizontal drift */
@keyframes gravityDown-4 {
    0% {
        transform: translateY(0) translateX(0);
    }
    20% {
        transform: translateY(20vh) translateX(200px); /* Quick fall with significant horizontal drift */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    55% {
        transform: translateY(70vh) translateX(-150px); /* Continue falling */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    80% {
        transform: translateY(calc(100vh - 100%)) translateX(100px); /* Reach the bottom */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    90% {
        transform: translateY(calc(100vh - 101%)) translateX(90px); /* Minimal bounce */
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    100% {
        transform: translateY(calc(100vh - 100%)) translateX(90px); /* Settle at the bottom */
    }
}

/* Apply the animations with adjusted durations and delays */
.gravity-down-1 {
    animation: gravityDown-1 12s cubic-bezier(0.42, 0, 0.58, 1) forwards 4s;
}

.gravity-down-2 {
    animation: gravityDown-2 10s cubic-bezier(0.42, 0, 0.58, 1) forwards 6s;
}

.gravity-down-3 {
    animation: gravityDown-3 14s cubic-bezier(0.42, 0, 0.58, 1) forwards 5s;
}

.gravity-down-4 {
    animation: gravityDown-4 11s cubic-bezier(0.42, 0, 0.58, 1) forwards 7s;
}


</style>