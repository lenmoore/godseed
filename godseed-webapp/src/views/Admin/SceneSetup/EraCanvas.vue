<template>
    <div>
        <div class="buttons-wrapper">
            <div class="toggle">
                <button @click="showCompositionEditor = !showCompositionEditor">
                    {{ showCompositionEditor ? 'Hide' : 'Show' }} composition editor
                </button>
                <div v-if="showCompositionEditor">
                    <h2>
                        Zoom out the browser window to use this page. Drag and resize scenes by cover images. Use
                        z-index to move
                        them in
                        front of each other
                    </h2>
                    <router-link :to="`/godseed/${eraName}`" target="_blank">Open real canvas for expo -></router-link>


                    <CompositionEditor />
                </div>
            </div>
            <button v-if="!addingScene" @click="addingScene=true">Add scene</button>
        </div>
        <AddScene v-if="addingScene" :era-name="eraName" @sceneAdded="refreshScenes" />

        <SceneList v-if="!showCompositionEditor" :era-name="eraName" :refreshKey="refreshKey" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AddScene from '@/views/Admin/SceneSetup/AddScene.vue'
import SceneList from '@/views/Admin/SceneSetup/SceneList.vue'
import CompositionEditor from '@/views/Admin/SceneSetup/CompositionEditor.vue'

const showCompositionEditor = ref(false)

const route = useRoute()
const eraName = ref(route.params.era)
const refreshKey = ref(0) // This key will be used to trigger a re-render in SceneList
const addingScene = ref(false)

watch(() => route.params.era, (newEra) => {
    refreshKey.value += 1 // Update the refresh key to trigger re-fetch in SceneList
    eraName.value = newEra // Update the era name whenever the route changes
    showCompositionEditor.value = false // Hide the composition editor when the era changes
})

const refreshScenes = () => {
    refreshKey.value += 1 // Update the refresh key to trigger re-fetch in SceneList
    addingScene.value = false
}
</script>

<style lang="scss">
.buttons-wrapper {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
</style>