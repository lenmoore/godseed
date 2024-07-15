<template>
    <div class="animation-box-wrapper">
        <small style="color: black;">
            {{ item.id }}
        </small>
        <div v-for="(src, idx) in currentFrame" :key="idx" class="frame">
            <img :src="getImageUrl(src)" alt="" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'AnimationBox',
    props: {
        item: Object
    },
    data() {
        return {
            currentFrame: [],
        };
    },
    created() {
        this.updateFrame();
    },
    watch: {
        item: {
            immediate: true,
            handler() {
                this.updateFrame();
            }
        }
    },
    methods: {
        updateFrame() {
            const parameters = {
                dinosaurs_domesticated: JSON.parse(localStorage.getItem('dinosaurs_domesticated')) || false,
                insects_huge: JSON.parse(localStorage.getItem('insects_huge')) || false,
                auras_real: JSON.parse(localStorage.getItem('auras_real')) || false
            };

            const frameNumber = 1; // Set the initial frame, you can add logic to change frames over time
            const frameData = this.item.animationData[frameNumber];
            const baseImages = frameData.base;
            console.log(baseImages)
            const dinoImages = frameData.dinosaurs_domesticated[parameters.dinosaurs_domesticated];
            const insectImages = frameData.insects_huge[parameters.insects_huge];
            const auraImages = frameData.auras_real[parameters.auras_real];

            this.currentFrame = [
                "bg.png",
                ...baseImages,
                ...dinoImages,
                ...insectImages,
                ...auraImages
            ];
        },
        getImageUrl(src) {
            const basePath = this.item.image.substring(0, this.item.image.lastIndexOf('/') + 1);
            return new URL(`${basePath}${src}`, import.meta.url).href;
        }
    }
};
</script>

<style lang="scss">
.animation-box-wrapper {
    height: 100%;
    width: 100%;
    position: relative;

    &:hover {
        border: 1px solid blue;
    }

    .frame {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
