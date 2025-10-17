<template>
    <div>
        <!-- Dropdown Header -->
        <div @click="toggleOpen"
            class="flex items-center text-sm font-normal transition-all ease-in-out rounded-lg cursor-pointer hover:bg-slate-50 group mb-1"
            :class="[headerClasses, collapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-3']">
            <div class="flex items-center" :class="collapsed ? '' : 'gap-3'">
                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-center transition-all duration-200 ease-in-out border border-solid rounded-lg shadow-none"
                    :class="iconWrapperClasses">
                    <i :class="[icon, 'text-sm transition-all']"></i>
                </div>
                <span v-if="!collapsed" class="ml-2 transition-all duration-200 whitespace-nowrap" :class="textClasses">
                    {{ label }}
                </span>
            </div>
            <i v-if="!collapsed" class="fas fa-chevron-down text-xs transition-transform duration-200 flex-shrink-0"
                :class="{ 'rotate-180': isOpen, 'text-slate-400': !isOpen, 'text-slate-700': isOpen }"></i>
        </div>

        <!-- Dropdown Content -->
        <div v-show="isOpen && !collapsed"
            class="overflow-hidden transition-all duration-300 ease-in-out space-y-1 mb-1">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    parent: { type: String, required: true }, // ← tambahan
    collapsed: { type: Boolean, default: false }
})

const route = useRoute()
const isOpen = ref(false)

// ✅ Detect active child route
const hasActiveChild = computed(() => {
    return route.path.startsWith(`/${props.parent}`)
})

// ✅ Auto expand dropdown kalau child aktif
watch(
    () => route.path,
    () => {
        if (hasActiveChild.value) {
            isOpen.value = true
        }
    },
    { immediate: true }
)

const toggleOpen = () => {
    if (!props.collapsed) {
        isOpen.value = !isOpen.value
    }
}

const headerClasses = computed(() => {
    return hasActiveChild.value
        ? 'bg-white shadow-md font-semibold' // sama kayak link active
        : ''
})

const iconWrapperClasses = computed(() => {
    return hasActiveChild.value
        ? 'bg-gradient-to-tl from-blue-500 to-violet-500 text-white border-transparent'
        : 'bg-white text-slate-700 border-slate-200 group-hover:border-slate-300'
})

const textClasses = computed(() => {
    return hasActiveChild.value
        ? 'text-slate-700 font-semibold'
        : 'text-slate-700 group-hover:text-slate-900'
})
</script>
