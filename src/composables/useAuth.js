// composables/useAuth.js
import { ref, computed } from 'vue'

const user = ref(null)
const permissions = ref([])
const tokens = ref(null)
const isInitialized = ref(false)

export function useAuth() {
    // ✅ RESTORE: Load auth data dari localStorage
    const restoreAuthState = () => {
        try {
            const accessToken = localStorage.getItem('access_token')
            const refreshToken = localStorage.getItem('refresh_token')
            const userInfo = localStorage.getItem('user_info')
            
            if (accessToken && userInfo) {
                const userData = JSON.parse(userInfo)
                
                user.value = userData
                tokens.value = {
                    access_token: accessToken,
                    refresh_token: refreshToken
                }
                
                if (userData?.permissions && Array.isArray(userData.permissions)) {
                    permissions.value = userData.permissions
                    console.log('🔄 Auth state restored:', permissions.value.length, 'permissions')
                } else {
                    permissions.value = []
                }
                
                isInitialized.value = true
                return true
            }
            
            isInitialized.value = true
            return false
        } catch (error) {
            console.error('❌ Failed to restore auth state:', error)
            clearAuth()
            isInitialized.value = true
            return false
        }
    }

    // ✅ PERSIST: Save auth data ke localStorage
    const setAuthData = ({ user: userData, tokens: tokenData }) => {
        console.log('🔧 setAuthData called')
        
        user.value = userData
        tokens.value = tokenData
        
        // Extract permissions
        if (userData?.permissions && Array.isArray(userData.permissions)) {
            permissions.value = userData.permissions
            console.log('✅ Permissions set:', permissions.value.length, 'items')
        } else {
            console.warn('⚠️ No permissions found')
            permissions.value = []
        }
        
        // ✅ Save to localStorage
        if (tokenData?.access_token) {
            localStorage.setItem('access_token', tokenData.access_token)
        }
        if (tokenData?.refresh_token) {
            localStorage.setItem('refresh_token', tokenData.refresh_token)
        }
        // ✅ CRITICAL: Save user dengan permissions
        localStorage.setItem('user_info', JSON.stringify(userData))
        
        isInitialized.value = true
        
        console.log('💾 Auth data saved to localStorage')
    }

    const setUser = (userData) => {
        user.value = userData
        if (userData?.permissions) {
            permissions.value = userData.permissions
            // Update localStorage juga
            localStorage.setItem('user_info', JSON.stringify(userData))
        }
    }

    const clearAuth = () => {
        console.log('🧹 Clearing auth data')
        user.value = null
        permissions.value = []
        tokens.value = null
        isInitialized.value = false
        
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_info')
        localStorage.removeItem('auth_token') // backward compatibility
    }

    // Permission checks
    const hasPermission = (permissionName) => {
        return permissions.value.some(p => p.name === permissionName)
    }

    const hasAnyPermission = (...permissionNames) => {
        return permissionNames.some(name => hasPermission(name))
    }

    const hasAllPermissions = (...permissionNames) => {
        return permissionNames.every(name => hasPermission(name))
    }

    const getMenuPermissions = () => {
        const menuPerms = permissions.value.filter(p => p.permission_type === 'menu')
        return menuPerms
    }

    const getActionPermissions = () => {
        return permissions.value.filter(p => p.permission_type === 'action')
    }

    const getPermissionsByResource = (resource) => {
        return permissions.value.filter(p => p.resource === resource)
    }

    const hasActionPermission = (actionName) => {
        return permissions.value.some(p => 
            p.permission_type === 'action' && p.name === actionName
        )
    }

    const isAuthenticated = computed(() => {
        return !!user.value && !!localStorage.getItem('access_token')
    })

    return {
        // State
        user: computed(() => user.value),
        permissions: computed(() => permissions.value),
        tokens: computed(() => tokens.value),
        isAuthenticated,
        isInitialized: computed(() => isInitialized.value),
        
        // Actions
        setAuthData,
        setUser,
        clearAuth,
        restoreAuthState,  // ✅ Expose restore function
        
        // Permission checks
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getMenuPermissions,
        getActionPermissions,
        getPermissionsByResource,
        hasActionPermission
    }
}