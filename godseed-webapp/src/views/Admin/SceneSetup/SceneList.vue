<template>
    <div>
        <h2>Scenes for {{ eraName }}</h2>
        <div class="scenes-wrapper">
            <div class="scene-item-wrapper" v-for="scene in filteredScenes" :key="scene._id">
                {{ scene.name }} |
                <small>
                    {{ scene.desc }}
                </small>

                <p>
                    x:{{ scene.coordX }}, y:{{ scene.coordY }} | z: {{ scene.zIndex }}
                </p>
                <img :src="`http://localhost:3000${scene.image_URL}`" alt="" height="400" width="500">
                <div class="actions">
                    <button @click="deleteScene(scene._id)">Delete</button>
                    <button>Edit variations</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScenesStore } from '@/stores/sceneStore.js';

const props = defineProps(['eraName', 'refreshKey']);
const scenesStore = useScenesStore();
const route = useRoute();
const eraName = ref(route.params.era);

const refreshScenes = async () => {
    await scenesStore.fetchScenes();
};

// Watch for changes in the route or the refreshKey prop
watch([() => route.params.era, () => props.refreshKey], ([newEra, newKey]) => {
    eraName.value = newEra;
    refreshScenes();
});

// Filter scenes based on the era
const filteredScenes = computed(() => {
    return scenesStore.scenes.filter(scene => scene.era.name === eraName.value);
});

const deleteScene = async (id) => {
    await scenesStore.deleteScene(id);
    await refreshScenes(); // Refresh scenes after deleting one
};
</script>
