<template>
    <div class="variation-setup">
        <h3>Setup Variations</h3>
        <div class="variation-tabs">
            <button v-for="parameter in parameters" :key="parameter._id" :class="{ active: parameter.isActive }">
                {{ parameter.name }}
            </button>
            <button @click="addVariation">+</button>
        </div>
        <div class="variation-details">
            <div v-for="variation in variations" :key="variation._id">
                <h4>{{ variation.parameter.name }}</h4>
                <ul>
                    <li v-for="video in variation.videos_list" :key="video">{{ video }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore();
const parameters = ref([]);
const variations = ref([]);

onMounted(async () => {
    await scenesStore.fetchParameters();
    await scenesStore.fetchVariations(scenesStore.currentScene._id);
    parameters.value = scenesStore.parameters;
    variations.value = scenesStore.variations;
});

const addVariation = () => {
    // Logic for adding a new variation
};
</script>

<style scoped>
/* Add any necessary styling */
</style>
