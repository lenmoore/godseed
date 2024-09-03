<template>
  <div style="background-color: #181818; height: 100%; width: 100%;">
    <div v-if="soundPlayer">
      <button
          v-if="!buttonHidden"
          style="z-index: 2229909000; height: 20rem; width: 20rem;"
          @click="hideButton"
      >
        click me to make sounds work
      </button>

    </div>
    <div v-if="buttonHidden">
      <div v-if="soundPlayer">
        <audio ref="backgroundSound" src="/idle.mp3"></audio>
        <audio ref="mainSound" src="/main.mp3"></audio>
      </div>

      <div class="description">
            <span v-show="showItIsWhatItIs">
                <img alt="" height="auto" src="/itiswhatitis.png" width="2000px">
            </span>
        <span v-show="showGeneratingWorld" class="create-wrapper">
                <audio ref="microwaveSound" src="/microwave.mp3"></audio>
                <img alt="" height="auto" src="/creating.png" width="2000px">
            </span>
        <div v-show="showCivilisationWasDestroyed" class="destruction-wrapper">
          <audio ref="shutdownSound" src="/shutdown.mp3"></audio>

          <video
              ref="destructionVideo" src="/tvshutdown.mov"
              @ended="onDestructionAnimationEnd"></video>

          <div style="position: absolute;">
            Civilisation number {{ civilisationCounter }} was destroyed.
          </div>
          <img ref="destroyedImage" alt="" src="/destroyed.png"
               style="position: absolute; display: none;
                        "
          >
        </div>
        <span v-show="showStandby" style="position: absolute; background-color: rgba(0, 0, 0, 0.5)">
                <img alt="" height="auto" src="/standby.png" width="2000px">
            </span>
      </div>

      <div v-if="playerActive && buttonHidden" ref="canvas" class="godseed-player">
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
  </div>
</template>

<script setup>
import {useScenesStore} from '@/stores/sceneStore.js'
import {useRoute} from 'vue-router'
import {nextTick, onMounted, ref, watch} from 'vue'
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

const soundPlayer = eraName.toString() === 'neolithic';

const hideButton = () => {
  buttonHidden.value = true

  // Trigger sounds manually once the button is clicked
  if (soundPlayer && shouldPlayBackground.value && backgroundSound.value) {
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
  showDestructionAnimation.value = true
  mainSound.value.volume = 0.1
  destructionVideo.value.style.display = 'block'

  if (soundPlayer && shutdownSound.value) shutdownSound.value.play().catch(console.error)

  nextTick()
  if (destructionVideo.value) {
    console.log('video has value')
    destructionVideo.value.play().catch(error => {
      console.error('Error playing destruction video:', error)
    })

  } else {
    console.log('didnt find video maybe')
  }
  nextTick()

}

watch(showCivilisationWasDestroyed, (value) => {
  if (value) {
    console.log('play destruction animation')
    playDestructionAnimation()
  }
})

const destroyedImage = ref(null)
const onDestructionAnimationEnd = () => {
  showDestructionAnimation.value = false
  if (soundPlayer && mainSound.value) mainSound.value.volume = 1
  destroyedImage.value.style.display = 'block'
  destructionVideo.value.style.display = 'none'
}

watch(created, (value, oldValue) => {
  if (value && value !== oldValue) {
    // play generating sounds
    showGeneratingWorld.value = true
    if (soundPlayer && microwaveSound.value) microwaveSound.value.play().catch(console.error)

    setTimeout(() => {
      nextTick()
      showGeneratingWorld.value = false
      showAllAnimations.value = true
      playerActive.value = true

      if (soundPlayer) {
        mainSound.value.volume = 1
      }
      nextTick()
    }, 14000)
  }
})

onMounted(async () => {
  await scenesStore.fetchScenes()
  await scenesStore.fetchParameters()
  normalParameterId.value = scenesStore.parameters.find(param => param.name === 'normal')._id

  updateActiveParameters()
  updateScenes()
  if (soundPlayer && shouldPlayMainSound.value && mainSound.value) {
    mainSound.value.play().catch(console.error)
    mainSound.value.volume = 1
  }
  // Trigger background sound after 3 seconds
  setTimeout(() => {
    if (soundPlayer) {
      shouldPlayBackground.value = true
    }
    if (soundPlayer && buttonHidden.value && backgroundSound.value) {
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
    console.log('showCivilisationWasDestroyed', showCivilisationWasDestroyed.value)
    civilisationCounter.value = status.data.state.civilisationCounter
    developmentMode.value = status.data.state.developmentMode
    created.value = status.data.state.created
    showConfirm.value = status.data.state.showConfirm
    createConfirmed.value = status.data.state.createConfirmed

    await scenesStore.fetchParameters()
    updateActiveParameters()

    if (soundPlayer) {
      shouldPlayMainSound.value = created.value
      if (shouldPlayMainSound.value && buttonHidden.value && mainSound.value) {
        mainSound.value.play().catch(console.error)
      }
    }
    // Trigger main sound only when the world is created


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
        (videoRow) => ({...videoRow, video: videoRow.original_video})
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
            displayVideos.push({name: row.name, video: row.replacement_video})
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

watch(activeParameters, applySpecialEffects, {deep: true})
watch(() => scenesStore.parameters, async () => {
  updateActiveParameters()
  updateScenes()
  await nextTick()
}, {deep: true})

</script>

<style scoped>


html, body {
  background-color: #181818 !important;
  overflow: hidden !important; /* Hide scrollbars */
  height: 100vh;
  width: 100vw;

  * {
    overflow: hidden !important; /* Hide scrollbars */
  }
}

.create-wrapper {
  z-index: 119919199;
  position: absolute;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.destruction-wrapper {
  z-index: 1199191919;
  position: absolute;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  video {
    position: relative;
    z-index: 1199191919;
    width: 100%;
    height: auto;
  }

  img {
    position: relative;
    z-index: 1199191918;
    width: 100%;
    height: auto;
  }
}
</style>
