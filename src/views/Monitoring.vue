<template>
    <div class="flex flex-wrap -mx-3">
        <!-- Header with Filters -->
        <div class="w-full max-w-full px-3 mb-6">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <div class="flex items-center justify-between">
                        <div>
                            <h6 class="mb-0 font-bold text-slate-700">Monitoring Logs</h6>
                            <p class="mb-0 text-sm leading-normal text-slate-400">View and filter application logs in
                                real-time</p>
                        </div>
                    </div>
                </div>

                <!-- Filters - Auto Submit on Change -->
                <div class="flex-auto p-6">
                    <div class="flex flex-wrap -mx-3 gap-y-4">
                        <!-- App Name and Level - Horizontal -->
                        <div class="w-full max-w-full px-3 md:w-4/12 md:flex-0">
                            <label class="inline-block mb-2 ml-1 text-xs font-bold text-slate-700">App Name</label>
                            <select v-model="filters.log" @change="handleFilterChange"
                                class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-500 focus:outline-none">
                                <option value="">All Apps</option>
                                <option v-for="app in appList" :key="app" :value="app">
                                    {{ app }}
                                </option>
                            </select>
                        </div>

                        <div class="w-full max-w-full px-3 md:w-4/12 md:flex-0">
                            <label class="inline-block mb-2 ml-1 text-xs font-bold text-slate-700">Level</label>
                            <select v-model="filters.level" @change="handleFilterChange"
                                class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-500 focus:outline-none">
                                <option value="">All Levels</option>
                                <option value="info">INFO</option>
                                <option value="warning">WARNING</option>
                                <option value="error">ERROR</option>
                            </select>
                        </div>

                        <div class="w-full max-w-full px-3 md:w-4/12 md:flex-0">
                            <label class="inline-block mb-2 ml-1 text-xs font-bold text-slate-700">&nbsp;</label>
                            <button @click="load" :disabled="loading"
                                class="inline-block w-full px-6 py-3 mb-0 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer leading-normal tracking-tight-rem bg-gradient-to-tl from-blue-500 to-violet-500 hover:shadow-xs hover:-translate-y-px active:opacity-85"
                                :class="{ 'opacity-60 cursor-not-allowed': loading }">
                                <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
                                {{ loading ? 'Loading...' : 'Manual Refresh' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && allItems.length === 0" class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i>
                    </div>
                    <p class="mb-0 text-sm leading-normal text-slate-400">Loading logs...</p>
                </div>
            </div>
        </div>

        <!-- Search and Size Controls - Always Show -->
        <div class="w-full max-w-full px-3 mb-4">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6">
                    <div class="flex flex-wrap items-end gap-4">
                        <!-- Search Box -->
                        <div class="flex-1" style="min-width: 300px;">
                            <label class="inline-block mb-2 text-xs font-bold text-slate-700">
                                <i class="fas fa-search mr-1"></i>
                                Quick Search
                                <span class="ml-2 text-slate-400 font-normal">(search in current page)</span>
                            </label>
                            <input v-model="searchQuery" type="text"
                                placeholder="Search by app, message, correlation ID, or level..."
                                class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-500 focus:outline-none">
                        </div>

                        <!-- Size Per Page -->
                        <div style="min-width: 120px;">
                            <label class="inline-block mb-2 text-xs font-bold text-slate-700">Per Page</label>
                            <select v-model.number="filters.size" @change="handleFilterChange"
                                class="focus:shadow-primary-outline text-sm leading-5.6 ease appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:outline-none w-full">
                                <option :value="5">5</option>
                                <option :value="10">10</option>
                                <option :value="25">25</option>
                                <option :value="50">50</option>
                                <option :value="100">100</option>
                            </select>
                        </div>

                        <!-- Active Filters Badge -->
                        <div v-if="filters.log || filters.level" class="flex items-center gap-2">
                            <span
                                class="inline-block px-3 py-2 text-xs font-bold leading-normal text-blue-600 bg-blue-100 rounded-lg whitespace-nowrap">
                                <i class="fas fa-filter mr-1"></i>
                                {{ getActiveFiltersCount() }} filter{{ getActiveFiltersCount() > 1 ? 's' : '' }} active
                            </span>
                            <button @click="clearFilters"
                                class="inline-block px-3 py-2 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-all whitespace-nowrap">
                                <i class="fas fa-times mr-1"></i>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Logs Table -->
        <div v-if="filteredItems.length" class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">

                <!-- Table Header Info -->
                <div class="border-black/12.5 border-b border-solid px-6 py-3 bg-slate-50">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h6 class="mb-0 font-bold text-slate-700">Recent Logs</h6>
                            <p class="mt-1 mb-0 text-xs text-slate-500">
                                <span v-if="searchQuery" class="font-semibold text-blue-600">
                                    🔍 Filtered by search: "{{ searchQuery }}"
                                </span>
                                <span v-if="filters.log" :class="{ 'ml-2': searchQuery }">
                                    📱 App: <span class="font-semibold">{{ filters.log }}</span>
                                </span>
                                <span v-if="filters.level" class="ml-2">
                                    🏷️ Level: <span class="font-semibold uppercase">{{ filters.level }}</span>
                                </span>
                            </p>
                        </div>
                        <span
                            class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center text-blue-500 align-middle transition-all ease-in bg-blue-500/13 rounded-lg">
                            {{ pagination ? `${pagination.from}-${pagination.to} of
                            ${pagination.total.toLocaleString()}` : filteredItems.length }}
                            log{{ filteredItems.length !== 1 ? 's' : '' }}
                        </span>
                    </div>
                </div>

                <div class="flex-auto p-0 overflow-x-auto">
                    <table class="items-center w-full mb-0 align-top border-collapse text-slate-500">
                        <thead class="align-bottom">
                            <tr>
                                <th
                                    class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Timestamp
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    App
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Level
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Message
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Duration
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Correlation ID
                                </th>
                                <th
                                    class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(it, idx) in filteredItems" :key="`${it.timestamp}-${it.correlation_id}-${idx}`"
                                class="transition-all hover:bg-gray-50">
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p class="mb-0 text-xs font-semibold leading-tight text-slate-500"
                                        style="font-family: monospace;">
                                        {{ formatTimestamp(it.timestamp) }}
                                    </p>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p class="mb-0 text-sm font-semibold leading-tight text-slate-700">
                                        {{ it.app }}
                                    </p>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span
                                        class="inline-block px-2 py-1 text-xs font-bold leading-normal text-center align-middle transition-all ease-in rounded-1.8"
                                        :class="getLevelBadgeClass(it.level)">
                                        {{ (it.level || '').toUpperCase() }}
                                    </span>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p class="mb-0 text-sm leading-tight text-slate-500">
                                        {{ it.message }}
                                    </p>
                                </td>
                                <td
                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span
                                        class="inline-block px-2 py-1 text-xs font-bold leading-normal text-center text-slate-500 align-middle transition-all ease-in bg-gray-500/30 rounded-1.8"
                                        style="font-family: monospace;">
                                        {{ formatDuration(it.duration_ms) }}
                                    </span>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p class="mb-0 text-xs leading-tight text-slate-400"
                                        style="font-family: monospace;">
                                        {{ it.correlation_id }}
                                    </p>
                                </td>
                                <td
                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <router-link :to="{
                                        name: 'Trace',
                                        query: {
                                            correlation_id: it.correlation_id,
                                            highlight: it.message
                                        }
                                    }"
                                        class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-blue-500 uppercase align-middle transition-all ease-in bg-blue-500/13 border-0 rounded-lg shadow-none cursor-pointer leading-normal hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                        <i class="fas fa-search mr-1"></i>
                                        View
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination Footer -->
                <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 bg-slate-50">
                    <div class="flex items-center justify-between flex-wrap gap-4">
                        <!-- Info Text -->
                        <div class="flex-1 min-w-[200px]">
                            <p class="mb-0 text-sm font-semibold leading-normal text-slate-600">
                                <span v-if="searchQuery" class="block mb-1">
                                    <i class="fas fa-filter mr-1"></i>
                                    Showing {{ filteredItems.length }} of {{ allItems.length }} logs matching "{{
                                        searchQuery }}"
                                </span>
                                <span v-else-if="pagination">
                                    Showing {{ pagination.from }} to {{ pagination.to }} of {{
                                        pagination.total.toLocaleString() }} logs
                                </span>
                                <span v-else>
                                    Showing {{ filteredItems.length }} log{{ filteredItems.length !== 1 ? 's' : '' }}
                                </span>
                            </p>
                            <p v-if="pagination && pagination.total > 10000" class="mt-1 mb-0 text-xs text-orange-600">
                                <i class="fas fa-exclamation-triangle mr-1"></i>
                                Max {{ Math.floor(10000 / filters.size) }} pages accessible due to Elasticsearch limit
                            </p>
                        </div>

                        <!-- Pagination Controls - ALWAYS SHOW when pagination exists -->
                        <div v-if="pagination" class="flex items-center gap-2 flex-wrap justify-end">
                            <!-- First Page -->
                            <button @click="goToPage(1)" :disabled="pagination.current_page === 1 || loading"
                                class="inline-block px-3 py-2 text-xs font-bold text-center uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-none cursor-pointer leading-normal"
                                :class="pagination.current_page === 1 || loading
                                    ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                                    : 'text-slate-700 bg-slate-200 hover:bg-slate-300'">
                                <i class="fas fa-angle-double-left"></i>
                            </button>

                            <!-- Previous Button -->
                            <button @click="prevPage" :disabled="!pagination.has_prev || loading"
                                class="inline-block px-4 py-2 text-xs font-bold text-center uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-none cursor-pointer leading-normal"
                                :class="pagination.has_prev && !loading
                                    ? 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                                    : 'text-slate-400 bg-slate-100 cursor-not-allowed'">
                                <i class="fas fa-chevron-left mr-1"></i>
                                Previous
                            </button>

                            <!-- Page Info with Jump -->
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-semibold text-slate-700">Page</span>
                                <input v-model.number="pageInput" @keyup.enter="jumpToPage"
                                    @blur="pageInput = pagination.current_page" type="number" min="1"
                                    :max="Math.min(pagination.total_pages, Math.floor(10000 / filters.size))"
                                    class="w-16 px-2 py-1.5 text-xs font-semibold text-center text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <span class="text-xs font-semibold text-slate-700">of {{
                                    Math.min(pagination.total_pages, Math.floor(10000 / filters.size)).toLocaleString()
                                }}</span>
                            </div>

                            <!-- Next Button -->
                            <button @click="nextPage" :disabled="!pagination.has_next || loading"
                                class="inline-block px-4 py-2 text-xs font-bold text-center uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-none cursor-pointer leading-normal"
                                :class="pagination.has_next && !loading
                                    ? 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                                    : 'text-slate-400 bg-slate-100 cursor-not-allowed'">
                                Next
                                <i class="fas fa-chevron-right ml-1"></i>
                            </button>

                            <!-- Last Page -->
                            <button
                                @click="goToPage(Math.min(pagination.total_pages, Math.floor(10000 / filters.size)))"
                                :disabled="pagination.current_page >= Math.min(pagination.total_pages, Math.floor(10000 / filters.size)) || loading"
                                class="inline-block px-3 py-2 text-xs font-bold text-center uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-none cursor-pointer leading-normal"
                                :class="pagination.current_page >= Math.min(pagination.total_pages, Math.floor(10000 / filters.size)) || loading
                                    ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                                    : 'text-slate-700 bg-slate-200 hover:bg-slate-300'">
                                <i class="fas fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 border-dashed shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-folder-open text-6xl text-slate-300"></i>
                    </div>
                    <h5 class="mb-2 font-bold text-slate-700">
                        {{ searchQuery ? 'No Matching Logs' : 'No logs found' }}
                    </h5>
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        {{ searchQuery ? `No logs matching "${searchQuery}" on this page` : 'Try adjusting your filters or check back later' }}
                    </p>
                    <button v-if="searchQuery" @click="searchQuery = ''"
                        class="inline-block px-6 py-3 mt-4 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer leading-normal tracking-tight-rem bg-gradient-to-tl from-blue-500 to-violet-500 hover:shadow-xs hover:-translate-y-px active:opacity-85">
                        <i class="fas fa-times mr-2"></i>
                        Clear Search
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getLogs, getAppRules } from '../services/api'

