import { ref, onMounted, onUnmounted } from 'vue'

export function useIdleDetection(timeout = null) { // null = auto dari refresh_expires_in
    const isIdle = ref(false)
    const lastActivity = ref(Date.now())
    let idleTimer = null
    let activityTimer = null

    const getRefreshExpiresIn = () => {
        const refreshExpiresAt = localStorage.getItem('refresh_expires_at')
        if (!refreshExpiresAt) return null
        
        const now = Date.now()
        const expiresAt = parseInt(refreshExpiresAt, 10)
        const remainingMs = expiresAt - now
        
        return remainingMs > 0 ? remainingMs : 0
    }

    const resetIdleTimer = () => {
        lastActivity.value = Date.now()
        isIdle.value = false
        
        // Clear existing timer
        if (idleTimer) {
            clearTimeout(idleTimer)
        }
        
        // Get timeout from refresh_expires_in or use provided timeout
        const effectiveTimeout = timeout || getRefreshExpiresIn()
        
        if (effectiveTimeout && effectiveTimeout > 0) {
            // Set new timer
            idleTimer = setTimeout(() => {
                isIdle.value = true
            }, effectiveTimeout)
        }
    }

    const handleActivity = () => {
        // Debounce activity detection
        if (activityTimer) {
            clearTimeout(activityTimer)
        }
        
        activityTimer = setTimeout(() => {
            resetIdleTimer()
        }, 1000) // 1 detik debounce
    }

    const startIdleDetection = () => {
        // Events to track
        const events = [
            'mousedown', 'mousemove', 'keypress', 'scroll', 
            'touchstart', 'click', 'keydown'
        ]
        
        events.forEach(event => {
            document.addEventListener(event, handleActivity, true)
        })
        
        // Start initial timer
        resetIdleTimer()
    }

    const stopIdleDetection = () => {
        // Remove event listeners
        const events = [
            'mousedown', 'mousemove', 'keypress', 'scroll', 
            'touchstart', 'click', 'keydown'
        ]
        
        events.forEach(event => {
            document.removeEventListener(event, handleActivity, true)
        })
        
        // Clear timers
        if (idleTimer) {
            clearTimeout(idleTimer)
            idleTimer = null
        }
        if (activityTimer) {
            clearTimeout(activityTimer)
            activityTimer = null
        }
        
        isIdle.value = false
    }

    const getTimeSinceLastActivity = () => {
        return Date.now() - lastActivity.value
    }

    const isUserActive = () => {
        return !isIdle.value
    }

    onMounted(() => {
        startIdleDetection()
    })

    onUnmounted(() => {
        stopIdleDetection()
    })

    return {
        isIdle,
        lastActivity,
        startIdleDetection,
        stopIdleDetection,
        getTimeSinceLastActivity,
        isUserActive,
        resetIdleTimer,
        getRefreshExpiresIn
    }
}
