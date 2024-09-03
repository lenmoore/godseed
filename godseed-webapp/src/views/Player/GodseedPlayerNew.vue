<template>
    <div style="background-color: #181818; height: 100%; width: 100%;">
        <button
            v-if="!buttonHidden"
            style="z-index: 2229909000; height: 20rem; width: 20rem;"
            @click="hideButton"
        >
            click me to make sounds work
        </button>

        <div v-if="eraName === 'neolithic'">
            <audio ref="backgroundSound" src="/idle.mp3"></audio>
            <audio ref="mainSound" src="/main.mp3"></audio>
        </div>

        <div class="description">
            <span v-show="showItIsWhatItIs">
                <img alt="" height="auto" src="/itiswhatitis.png" width="2000px">
            </span>
            <span v-show="showGeneratingWorld">
                <audio ref="microwaveSound" src="/Microwave.mp3"></audio>
                <img alt="" height="auto" src="/creating.png" width="2000px">
            </span>
            <div v-show="showCivilisationWasDestroyed">
                <audio ref="shutdownSound" src="/shutdown.mp3"></audio>
                <video
                    ref="destructionVideo" src="/tvshutdown.mov"
                    style="position: absolute; left: 0; width: 2000px; height: auto; height: auto"
                    @ended="onDestructionAnimationEnd"></video>

                <div style="position: absolute;">
                    Civilisation number {{ civilisationCounter }} was destroyed.
                </div>
                <img alt="" src="/destroyed.png"
                     style="position: absolute; left: 0; max-width: 2000px"
                >
            </div>
            <span v-show="showStandby" style="position: absolute; background-color: rgba(0, 0, 0, 0.5)">
                <img alt="" height="auto" src="/standby.png" width="2000px">
            </span>
        </div>

        <div v-if="showAllAnimations && buttonHidden" ref="canvas" class="godseed-player">
            <div
                v-for="(scene, index) in scenes"
                :key="scene._id"
                :class="['scene', isGravityDownActive ? `gravity-down-${index % 5}` : '',
                gravityUpIsActive && scene.gravity === true ? `gravity-up-${index % 5 + 1}` : '']"
                :style="{
                    left: scene.coordX + 'px',
                    top: scene.coordY + 'px',
                    zIndex: scene.zIndex,
                    width: scene.displayWidth + 'px',
                    height: scene.displayHeight + 'px',
                    position: 'absolute',
                }"
            >
                <div v-if="scene.displayVideos.length === 0">videos</div>
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
                    <source :src="`${apiBaseUrl}${video.video}`" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
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
const isGravityDownActive = ref(false)
const gravityUpIsActive = ref(false)
const buttonHidden = ref(false)

// Refs for media elements
const backgroundSound = ref(null)
const mainSound = ref(null)
const microwaveSound = ref(null)
const shutdownSound = ref(null)
const destructionVideo = ref(null)

const hideButton = () => {
    buttonHidden.value = true

    // Trigger sounds manually once the button is clicked
    if (shouldPlayBackground.value && backgroundSound.value) {
        backgroundSound.value.play().catch(console.error)
    }

    if (shouldPlayMainSound.value && mainSound.value) {
        mainSound.value.play().catch(console.error)
    }
}

const specialParameters = {
    light_mode: (isActive) => {
        document.documentElement.style.filter = isActive ? 'invert(1)' : 'invert(0)'
    },
    gravity_up: (isActive) => {
        gravityUpIsActive.value = isActive
    }
}

const showConfirmDestroyWorld = ref(false)
const showStandby = ref(false)
const showItIsWhatItIs = ref(false)
const showCivilisationWasDestroyed = ref(false)
const civilisationCounter = ref(0)
const developmentMode = ref(false)
const created = ref(false)
const showConfirm = ref(false)
const createConfirmed = ref(false)
const showDestructionAnimation = ref(false)
const showAllAnimations = ref(false)
const showGeneratingWorld = ref(false)
const playerActive = ref(false)

const shouldPlayBackground = ref(false)
const shouldPlayMainSound = ref(false)

const playDestructionAnimation = () => {
    showGeneratingWorld.value = false
    if (shutdownSound.value) shutdownSound.value.play().catch(console.error)
    showDestructionAnimation.value = true
    nextTick(() => {
        if (destructionVideo.value) {
            if (mainSound.value) mainSound.value.volume = 0.1
            destructionVideo.value.play().catch(error => {
                console.error('Error playing destruction video:', error)
            })
        }
    })
}

watch(showCivilisationWasDestroyed, (value) => {
    if (value) {
        playDestructionAnimation()
    }
})

