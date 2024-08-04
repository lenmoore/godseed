<template>
    <div>
        <h2>Add New Scene for {{ eraName }}</h2>
        <form @submit.prevent="submitScene">
            <div>
                <label for="name">Scene Name:</label>
                <input v-model="scene.name" id="name" required />
            </div>
            <div>
                <label for="desc">Description:</label>
                <input v-model="scene.desc" id="desc" />
            </div>
            <div>
                <label for="coverImage">Cover Image:</label>
                <input type="file" @change="handleImageUpload" accept="image/*" />
            </div>
            <div>
                <label for="videos">Upload Videos:</label>
                <input type="file" @change="handleVideoUpload" accept="video/*" multiple />
            </div>
            <div>
                <label for="coordX">X Coordinate:</label>
                <input type="number" v-model.number="scene.coordX" id="coordX" required />
            </div>
            <div>
                <label for="coordY">Y Coordinate:</label>
                <input type="number" v-model.number="scene.coordY" id="coordY" required />
            </div>
            <div>
                <label for="zIndex">Z Index:</label>
                <input type="number" v-model.number="scene.zIndex" id="zIndex" required />
            </div>
            <button type="submit">Add Scene</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useScenesStore } from '@/stores/sceneStore.js';

const scenesStore = useScenesStore();
const route = useRoute();
const eraId = route.params.era;
const eraName = ref(route.params.era);

// Define the initial state for the scene
const scene = ref({
    era: eraId,
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
        console.log(imageUrl)
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

<style scoped>
form {
    display: flex;
    flex-direction: column;
}

div {
    margin-bottom: 10px;
}

label {
    margin-bottom: 5px;
}

input {
    padding: 5px;
    margin-bottom: 10px;
}

button {
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
