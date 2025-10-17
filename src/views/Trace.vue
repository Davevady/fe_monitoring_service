<template>
    <div class="flex flex-wrap -mx-3">
        <!-- Header Card -->
        <div class="w-full max-w-full px-3 mb-6">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                    <router-link to="/"
                        class="inline-flex items-center mb-4 text-sm font-semibold transition-colors text-slate-500 hover:text-blue-500">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Monitoring
                    </router-link>

                    <h6 class="mb-2 font-bold text-slate-700">Trace Details</h6>

                    <!-- Search Correlation -->
                    <div class="w-full max-w-2xl mb-2">
                        <!-- Search Box -->
                        <label class="block mb-2 text-sm font-semibold text-slate-700">
                            Search Correlation ID
                        </label>
                        <div class="flex gap-2">
                            <input v-model="searchInput" @keyup.enter="handleSearch" type="text"
                                placeholder="Enter correlation ID (e.g. 9d694c91-7047-4af1-a955-12cf1b025af8)"
                                class="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-slate-700" />

                            <button @click="handleSearch" :disabled="!searchInput.trim()"
                                class="px-6 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-tl from-blue-500 to-violet-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <i class="fas fa-search mr-2"></i>
                                Search
                            </button>
                        </div>
                    </div>

                    <!-- Info Correlation jika ada -->
                    <div v-if="correlation"
                    class="flex items-center">
                    <div>
                            <span class="text-sm text-slate-500">Current Correlation ID:</span>
                            <code class="ml-2 text-sm font-semibold text-slate-800">{{ correlation }}</code>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i>
                    </div>
                    <p class="mb-0 text-sm leading-normal text-slate-400">Loading trace...</p>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div v-else-if="items.length" class="w-full max-w-full px-3">
            <div class="flex flex-wrap -mx-3">
                <!-- Total Steps -->
                <div class="w-full max-w-full px-3 mb-6 md:w-4/12 md:flex-0">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div class="flex-auto p-4">
                            <div class="flex flex-row -mx-3">
                                <div class="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p
                                            class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                            Total Steps</p>
                                        <h5 class="mb-0 font-bold text-slate-700">
                                            {{ items.length }}
                                        </h5>
                                    </div>
                                </div>
                                <div class="px-3 text-right basis-1/3">
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-blue-500 to-violet-500">
                                        <i class="fas fa-list text-lg text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Total Duration -->
                <div class="w-full max-w-full px-3 mb-6 md:w-4/12 md:flex-0">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div class="flex-auto p-4">
                            <div class="flex flex-row -mx-3">
                                <div class="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p
                                            class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                            Total Duration</p>
                                        <h5 class="mb-0 font-bold text-slate-700">
                                            {{ calculateTotalDuration() }}
                                        </h5>
                                    </div>
                                </div>
                                <div class="px-3 text-right basis-1/3">
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-orange-500 to-yellow-500">
                                        <i class="fas fa-clock text-lg text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="w-full max-w-full px-3 mb-6 md:w-4/12 md:flex-0">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div class="flex-auto p-4">
                            <div class="flex flex-row -mx-3">
                                <div class="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p
                                            class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                            Status</p>
                                        <h5 class="mb-0 font-bold"
                                            :class="getTraceStatus().includes('Healthy') ? 'text-emerald-500' : 'text-red-500'">
                                            {{ getTraceStatus() }}
                                        </h5>
                                    </div>
                                </div>
                                <div class="px-3 text-right basis-1/3">
                                    <div class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle"
                                        :class="getTraceStatus().includes('Healthy') ? 'bg-gradient-to-tl from-emerald-500 to-teal-400' : 'bg-gradient-to-tl from-red-600 to-orange-600'">
                                        <i :class="getTraceStatus().includes('Healthy') ? 'fas fa-check' : 'fas fa-exclamation-triangle'"
                                            class="text-lg text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Timeline -->
        <div v-if="!loading && items.length" class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <h6 class="mb-0 font-bold text-slate-700">Trace Timeline</h6>
                </div>

                <div class="flex-auto p-6">
                    <div v-for="(log, idx) in items" :key="`log-${idx}`" :ref="el => { if (el) logRefs[idx] = el }"
                        class="relative flex" :class="{ 'pb-6': idx < items.length - 1 }">

                        <!-- Timeline Line -->
                        <div v-if="idx < items.length - 1" class="absolute left-2 top-0 -ml-px h-full w-0.5"
                            :class="checkViolation(log) ? 'bg-red-300' : 'bg-blue-300'">
                        </div>

                        <!-- Timeline Dot Container -->
                        <div class="relative z-10 flex-shrink-0 mr-4">
                            <!-- Dot dengan warna berdasarkan violation -->
                            <div style="width: 16px; height: 16px; margin-top: 8px; border-radius: 50%;"
                                :style="{ backgroundColor: checkViolation(log) ? '#ef4444' : '#3b82f6' }">
                            </div>
                        </div>

                        <!-- Log Card -->
                        <div class="flex-grow">
                            <div class="relative flex flex-col min-w-0 break-words border-0 shadow-sm bg-slate-50 dark:bg-slate-850 rounded-xl bg-clip-border transition-all hover:shadow-md"
                                :class="{ 'highlight-card': isHighlighted(log) }">
                                <div class="p-4">
                                    <!-- Header -->
                                    <div class="flex items-center justify-between mb-4">
                                        <span
                                            class="inline-block px-3 py-1.5 text-sm font-bold leading-normal text-center text-blue-500 align-middle transition-all ease-in bg-blue-500/13 rounded-lg">
                                            <i class="fas fa-layer-group mr-2"></i>
                                            Step {{ idx + 1 }}
                                        </span>
                                        <span class="text-xs font-semibold text-slate-500"
                                            style="font-family: monospace;">
                                            {{ log.timestamp }}
                                        </span>
                                    </div>

                                    <!-- App & Message -->
                                    <div class="flex flex-wrap gap-2 mb-4">
                                        <!-- App Name dengan v-if -->
                                        <span v-if="checkViolation(log)"
                                            class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center text-red-600 align-middle transition-all ease-in bg-red-500/13 rounded-lg">
                                            <i class="fas fa-mobile-alt mr-1"></i>
                                            {{ log.app_name }}
                                        </span>
                                        <span v-else
                                            class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center text-emerald-600 align-middle transition-all ease-in bg-emerald-500/13 rounded-lg">
                                            <i class="fas fa-mobile-alt mr-1"></i>
                                            {{ log.app_name }}
                                        </span>

                                        <span
                                            class="flex-1 inline-block px-3 py-1.5 text-xs font-semibold leading-normal rounded-lg"
                                            :class="isHighlighted(log) ? 'text-slate-800 bg-blue-400 font-bold' : 'text-slate-700 bg-slate-200'">
                                            {{ log.message }}
                                            <i v-if="isHighlighted(log)" class="fas fa-star ml-2 text-yellow-500"></i>
                                        </span>
                                    </div>

                                    <!-- Duration Badge -->
                                    <div class="mb-4">
                                        <span
                                            class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center align-middle transition-all ease-in rounded-lg"
                                            :style="getDurationBadgeStyle(log)">
                                            <i class="far fa-clock mr-1"></i>
                                            {{ formatDuration(log.source?.extra?.duration_ms) }}
                                        </span>
                                    </div>

                                    <!-- Details Toggle -->
                                    <div v-if="log.source">
                                        <button @click="toggleExpand(idx)"
                                            class="inline-block px-4 py-2 mb-2 text-xs font-bold text-center uppercase align-middle transition-all ease-in bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-normal text-slate-700 border-slate-700 hover:bg-slate-700 hover:text-white">
                                            <i :class="expanded[idx] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
                                                class="mr-1"></i>
                                            {{ expanded[idx] ? 'Hide' : 'Show' }} Details
                                        </button>

                                        <!-- Expanded Details -->
                                        <div v-if="expanded[idx]"
                                            class="p-4 mt-3 text-xs leading-relaxed text-green-400 rounded-lg bg-slate-800 border border-slate-700"
                                            style="font-family: 'Courier New', monospace; white-space: pre-wrap; overflow-x: auto; line-height: 1.6; max-height: 400px; overflow-y: auto;">
                                            {{ prettySource(log.source) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 border-dashed shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-search text-6xl text-slate-300"></i>
                    </div>
                    <h5 class="mb-2 font-bold text-slate-700">No Trace Found</h5>
                    <p class="mb-4 text-sm leading-normal text-slate-400">
                        No trace data found for correlation ID:
                        <code
                            class="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-200 text-slate-800">{{ correlation }}</code>
                    </p>
                    <router-link to="/"
                        class="inline-block px-6 py-3 mb-0 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer leading-normal tracking-tight-rem bg-gradient-to-tl from-blue-500 to-violet-500 hover:shadow-xs hover:-translate-y-px active:opacity-85">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Monitoring
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTrace, getMessageRules, getAppRules } from '../services/api'

export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const correlation = ref(route.query.correlation_id || '')
        const searchInput = ref(route.query.correlation_id || '') // ✅ bikin inline dengan correlation
        const highlightMessage = route.query.highlight || ''
        const items = ref([])
        const messageRules = ref([])
        const appRules = ref([])
        const loading = ref(false)
        const expanded = ref({})
        const logRefs = ref([])

        const handleSearch = () => {
            const searchValue = searchInput.value.trim()
            router.push({
                path: route.path,
                query: searchValue ? { correlation_id: searchValue } : {}
            })
        }

        const isHighlighted = (log) => {
            return highlightMessage && log.message === highlightMessage
        }

        const scrollToHighlighted = () => {
            if (!highlightMessage || !items.value.length) return

            const highlightedIndex = items.value.findIndex(log => log.message === highlightMessage)
            if (highlightedIndex === -1) return

            const element = logRefs.value[highlightedIndex]
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }

        const toggleExpand = (idx) => {
            expanded.value[idx] = !expanded.value[idx]
        }

        const prettySource = (src) => {
            try {
                const parsed = typeof src === 'string' ? JSON.parse(src) : src
                return JSON.stringify(parsed, null, 2)
            } catch {
                return typeof src === 'string' ? src : JSON.stringify(src)
            }
        }

        const toNumber = (val) => {
            if (val === undefined || val === null) return NaN
            if (typeof val === 'number') return val
            if (typeof val === 'string') {
                const cleaned = val.replace(/ms/gi, '').replace(',', '.').trim()
                return parseFloat(cleaned)
            }
            return NaN
        }

        const formatDuration = (duration) => {
            const num = toNumber(duration)
            return isNaN(num) ? 'N/A' : `${num.toFixed(2)} ms`
        }

        const calculateTotalDuration = () => {
            const total = items.value.reduce((sum, log) => {
                const duration = toNumber(log?.source?.extra?.duration_ms)
                return sum + (isNaN(duration) ? 0 : duration)
            }, 0)
            return `${total.toFixed(2)} ms`
        }

        const checkViolation = (log) => {
            const duration = toNumber(log?.source?.extra?.duration_ms)
            if (isNaN(duration)) return false

            const appRule = appRules.value.find(r => r.app_name === log.app_name)
            const msgRule = messageRules.value.find(r =>
                r.app_name === log.app_name && r.message_key === log.message
            )

            const appMax = toNumber(appRule?.max_duration)
            const msgMax = toNumber(msgRule?.max_duration)

            return (!isNaN(appMax) && duration > appMax) ||
                (!isNaN(msgMax) && duration > msgMax)
        }

        const getTraceStatus = () => {
            const hasError = items.value.some(log => checkViolation(log))
            return hasError ? '⚠️ Issues Detected' : '✅ Healthy'
        }

        const getDurationBadgeStyle = (log) => {
            const duration = toNumber(log?.source?.extra?.duration_ms)
            if (isNaN(duration)) {
                return { background: '#f3f4f6', color: '#6b7280' }
            }
            if (checkViolation(log)) {
                return { background: 'rgba(220, 38, 38, 0.13)', color: '#991b1b', fontWeight: 'bold' }
            }
            if (duration < 10) {
                return { background: 'rgba(45, 206, 137, 0.13)', color: '#166534', fontWeight: 'bold' }
            } else if (duration < 50) {
                return { background: 'rgba(94, 114, 228, 0.13)', color: '#1e40af', fontWeight: 'bold' }
            } else {
                return { background: 'rgba(251, 99, 64, 0.13)', color: '#92400e', fontWeight: 'bold' }
            }
        }

        const load = async () => {
            const currentCorrelationId = route.query.correlation_id || ''
            correlation.value = currentCorrelationId
            searchInput.value = currentCorrelationId // ✅ biar input ikut berubah

            if (!currentCorrelationId) {
                items.value = []
                return
            }

            loading.value = true
            try {
                const [traceRes, messageRes, appRes] = await Promise.all([
                    getTrace(currentCorrelationId),
                    getMessageRules(),
                    getAppRules()
                ])
                items.value = traceRes || []
                messageRules.value = messageRes?.data || []
                appRules.value = appRes?.data || []
            } catch (e) {
                console.error('Error loading trace:', e)
                items.value = []
            } finally {
                loading.value = false
                await nextTick()
                scrollToHighlighted()
            }
        }

        watch(() => route.query.correlation_id, load)

        onMounted(load)

        return {
            correlation,
            searchInput,
            highlightMessage,
            items,
            messageRules,
            appRules,
            loading,
            expanded,
            logRefs,
            handleSearch,
            isHighlighted,
            checkViolation,
            toggleExpand,
            prettySource,
            formatDuration,
            calculateTotalDuration,
            getTraceStatus,
            getDurationBadgeStyle
        }
    }
}
</script>


<style scoped>
@keyframes highlight-pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        border-color: rgba(59, 130, 246, 0.5);
    }

    50% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        border-color: rgba(59, 130, 246, 1);
    }
}

.highlight-card {
    animation: highlight-pulse 2s ease-in-out 3;
    border: 2px solid rgba(59, 130, 246, 0.5);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
}
</style>