import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CheckboxView from "@/views/CheckboxView.vue";
import CanvasView from "@/views/CanvasView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      { path: '/', name: 'CheckboxView', component: CheckboxView },
    { path: '/canvas1', name: 'Canvas1', component: CanvasView },
    { path: '/canvas2', name: 'Canvas2', component: CanvasView },
    { path: '/canvas3', name: 'Canvas3', component: CanvasView },
    { path: '/canvas4', name: 'Canvas4', component: CanvasView },
    { path: '/canvas5', name: 'Canvas5', component: CanvasView }
  ]
})

export default router
