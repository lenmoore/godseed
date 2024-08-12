<template>
    <div>
        <div class="buttons-wrapper">
            <div class="toggle">
                <button @click="showCompositionEditor = !showCompositionEditor">
                    {{ showCompositionEditor ? 'Hide' : 'Show' }} composition editor
                </button>
                <div v-if="showCompositionEditor">
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
    eraName.value = newEra // Update the era name whenever the route changes
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