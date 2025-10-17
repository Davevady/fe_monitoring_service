<template>
    <nav
        class="fixed top-0 left-0 right-0 h-16 z-990 flex items-center bg-white/80 backdrop-blur-2xl backdrop-saturate-200 border-b border-solid shadow-none transition-all ease-in border-slate-100/80 px-6">
        <div class="flex items-center gap-4 w-full">
            <!-- Sidebar Toggle Button -->
            <button @click="$emit('toggle-sidebar')"
                class="inline-block p-2 text-sm font-bold text-center uppercase align-middle transition-all ease-in bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-slate-700 hover:bg-slate-100">
                <i class="fa fa-bars text-lg"></i>
            </button>

            <!-- Breadcrumb -->
            <div class="flex items-center gap-2">
                <h6 class="mb-0 font-bold text-slate-700">Trace Monitor</h6>
                <span class="text-sm text-slate-400">/</span>
                <span class="text-sm leading-normal text-slate-400">{{ currentRoute }}</span>
            </div>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Search Input -->
            <div class="hidden md:flex items-center">
                <div
                    class="relative flex items-center bg-white border border-solid rounded-lg border-slate-200 focus-within:border-blue-500 transition-colors">
                    <span class="absolute left-3 text-slate-400">
                        <i class="fas fa-search text-sm"></i>
                    </span>
                    <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                        placeholder="Search correlation ID..."
                        class="pl-10 pr-4 py-2 text-sm bg-transparent outline-none text-slate-700 w-64" />
                </div>
            </div>

            <!-- Dark Mode Toggle -->
            <button @click="toggleTheme"
                class="inline-block p-2 text-sm font-bold text-center uppercase align-middle transition-all ease-in bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-slate-700 hover:bg-slate-100">
                <i v-if="currentTheme === 'dark'" class="fas fa-sun text-lg text-yellow-400"></i>
                <i v-else class="fas fa-moon text-lg"></i>
            </button>

            <!-- Notifications -->
            <button
                class="inline-block p-2 text-sm font-bold text-center uppercase align-middle transition-all ease-in bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-slate-700 hover:bg-slate-100">
                <i class="fas fa-bell text-lg"></i>
            </button>

            <!-- User Profile -->
            <div class="relative">
                <button
                    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all ease-in bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-normal text-slate-700 border-slate-200 hover:bg-slate-100">
                    <div
                        class="inline-flex items-center justify-center w-8 h-8 text-center text-white rounded-circle bg-gradient-to-tl from-blue-500 to-violet-500">
                        <i class="fas fa-user text-sm"></i>
                    </div>
                    <span class="hidden lg:inline-block">Admin</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['toggle-sidebar', 'toggle-theme'])

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')

// Theme
const currentTheme = ref(
    localStorage.getItem('theme_override') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
)

// Current route name for breadcrumb
const currentRoute = computed(() => {
    const name = route.name || 'Dashboard'
    return name.toString()
})

// Toggle theme
const toggleTheme = () => {
    const next = currentTheme.value === 'dark' ? 'light' : 'dark'
    currentTheme.value = next
    localStorage.setItem('theme_override', next)

    // Apply theme to document
    if (next === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }

    emit('toggle-theme', next)
}

// Handle search
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
            path: '/monitor/trace',
            query: { correlation_id: searchQuery.value.trim() }
        })
        searchQuery.value = ''
    }
}

// Listen for storage changes (other tabs)
window.addEventListener('storage', e => {
    if (e.key === 'theme_override') {
        currentTheme.value = e.newValue || 'light'
    }
})
</script>

<style scoped>
/* Additional Argon styles if needed */
</style>