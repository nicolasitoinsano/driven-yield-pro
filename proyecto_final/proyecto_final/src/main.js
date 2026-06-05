import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useCitasStore } from './stores/citas'
import './assets/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Init stores
const auth = useAuthStore()
auth.init()
const citas = useCitasStore()
citas.init()

app.mount('#app')
