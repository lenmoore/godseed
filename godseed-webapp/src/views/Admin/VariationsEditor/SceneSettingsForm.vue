<template>
    <div class="scene-settings-form">
        <form v-if="scene" @submit.prevent="submitForm">
            <div>
                <label>Scene Name:</label>
                <input v-model="scene.name" type="text" required />
            </div>
            <div>
                {{ scene.era.name }}
            </div>
            <div>
                <label>Scene Description:</label>
                <textarea v-model="scene.desc"></textarea>
            </div>
            <div>
                <label>Scene Image:</label>
                <input type="file" @change="handleImageUpload" />
            </div>
            <div>
                <label>Is Saved:</label>
                <input v-model="scene.is_saved" type="checkbox" />
            </div>
            <button type="submit">Save Scene</button>
        </form>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useScenesStore } from '@/stores/sceneStore';

const scenesStore = useScenesStore();

// Make scene reactive to changes in scenesStore.currentScene
const scene = computed(() => scenesStore.currentScene);

const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    try {
        const imageUrl = await scenesStore.uploadImage(file);
        scene.value.image_URL = imageUrl;
    } catch (error) {
        console.error('Failed to upload image:', error);
    }
};

const submitForm = async () => {
    try {
        await scenesStore.updateScene(scene.value._id, scene.value);
        alert('Scene saved successfully');
    } catch (error) {
        console.error('Failed to save scene:', error);
    }
};
</script>

<style scoped>
/* Add any necessary styling */
</style>
