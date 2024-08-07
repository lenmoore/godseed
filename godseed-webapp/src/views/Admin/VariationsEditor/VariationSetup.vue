<template>
    <div class="variation-setup border">
        <h3>Setup Variations</h3>
        <div class="variation-tabs">
            <button
                v-for="(variation, index) in variations"
                :key="variation._id"
                :class="{ active: activeVariation === index }"
                @click="setActiveVariation(index)"
            >
                {{ variation.parameter.name }}
            </button>

            <button
                v-if="parameters.length"
                @click="showAddVariationDropdown = !showAddVariationDropdown"
            >
                add variation
            </button>
            <div v-if="showAddVariationDropdown" class="dropdown">
                <button
                    v-for="parameter in availableParameters"
                    :key="parameter._id"
                    @click="addVariation(parameter)"
                >
                    {{ parameter.name }}
                </button>
            </div>
        </div>
        <div class="variation-details">
            <div v-if="activeVariation !== null">
                <h4>{{ variations[activeVariation].parameter.name }}</h4>
                <ul>
                    <li
                        v-for="video in variations[activeVariation].videos_list"
                        :key="video"
                    >
                        {{ video }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore()
const showAddVariationDropdown = ref(false)
const activeVariation = ref(null)

const parameters = ref([])
const variations = ref([])

// Filter out parameters that are already used in variations
const availableParameters = computed(() =>
    parameters.value.filter(
        (param) =>
            !variations.value.some((variation) => variation.parameter._id === param._id)
    )
)

onMounted(async () => {
    await scenesStore.fetchParameters()
    await scenesStore.fetchVariations(scenesStore.currentScene._id)
    parameters.value = scenesStore.parameters
    variations.value = scenesStore.variations

})

const addVariation = async (parameter) => {
    console.log(parameter)
    console.log(parameters.value)
    showAddVariationDropdown.value = false

    const newVariation = {
        scene: scenesStore.currentScene._id,
        parameter: parameter._id,
        videos_list: [] // Start with an empty list of videos
    }

    console.log(newVariation)
    await scenesStore.addVariation(newVariation)

    // Add the new variation to the variations list and set it as the active variation
    variations.value.push({
        ...newVariation,
        _id: scenesStore.variations[scenesStore.variations.length - 1]._id
    })
    activeVariation.value = variations.value.length - 1
}

const setActiveVariation = (index) => {
    activeVariation.value = index
}
</script>

<style scoped>
.variation-setup {
    position: relative;
}

.variation-tabs {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.variation-tabs button {
    margin-right: 5px;
}

.dropdown {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px;
    display: flex;
    flex-direction: column;
}

.dropdown button {
    margin-bottom: 5px;
    cursor: pointer;
}

.dropdown button:last-child {
    margin-bottom: 0;
}
</style>
