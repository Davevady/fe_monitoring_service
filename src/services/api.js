import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || '' // or '' if using proxy /api

const api = axios.create({
    baseURL: BASE,
    timeout: 10000,
})

function unwrap(res) {
    // many endpoints return { status, data, total }
    if (!res || !res.data) return null
    // jika response.data.data ada, kembalikan itu; kalau array langsung, kembalikan array
    if (Array.isArray(res.data)) return res.data
    if (res.data.data !== undefined) return res.data.data
    return res.data
}

export async function getDashboardOverview() {
    try {
        const response = await api.get('/dashboard/overview');
        return response.data; // ini return { status: 'success', data: [...], meta: [...] }
    } catch (error) {
        console.error('Error fetching app rules:', error);
        throw error;
    }
}

export async function getAppRules() {
    try {
        const response = await api.get('/rules/app');
        return response.data; // ini return { status: 'success', data: [...] }
    } catch (error) {
        console.error('Error fetching app rules:', error);
        throw error;
    }
}

export async function createAppRule(payload) {
    const res = await api.post('/rules/app', payload)
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

/* Message rule */
export const getMessageRules = async () => {
    try {
        const response = await api.get('/rules/message');
        return response.data; // ini return { status: 'success', data: [...] }
    } catch (error) {
        console.error('Error fetching message rules:', error);
        throw error;
    }
};
export async function createMessageRule(payload) {
    const res = await api.post('/rules/message', payload)
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

/* Monitoring endpoints */
export async function getLogs(params = {}) {
    // params: { log, size, level, page }
    // IMPORTANT: Return full response to get pagination data
    const res = await api.get('/monitor/server', { params })
    return res.data // Return full object: { status, data, pagination, filters }
}

export async function getTrace(correlation_id) {
    const res = await api.get('/monitor/trace', { params: { correlation_id } })
    return unwrap(res)
}
export async function getViolationsByApp(params = {}) {
    const res = await api.get('/monitor/violation/by-app', { params })
    return unwrap(res)
}
export async function getViolationsByMessage(params = {}) {
    const res = await api.get('/monitor/violation/by-message', { params })
    return unwrap(res)
}

export default api