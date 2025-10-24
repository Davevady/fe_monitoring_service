import axios from 'axios'
import { useAuth } from '../composables/useAuth'

const BASE = import.meta.env.VITE_API_BASE_URL || '' // or '' if using proxy /api

// Global idle detection state
let isUserActive = true
let lastActivityTime = Date.now()

const api = axios.create({
    baseURL: BASE,
    timeout: 10000,
})

// ===== Refresh Token Helpers =====
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

function getAccessToken() {
    return localStorage.getItem('auth_token')
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token')
}

function getRefreshExpiresAt() {
    const ts = localStorage.getItem('refresh_expires_at')
    return ts ? parseInt(ts, 10) : 0
}

function isRememberMeEnabled() {
    return localStorage.getItem('remember_me') === 'true'
}

function isUserCurrentlyActive() {
    return isUserActive
}

function updateUserActivity(active) {
    isUserActive = active
    if (active) {
        lastActivityTime = Date.now()
    }
}

// Export functions for idle detection integration
export function setUserActivity(active) {
    updateUserActivity(active)
}

export function getUserActivityStatus() {
    return {
        isActive: isUserActive,
        lastActivity: lastActivityTime
    }
}

function setTokens({ accessToken, refreshToken, expiresIn, refreshExpiresIn }) {
    if (accessToken) {
        localStorage.setItem('auth_token', accessToken)
    }
    if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
    }
    // expiresIn not used here (handled server-side via JWT). We persist refresh expiry only
    if (refreshExpiresIn) {
        const nowMs = Date.now()
        const refreshExpiresAt = nowMs + (Number(refreshExpiresIn) * 1000) // convert seconds to ms
        localStorage.setItem('refresh_expires_at', String(refreshExpiresAt))
    }
}

async function refreshTokenRequest() {
    const refreshToken = getRefreshToken()
    const refreshExpiresAt = getRefreshExpiresAt()
    const now = Date.now()

    if (!refreshToken || !refreshExpiresAt || now >= refreshExpiresAt) {
        throw new Error('Refresh token missing or expired')
    }

    const res = await api.post('/auth/refresh', {
        refresh_token: refreshToken,
    })

    const data = res.data
    if (!data?.success) {
        throw new Error(data?.message || 'Failed to refresh token')
    }

    const payload = data.data || {}
    setTokens({
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        expiresIn: payload.expires_in,
        refreshExpiresIn: payload.refresh_expires_in,
    })

    return payload.access_token
}

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        const isUnauthorized = error.response?.status === 401
        const isInvalidTokenMsg = error.response?.data?.message === 'Invalid or expired token'

        if ((isUnauthorized || isInvalidTokenMsg) && !originalRequest._retry) {
            // Check if refresh token should be attempted
            const shouldRefresh = isRememberMeEnabled() && isUserCurrentlyActive()
            
            if (!shouldRefresh) {
                // Force logout if remember me is disabled or user is idle
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user_info')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('refresh_expires_at')
                localStorage.removeItem('remember_me')
                window.location.href = '/login'
                return Promise.reject(error)
            }

            if (isRefreshing) {
                // Queue the request until refresh is done
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token
                            resolve(api(originalRequest))
                        },
                        reject,
                    })
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const newAccessToken = await refreshTokenRequest()
                processQueue(null, newAccessToken)
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken
                return api(originalRequest)
            } catch (refreshErr) {
                processQueue(refreshErr, null)
                // Clear storage and redirect to login
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user_info')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('refresh_expires_at')
                localStorage.removeItem('remember_me')
                window.location.href = '/login'
                return Promise.reject(refreshErr)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

function unwrap(res) {
    // many endpoints return { status, data, total }
    if (!res || !res.data) return null
    // jika response.data.data ada, kembalikan itu; kalau array langsung, kembalikan array
    if (Array.isArray(res.data)) return res.data
    if (res.data.data !== undefined) return res.data.data
    return res.data
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================
// Di fungsi login, setelah dapat response
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials)
        
        if (response.data.success) {
            const { user, tokens } = response.data.data
            
            // Use the new useAuth composable
            const { setAuthData } = useAuth()
            setAuthData({ user, tokens })
            
            return response.data
        }
        
        return response.data
    } catch (error) {
        throw error
    }
}

// services/api.js - pastikan bagian logout seperti ini
export const logout = async () => {
    try {
        // Call API logout
        await api.post('/auth/logout')
    } catch (error) {
        console.error('Logout API error:', error)
    } finally {
        // ✅ ALWAYS clear auth data
        const { clearAuth } = useAuth()
        clearAuth()
        
        // Debug: pastikan localStorage benar-benar dihapus
        console.log('After logout - access_token:', localStorage.getItem('access_token'))
        console.log('After logout - refresh_token:', localStorage.getItem('refresh_token'))
    }
}

export async function changePassword(oldPassword, newPassword, confirmPassword) {
    const res = await api.put('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
    })
    return res.data
}

export async function forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
}

export async function resetPassword(token, password, password_confirmation) {
    const res = await api.post('/auth/reset-password', {
        token,
        password,
        password_confirmation
    })
    return res.data
}

export async function checkResetToken(token) {
    const res = await api.post('/auth/check-reset-token', { token })
    return res.data
}

// ============================================================================
// PROFILE ENDPOINTS
// ============================================================================
export async function getProfile() {
    const res = await api.get('/profile')
    return res.data
}

