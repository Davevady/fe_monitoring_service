// main.js
import { createApp } from 'vue'
import { useAuth } from './composables/useAuth'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// ✅ Restore auth state sebelum mount app
const { restoreAuthState } = useAuth()
restoreAuthState()

app.use(router)
app.mount('#app')