<template>
    <div v-if="sceneLoaded" class="variations-editor-wrapper">
        <div class="top-wrapper">

            <div class="left">
                <SceneSettingsForm class="scene-settings-form border" />
                <UploadedVideosManager class="videos-list rounded-lg" />
            </div>
            <VideoPlayer :selected-variation="selectedVariation" class="video-player rounded-lg" />
        </div>
        <VariationSetup class="variation-setup rounded-lg" @select-variation="selectVariation" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useScenesStore } from '@/stores/sceneStore'

import SceneSettingsForm from '@/views/Admin/VariationsEditor/SceneSettingsForm.vue'
import UploadedVideosManager from '@/views/Admin/VariationsEditor/UploadedVideosManager.vue'
import VideoPlayer from '@/views/Admin/VariationsEditor/VideoPlayer.vue'
import VariationSetup from '@/views/Admin/VariationsEditor/VariationSetup.vue'

const route = useRoute()
const scenesStore = useScenesStore()
const sceneLoaded = ref(false)
const selectedVariation = ref(null)

function selectVariation(variation) {
    console.log('Selected variation:', variation)
}

onMounted(async () => {
    const sceneId = route.params.scene // Assuming the route parameter is named 'scene'
    await scenesStore.fetchSceneById(sceneId)
    sceneLoaded.value = true
})
</script>

<style lang="scss">
.left {
    display: flex;
    width: 30rem;
    flex-direction: column;
    gap: 1rem;

    padding: 1rem;
    border-radius: 1rem;
}

.scene-settings-form {
    background-color: #2d2d2d;
}

.videos-list {
    padding: 1rem;
    background-color: #2d2d2d;
    height: 100%;
}

.top-wrapper {
    display: flex;
    gap: 1rem;
    height: 50rem;
    width: 100%;

    video {
        border: 1px solid green;
    }
}

.video-player {
    margin: 1rem;
    width: 100%;
}
</style>