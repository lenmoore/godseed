<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSetupStore } from '@/stores/parameterStore.js';
import { useRoute } from 'vue-router'

const setupStore = useSetupStore();
const eras = ref([]);

onMounted(async () => {
    await setupStore.fetchEras();
    eras.value = setupStore.eras; // Assign the fetched eras to a local reactive variable
});

</script>

<template>
    <div class="dashboard-wrapper">
        <ul style="display: flex">
            <li style="width: 10rem; font-size: 0.75rem;" v-for="era in eras" :key="era._id">
                <router-link :to="{ name: 'era-canvas', params: { era: era.name }}">{{ era.name }}</router-link>
            </li>
        </ul>

        <router-view />
    </div>
</template>

<style>
.dashboard-wrapper {
    margin-left: 1rem;
    margin-right: 1rem;
}
</style>