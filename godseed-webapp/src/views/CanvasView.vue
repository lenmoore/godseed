<template>
    <div>
        <h1>Canvas {{ $route.name }}</h1>
        <div id="canvas">
            <draggable v-model="animations" @end="saveCoordinates">
                <div v-for="(animation, index) in animations" :key="animation.id" :style="{ position: 'absolute', top: animation.y + 'px', left: animation.x + 'px', zIndex: index }">
                    <img alt="img" :src="animation.frames[animation.currentFrame]" />
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
import { loadAnimations } from '../utils/loadAnimations';
import draggable from 'vuedraggable';

export default {
    components: {
        draggable
    },
    data() {
        return {
            animations: loadAnimations()  // Load initial data from utility function
        };
    },
    methods: {
        saveCoordinates() {
            localStorage.setItem(`canvas-${this.$route.name}`, JSON.stringify(this.animations));
        }
    },
    created() {
        const savedAnimations = localStorage.getItem(`canvas-${this.$route.name}`);
        if (savedAnimations) {
            this.animations = JSON.parse(savedAnimations);
        }
    }
};

</script>

<style>
#canvas {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
