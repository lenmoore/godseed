<template>
    <div class="variation-setup border p-4 m-4 bg-gray-800 rounded-lg">
        <h3 class="text-xl font-bold text-gray-200 ">Configure variations</h3>
        <small class="my-4">
            First add layers for the "normal" parameter. Then add replacements in different tabs.
        </small>
        <div class="variation-tabs mb-4">
            <button
                v-for="(variation, index) in variations"
                :key="variation._id"
                :class="[
          'py-2 px-4 rounded-md',
          activeVariation === index
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
                @click="setActiveVariation(index)"
            >
                {{ variation.parameter.name }}
            </button>

            <div class="relative">
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

        <div v-if="activeVariation !== null" class="variation-details">
            <h4 class="text-lg font-semibold text-gray-300 mb-4">
                {{ variations[activeVariation].parameter.name }}</h4>

            <!-- Table Header -->
            <div class="grid grid-cols-4 gap-4 mb-2">
                <div class="text-gray-400">Layer</div>
                <div class="text-gray-400">Original Video</div>
                <div class="text-gray-400">Replace This</div>
                <div class="text-gray-400">Replacement Video</div>
            </div>

            <!-- Rows -->
            <ul class="space-y-4">
                <li
                    v-for="(row, rowIndex) in getVideoRowsForCurrentVariation"
                    :key="rowIndex"
                    class="grid grid-cols-4 gap-4 items-center"
                >
                    <input
                        v-model="row.name"
                        :class="[
              'px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400',
              isNormalVariation ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-black text-gray-500 border-gray-700'
            ]"
                        :readonly="!isNormalVariation"
                        placeholder="Row Name"
                    />
                    <input
                        v-model="row.original_video"
                        class="px-3 py-2 bg-black text-gray-500 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        placeholder="Original Video URL"
                        readonly
                    />
                    <div v-if="!isNormalVariation" class="flex items-center justify-center">
                        <input
                            v-model="row.replace"
                            class="form-checkbox text-blue-500 h-5 w-5"
                            type="checkbox"
                        />
                    </div>
                    <select
                        v-if="!isNormalVariation && row.replace"
                        v-model="row.replacement_video"
                        class="px-3 py-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    >
                        <option v-for="video in allUploadedVideos" :key="video" :value="video">
                            {{ video }}
                        </option>
                    </select>
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
                <button
                    class="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    @click="saveVariation"
                >
                    Save Variation
                </button>
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

const allUploadedVideos = computed(() => scenesStore.currentScene.uploaded_videos)

// Get the normal variation (used to define the base rows)
const normalVariation = computed(() =>
    variations.value.find(variation => variation.parameter.name === 'normal')
)

const isNormalVariation = computed(() => {
    return variations.value[activeVariation.value].parameter.name === 'normal'
})

// Get the video rows for the current variation
const getVideoRowsForCurrentVariation = computed(() => {
    if (isNormalVariation.value) {
        return variations.value[activeVariation.value].video_rows
    } else {
        return normalVariation.value.video_rows.map((row) => {
            // Find or create a corresponding row in the current variation
            let existingRow = variations.value[activeVariation.value].video_rows.find(vr => vr.name === row.name)
            if (!existingRow) {
                existingRow = {
                    name: row.name,
                    original_video: row.original_video,
                    replacement_video: '',
                    replace: false
                }
                variations.value[activeVariation.value].video_rows.push(existingRow)
            }
            return existingRow
        })
    }
})

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
    showAddVariationDropdown.value = false

    const newVariation = {
        scene: scenesStore.currentScene._id,
        parameter: parameter._id,
        video_rows: [] // Start with an empty list of rows
    }

    await scenesStore.addVariation(newVariation)

    // Add the new variation to the variations list and set it as the active variation
    variations.value.push({
        ...newVariation,
        _id: scenesStore.variations[scenesStore.variations.length - 1]._id,
        parameter: {
            _id: parameter._id,
            name: parameter.name
        }
    })
    activeVariation.value = variations.value.length - 1
}

const setActiveVariation = (index) => {
    activeVariation.value = index
}

const addRow = () => {
    const newRow = {
        name: '',
        original_video: '',
        replacement_video: '',
        replace: false
    }
    variations.value[activeVariation.value].video_rows.push(newRow)
}

const removeRow = (index) => {
    variations.value[activeVariation.value].video_rows.splice(index, 1)
}

const saveVariation = async () => {
    const variationToSave = variations.value[activeVariation.value]

    // Filter out rows that are not set to be replaced
    variationToSave.video_rows = variationToSave.video_rows.filter(row => isNormalVariation.value || row.replace)

    try {
        await scenesStore.updateVariation(variationToSave._id, variationToSave)
        alert('Variation saved successfully')
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
</style>
