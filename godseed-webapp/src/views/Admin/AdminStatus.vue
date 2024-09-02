<script setup>
import { useStateStore } from '@/stores/stateStore.js'
import { onMounted, ref, watch } from 'vue'

const stateStore = useStateStore()
const lastUpdateTime = ref(Date.now())
const countdownInterval = ref(null)

// Function to start the 10-second countdown
const startCountdown = () => {
    if (countdownInterval.value) clearInterval(countdownInterval.value)

    countdownInterval.value = setInterval(async () => {
        const timePassed = (Date.now() - lastUpdateTime.value) / 1000
        console.log(`Time passed: ${timePassed} seconds`)

        if (timePassed >= 10) {
            clearInterval(countdownInterval.value)
            stateStore.showStandby = true
            await updateStandbyInAPI(true)
            console.log('Standby set to true')
        }
    }, 1000)
}

// Function to update the `showStandby` status in the API
const updateStandbyInAPI = async (status) => {
    try {
        // Assuming `jackInserted` updates the standby status in the backend
        await stateStore.activateStandby() // Replace with your store's API update method
    } catch (error) {
        console.error('Failed to update standby status:', error)
    }
}

// Function to watch for standby changes in the API
const watchStandbyInAPI = async () => {
    setInterval(async () => {
        try {
            await stateStore.fetchState()
            if (stateStore.showStandby === false && countdownInterval.value === null) {
                lastUpdateTime.value = Date.now() // Reset the time if standby becomes false
                startCountdown() // Restart countdown
                console.log('Standby set to false, countdown restarted')
            }
        } catch (error) {
            console.error('Failed to fetch state:', error)
        }
    }, 3000)
}

onMounted(() => {
    // Start watching the API for changes
    watchStandbyInAPI()

    // Watch for changes in the showStandby status locally
    watch(
        () => stateStore.showStandby,
        (newStatus) => {
            if (!newStatus) {
                lastUpdateTime.value = Date.now()
                startCountdown()
            } else {
                clearInterval(countdownInterval.value)
                countdownInterval.value = null
            }
        }
    )
})

</script>

<template>
    <div>
        <div>Time since last update: {{ (Date.now() - lastUpdateTime) / 1000 }} seconds</div>
        <div>Show Standby: {{ stateStore.showStandby }}</div>
        <div>Show ItIsWhatItIs: {{ stateStore.showItIsWhatItIs }}</div>
        <div>Show All Animations: {{ stateStore.showAllAnimations }}</div>
        <div>Show Civilisation Was Destroyed: {{ stateStore.showCivilisationWasDestroyed }}</div>
        <div>Civilisation Counter: {{ stateStore.civilisationCounter }}</div>
    </div>
</template>
