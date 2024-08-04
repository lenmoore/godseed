<template>
    <div>
        <h1>Admin View</h1>

        <section>
            <h2>Parameters</h2>
            <ul>
                <li v-for="parameter in parameters" :key="parameter._id">
                    <input v-model="parameter.name" placeholder="Parameter Name" />
                    <button @click="saveParameter(parameter)">Save</button>
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
                    <input v-model="era.name" placeholder="Era Name" />
                    <input v-model="era.imageURL" />
                    <button @click="saveEra(era)">Save</button>
                    <button @click="deleteEra(era._id)">Delete</button>
                </li>
            </ul>
            <input v-model="newEraName" placeholder="New Era Name" />
            <button @click="addEra">Add Era</button>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from 'vue';
import { useSetupStore } from '@/stores/parameterStore.js'

const setupStore = useSetupStore();
const { parameters, eras } = toRefs(setupStore); // Make sure reactive properties stay reactive

const newParameterName = ref('');
const newEraName = ref('');

onMounted(async () => {
    try {
        await setupStore.fetchParameters();
        await setupStore.fetchEras();
    } catch (error) {
        console.error("Error fetching data on mount:", error);
    }
});

const addParameter = async () => {
    if (newParameterName.value.trim()) {
        try {
            await setupStore.addParameter({ name: newParameterName.value, is_active: false });
            newParameterName.value = ''; // Clear the input field after adding
        } catch (error) {
            console.error("Error adding parameter:", error);
        }
    }
};

const saveParameter = async (parameter) => {
    if (parameter.name.trim()) {
        try {
            await setupStore.updateParameter(parameter._id, { name: parameter.name });
        } catch (error) {
            console.error("Error saving parameter:", error);
        }
    }
};

const deleteParameter = async (id) => {
    try {
        await setupStore.deleteParameter(id);
    } catch (error) {
        console.error("Error deleting parameter:", error);
    }
};

const addEra = async () => {
    if (newEraName.value.trim()) {
        try {
            await setupStore.addEra({ name: newEraName.value });
            newEraName.value = ''; // Clear the input field after adding
        } catch (error) {
            console.error("Error adding era:", error);
        }
    }
};

const saveEra = async (era) => {
    if (era.name.trim()) {
        try {
            await setupStore.updateEra(era._id, { name: era.name });
        } catch (error) {
            console.error("Error saving era:", error);
        }
    }
};

const deleteEra = async (id) => {
    try {
        await setupStore.deleteEra(id);
    } catch (error) {
        console.error("Error deleting era:", error);
    }
};
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
}

button {
    margin-right: 10px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>
