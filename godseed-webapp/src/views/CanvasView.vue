<template>
  <div>
    <h1>Canvas {{ $route.name }}</h1>
    <div id="canvas">
      <div
        v-for="(animation, index) in animations"
        :key="index"
        :style="{ position: 'absolute', top: animation.y + 'px', left: animation.x + 'px', zIndex: index }"
        :draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover="onDragOver($event)"
        @drop="onDrop($event, index)"
      >
        <div class="animation-container">
          <img :src="animation.frames[animation.currentFrame]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      animations: []
    };
  },
  methods: {
    async loadAnimations() {
      const images = import.meta.glob('../assets/animations/neolithic/**/*.png');
      console.log(images);  // Verify that images are being imported correctly
      const animations = [];

      for (const path in images) {
        const [, , folder] = path.split('/');
        let animation = animations.find(anim => anim.folder === folder);

        if (!animation) {
          animation = { folder, frames: [], currentFrame: 0, x: 0, y: 0 };
          animations.push(animation);
        }

        const module = await images[path]();
        animation.frames.push(module.default);
      }

      this.animations = animations;
    },
    saveCoordinates() {
      localStorage.setItem(`canvas-${this.$route.name}`, JSON.stringify(this.animations));
    },
    startAnimation() {
      setInterval(() => {
        this.animations.forEach(animation => {
          animation.currentFrame = (animation.currentFrame + 1) % animation.frames.length;
        });
      }, 100); // Adjust the interval for animation speed
    },
    onDragStart(event, index) {
      event.dataTransfer.setData('index', index);
    },
    onDragOver(event) {
      event.preventDefault();
    },
    onDrop(event, index) {
      const draggedIndex = event.dataTransfer.getData('index');
      const draggedItem = this.animations[draggedIndex];
      this.animations.splice(draggedIndex, 1);
      this.animations.splice(index, 0, draggedItem);
      this.saveCoordinates();
    }
  },
  created() {
    const savedAnimations = localStorage.getItem(`canvas-${this.$route.name}`);
    if (savedAnimations) {
      this.animations = JSON.parse(savedAnimations);
    } else {
      this.loadAnimations();
    }
  },
  mounted() {
    this.startAnimation();
  }
});
</script>

<style>
#canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;  /* Adjust as needed */
  height: 100px;  /* Adjust as needed */
}
</style>
