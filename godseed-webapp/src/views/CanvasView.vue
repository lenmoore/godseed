<template>
    <div class="canvas">
        <div
            v-for="(box, index) in boxes"
            :key="box.id"
            class="bounding-box"
            :draggable="true"
            @dragstart="(event) => onDragStart(event, index)"
            @dragover.prevent
            @drop="(event) => onDrop(event, index)"
            :style="{ left: box.x + 'px', top: box.y + 'px', width: box.width + 'px', height: box.height + 'px' }"
        >
            {{ box.content }}
        </div>
    </div>
</template>
<script>
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export default {
    data() {
        return {
            boxes: [
                { id: 1, x: 50, y: 50, width: 200, height: 150, content: 'Box 1' },
                { id: 2, x: 300, y: 100, width: 200, height: 150, content: 'Box 2' },
                { id: 3, x: 600, y: 200, width: 200, height: 150, content: 'Box 3' }
            ],
            draggedBoxIndex: null,
            dragStartX: 0,
            dragStartY: 0
        };
    },
    mounted() {
        this.boxes.forEach((box, index) => {
            const element = this.$el.querySelectorAll('.bounding-box')[index];
            draggable({ element });
            dropTargetForElements({ element });
        });
    },
    methods: {
        onDragStart(event, index) {
            this.draggedBoxIndex = index;
            this.dragStartX = event.clientX - this.boxes[index].x;
            this.dragStartY = event.clientY - this.boxes[index].y;
        },
        onDrop(event, targetIndex) {
            const draggedBox = this.boxes[this.draggedBoxIndex];
            draggedBox.x = event.clientX - this.dragStartX;
            draggedBox.y = event.clientY - this.dragStartY;
            this.draggedBoxIndex = null;
        }
    }
};
</script>
<style>
.canvas {
    position: relative;
    width: 3840px;
    height: 2160px;
    border: 1px solid #000;
}

.bounding-box {
    position: absolute;
    border: 2px solid #000;
    background-color: rgba(255, 255, 255, 0.8);
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
