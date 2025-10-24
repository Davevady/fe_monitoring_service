<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '../services/api'

const props = defineProps({
    icon: { type: String, required: true },
    iconSize: { type: String, default: 'text-sm' },
    label: { type: String, required: true },
    to: { type: String, default: '#' },
    sub: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
    parent: { type: String, default: '' },
    action: { type: String, default: null }
})

const route = useRoute()
const router = useRouter()
const isLoggingOut = ref(false)

const handleLogout = async () => {
    if (isLoggingOut.value) return
    
    try {
        isLoggingOut.value = true
        
        // Call logout API
        await logout()
        
        // Force redirect ke login
        await router.push('/login')
        
        // Optional: reload page untuk clear semua state
        window.location.href = '/login'
        
    } catch (error) {
        console.error('Logout failed:', error)
        
        // Tetap redirect meski ada error
        await router.push('/login')
        window.location.href = '/login'
        
    } finally {
        isLoggingOut.value = false
    }
}

const isActive = computed(() => {
    return route.path === props.to
})

const linkClasses = computed(() => {
    const classes = ['mb-1']

    if (props.sub) {
        classes.push('ml-4')
    }

    if (isActive.value) {
        classes.push('bg-white', 'shadow-md', 'font-semibold')
    } else {
        classes.push('hover:bg-slate-50')
    }

    return classes
})

const iconWrapperClasses = computed(() => {
    const baseClasses = ['w-8', 'h-8']

    if (isActive.value) {
        baseClasses.push('bg-gradient-to-tl', 'from-blue-500', 'to-violet-500', 'text-white')
    } else {
        baseClasses.push('bg-white', 'text-slate-700', 'border', 'border-slate-200', 'group-hover:border-slate-300')
    }

    return baseClasses
})

const textClasses = computed(() => {
    if (isActive.value) {
        return 'text-slate-700 font-semibold'
    }
    return 'text-slate-700 group-hover:text-slate-900'
})
</script>

<template>
    <!-- Logout Button -->
    <button 
        v-if="action === 'logout'" 
        @click="handleLogout"
        :disabled="isLoggingOut"
        class="flex items-center text-sm font-normal transition-all ease-in-out rounded-lg cursor-pointer group w-full disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[linkClasses, collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-3']"
    >
        <div 
            class="inline-flex items-center justify-center flex-shrink-0 text-center transition-all duration-200 ease-in-out rounded-lg shadow-none"
            :class="iconWrapperClasses"
        >
            <i v-if="!isLoggingOut" :class="[icon, iconSize, 'transition-all']"></i>
            <i v-else class="fas fa-spinner fa-spin text-sm"></i>
        </div>
        <span 
            v-if="!collapsed" 
            class="ml-2 transition-all duration-200 whitespace-nowrap" 
            :class="textClasses"
        >
            {{ isLoggingOut ? 'Logging out...' : label }}
        </span>
    </button>
    
    <!-- Regular Router Link -->
    <router-link 
        v-else 
        :to="to"
        class="flex items-center text-sm font-normal transition-all ease-in-out rounded-lg cursor-pointer group"
        :class="[linkClasses, collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-3']"
    >
        <div 
            class="inline-flex items-center justify-center flex-shrink-0 text-center transition-all duration-200 ease-in-out rounded-lg shadow-none"
            :class="iconWrapperClasses"
        >
            <i :class="[icon, iconSize, 'transition-all']"></i>
        </div>
        <span 
            v-if="!collapsed" 
            class="ml-2 transition-all duration-200 whitespace-nowrap" 
            :class="textClasses"
        >
            {{ label }}
        </span>
    </router-link>
</template>