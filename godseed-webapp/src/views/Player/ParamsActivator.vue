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
    </div>
</template>

<script setup>
import { onMounted, toRefs } from 'vue'
import { useSetupStore } from '@/stores/parameterStore.js'

const setupStore = useSetupStore()
const { parametersWithoutNormal } = toRefs(setupStore)

onMounted(async () => {
    try {
        await setupStore.fetchParametersExceptNormal()
    } catch (error) {
        console.error('Error fetching parameters on mount:', error)
    }
})

const toggleParameter = async (parameter) => {
    parameter.is_active = !parameter.is_active
    try {
        await setupStore.updateParameter(parameter._id, { is_active: parameter.is_active })
    } catch (error) {
        console.error('Error updating parameter:', error)
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
</style>
