import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Argon Dashboard Tailwind CSS
import './assets/css/argon-dashboard-tailwind.css'

// Import Custom CSS (Override fonts)
import './assets/css/custom.css'

createApp(App)
    .use(router)
    .mount('#app')