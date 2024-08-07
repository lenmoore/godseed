<template>
    <div class="variations-editor">
        <SceneSettingsForm v-if="sceneLoaded" />
        <div class="middle-section" v-if="sceneLoaded">
            <UploadedVideosManager />
            <VideoPlayer />
        </div>
        <VariationSetup v-if="sceneLoaded" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useScenesStore } from '@/stores/sceneStore';

import SceneSettingsForm from '@/views/Admin/VariationsEditor/SceneSettingsForm.vue';
import UploadedVideosManager from '@/views/Admin/VariationsEditor/UploadedVideosManager.vue';
import VideoPlayer from '@/views/Admin/VariationsEditor/VideoPlayer.vue';
import VariationSetup from '@/views/Admin/VariationsEditor/VariationSetup.vue';

const route = useRoute();
const scenesStore = useScenesStore();
const sceneLoaded = ref(false);

onMounted(async () => {
    const sceneId = route.params.scene; // Assuming the route parameter is named 'id'
    await scenesStore.fetchSceneById(sceneId);
    sceneLoaded.value = true;
});
</script>

<style scoped>
.variations-editor {
    display: flex;
    flex-direction: column;
}

.middle-section {
    display: flex;
    justify-content: space-between;
}
</style>