export default {
    setup() {
        const allItems = ref([])
        const loading = ref(false)
        const filters = ref({ log: '', level: '', size: 50, page: 1 })
        const appList = ref([])
        const pagination = ref(null)
        const searchQuery = ref('')
        const pageInput = ref(1)

        // Frontend search - filter allItems based on searchQuery
        const filteredItems = computed(() => {
            if (!searchQuery.value || searchQuery.value.trim() === '') {
                return allItems.value
            }

            if (!allItems.value || allItems.value.length === 0) {
                return []
            }

            const query = searchQuery.value.trim().toLowerCase()

            return allItems.value.filter(item => {
                const app = String(item.app || '').toLowerCase()
                const message = String(item.message || '').toLowerCase()
                const correlationId = String(item.correlation_id || '').toLowerCase()
                const level = String(item.level || '').toLowerCase()

                return app.includes(query) ||
                    message.includes(query) ||
                    correlationId.includes(query) ||
                    level.includes(query)
            })
        })

        const formatTimestamp = (timestamp) => {
            if (!timestamp) return 'N/A'
            const date = new Date(timestamp)
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
        }

        const formatDuration = (duration) => {
            if (duration === undefined || duration === null) return 'N/A'
            return `${duration} ms`
        }

        const getLevelBadgeClass = (level) => {
            const classes = {
                info: 'text-cyan-500 bg-cyan-500/30',
                warning: 'text-orange-500 bg-orange-500/30',
                error: 'text-red-500 bg-red-500/30'
            }
            return classes[level?.toLowerCase()] || 'text-gray-500 bg-gray-500/30'
        }

        const getActiveFiltersCount = () => {
            let count = 0
            if (filters.value.log) count++
            if (filters.value.level) count++
            return count
        }

        const clearFilters = () => {
            filters.value.log = ''
            filters.value.level = ''
            handleFilterChange()
        }

        const loadAppList = async () => {
            try {
                const response = await getAppRules()
                if (response && response.data) {
                    const uniqueApps = [...new Set(response.data.map(rule => rule.app_name))]
                    appList.value = uniqueApps.filter(app => app)
                }
            } catch (e) {
                console.error('Error loading app list:', e)
                appList.value = []
            }
        }

        const load = async () => {
            loading.value = true
            try {
                const params = {
                    page: filters.value.page,
                    size: filters.value.size
                }

                if (filters.value.log) params.log = filters.value.log
                if (filters.value.level) params.level = filters.value.level

                console.log('Loading with params:', params)

                const res = await getLogs(params)

                console.log('API Response:', res)
                console.log('Pagination data:', res?.pagination)

                // Handle response - prioritize checking for status: success
                if (res?.status === 'success' && res?.data) {
                    allItems.value = Array.isArray(res.data) ? res.data : []
                    pagination.value = res.pagination || null

                    console.log('Pagination set to:', pagination.value)

                    if (pagination.value) {
                        pageInput.value = pagination.value.current_page
                    }
                } else if (res?.data) {
                    // Fallback if no status field
                    allItems.value = Array.isArray(res.data) ? res.data : []
                    pagination.value = res.pagination || null

                    if (pagination.value) {
                        pageInput.value = pagination.value.current_page
                    }
                } else if (Array.isArray(res)) {
                    allItems.value = res
                    pagination.value = null
                } else {
                    allItems.value = []
                    pagination.value = null
                }

                console.log('Items loaded:', allItems.value.length)
                console.log('Final pagination value:', pagination.value)

                // Clear search when loading new data
                searchQuery.value = ''
            } catch (e) {
                console.error('Error loading logs:', e)
                allItems.value = []
                pagination.value = null
            } finally {
                loading.value = false
            }
        }

        const goToPage = (page) => {
            if (loading.value) return

            // Elasticsearch limit: from + size <= 10000
            const maxAllowedPage = Math.floor(10000 / filters.value.size)

            if (page > maxAllowedPage) {
                alert(`⚠️ Cannot navigate beyond page ${maxAllowedPage} due to Elasticsearch limitations.\n\nMax result window is 10,000 records.\nCurrent page size: ${filters.value.size}\nMax page: ${maxAllowedPage}\n\nTip: Use filters to narrow down results or reduce page size.`)
                return
            }

            filters.value.page = page
            pageInput.value = page
            load()
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const jumpToPage = () => {
            const maxAllowedPage = Math.floor(10000 / filters.value.size)

            if (pageInput.value && pageInput.value >= 1) {
                if (pageInput.value > maxAllowedPage) {
                    alert(`⚠️ Page ${pageInput.value} exceeds maximum allowed page ${maxAllowedPage}`)
                    pageInput.value = pagination.value.current_page
                    return
                }

                if (pageInput.value <= pagination.value.total_pages) {
                    goToPage(pageInput.value)
                } else {
                    pageInput.value = pagination.value.current_page
                }
            } else {
                pageInput.value = pagination.value.current_page
            }
        }

        const nextPage = () => {
            if (pagination.value?.has_next && !loading.value) {
                const maxAllowedPage = Math.floor(10000 / filters.value.size)
                if (pagination.value.current_page + 1 <= maxAllowedPage) {
                    goToPage(pagination.value.current_page + 1)
                }
            }
        }

        const prevPage = () => {
            if (pagination.value?.has_prev && !loading.value) {
                goToPage(pagination.value.current_page - 1)
            }
        }

        const handleFilterChange = () => {
            // Reset to page 1 when filter changes and auto-load
            filters.value.page = 1
            load()
        }

        onMounted(async () => {
            await loadAppList()
            await load()
        })

        return {
            allItems,
            filteredItems,
            loading,
            filters,
            appList,
            pagination,
            searchQuery,
            pageInput,
            load,
            formatTimestamp,
            formatDuration,
            getLevelBadgeClass,
            getActiveFiltersCount,
            clearFilters,
            handleFilterChange,
            goToPage,
            jumpToPage,
            nextPage,
            prevPage
        }
    }
}
</script>