import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '@/views/Admin/ParametersErasSetup.vue'
import ScenesDashboard from '@/views/Admin/SceneSetup/ScenesDashboard.vue'
import EraCanvas from '@/views/Admin/SceneSetup/EraCanvas.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/admin', name: 'admin', component: AdminView },
    {
      path: '/scenes', name: 'scenes', component: ScenesDashboard, children: [
        {
          path: ':era',
          name: 'era-canvas',
          component: EraCanvas,
        }
      ]
    }
  ]
})

export default router
