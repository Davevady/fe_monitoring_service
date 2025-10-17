<template>
    <aside ref="sidebarRef"
        class="fixed left-0 z-990 bg-white shadow-xl transition-all duration-300 ease-in-out overflow-y-auto sidebar-fixed"
        :style="sidebarStyle" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <div class="h-full flex flex-col">
            <!-- Logo Section -->
            <div
                class="flex items-center justify-center h-16 border-b border-solid transition-all duration-300 border-slate-100">
                <div class="flex items-center gap-3 px-4">
                    <div
                        class="inline-flex items-center justify-center w-10 h-10 text-center text-white rounded-circle bg-gradient-to-tl from-blue-500 to-violet-500 shadow-md">
                        <i class="fas fa-bolt text-lg"></i>
                    </div>
                    <div v-show="!isCollapsed" class="ml-2 font-bold">
                        Trace Monitor
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 overflow-y-auto">
                <ul class="space-y-2">
                    <li>
                        <SidebarItem icon="fas fa-home" label="Dashboard" to="/" :collapsed="isCollapsed" />
                    </li>
                    <li>
                        <SidebarItem icon="fas fa-desktop" label="Monitoring" to="/monitor" :collapsed="isCollapsed" />
                    </li>
                    <li>
                        <SidebarItem icon="fas fa-search" label="Trace Monitor" to="/monitor/trace"
                            :collapsed="isCollapsed" />
                    </li>

                    <!-- Violations Dropdown -->
                    <li class="mt-4">
                        <div class="mb-2 px-3">
                            <h6 v-show="!isCollapsed"
                                class="text-xs font-bold leading-tight uppercase text-slate-500 tracking-tight-rem">
                                Reports
                            </h6>
                            <hr v-show="isCollapsed" class="mt-0 mb-2 border-slate-200" />
                        </div>
                        <SidebarDropdown icon="fas fa-exclamation-triangle" label="Violations"
                            parent="monitor/violations" :collapsed="isCollapsed">
                            <SidebarItem sub icon="fa fa-mobile" label="App Violations" to="/monitor/violations/app"
                                parent="monitor/violations" />
                            <SidebarItem sub icon="fa fa-comments" label="Message Violations"
                                to="/monitor/violations/message" parent="monitor/violations" />
                        </SidebarDropdown>
                    </li>

                    <!-- Rules Dropdown -->
                    <li class="mt-2">
                        <SidebarDropdown icon="fas fa-cogs" label="Rules" parent="rules" :collapsed="isCollapsed">
                            <SidebarItem sub icon="fa fa-mobile" label="App Rules" to="/rules/app" parent="rules" />
                            <SidebarItem sub icon="fa fa-comments" label="Message Rules" to="/rules/message"
                                parent="rules" />
                        </SidebarDropdown>
                    </li>

                    <!-- System Dropdown -->
                    <li class="mt-4">
                        <div class="mb-2 px-3">
                            <h6 v-show="!isCollapsed"
                                class="text-xs font-bold leading-tight uppercase text-slate-500 tracking-tight-rem">
                                System
                            </h6>
                            <hr v-show="isCollapsed" class="mt-0 mb-2 border-slate-200" />
                        </div>
                        <SidebarDropdown icon="fas fa-cog" label="Settings" parent="settings" :collapsed="isCollapsed">
                            <SidebarItem sub icon="fas fa-sliders-h" label="Preferences" to="/settings"
                                parent="settings" />
                            <SidebarItem sub icon="fas fa-key" label="API Keys" to="/settings/api" parent="settings" />
                        </SidebarDropdown>
                    </li>

                    <li class="mt-2">
                        <SidebarItem icon="fas fa-sign-out-alt" label="Logout" to="/logout" :collapsed="isCollapsed" />
                    </li>
                </ul>
            </nav>

            <!-- Toggle Button at Bottom -->
            <!-- <div class="flex items-center justify-center h-14 border-t border-solid border-slate-100">
                <button @click="$emit('request-toggle')"
                    class="p-2 text-slate-500 transition-all duration-200 rounded-lg hover:bg-slate-100 hover:text-slate-700">
                    <i class="fas fa-chevron-left transition-transform duration-300"
                        :class="{ 'rotate-180': isCollapsed }"></i>
                </button>
            </div> -->
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SidebarItem from './SidebarItem.vue'
import SidebarDropdown from './SidebarDropdown.vue'

const props = defineProps({
    collapsed: { type: Boolean, default: true }
})

const emit = defineEmits(['request-toggle'])

const sidebarRef = ref(null)
const isCollapsed = ref(props.collapsed)

// Watch for prop changes
watch(() => props.collapsed, (newVal) => {
    isCollapsed.value = newVal
})

// Hover behavior
let hoverTimer = null

const onMouseEnter = () => {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (props.collapsed) {
        isCollapsed.value = false
    }
}

const onMouseLeave = () => {
    if (props.collapsed) {
        hoverTimer = setTimeout(() => {
            isCollapsed.value = true
        }, 200)
    }
}

// Dimensions
const navHeight = 64 // Match navbar height
const collapsedWidth = 72
const expandedWidth = 256

const sidebarStyle = computed(() => ({
    width: `${isCollapsed.value ? collapsedWidth : expandedWidth}px`
}))
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside {
    scrollbar-width: thin;
    scrollbar-color: rgba(99, 102, 241, 0.2) transparent;
}

aside::-webkit-scrollbar {
    width: 6px;
}

aside::-webkit-scrollbar-track {
    background: transparent;
}

aside::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.2);
    border-radius: 10px;
}

aside::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.3);
}

/* Pastikan sidebar selalu full tinggi viewport dan mulai di bawah navbar */
.sidebar-fixed {
    top: var(--nav-h, 64px);
    /* Gunakan unit viewport modern agar tidak ada gap pada mobile */
    height: calc(100dvh - var(--nav-h, 64px));
}

@supports (-webkit-touch-callout: none) {
    /* Safari iOS full height fix */
    .sidebar-fixed {
        height: calc(100vh - var(--nav-h, 64px));
    }
}

@supports (height: 100svh) {
    .sidebar-fixed {
        height: calc(100svh - var(--nav-h, 64px));
    }
}
</style>