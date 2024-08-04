<template>
    <div>
        <h1>Era Canvas - {{ eraName }}</h1>

        <button v-if="!addingScene" @click="addingScene=true">Add scene</button>
        <AddScene v-if="addingScene" :era-name="eraName" @sceneAdded="refreshScenes" />
        <SceneList :era-name="eraName" :refreshKey="refreshKey" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AddScene from '@/views/Admin/SceneSetup/AddScene.vue';
import SceneList from '@/views/Admin/SceneSetup/SceneList.vue';

const route = useRoute();
const eraName = ref(route.params.era);
const refreshKey = ref(0); // This key will be used to trigger a re-render in SceneList
const addingScene = ref(false);

watch(() => route.params.era, (newEra) => {
    eraName.value = newEra; // Update the era name whenever the route changes
});

const refreshScenes = () => {
    refreshKey.value += 1; // Update the refresh key to trigger re-fetch in SceneList
    addingScene.value = false;
};
</script>
