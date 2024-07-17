import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CheckboxView from '@/views/Player/CheckboxView.vue'
import CanvasView from '@/views/Player/CanvasView.vue'
import SceneSetup from '@/views/Creator/SceneSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/add', name: 'AddScene', component: SceneSetup },
    { path: '/', name: 'CheckboxView', component: CheckboxView },
    { path: '/neolithic', name: 'neolithic', component: CanvasView },
    { path: '/antique', name: 'antique', component: CanvasView },
    { path: '/industrial', name: 'industrial', component: CanvasView },
    { path: '/contemporary', name: 'contemporary', component: CanvasView },
    { path: '/future', name: 'future', component: CanvasView }
  ]
})

export default router
