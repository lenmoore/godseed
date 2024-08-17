<template>
    <div class="variation-setup border p-4 m-4 bg-gray-800 rounded-lg">
        <h3 class="text-xl font-bold text-gray-200">Configure variations</h3>
        <small class="my-4">
            First add layers for the "normal" parameter. Then add replacements in different tabs.
        </small>

        <!-- Variation Tabs -->
        <div v-if="parameters.length" class="variation-tabs mb-4">
            <div class="flex items-center mb-4">
                <div v-if="variations.length" class="flex">
                    <button
                        v-for="(variation, index) in variations"
                        :key="variation._id"
                        :class="[
                            'variation-tab',
                            activeVariation === index
                                ? 'active'
                                : ' '
                        ]"
                        @click="setActiveVariation(index)"
                    >
                        {{ variation.parameter.name || 'Unnamed' }}
                    </button>
                </div>
            </div>

            <div class="relative ml-auto">
                <button
                    v-if="availableParameters.length"
                    class="py-2 px-4 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                    @click="showAddVariationDropdown = !showAddVariationDropdown"
                >
                    Add Variation
                </button>
                <div
                    v-if="showAddVariationDropdown"
                    class="dropdown absolute bg-gray-700 rounded-lg shadow-lg p-2"
                >
                    <div v-if="variations.length === 0">
                        <button @click="addVariation(normalParameter)">
                            <span class="text-blue-500">Add normal</span>
                        </button>
                    </div>
                    <div v-else>
                        <button
                            v-for="parameter in availableParameters"
                            :key="parameter._id"
                            class="block text-gray-200 hover:text-white px-4 py-2"
                            @click="addVariation(parameter)"
                        >
                            {{ parameter.name }}
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- No Variations Message -->
        <div v-if="!variations.length" class="text-gray-300">
            No variations exist. Start by adding a new variation.
        </div>

        <!-- Variation Details -->
        <div v-if="activeVariation !== null && variations.length" class="variation-details">
            <h4 class="text-lg font-semibold text-gray-300 mb-4">
                {{ variations[activeVariation].parameter.name || 'Refresh the page' }}
            </h4>

            <!-- Rows -->
            <ul style="padding-left: 0;">
                <li
                    v-for="(row, rowIndex) in getAllVideoRows"
                    :key="rowIndex"
                    class="var-row flex items-center"
                >
                    <input
                        v-model="row.name"
                        :class="[
                            'px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400',
                            isNormalVariation ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-black text-gray-500 border-gray-700'
                        ]"
                        :disabled="row.disabledEditingOriginal"
                        placeholder="Row Name"
                    />
                    <select
                        v-model="row.original_video"
                        :disabled="!isNormalVariation"
                        class="px-3 py-2 bg-black text-gray-500 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    >
                        <option v-for="video in allUploadedVideos" :key="video" :value="video">
                            {{ video }}
                        </option>
                    </select>
                    <div v-if="!isNormalVariation" class="replace-row">
                        <small>
                            Replace with:
                        </small>
                        <select
                            v-model="row.replacement_video"
                            class="px-3 py-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        >
                            <option v-for="video in allUploadedVideos" :key="video" :value="video">
                                {{ video }}
                            </option>
                        </select>
                        <button
                            v-if="row.replacement_video"
                            class="remove-button"
                            @click="clearReplacement(row)"
                        >
                            X
                        </button>
                    </div>

                    <!-- Up/Down Arrows -->
                    <div class="arrows">
                        <button
                            :disabled="rowIndex === 0"
                            class="arrow-button"
                            @click="moveRowUp(rowIndex)"
                        >
                            ▲
                        </button>
                        <button
                            :disabled="rowIndex === getVideoRowsForCurrentVariation.length - 1"
                            class="arrow-button"
                            @click="moveRowDown(rowIndex)"
                        >
                            ▼
                        </button>
                    </div>
                </li>
            </ul>

            <div class="flex mt-4">
                <button
                    v-if="isNormalVariation"
                    class="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4"
                    @click="addRow"
                >
                    Add Row
                </button>

                <button v-else @click="addVariationRow">
                    Add a row to only this variation
                </button>
                <button
                    :class="[
                        'py-2 px-4 rounded-md save-btn',
                    ]"
                    @click="saveVariation"
                >
                    {{ saveButtonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useScenesStore } from '@/stores/sceneStore.js'

const scenesStore = useScenesStore()
const showAddVariationDropdown = ref(false)
const activeVariation = ref(0)
const saveButtonText = ref('Save changes')
const parameters = ref([])
const variations = ref([])
const normalParameter = ref(null)

const allUploadedVideos = computed(() => scenesStore.currentScene.uploaded_videos)

const hasChanges = ref(false)

// Watch for changes in the current variation and reset the save button text
watch(
    () => variations.value[activeVariation.value],
    {
        deep: true,
        handler() {
            saveButtonText.value = 'Save Variation'
            hasChanges.value = true
        }
    }
)

// Get the normal variation (used to define the base rows)
const normalVariation = computed(() =>
    variations.value.find(variation => variation?.parameter?.name === 'normal')
)

const isNormalVariation = computed(() => {
    return variations.value[activeVariation.value]?.parameter?.name === 'normal'
})
// Get the video rows for the current variation
const getVideoRowsForCurrentVariation = computed(() => {
    if (isNormalVariation.value) {
        return variations.value[activeVariation.value]?.video_rows || []
    } else if (normalVariation.value) {
        return normalVariation.value?.video_rows?.map((row) => {
            // Find or create a corresponding row in the current variation
            let existingRow = variations.value[activeVariation.value]?.video_rows?.find(vr => vr.name === row.name)
            if (!existingRow) {
                existingRow = {
                    name: row.name,
                    original_video: row.original_video,
                    replacement_video: ''
                }
                variations.value[activeVariation.value].video_rows.push({
                    ...existingRow,
                    disabledEditingOriginal: true
                })
            }
            return { ...existingRow, disabledEditingOriginal: true }
        }) || []
    }
    return []
})

// Get only the videos specific to the current variation (not in normal)
const getVideosOnlyForThisVariationNotNormal = computed(() => {
    console.log(activeVariation)
    if (activeVariation.value === 0) return []
    return variations.value[activeVariation.value]?.video_rows.filter(row => row.original_video.length === 0) || []
})
console.log(variations)
// Combine all video rows from the normal variation and the current variation
const getAllVideoRows = computed(() => {
    return [
        ...getVideoRowsForCurrentVariation.value,
        ...getVideosOnlyForThisVariationNotNormal.value
    ]
})

console.log(getVideoRowsForCurrentVariation, getVideosOnlyForThisVariationNotNormal, getAllVideoRows)

// Clear the replacement video URL
const clearReplacement = (row) => {
    row.replacement_video = ''
}

// Filter out parameters that are already used in variations
const availableParameters = computed(() =>
    parameters.value.filter(
        (param) =>
            !variations.value.some((variation) => variation.parameter._id === param._id)
    )
)

onMounted(async () => {
    try {
        await scenesStore.fetchParameters()
        await scenesStore.fetchVariationsForScene(scenesStore.currentScene._id)

        // Check the structure of fetched data
        console.log('Parameters:', scenesStore.parameters)
        console.log('Variations:', scenesStore.variations)

        parameters.value = scenesStore.parameters
        variations.value = scenesStore.variations

        if (variations.value.length > 0) {
            activeVariation.value = 0
        } else {
            console.warn('No variations found. Add a new one.')
        }

        normalParameter.value = parameters.value.find(param => param.name === 'normal')
    } catch (error) {
        console.error('Error fetching parameters or variations:', error)
    }
})

const addVariation = async (parameter) => {
    showAddVariationDropdown.value = false

    const newVariation = {
        scene: scenesStore.currentScene._id, // Include the current scene ID here
        parameter: parameter._id,
        video_rows: [] // Start with an empty list of rows
    }

    try {
        await scenesStore.addVariation(newVariation)
        await scenesStore.fetchVariationsForScene(scenesStore.currentScene._id)
        variations.value = scenesStore.variations
        activeVariation.value = variations.value.length - 1
    } catch (error) {
        console.error('Error adding variation:', error)
    }
}

const setActiveVariation = (index) => {
    console.log(index)
    activeVariation.value = index
    saveButtonText.value = 'Save Variation'
    hasChanges.value = false
}

const addRow = () => {
    const newRow = {
        name: '',
        original_video: '',
        replacement_video: ''
    }
    variations.value[activeVariation.value].video_rows.push(newRow)
}

const addVariationRow = () => {
    console.log('add to only this')
    const newRow = {
        name: '',
        original_video: '',
        replacement_video: ''
    }
    variations.value[activeVariation.value].video_rows.push(newRow)
    console.log(variations.value)
}

// Move row up
const moveRowUp = (index) => {
    if (index > 0) {
        const rows = variations.value[activeVariation.value].video_rows
        const temp = rows[index - 1]
        rows[index - 1] = rows[index]
        rows[index] = temp
    }
}

// Move row down
const moveRowDown = (index) => {
    const rows = variations.value[activeVariation.value].video_rows
    if (index < rows.length - 1) {
        const temp = rows[index + 1]
        rows[index + 1] = rows[index]
        rows[index] = temp
    }
}

const saveVariation = async () => {
    const variationToSave = variations.value[activeVariation.value]

    try {
        await scenesStore.updateVariation(variationToSave._id, variationToSave)
        saveButtonText.value = 'Updated'
        hasChanges.value = false
        setTimeout(() => {
            saveButtonText.value = 'Save Variation'
        }, 2000)
    } catch (error) {
        console.error('Failed to save variation:', error)
        alert('Failed to save variation')
    }
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

.var-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    margin-bottom: 0.25rem;
}

.variation-tab {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    cursor: pointer;

    &.active {
        background-color: darkgreen;
    }
}

.save-btn {
    background-color: purple;

    &:hover {
        background-color: #bd04bd;
    }
}

.remove-button {
    padding: 0.5rem;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #ff3737;
    }
}

.arrow-button {
    padding: 0.5rem;
    background-color: #ccc;
    border: none;
    cursor: pointer;


    &:hover {
        background-color: #aaa;
    }
}

.arrows, .replace-row {
    display: flex;
}
</style>
