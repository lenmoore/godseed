<template>
    <div>

        <nav>
            <RouterLink to="/admin">params, eras</RouterLink>
            <RouterLink to="/scenes">scenes</RouterLink>
        </nav>

        <h1>Admin View</h1>

        <section>
            <h2>Parameters</h2>
            <ul>
                <li v-for="parameter in parameters" :key="parameter._id">
                    <input
                        v-model="parameter.name"
                        :class="{'readonly-input': !parameter.isEditing}"
                        :readonly="!parameter.isEditing"
                        placeholder="Parameter Name"
                    />
                    <button v-if="parameter.isEditing" @click="saveParameter(parameter)">Save</button>
                    <button v-if="parameter.isEditing" @click="cancelEdit(parameter)">Cancel</button>
                    <button v-else @click="editParameter(parameter)">Edit</button>
                    <button @click="deleteParameter(parameter._id)">Delete</button>
                </li>
            </ul>
            <input v-model="newParameterName" placeholder="New Parameter Name" />
            <button @click="addParameter">Add Parameter</button>
        </section>

        <section>
            <h2>Eras</h2>
            <ul>
                <li v-for="era in eras" :key="era._id">
                    <input
                        v-model="era.name"
                        :class="{'readonly-input': !era.isEditing}"
                        :readonly="!era.isEditing"
                        placeholder="Era Name"
                    />
                    <!--                    <input-->
                    <!--                        v-model="era.imageURL"-->
                    <!--                        :class="{'readonly-input': !era.isEditing}"-->
                    <!--                        :readonly="!era.isEditing"-->
                    <!--                        placeholder="Era Image URL"-->
                    <!--                    />-->
                    <button v-if="era.isEditing" @click="saveEra(era)">Save</button>
                    <button v-if="era.isEditing" @click="cancelEdit(era)">Cancel</button>
                    <button v-else @click="editEra(era)">Edit</button>
                    <button @click="deleteEra(era._id)">Delete</button>
                </li>
            </ul>
            <input v-model="newEraName" placeholder="New Era Name" />
            <button @click="addEra">Add Era</button>
        </section>
    </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { useSetupStore } from '@/stores/setupStore.js'
import { RouterLink } from 'vue-router'

const setupStore = useSetupStore()
const { parameters, eras } = toRefs(setupStore) // Make sure reactive properties stay reactive

const newParameterName = ref('')
const newEraName = ref('')

onMounted(async () => {
    try {
        await setupStore.fetchParameters()
        await setupStore.fetchEras()

        // Add `isEditing` property to all parameters and eras
        parameters.value.forEach(param => param.isEditing = false)
        eras.value.forEach(era => era.isEditing = false)
    } catch (error) {
        console.error('Error fetching data on mount:', error)
    }
})

const editParameter = (parameter) => {
    parameter.isEditing = true
}

const cancelEdit = (item) => {
    item.isEditing = false
    setupStore.fetchParameters() // Re-fetch to reset values (optional)
    setupStore.fetchEras() // Re-fetch to reset values (optional)
}

const saveParameter = async (parameter) => {
    if (parameter.name.trim()) {
        try {
            await setupStore.updateParameter(parameter._id, { name: parameter.name })
            parameter.isEditing = false // Exit edit mode after saving
        } catch (error) {
            console.error('Error saving parameter:', error)
        }
    }
}

const deleteParameter = async (id) => {
    try {
        await setupStore.deleteParameter(id)
    } catch (error) {
        console.error('Error deleting parameter:', error)
    }
}

const addParameter = async () => {
    if (newParameterName.value.trim()) {
        try {
            await setupStore.addParameter({ name: newParameterName.value, is_active: false })
            newParameterName.value = '' // Clear the input field after adding
        } catch (error) {
            console.error('Error adding parameter:', error)
        }
    }
}

const editEra = (era) => {
    era.isEditing = true
}

const saveEra = async (era) => {
    if (era.name.trim()) {
        try {
            await setupStore.updateEra(era._id, { name: era.name, imageURL: era.imageURL })
            era.isEditing = false // Exit edit mode after saving
        } catch (error) {
            console.error('Error saving era:', error)
        }
    }
}

const deleteEra = async (id) => {
    try {
        await setupStore.deleteEra(id)
    } catch (error) {
        console.error('Error deleting era:', error)
    }
}

const addEra = async () => {
    if (newEraName.value.trim()) {
        try {
            await setupStore.addEra({ name: newEraName.value })
            newEraName.value = '' // Clear the input field after adding
        } catch (error) {
            console.error('Error adding era:', error)
        }
    }
}
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}

section {
    margin-bottom: 40px;
}

input {
    margin-right: 10px;
    padding: 5px;
    font-family: monospace;
}

.readonly-input {
    background-color: transparent;
    border: none;
    cursor: default;
}

button {
    margin-right: 10px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>
