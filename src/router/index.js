// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import Login from '../views/Login.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Dashboard from '../views/Dashboard.vue'
import Monitoring from '../views/Monitoring.vue'
import Trace from '../views/Trace.vue'
import AppRules from '../views/AppRules.vue'
import MessageRules from '../views/MessageRules.vue'
import ViolationsByApp from '../views/ViolationsByApp.vue'
import ViolationsByMessage from '../views/ViolationsByMessage.vue'

const routes = [
    { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
    { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { requiresGuest: true } },
    { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/dashboard', redirect: '/' },
    { path: '/monitoring', name: 'Monitoring', component: Monitoring, meta: { requiresAuth: true } },
    { path: '/monitor/trace', name: 'Trace', component: Trace, meta: { requiresAuth: true } },
    { path: '/trace', redirect: '/monitor/trace' },
    { path: '/monitor/violations/app', name: 'ViolationsByApp', component: ViolationsByApp, meta: { requiresAuth: true } },
    { path: '/monitor/violations/message', name: 'ViolationsByMessage', component: ViolationsByMessage, meta: { requiresAuth: true } },
    { path: '/rules/app', name: 'AppRules', component: AppRules, meta: { requiresAuth: true } },
    { path: '/rules/apps', redirect: '/rules/app' },
    { path: '/rules/message', name: 'MessageRules', component: MessageRules, meta: { requiresAuth: true } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Helper to check token validity
function isTokenValid(token) {
    if (!token) return false
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expiry = payload.exp * 1000
        return Date.now() < expiry
    } catch (error) {
        return false
    }
}

// Route guard with auth restore
router.beforeEach((to, from, next) => {
    const { restoreAuthState, isAuthenticated, clearAuth } = useAuth()
    
    // ✅ Restore auth state jika belum di-restore
    const accessToken = localStorage.getItem('access_token')
    if (accessToken && !isAuthenticated.value) {
        console.log('🔄 Restoring auth state from localStorage...')
        restoreAuthState()
    }
    
    // Check if token is still valid
    if (accessToken && !isTokenValid(accessToken)) {
        console.log('⚠️ Token expired, clearing auth')
        clearAuth()
    }
    
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
    
    const authenticated = isAuthenticated.value
    
    if (requiresAuth && !authenticated) {
        console.log('🚫 Not authenticated, redirecting to login')
        next('/login')
    } else if (requiresGuest && authenticated) {
        console.log('✅ Already authenticated, redirecting to dashboard')
        next('/')
    } else {
        next()
    }
})

export default router