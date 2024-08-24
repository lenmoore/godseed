<template>
    <div class="add-scene-wrapper">
        <h2>Add New Scene for {{ eraName }}</h2>
        <form @submit.prevent="submitScene">
            <div class="input-row">
                <label for="name">Scene Name:</label>
                <input id="name" v-model="scene.name" required />
            </div>
            <div class="input-row">
                <label for="desc">Description:</label>
                <input id="desc" v-model="scene.desc" />
            </div>
            <div class="input-row">
                <label for="coverImage">Cover Image:</label>
                <input accept="image/*" type="file" @change="handleImageUpload" />
            </div>
            <div class="input-row">
                <label for="videos">Upload Videos:</label>
                <input accept="video/*" multiple type="file" @change="handleVideoUpload" />
                <div v-if="videosFinished" style="color: lightgreen;">done</div>
                <div v-else-if="videosLoading">uploading</div>
            </div>
            <div class="input-row">
                <label for="coordX">X Coordinate:</label>
                <input id="coordX" v-model.number="scene.coordX" required type="number" />
            </div>
            <div class="input-row">
                <label for="coordY">Y Coordinate:</label>
                <input id="coordY" v-model.number="scene.coordY" required type="number" />
            </div>
            <div class="input-row">
                <label for="zIndex">Z Index:</label>
                <input id="zIndex" v-model.number="scene.zIndex" required type="number" />
            </div>
            <button style="float: right; margin: 1rem;" type="submit">Add Scene</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useScenesStore } from '@/stores/sceneStore.js'

const emit = defineEmits(['sceneAdded'])
const scenesStore = useScenesStore()
const route = useRoute()
const eraName = ref(route.params.era)

const scene = ref({
    era: eraName.value,
    name: '',
    desc: '',
    image_URL: '',
    uploaded_videos: [],
    coordX: 0,
    coordY: 0,
    zIndex: 0,
    displayWidth: 0,
    displayHeight: 0
})

const videosFinished = ref(false)
const videosLoading = ref(false)
const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result

        img.onload = async () => {
            console.log('Image loaded, width:', img.width, 'height:', img.height)
            try {
                const imageUrl = await scenesStore.uploadImage(file)
                scene.value.image_URL = imageUrl
                // Ensure reactivity is maintained
                scene.value.displayWidth = img.width
                scene.value.displayHeight = img.height
            } catch (error) {
                console.error('Error uploading image:', error)
            }
        }
    }

    reader.readAsDataURL(file)
}

const handleVideoUpload = async (event) => {
    const files = event.target.files
    const uploadedVideos = []
    videosLoading.value = true
    for (let i = 0; i < files.length; i++) {
        try {
            const videoUrl = await scenesStore.uploadVideo(files[i])
            uploadedVideos.push(videoUrl)
            videosFinished.value = i === files.length - 1
        } catch (error) {
            console.error(`Error uploading video ${files[i].name}:`, error)
        }
    }
    videosLoading.value = false
    scene.value.uploaded_videos = uploadedVideos
}

const submitScene = async () => {
    try {
        console.log(scene.value)
        await scenesStore.addScene(scene.value)
        // Emit event to notify parent component (EraCanvas) to refresh the scene list
        emit('sceneAdded')
        // Reset the form
        scene.value = {
            era: eraName.value,
            name: '',
            desc: '',
            image_URL: '',
            uploaded_videos: [],
            coordX: 0,
            coordY: 0,
            zIndex: 0
        }
    } catch (error) {
        console.error('Failed to add scene:', error)
        alert('Failed to add scene.')
    }
}
</script>

<style lang="scss">
.add-scene-wrapper {
    margin: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 80rem;

    .input-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 3rem;
        margin-bottom: 0.5rem;
        background-color: #2d2d2d;

        label {
            font-size: 2rem;
        }

        input {
            height: 3rem;
            font-size: 2rem;
            width: 80%;
        }
    }
}
</style>