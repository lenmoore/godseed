import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CheckboxView from "@/views/CheckboxView.vue";
import CanvasView from "@/views/CanvasView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      { path: '/', name: 'CheckboxView', component: CheckboxView },
    { path: '/neolithic', name: 'neolithic', component: CanvasView },
    { path: '/antique', name: 'antique', component: CanvasView },
    { path: '/industrial', name: 'industrial', component: CanvasView },
    { path: '/contemporary', name: 'contemporary', component: CanvasView },
    { path: '/future', name: 'future', component: CanvasView }
  ]
})

export default router
