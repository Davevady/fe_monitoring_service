import { ref, onMounted, onUnmounted } from 'vue'
import { useIdleDetection } from './useIdleDetection'
import { useAuth } from './useAuth'
import { setUserActivity, getUserActivityStatus } from '../services/api'

export function useAuthSession() {
    const { isIdle, startIdleDetection, stopIdleDetection, resetIdleTimer, getRefreshExpiresIn } = useIdleDetection()
    const { clearAuth } = useAuth()
    const isSessionActive = ref(true)

    const updateActivityStatus = () => {
        const active = !isIdle.value
        isSessionActive.value = active
        setUserActivity(active)
    }

    const watchIdleStatus = () => {
        updateActivityStatus()
    }

    const checkSessionTimeout = () => {
        const rememberMe = localStorage.getItem('remember_me') === 'true'
        const refreshExpiresIn = getRefreshExpiresIn()
        
        if (!rememberMe && isIdle.value) {
            forceLogout()
            return
        }
        
        if (refreshExpiresIn !== null && refreshExpiresIn <= 0) {
            forceLogout()
            return
        }
        
        if (isIdle.value && refreshExpiresIn !== null && refreshExpiresIn < 60000) {
            forceLogout()
            return
        }
    }

    const forceLogout = () => {
        // Use clearAuth from useAuth composable
        clearAuth()
        
        // Redirect to login
        window.location.href = '/login'
    }

    const startSessionMonitoring = () => {
        startIdleDetection()
        
        const sessionCheckInterval = setInterval(() => {
            checkSessionTimeout()
        }, 60 * 1000)
        
        onUnmounted(() => {
            clearInterval(sessionCheckInterval)
        })
    }

    const stopSessionMonitoring = () => {
        stopIdleDetection()
    }

    const resetSession = () => {
        resetIdleTimer()
        updateActivityStatus()
    }

    onMounted(() => {
        startSessionMonitoring()
        
        const unwatch = ref(isIdle.value)
        const checkIdle = () => {
            if (unwatch.value !== isIdle.value) {
                unwatch.value = isIdle.value
                watchIdleStatus()
            }
        }
        
        const idleWatcher = setInterval(checkIdle, 1000)
        
        onUnmounted(() => {
            clearInterval(idleWatcher)
        })
    })

    return {
        isIdle,
        isSessionActive,
        startSessionMonitoring,
        stopSessionMonitoring,
        resetSession,
        forceLogout,
        checkSessionTimeout
    }
}