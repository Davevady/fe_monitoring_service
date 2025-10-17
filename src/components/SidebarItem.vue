<template>
    <router-link :to="to"
        class="flex items-center text-sm font-normal transition-all ease-in-out rounded-lg cursor-pointer group"
        :class="[linkClasses, collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-3']">
        <div class="inline-flex items-center justify-center flex-shrink-0 text-center transition-all duration-200 ease-in-out rounded-lg shadow-none"
            :class="iconWrapperClasses">
            <i :class="[icon, iconSize, 'transition-all']"></i>
        </div>
        <span v-if="!collapsed" class="ml-2 transition-all duration-200 whitespace-nowrap" :class="textClasses">
            {{ label }}
        </span>
    </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    icon: { type: String, required: true },
    iconSize: { type: String, default: 'text-sm' },
    label: { type: String, required: true },
    to: { type: String, required: true },
    sub: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
    parent: { type: String, default: false } // ← ini tambahan baru
})

const route = useRoute()

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