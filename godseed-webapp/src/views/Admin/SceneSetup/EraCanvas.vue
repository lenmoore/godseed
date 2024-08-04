<template>
    <div>
        <h1>Era Canvas - {{ eraName }}</h1>
        <AddScene />
        <SceneList />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import AddScene from '@/views/Admin/SceneSetup/AddScene.vue'
import SceneList from '@/views/Admin/SceneSetup/SceneList.vue'

const route = useRoute();
const eraName = route.params.era;
</script>
