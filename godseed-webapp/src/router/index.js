import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '@/views/Admin/ParametersErasSetup.vue'
import ScenesDashboard from '@/views/Admin/SceneSetup/ScenesDashboard.vue'
import EraCanvas from '@/views/Admin/SceneSetup/EraCanvas.vue'
import VariationsEditor from '@/views/Admin/VariationsEditor/VariationsEditor.vue'
import GodseedPlayer from '@/views/Player/GodseedPlayer.vue'
import ParamsActivator from '@/views/Player/ParamsActivator.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/scenes' // or any other route you want as the default
    },
    {
      path: '/params',
      component: ParamsActivator
    },

    {
      path: '/godseed/:eraName',
      name: 'godseed-player',
      component: GodseedPlayer
    },

    { path: '/admin', name: 'admin', component: AdminView },
    {
      path: '/scenes', name: 'scenes', component: ScenesDashboard,
      children: [
        {
          path: ':era',
          name: 'era-canvas',
          component: EraCanvas
        }
      ]
    },

    {
      path: '/scene-variations/:scene',
      name: 'variations-editor',
      component: VariationsEditor
    }
  ]
})

export default router
