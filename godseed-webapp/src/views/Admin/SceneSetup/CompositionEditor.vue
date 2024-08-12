<template>
    <div ref="canvas" class="composition-editor">
        <div
            v-for="scene in scenes"
            :key="scene._id"
            :style="{
                left: scene.coordX + 'px',
                top: scene.coordY + 'px',
                zIndex: scene.zIndex,
                width: scene.displayWidth + 'px',
                height: scene.displayHeight + 'px'
            }"
            class="scene"
        >
            <div class="scene-content">
                <img :src="`${apiBaseUrl}${scene.image_URL}`" alt="" class="scene-image" />
                <div class="z-index-input">
                    <label>Z-index: </label>
                    <input v-model.number="scene.zIndex" type="number" @change="updateScene(scene)" />
                </div>
                <!-- Drag Handle in Top-Left Corner -->
                <div
                    class="drag-handle"
                    draggable="true"
                    @dragend="handleDragEnd(scene, $event)"
                    @dragstart="handleDragStart(scene, $event)"
                    @mousedown="startDrag(scene, $event)"
                >
                    Drag
                </div>
                <!-- Resize Handle in Bottom-Right Corner -->
                <div class="resize-handle" @mousedown="startResize(scene, $event)"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'
import { useRoute } from 'vue-router'

const apiBaseUrl = import.meta.env.VITE_SERVER_URL
const route = useRoute()
const eraName = ref(route.params.era)
const scenesStore = useScenesStore()
const scenes = ref([])
const canvas = ref(null)
let startX = 0
let startY = 0
let initialWidth = 0
let initialHeight = 0
let aspectRatio = 1 // Variable to store the aspect ratio
let isResizing = false
let isDragging = false
let currentScene = null
let initialX = 0
let initialY = 0
onMounted(async () => {
    await scenesStore.fetchScenes()
    scenes.value = await Promise.all(
        scenesStore.scenes
            .filter(scene => scene.era.name === eraName.value)
            .map(async scene => {
                const image = new Image()
                const imageURL = `${apiBaseUrl}${scene.image_URL}`

                // Load the image to get its dimensions
                const loadImageDimensions = () =>
                    new Promise((resolve, reject) => {
                        image.onload = () => {
                            resolve({
                                width: image.width,
                                height: image.height
                            })
                        }
                        image.onerror = reject
                        image.src = imageURL
                    })

                let dimensions = { width: 400, height: 400 } // Default dimensions

                try {
                    dimensions = await loadImageDimensions()
                } catch (error) {
                    console.error('Failed to load image:', imageURL, error)
                }

                return {
                    ...scene,
                    coordX: scene.coordX || 0,
                    coordY: scene.coordY || 0,
                    displayWidth: scene.displayWidth || dimensions.width,  // Use image dimensions if not set
                    displayHeight: scene.displayHeight || dimensions.height, // Use image dimensions if not set
                    zIndex: scene.zIndex || 1
                }
            })
    )
})

const handleDragStart = (scene, event) => {
    const rect = canvas.value.getBoundingClientRect()
    startX = event.clientX - rect.left
    startY = event.clientY - rect.top

    initialX = scene.coordX
    initialY = scene.coordY
}

const startDrag = (scene, event) => {
    isDragging = true
    currentScene = scene

    const rect = canvas.value.getBoundingClientRect()
    startX = event.clientX - rect.left
    startY = event.clientY - rect.top

    initialX = scene.coordX
    initialY = scene.coordY
}
const handleDragEnd = async (scene, event) => {
    if (!isDragging) return

    const rect = canvas.value.getBoundingClientRect()
    const endX = event.clientX - rect.left
    const endY = event.clientY - rect.top

    scene.coordX = Math.max(0, initialX + (endX - startX)) || 0
    scene.coordY = Math.max(0, initialY + (endY - startY)) || 0

    console.log('Updating Scene with new position:', {
        coordX: scene.coordX,
        coordY: scene.coordY
    })

    await scenesStore.updateScene(scene._id, {
        coordX: scene.coordX,
        coordY: scene.coordY,
        zIndex: scene.zIndex,
        displayWidth: scene.displayWidth,
        displayHeight: scene.displayHeight
    })

    isDragging = false
}


const startResize = (scene, event) => {
    isResizing = true
    currentScene = scene

    startX = event.clientX
    startY = event.clientY

    initialWidth = currentScene.displayWidth
    initialHeight = currentScene.displayHeight
    aspectRatio = initialWidth / initialHeight // Calculate the initial aspect ratio

    document.addEventListener('mousemove', resizeScene)
    document.addEventListener('mouseup', stopResize)
}

const resizeScene = (event) => {
    if (!isResizing || !currentScene) return

    const deltaX = (event.clientX - startX) || 0  // Sanitize the deltaX
    const deltaY = (event.clientY - startY) || 0  // Sanitize the deltaY

    // Calculate new width and height based on the aspect ratio
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Width change is more significant, adjust height based on width
        currentScene.displayWidth = Math.max(0, initialWidth + deltaX)
        currentScene.displayHeight = currentScene.displayWidth / aspectRatio
    } else {
        // Height change is more significant, adjust width based on height
        currentScene.displayHeight = Math.max(0, initialHeight + deltaY)
        currentScene.displayWidth = currentScene.displayHeight * aspectRatio
    }
}


const stopResize = async () => {
    isResizing = false

    if (currentScene) {
        console.log('Updating Scene with new dimensions:', {
            displayWidth: currentScene.displayWidth,
            displayHeight: currentScene.displayHeight
        })
        await scenesStore.updateScene(currentScene._id, {
            displayWidth: currentScene.displayWidth,
            displayHeight: currentScene.displayHeight
        })
    }

    document.removeEventListener('mousemove', resizeScene)
    document.removeEventListener('mouseup', stopResize)
    currentScene = null
}

const sanitizeValue = (value) => isNaN(value) ? 0 : value

const updateScene = async (scene) => {
    await scenesStore.updateScene(scene._id, {
        coordX: sanitizeValue(scene.coordX),
        coordY: sanitizeValue(scene.coordY),
        zIndex: sanitizeValue(scene.zIndex),
        displayWidth: sanitizeValue(scene.displayWidth),
        displayHeight: sanitizeValue(scene.displayHeight)
    })
}

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', resizeScene)
    document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.composition-editor {
    position: relative;
    width: 3840px; /* UHD width */
    height: 2160px; /* UHD height */
    border: 1px solid #ccc;
}

.scene {
    position: absolute;
    border: 2px solid red;
    padding: 10px;
}

.scene-content {
    position: relative;
    width: 100%;
    height: 100%;
}

.scene-image {
    width: 100%;
    height: 100%;
}

.z-index-input {
    margin-top: 10px;
}

.drag-handle {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 30px;
    height: 30px;
    background-color: #007BFF;
    cursor: grab;
    z-index: 10;
}

.resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: #007BFF;
    cursor: se-resize;
}
</style>
