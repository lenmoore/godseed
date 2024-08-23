<script setup>
import { onMounted, ref } from 'vue'
import { useSetupStore } from '@/stores/setupStore.js'

const setupStore = useSetupStore()
const eras = ref([])

onMounted(async () => {
    await setupStore.fetchEras()
    eras.value = setupStore.eras // Assign the fetched eras to a local reactive variable
})

</script>

<template>
    <div class="dashboard-wrapper">
        Select era:
        <ul v-if="eras.length" class="era-list">
            <li
                v-for="era in eras"
                :key="era._id"
                class="era-item"
            >
                <router-link
                    :to="{ name: 'era-canvas', params: { era: era.name }}"
                    active-class="active-era-link"
                    class="era-link"
                >
                    {{ era.name }}
                </router-link>
            </li>
        </ul>

        <router-view />
    </div>
</template>

<style scoped>
.dashboard-wrapper {
    margin-left: 1rem;
    margin-right: 1rem;
}

.era-list {
    display: flex;
}

.era-item {
    width: 10rem;
    font-size: 0.75rem;
}

.era-link {
    text-decoration: none;
    color: inherit;
    padding: 0.5rem;
    display: block;
    text-align: center;
}

/* Styling for active link */
.active-era-link {
    font-weight: bold;
    color: #007bff; /* Highlight color */
    background-color: #f0f0f0; /* Background color for active link */
    border-radius: 4px; /* Optional: To make it look better */
}
</style>
