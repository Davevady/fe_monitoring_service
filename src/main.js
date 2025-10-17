import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Argon Dashboard Tailwind CSS
import './assets/css/argon-dashboard-tailwind.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App)
    .use(router)
    .mount('#app')