<template>
    <div class="canvas" ref="canvas">
        <div
            v-for="(item, index) in items"
            :key="index"
            class="draggable-item"
            :style="{ top: `${item.top}px`, left: `${item.left}px`, backgroundImage: `url(${item.image})` }"
        >
            <div class="drag-handle" @mousedown="startDrag($event, item)"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            currentItem: null,
            offsetX: 0,
            offsetY: 0,
        };
    },
    async created() {
        await this.loadImages();
    },
    methods: {
        async loadImages() {
            const images = import.meta.glob('@/assets/animations/neolithic/*/*.{png,jpg,jpeg,svg}');
            console.log(images)
            const imagePaths = Object.keys(images);

            // Extract folders and remove duplicates
            const folders = imagePaths.map(path => path.split('/')[5]);
            const uniqueFolders = [...new Set(folders)];
            console.log(uniqueFolders)

            this.items = await Promise.all(uniqueFolders.map(async (folder, index) => {
                // Find the first image in the folder
                const imagePath = imagePaths.find(path => path.includes(folder));
                const imageModule = await images[imagePath]();
                const image = imageModule.default;

                return {
                    id: index + 1,
                    top: Math.random() * window.innerHeight * 0.8,
                    left: Math.random() * window.innerWidth * 0.8,
                    image,
                };
            }));
            console.log(this.items)
        },
        startDrag(event, item) {
            this.currentItem = item;
            this.offsetX = event.clientX - item.left;
            this.offsetY = event.clientY - item.top;
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.stopDrag);
        },
        onDrag(event) {
            if (this.currentItem) {
                this.currentItem.top = event.clientY - this.offsetY;
                this.currentItem.left = event.clientX - this.offsetX;
            }
        },
        stopDrag() {
            this.currentItem = null;
            document.removeEventListener('mousemove', this.onDrag);
            document.removeEventListener('mouseup', this.stopDrag);
        },
    },
};
</script>

<style>
.canvas {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    overflow: hidden;
}

.draggable-item {
    position: absolute;
    width: 400px;
    height: 400px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
}

.drag-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: #ff0000;
    cursor: pointer;
}
</style>
