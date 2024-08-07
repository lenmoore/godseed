<template>
    <div class="variations-editor flex-col h-full p-6 bg-gray-900 text-gray-200">
        <SceneSettingsForm v-if="sceneLoaded" class="mb-6" />
        <div v-if="sceneLoaded" class="middle-section flex justify-between space-x-6 mb-6">
            <UploadedVideosManager class="flex-1 bg-gray-800 p-4 rounded-lg" />
            <VideoPlayer class="flex-1 bg-gray-800 p-4 rounded-lg" />
        </div>
        <VariationSetup v-if="sceneLoaded" class="bg-gray-800 p-4 rounded-lg" />
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

onMounted(async () => {
    const sceneId = route.params.scene // Assuming the route parameter is named 'scene'
    await scenesStore.fetchSceneById(sceneId)
    sceneLoaded.value = true
})
</script>
