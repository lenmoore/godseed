<template>
    <div class="scene-settings-form p-6 bg-gray-800 shadow-md rounded-lg">
        <div v-if="isReadOnly" class="cursor-pointer">
            <h3 class="text-xl font-bold text-gray-200">{{ scene.name }}</h3>
            <p class="text-gray-400">{{ scene.era.name }}</p>
            <p class="text-gray-300">{{ scene.desc }}</p>
            {{ scene.gravity ? 'gravity affects it' : 'gravity does not affect it' }}
            <img v-if="scene.image_URL" :src="apiBaseUrl + scene.image_URL"
                 alt="Scene Image"
                 class="mt-2 rounded-md h-48 object-cover"
                 width="400px" />
            <div class="mt-4">
                <button @click="toggleEditMode">edit</button>
            </div>
        </div>

        <form v-else @submit.prevent="submitForm">
            <div class="mb-4">
                <label class="block text-gray-200 font-bold mb-2">Scene Name:</label>
                <input
                    v-model="scene.name"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    required
                    type="text"
                />
            </div>
            <div class="mb-4">
                <label class="block text-gray-200 font-bold mb-2">Era:</label>
                <p class="text-gray-300">{{ scene.era.name }}</p>
            </div>
            <div class="mb-4">
                <label class="block text-gray-200 font-bold mb-2">Scene Description:</label>
                <textarea
                    v-model="scene.desc"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                ></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-gray-200 font-bold mb-2">Scene Image:</label>
                <input
                    class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                    type="file"
                    @change="handleImageUpload"
                />
            </div>
            <div class="mb-4">
                <label class="block text-gray-200 font-bold mb-2">Gravity</label>
                <input
                    v-model="scene.gravity"
                    class="h-4 w-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500"
                    type="checkbox"
                />
            </div>
            <div class="flex justify-between items-center">
                <button
                    class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="submit"
                >
                    Save Scene
                </button>
                <button
                    class="text-gray-400 underline"
                    type="button"
                    @click="toggleEditMode"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useScenesStore } from '@/stores/sceneStore'

const apiBaseUrl = import.meta.env.VITE_SERVER_URL
const scenesStore = useScenesStore()
const isReadOnly = ref(true) // Track whether the form is in read-only mode or edit mode

// Make scene reactive to changes in scenesStore.currentScene
const scene = computed(() => scenesStore.currentScene)

const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    try {
        const imageUrl = await scenesStore.uploadImage(file)
        scene.value.image_URL = imageUrl
    } catch (error) {
        console.error('Failed to upload image:', error)
    }
}

const submitForm = async () => {
    try {
        await scenesStore.updateScene(scene.value._id, scene.value)
        isReadOnly.value = true // Return to read-only mode after saving
    } catch (error) {
        console.error('Failed to save scene:', error)
    }
}

const toggleEditMode = () => {
    isReadOnly.value = !isReadOnly.value
}
</script>

<style scoped>
/* Add any necessary styling */
</style>
