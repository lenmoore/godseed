<template>
    <div class="composition-editor" ref="canvas">
        <h2>Composition Editor</h2>
        <div
            v-for="scene in scenes"
            :key="scene._id"
            class="scene"
            :style="{ left: scene.coordX + 'px', top: scene.coordY + 'px', zIndex: scene.zIndex }"
            draggable="true"
            @dragstart="handleDragStart(scene)"
            @dragend="handleDragEnd(scene, $event)"
        >drag
            <div class="scene-content">
                <img :src="`http://localhost:3000${scene.image_URL}`" alt="" class="scene-image" />
                <div class="z-index-input">
                    <label>Z-index: </label>
                    <input type="number" v-model.number="scene.zIndex" @change="updateScene(scene)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScenesStore } from '@/stores/sceneStore.js';
import { useRoute } from 'vue-router'

const route = useRoute();
const eraName = ref(route.params.era);
const scenesStore = useScenesStore();
const scenes = ref([]);
const canvas = ref(null); // Reference to the canvas element
let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;

onMounted(async () => {
    await scenesStore.fetchScenes();
    scenes.value = scenesStore.scenes.filter(scene => scene.era.name === eraName.value);
});

const handleDragStart = (scene, event) => {
    // Get the initial position relative to the canvas
    const rect = canvas.value.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;

    initialX = scene.coordX;
    initialY = scene.coordY;
};

const handleDragEnd = async (scene, event) => {
    const rect = canvas.value.getBoundingClientRect();
    const endX = event.clientX - rect.left;
    const endY = event.clientY - rect.top;

    // Calculate the new position
    scene.coordX = initialX + (endX - startX);
    scene.coordY = initialY + (endY - startY);

    await scenesStore.updateScene(scene._id, {
        coordX: scene.coordX,
        coordY: scene.coordY,
        zIndex: scene.zIndex,
    });
};

const updateScene = async (scene) => {
    await scenesStore.updateScene(scene._id, {
        coordX: scene.coordX,
        coordY: scene.coordY,
        zIndex: scene.zIndex,
    });
};
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
    cursor: move;
}

.scene-content {
    position: relative;
}

.scene-image {
    width: 100%;
    height: auto;
    max-width: 300px;
    max-height: 200px;
}

.z-index-input {
    margin-top: 10px;
}

.drag-handle {
    position: absolute;
    top: 0;
    right: 0;
    cursor: grab;
}
</style>
