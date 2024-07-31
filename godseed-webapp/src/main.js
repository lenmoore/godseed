import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'

// Import Pinia
import { createPinia } from 'pinia'

// Create the Vue app
const app = createApp(App)

// Create the Pinia store
const pinia = createPinia()

// Use Pinia and the router in the app
app.use(pinia)
app.use(router)

app.mount('#app')
