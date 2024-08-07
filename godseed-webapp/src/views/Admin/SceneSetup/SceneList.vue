<template>
    <div>
        <h2>Scenes for {{ eraName }}</h2>
        <div v-if="filteredScenes.length" class="scenes-wrapper">
            <div
                v-for="scene in filteredScenes"
                 :key="scene._id"
                class="scene-item-wrapper"
                :class="{ 'selected': scene.selected } "
            >
                {{ scene.name }} |
                <small>
                    {{ scene.desc }}
                </small>

                <p>
                    x:{{ scene.coordX }}, y:{{ scene.coordY }} | z: {{ scene.zIndex }}
                </p>
                <img :src="`http://localhost:3000${scene.image_URL}`" alt="" >
                <div class="actions">
                    <button @click="deleteScene(scene._id)">Delete</button>
                    <button @click="$router.push({ name: 'variations-editor', params: { scene: scene._id } })">Edit variations</button>
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

// Initialize eraName with the prop value and update when the route changes
eraName.value = props.eraName;
watch([() => props.eraName, () => props.refreshKey], async () => {
    await refreshScenes();
});

// Also, watch for route changes to update eraName and refresh scenes
watch(() => route.params.era, async (newEra) => {
    eraName.value = newEra;
    await refreshScenes();
});

// Filter scenes based on the era
const filteredScenes = computed(() => {
    return scenesStore.scenes.filter(scene => scene.era.name === eraName.value);
});

const deleteScene = async (id) => {
    await scenesStore.deleteScene(id);
    await refreshScenes(); // Refresh scenes after deleting one
};

// Fetch scenes on component mount
onMounted(async () => {
    await refreshScenes();
});

function selectScene(scene) {
    scene.selected = true;
}
</script>

<style lang="scss">
.scenes-wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
}

.scene-item-wrapper {
    padding: 1rem;
    margin: 1rem;
    border: 1px solid whitesmoke;
    width: 40rem;

    img {
        width: 100%;
        height: auto;
    }
}
</style>