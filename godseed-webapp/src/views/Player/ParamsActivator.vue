<template>
    <div>
        <h1>Parameters List</h1>
        Green = active
        <section>
            <ul>
                <li
                    v-for="parameter in parametersWithoutNormal"
                    :key="parameter._id"
                    :class="{'active-parameter': parameter.is_active}"
                    @click="toggleParameter(parameter)"
                >
                    <span>{{ parameter.name }}</span>
                </li>
            </ul>
        </section>

        <!--        <button @click="createInitialState">create initial state</button>-->

        <div v-if="!continuousUpdates" class="buttons">
            {{ currentStateIsCreated ? 'Animations are shown' : 'Animations are hidden' }}
            <button
                :disabled="currentStateIsCreated"
                class="create-button"
                @click="clickCreate"
            >
                Create
            </button>
            <button
                :disabled="!currentStateIsCreated"
                class="destroy-button"
                @click="clickDestroy"
            >
                Destroy
            </button>
        </div>
        <div style="margin-top: 10rem;">

            <label for="cont-updates" style="padding: 1rem; background-color: lightpink; color: black;">
                Activates automatically
                <input id="cont-updates" v-model="continuousUpdates" type="checkbox" />
            </label>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { useSetupStore } from '@/stores/setupStore.js'
import http from '@/stores/http.js'

const setupStore = useSetupStore()
const { parametersWithoutNormal } = toRefs(setupStore)

const continuousUpdates = ref(false)
const currentStateIsCreated = ref(false)

onMounted(async () => {
    try {
        await setupStore.fetchParametersExceptNormal()
        const status = await http.get('/arduino/status')
        console.log(status)
        currentStateIsCreated.value = status.data.state.created
    } catch (error) {
        console.error('Error fetching parameters on mount:', error)
    }
})

const toggleParameter = async (parameter) => {
    parameter.is_active = !parameter.is_active
    if (continuousUpdates.value) {

        try {
            await setupStore.updateParameter(parameter._id, { is_active: parameter.is_active })
        } catch (error) {
            console.error('Error updating parameter:', error)
        }
    } else {
        console.log('Do nothing')
    }
}


const clickCreate = async () => {
    console.log('Create')
    currentStateIsCreated.value = true

    await http.post('/arduino/create-initial-state')
    await http.post('/arduino/create', { parameters: parametersWithoutNormal.value })
}

const clickDestroy = async () => {
    console.log('Destroy')
    currentStateIsCreated.value = false

    await http.post('/arduino/destroy')
}
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}

section {
    margin-bottom: 40px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    background-color: #f0f0f0;
    color: black;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: monospace;
    font-size: 16px;
}

li.active-parameter {
    background-color: #4caf50;
    color: white;
}

li:hover {
    background-color: #e0e0e0;
}

li.active-parameter:hover {
    background-color: #45a049;
}

span {
    flex-grow: 1;
    text-align: center;
}

.create-button {
    background-color: #066e09;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 80%;
}

.create-button:hover {
    background-color: #45a049;
}

.destroy-button {
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 80%;

}

.destroy-button:hover {
    background-color: #e53935;
}

.create-button:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
}

.destroy-button:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
}

</style>
