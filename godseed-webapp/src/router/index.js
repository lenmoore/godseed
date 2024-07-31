import { createRouter, createWebHistory } from 'vue-router'
import CheckboxView from '@/views/Player/CheckboxView.vue'
import CanvasView from '@/views/Player/CanvasView.vue'
import SceneSetup from '@/views/Creator/SceneSetup.vue'
import AdminView from '@/views/Admin/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/admin', name: 'admin', component: AdminView },
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
