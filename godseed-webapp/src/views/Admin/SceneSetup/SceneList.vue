<template>
    <div>
        <h2>Scenes for {{ eraName }}</h2>
        <ul>
            <li v-for="scene in filteredScenes" :key="scene._id">
                {{ scene.name }}
                <button @click="deleteScene(scene._id)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore();
const route = useRoute();
const eraId = route.params.era;
const eraName = ref(route.params.era);

onMounted(async () => {
    await scenesStore.fetchScenes();
});

// Filter scenes based on the era
const filteredScenes = computed(() => {
    return scenesStore.scenes.filter(scene => scene.era === eraId);
});

const deleteScene = async (id) => {
    await scenesStore.deleteScene(id);
};
</script>
