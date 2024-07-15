<template>
    <div>
        <h1>Configure Parameters</h1>
        <form>
            <div v-for="param in params" @click="onInput(param)">
                <label :for="param.name"> <input type="checkbox" v-model="param.value"> {{ param.description }}</label>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
// params : dinosaurs_domesticated	bears_domesticated	transport_teleport	wheel_is_square	insects_huge	tomato_worship	auras_real	fire_cold_ice_warm	stars_sentient	sky_screen	sun_sentient	people_on_moon	moon_is_hologram	money_on_trees	trees_can_walk	plants_glow_in_dark	zombies
        return {
            params: [
                { name: 'dinosaurs_domesticated', value: localStorage.getItem('dinosaurs_domesticated'), description: 'Dinosaurs are domesticated' },
                { name: 'auras_real', value: localStorage.getItem('auras_real'), description: 'Auras are real' },
                { name: 'insects_huge', value: localStorage.getItem('insects_huge'), description: 'Insects are huge' },

                // { name: 'bears_domesticated', value: localStorage.getItem('bears_domesticated'), description: 'Bears are domesticated'},
                // { name: 'transport_teleport', value: localStorage.getItem('transport_teleport'), description: 'Transport is teleportation' },
                // { name: 'wheel_is_square', value: localStorage.getItem('wheel_is_square'), description: 'Wheels are square' },
                // { name: 'tomato_worship', value: localStorage.getItem('tomato_worship'), description: 'Tomatoes are worshipped' },
                // { name: 'fire_cold_ice_warm', value: localStorage.getItem('fire_cold_ice_warm'), description: 'Fire is cold and ice is warm' },
                // { name: 'stars_sentient', value: localStorage.getItem('stars_sentient'), description: 'Stars are sentient' },
                // { name: 'sky_screen', value: localStorage.getItem('sky_screen'), description: 'Sky is a screen' },
                // { name: 'sun_sentient', value: localStorage.getItem('sun_sentient'), description: 'Sun is sentient' },
                // { name: 'people_on_moon', value: localStorage.getItem('people_on_moon'), description: 'People live on the moon' },
                // { name: 'moon_is_hologram', value: localStorage.getItem('moon_is_hologram'), description: 'Moon is a hologram' },
                // { name: 'money_on_trees', value: localStorage.getItem('money_on_trees'), description: 'Money grows on trees' },
                // { name: 'trees_can_walk', value: localStorage.getItem('trees_can_walk'), description: 'Trees can walk' },
                // { name: 'plants_glow_in_dark', value: localStorage.getItem('plants_glow_in_dark'), description: 'Plants glow in the dark' },
                // { name: 'zombies', value: localStorage.getItem('zombies'), description: 'Zombies are real' }

            ]
        }

    },
    methods: {
        onInput(param) {
            console.log(param)
            param.value = !param.value
            localStorage.setItem(param.name, param.value)
        }
    }
}
</script>
