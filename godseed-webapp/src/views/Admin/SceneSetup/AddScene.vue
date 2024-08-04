<template>
    <div class="add-scene-wrapper">
        <h2>Add New Scene for {{ eraName }}</h2>
        <form @submit.prevent="submitScene">
            <div class="input-row">
                <label for="name">Scene Name:</label>
                <input v-model="scene.name" id="name" required />
            </div>
            <div class="input-row">
                <label for="desc">Description:</label>
                <input v-model="scene.desc" id="desc" />
            </div>
            <div class="input-row">
                <label for="coverImage">Cover Image:</label>
                <input type="file" @change="handleImageUpload" accept="image/*" />
            </div>
            <div class="input-row">
                <label for="videos">Upload Videos:</label>
                <input type="file" @change="handleVideoUpload" accept="video/*" multiple />
            </div>
            <div class="input-row">
                <label for="coordX">X Coordinate:</label>
                <input type="number" v-model.number="scene.coordX" id="coordX" required />
            </div>
            <div class="input-row">
                <label for="coordY">Y Coordinate:</label>
                <input type="number" v-model.number="scene.coordY" id="coordY" required />
            </div>
            <div class="input-row">
                <label for="zIndex">Z Index:</label>
                <input type="number" v-model.number="scene.zIndex" id="zIndex" required />
            </div>
            <button style="float: right; margin: 1rem;" type="submit">Add Scene</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useScenesStore } from '@/stores/sceneStore.js';

const emit = defineEmits(['sceneAdded']);
const scenesStore = useScenesStore();
const route = useRoute();
const eraName = ref(route.params.era);

const scene = ref({
    era: eraName.value,
    name: '',
    desc: '',
    image_URL: '',
    uploaded_videos: [],
    coordX: 0,
    coordY: 0,
    zIndex: 0,
});

const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    try {
        const imageUrl = await scenesStore.uploadImage(file);
        scene.value.image_URL = imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

const handleVideoUpload = async (event) => {
    const files = event.target.files;
    const uploadedVideos = [];

    for (let i = 0; i < files.length; i++) {
        try {
            const videoUrl = await scenesStore.uploadVideo(files[i]);
            uploadedVideos.push(videoUrl);
        } catch (error) {
            console.error(`Error uploading video ${files[i].name}:`, error);
        }
    }

    scene.value.uploaded_videos = uploadedVideos;
};

const submitScene = async () => {
    try {
        await scenesStore.addScene(scene.value);
        alert('Scene added successfully!');
        // Emit event to notify parent component (EraCanvas) to refresh the scene list
        emit('sceneAdded');
        // Reset the form
        scene.value = {
            era: eraName.value,
            name: '',
            desc: '',
            image_URL: '',
            uploaded_videos: [],
            coordX: 0,
            coordY: 0,
            zIndex: 0,
        };
    } catch (error) {
        console.error('Failed to add scene:', error);
        alert('Failed to add scene.');
    }
};
</script>

<style lang="scss">
.add-scene-wrapper {
    margin: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 40rem;

    .input-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>