const onDestructionAnimationEnd = () => {
    showDestructionAnimation.value = false
    if (mainSound.value) mainSound.value.volume = 1
}

watch(created, (value, oldValue) => {
    if (value && value !== oldValue) {
        // play generating sounds
        showGeneratingWorld.value = true
        if (microwaveSound.value) microwaveSound.value.play().catch(console.error)

        setTimeout(() => {
            if (mainSound.value) mainSound.value.play().catch(console.error)
            showGeneratingWorld.value = false
            showAllAnimations.value = true
            playerActive.value = true
        }, 14000)
    }
})

onMounted(async () => {
    await scenesStore.fetchScenes()
    await scenesStore.fetchParameters()
    normalParameterId.value = scenesStore.parameters.find(param => param.name === 'normal')._id

    updateActiveParameters()
    updateScenes()

    // Trigger background sound after 3 seconds
    setTimeout(() => {
        shouldPlayBackground.value = true
        if (buttonHidden.value && backgroundSound.value) {
            backgroundSound.value.play().catch(console.error)
        }
    }, 3000)

    setInterval(async () => {
        const status = await http.get('/arduino/status')
        createConfirmed.value = status.data.state.createConfirmed
        showConfirmDestroyWorld.value = status.data.state.showConfirm
        showStandby.value = status.data.state.showStandby
        showItIsWhatItIs.value = status.data.state.showItIsWhatItIs
        showAllAnimations.value = status.data.state.showAllAnimations
        showCivilisationWasDestroyed.value = status.data.state.showCivilisationWasDestroyed
        civilisationCounter.value = status.data.state.civilisationCounter
        developmentMode.value = status.data.state.developmentMode
        created.value = status.data.state.created
        showConfirm.value = status.data.state.showConfirm
        createConfirmed.value = status.data.state.createConfirmed

        await scenesStore.fetchParameters()
        updateActiveParameters()

        // Trigger main sound only when the world is created
        shouldPlayMainSound.value = created.value
        if (shouldPlayMainSound.value && buttonHidden.value && mainSound.value) {
            mainSound.value.play().catch(console.error)
        }

        await nextTick()
    }, 500)
})

const updateActiveParameters = () => {
    activeParameters.value = scenesStore.parameters.filter(param => param.is_active)
    applySpecialEffects()
}

const updateScenes = () => {
    scenes.value = scenesStore.scenes
        .filter(scene => scene.era?.name === eraName.value)
        .map(scene => ({
            ...scene,
            displayVideos: getFilteredVideos(scene)
        }))
    scenes.value = [...scenes.value]
}

const applySpecialEffects = () => {
    for (const [paramName, effectFn] of Object.entries(specialParameters)) {
        const isActive = activeParameters.value.some(param => param.name.includes(paramName))
        effectFn(isActive)
    }
}

const getFilteredVideos = (scene) => {
    const normalVideos = scene.variations?.find(variation => variation.parameter === normalParameterId.value)
    if (normalVideos) {
        const displayVideos = normalVideos.video_rows ? [...normalVideos.video_rows.map(
            (videoRow) => ({ ...videoRow, video: videoRow.original_video })
        )] : []
        activeParameters.value.forEach(param => {
            const variation = scene.variations?.find(variation => variation.parameter === param._id)
            if (variation) {
                variation.video_rows.forEach(row => {
                    const videoToReplace = displayVideos.find(v => v.name === row.name)
                    if (videoToReplace) {
                        videoToReplace.video = row.replacement_video || videoToReplace.video
                    }
                    if (!videoToReplace && row.replacement_video) {
                        displayVideos.push({ name: row.name, video: row.replacement_video })
                    }
                })
            }
        })
        return displayVideos
    }
    return []
}

const lastFetchedParameters = ref([])

const fetchParametersAndUpdate = async () => {
    await scenesStore.fetchParameters()
    if (JSON.stringify(lastFetchedParameters.value) !== JSON.stringify(scenesStore.parameters)) {
        lastFetchedParameters.value = [...scenesStore.parameters]
        updateActiveParameters()
        updateScenes()
    }
}

setInterval(fetchParametersAndUpdate, 3000)

watch(activeParameters, applySpecialEffects, { deep: true })
watch(() => scenesStore.parameters, async () => {
    updateActiveParameters()
    updateScenes()
    await nextTick()
}, { deep: true })

</script>

<style scoped>

html, body {
    background-color: #181818;
    overflow: hidden; /* Hide scrollbars */
    height: 100vh;
    width: 100vw;
}
</style>
