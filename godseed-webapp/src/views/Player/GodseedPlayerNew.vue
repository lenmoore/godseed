<template>
    <div style="background-color: #181818;">
        <button v-if="!buttonHidden" @click="hideButton"></button>

        <div v-if="eraName === 'neolithic'">
            <audio v-if="shouldPlayBackground" ref="mainSound" autoplay src="/idle.mp3"></audio>
            <audio v-if="shouldPlayMainSound" ref="mainSound" autoplay src="/main.mp3"></audio>
        </div>

        <div class="description">
            <span v-if="showItIsWhatItIs">
                <img alt="" height="auto" src="/itiswhatitis.png" width="2000px">
            </span>
            <span v-else-if="showGeneratingWorld">
                <audio v-if="eraName === 'neolithic'" ref="microwaveSound" autoplay src="/Microwave.mp3"></audio>
                <img alt="" height="auto" src="/creating.png" width="2000px">
            </span>
            <span v-else-if="showDestructionAnimation">
                <audio v-if="eraName === 'neolithic'" ref="shutdownSound" autoplay src="/shutdown.mp3"></audio>
                <video autoplay src="/tvshutdown.mov"></video>
            </span>
            <div v-else-if="showCivilisationWasDestroyedYee"
                 style="font-size: 2rem; display: flex; align-items: center; justify-content: center; flex-direction: column; height: 100%; width: 100%; color: white;">
                <div style="position: absolute; top: 20rem;">Civilisation number {{ civilisationCounter }} was
                    destroyed.
                </div>
                <img alt="" src="/destroyed.png">
            </div>
            <span v-else-if="developmentMode">development mode</span>
            <span v-else-if="showStandby" style="position: absolute; background-color: rgba(0, 0, 0, 0.5)">
                standby
                <img alt="" height="auto" src="/standby.png" width="2000px">
            </span>
        </div>

        <div v-if="showAllAnimations" ref="canvas" class="godseed-player">
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
const isGravityDownActive = ref(false) // State to control the gravity effect
const currentStateIsCreated = ref(false)
const gravityUpIsActive = ref(false)
const buttonHidden = ref(false)
const hideButton = () => {
    buttonHidden.value = true
}

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
const showStandby = ref(false)
const showItIsWhatItIs = ref(false)
const showCivilisationWasDestroyed = ref(false)
const civilisationCounter = ref(0)
const developmentMode = ref(false)
const created = ref(false)
const showConfirm = ref(false)
const createConfirmed = ref(false)
const showDestructionAnimation = ref(false)
const showCivilisationWasDestroyedYee = ref(false)
const showAllAnimations = ref(false)
const showGeneratingWorld = ref(false)
const playerActive = ref(false)

const shouldPlayBackground = ref(false)
const shouldPlayMainSound = ref(false)

watch(showCivilisationWasDestroyed, async (value) => {
    if (value) {
        showDestructionAnimation.value = true
        await nextTick()

        setTimeout(async () => {
            showDestructionAnimation.value = false
            showCivilisationWasDestroyedYee.value = true
            await nextTick()
        }, 4000)
    }
})

watch(showAllAnimations, (value, oldValue) => {
    if (value && value !== oldValue) {
        showGeneratingWorld.value = true
        setTimeout(() => {
            showGeneratingWorld.value = false
            playerActive.value = true
            showCivilisationWasDestroyedYee.value = false
        }, 14000)
    }
})

onMounted(async () => {
    await scenesStore.fetchScenes()
    await scenesStore.fetchParameters()
    normalParameterId.value = scenesStore.parameters.find(param => param.name === 'normal')._id

    updateActiveParameters()
    updateScenes()

    // just wait 3 seconds to start playing main sound
    setTimeout(() => {
        shouldPlayBackground.value = true
    }, 3000)

    setInterval(async () => {
        const status = await http.get('/arduino/status')
        createConfirmed.value = status.data.state.createConfirmed
        currentStateIsCreated.value = status.data.state.created
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
/* Your existing CSS styles */
</style>
