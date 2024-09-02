<script setup>
import { useStateStore } from '@/stores/stateStore.js'
import { onMounted, watch } from 'vue'

const stateStore = useStateStore()

// Function to check the timer and handle standby mode
const checkTimerAndUpdate = () => {
    const interval = setInterval(async () => {
        const currentTime = Date.now()
        const storedTime = parseInt(localStorage.getItem('timer'), 10)

        if (!isNaN(storedTime) && currentTime >= storedTime) {
            clearInterval(interval)
            if (!stateStore.showStandby) {
                stateStore.showStandby = true
                await updateStandbyInAPI(true)
                console.log('Standby set to true and API updated')
            }
        }
    }, 1000)
}

// Function to update the `showStandby` status in the API
const updateStandbyInAPI = async (status) => {
    try {
        await stateStore.activateStandby() // Replace with your store's API update method
    } catch (error) {
        console.error('Failed to update standby status:', error)
    }
}

onMounted(() => {
    checkTimerAndUpdate() // Start checking the timer when the component is mounted

    // Watch for changes in the showStandby status locally
    watch(
        () => stateStore.showStandby,
        async (newStatus) => {
            if (newStatus) {
                // The timer reached its limit, and standby mode has been activated
                await updateStandbyInAPI(true)
            }
        }
    )
})

</script>

<template>
    <div style="font-size: 2rem;">
        <div>Show Standby: {{ stateStore.showStandby }}</div>
        <div>Show ItIsWhatItIs: {{ stateStore.showItIsWhatItIs }}</div>
        <div>Show All Animations: {{ stateStore.showAllAnimations }}</div>
        <div>Show Civilisation Was Destroyed: {{ stateStore.showCivilisationWasDestroyed }}</div>
        <div>Civilisation Counter: {{ stateStore.civilisationCounter }}</div>
    </div>
</template>
