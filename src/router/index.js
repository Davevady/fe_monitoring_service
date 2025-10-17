import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Monitoring from '../views/Monitoring.vue'
import Trace from '../views/Trace.vue'
import AppRules from '../views/AppRules.vue'
import MessageRules from '../views/MessageRules.vue'
import ViolationsByApp from '../views/ViolationsByApp.vue'
import ViolationsByMessage from '../views/ViolationsByMessage.vue'

const routes = [
    { path: '/', name: 'Dashboard', component: Dashboard },
    { path: '/monitor', name: 'Monitoring', component: Monitoring },
    { path: '/monitor/trace', name: 'Trace', component: Trace },
    { path: '/monitor/violations/app', name: 'ViolationsByApp', component: ViolationsByApp },
    { path: '/monitor/violations/message', name: 'ViolationsByMessage', component: ViolationsByMessage },
    { path: '/rules/app', name: 'AppRules', component: AppRules },
    { path: '/rules/message', name: 'MessageRules', component: MessageRules },
    { path: '/monitoring', component: Monitoring },
    { path: '/trace', component: Trace },
    { path: '/rules/apps', component: AppRules },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
