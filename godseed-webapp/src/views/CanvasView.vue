<template>
    <div>
        <h1>Drag and Drop Example</h1>
        <div
            v-for="(item, index) in items"
            :key="item.id"
            class="draggable"
            :draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
        >
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export default {
    data() {
        return {
            items: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' }
            ],
            draggedItemIndex: null
        };
    },
    mounted() {
        this.items.forEach((item, index) => {
            const element = this.$el.querySelectorAll('.draggable')[index];
            draggable({ element });
            dropTargetForElements({ element });
        });
    },
    methods: {
        onDragStart(index) {
            this.draggedItemIndex = index;
        },
        onDrop(targetIndex) {
            const draggedItem = this.items[this.draggedItemIndex];
            this.items.splice(this.draggedItemIndex, 1);
            this.items.splice(targetIndex, 0, draggedItem);
            this.draggedItemIndex = null;
        }
    }
};
</script>

<style>
.draggable {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 5px;
    background-color: #f9f9f9;
    cursor: move;
    color: black;
}
</style>