export async function updateProfile(payload) {
    const res = await api.put('/profile', payload)
    return res.data
}

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================
export async function getDashboardOverview() {
    try {
        const response = await api.get('/dashboard/overview')
        return response.data
    } catch (error) {
        console.error('Error fetching dashboard overview:', error)
        throw error
    }
}

export async function getLogTrends(range = '7d') {
    const res = await api.get('/dashboard/log-trends', { params: { range } })
    return res.data
}

export async function getAppPerformance(range = '30d') {
    const res = await api.get('/dashboard/app-performance', { params: { range } })
    return res.data
}

// ============================================================================
// MONITOR ENDPOINTS
// ============================================================================
export async function getLogs(params = {}) {
    const res = await api.get('/monitor/server', { params })
    return res.data
}

export async function getTrace(correlation_id) {
    const res = await api.get('/monitor/trace', { params: { correlation_id } })
    return unwrap(res)
}

export async function getViolationsByApp(params = {}) {
    const res = await api.get('/monitor/violations/by-app', { params })
    return unwrap(res)
}

export async function getViolationsByMessage(params = {}) {
    const res = await api.get('/monitor/violations/by-message', { params })
    return unwrap(res)
}

// ============================================================================
// APP RULES ENDPOINTS
// ============================================================================
export async function getAppRules() {
    try {
        const response = await api.get('/rules/app')
        return response.data
    } catch (error) {
        console.error('Error fetching app rules:', error)
        throw error
    }
}

export async function createAppRule(payload) {
    const res = await api.post('/rules/app', payload)
    return unwrap(res)
}

export async function getAppRule(id) {
    const res = await api.get(`/rules/app/${id}`)
    return unwrap(res)
}

export async function updateAppRule(id, payload) {
    const res = await api.put(`/rules/app/${id}`, payload)
    return unwrap(res)
}

export async function deleteAppRule(id) {
    const res = await api.delete(`/rules/app/${id}`)
    return unwrap(res)
}

// ============================================================================
// MESSAGE RULES ENDPOINTS
// ============================================================================
export const getMessageRules = async () => {
    try {
        const response = await api.get('/rules/message')
        return response.data
    } catch (error) {
        console.error('Error fetching message rules:', error)
        throw error
    }
}

export async function createMessageRule(payload) {
    const res = await api.post('/rules/message', payload)
    return unwrap(res)
}

export async function getMessageRule(id) {
    const res = await api.get(`/rules/message/${id}`)
    return unwrap(res)
}

export async function updateMessageRule(id, payload) {
    const res = await api.put(`/rules/message/${id}`, payload)
    return unwrap(res)
}

export async function deleteMessageRule(id) {
    const res = await api.delete(`/rules/message/${id}`)
    return unwrap(res)
}

// ============================================================================
// ROLES ENDPOINTS
// ============================================================================
export async function getRoles(params = {}) {
    const res = await api.get('/roles', { params })
    return res.data
}

export async function createRole(payload) {
    const res = await api.post('/roles', payload)
    return res.data
}

export async function getRole(id) {
    const res = await api.get(`/roles/${id}`)
    return res.data
}

export async function updateRole(id, payload) {
    const res = await api.put(`/roles/${id}`, payload)
    return res.data
}

export async function deleteRole(id) {
    const res = await api.delete(`/roles/${id}`)
    return res.data
}

export async function getRolePermissions(id) {
    const res = await api.get(`/roles/${id}/permissions`)
    return res.data
}

export async function syncRolePermissions(id, permissionIds) {
    const res = await api.put(`/roles/${id}/permissions`, {
        permission_ids: permissionIds
    })
    return res.data
}

// ============================================================================
// PERMISSIONS ENDPOINTS
// ============================================================================
export async function getPermissions(params = {}) {
    const res = await api.get('/permissions', { params })
    return res.data
}

export async function createPermission(payload) {
    const res = await api.post('/permissions', payload)
    return res.data
}

export async function getPermission(id) {
    const res = await api.get(`/permissions/${id}`)
    return res.data
}

export async function updatePermission(id, payload) {
    const res = await api.put(`/permissions/${id}`, payload)
    return res.data
}

export async function deletePermission(id) {
    const res = await api.delete(`/permissions/${id}`)
    return res.data
}

export async function getPermissionGroups() {
    const res = await api.get('/permissions/groups')
    return res.data
}

export async function getGroupedPermissions() {
    const res = await api.get('/permissions/grouped')
    return res.data
}

export async function getStructuredPermissions() {
    const res = await api.get('/permissions/structured')
    return res.data
}

export async function getPermissionsByResource() {
    const res = await api.get('/permissions/by-resource')
    return res.data
}

// ============================================================================
// USERS ENDPOINTS
// ============================================================================
export async function getUsers(params = {}) {
    const res = await api.get('/users', { params })
    return res.data
}

export async function createUser(payload) {
    const res = await api.post('/users', payload)
    return res.data
}

export async function getUser(id) {
    const res = await api.get(`/users/${id}`)
    return res.data
}

export async function updateUser(id, payload) {
    const res = await api.put(`/users/${id}`, payload)
    return res.data
}

export async function deleteUser(id) {
    const res = await api.delete(`/users/${id}`)
    return res.data
}

export async function getUserPermissions(id) {
    const res = await api.get(`/users/${id}/permissions`)
    return res.data
}

export default api