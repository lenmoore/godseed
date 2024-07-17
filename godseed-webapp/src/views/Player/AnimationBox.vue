<template>
    <div class="animation-box-wrapper">
        <small style="color: black;">
            {{ item.id }}
        </small>
        <div v-if="item.animationData" v-for="(src, idx) in currentFrame" :key="idx" class="frame">
            <img :src="getImageUrl(src)" alt="" />
        </div>
        <img v-else :src="getImageUrl(item.image)" alt="" />
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
            frameIndex: 1, // Start with the first frame
            timer: null
        };
    },
    created() {
        if (this.item.animationData) {
            this.updateFrame();
            this.startAnimation();
        }
    },
    beforeDestroy() {
        this.stopAnimation();
    },
    watch: {
        item: {
            immediate: true,
            handler() {
                if (this.item.animationData) {
                    this.updateFrame();
                    this.startAnimation();
                } else {
                    this.stopAnimation();
                }
            }
        }
    },
    methods: {
        startAnimation() {
            this.timer = setInterval(() => {
                // Toggle frame index between 1 and 2
                this.frameIndex = this.frameIndex === 1 ? 2 : 1;
                this.updateFrame();
            }, 1000); // Change frame every second
        },
        stopAnimation() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        updateFrame() {
            if (this.item.animationData) {

            const parameters = {
                dinosaurs_domesticated: JSON.parse(localStorage.getItem('dinosaurs_domesticated')) || false,
                insects_huge: JSON.parse(localStorage.getItem('insects_huge')) || false,
                auras_real: JSON.parse(localStorage.getItem('auras_real')) || false
            };

            const frameData = this.item?.animationData[this.frameIndex];
            const baseImages = frameData.base;
            const dinoImages = frameData.dinosaurs_domesticated[parameters.dinosaurs_domesticated];
            const insectImages = frameData.insects_huge[parameters.insects_huge];
            const auraImages = frameData.auras_real[parameters.auras_real];

            this.currentFrame = [
                frameData.bg,
                ...baseImages,
                ...dinoImages,
                ...insectImages,
                ...auraImages
            ];
            }

        },
        getImageUrl(src) {
            if (this.item.animationData) {
                console.log('has animation')
            } else {
                console.log('has no animation')
            }
            const basePath = this.item.image.substring(0, this.item.image.lastIndexOf('/') + 1);
            console.log(basePath)
            return this.item.animationData ? new URL(`${basePath}${src}`, import.meta.url).href : src;
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
