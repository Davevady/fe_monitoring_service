<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import SidebarItem from './SidebarItem.vue'
import SidebarDropdown from './SidebarDropdown.vue'

const props = defineProps({
    collapsed: { type: Boolean, default: true }
})

const { getMenuPermissions, permissions, user, isInitialized } = useAuth()

// ✅ Wait until auth is initialized
watch(isInitialized, (initialized) => {
    if (initialized) {
        console.log('✅ Auth initialized, permissions:', permissions.value.length)
    }
}, { immediate: true })

// Debug watchers
watch(permissions, (newPerms) => {
    console.log('🔄 Permissions changed in sidebar:', newPerms.length)
    if (newPerms.length > 0) {
        console.log('📋 Permissions:', newPerms.map(p => p.name))
    }
}, { immediate: true })

onMounted(() => {
    console.log('🎨 Sidebar mounted')
    console.log('👤 User:', user.value?.name)
    console.log('🔑 Permissions count:', permissions.value.length)
    console.log('📋 Menu permissions:', getMenuPermissions())
})

// Menu configuration
const menuMappings = {
    'dashboard.menu': {
        icon: 'fas fa-home',
        to: '/',
        order: 1
    },
    'monitor.menu': {
        icon: 'fas fa-desktop',
        to: '/monitoring',
        order: 2
    },
    'trace.menu': {
        icon: 'fas fa-search',
        to: '/monitor/trace',
        order: 3
    },
    'violations-by-app.menu': {
        icon: 'fa fa-mobile',
        to: '/monitor/violations/app',
        parentGroup: 'violations',
        order: 4
    },
    'violations-by-message.menu': {
        icon: 'fa fa-comments',
        to: '/monitor/violations/message',
        parentGroup: 'violations',
        order: 5
    },
    'app-rules.menu': {
        icon: 'fa fa-mobile',
        to: '/rules/app',
        parentGroup: 'rules',
        order: 4
    },
    'message-rules.menu': {
        icon: 'fa fa-comments',
        to: '/rules/message',
        parentGroup: 'rules',
        order: 5
    },
    'users.menu': {
        icon: 'fas fa-users',
        to: '/users',
        section: 'User Management',
        order: 20
    },
    'roles.menu': {
        icon: 'fas fa-user-tag',
        to: '/roles',
        order: 21
    },
    'permissions.menu': {
        icon: 'fas fa-shield-alt',
        to: '/permissions',
        order: 22
    }
}

// Dropdown parent configuration
const dropdownParents = {
    'violations': {
        icon: 'fas fa-exclamation-triangle',
        label: 'Violations',
        parent: 'monitor/violations',
        section: 'Reports',
        order: 3.5
    },
    'rules': {
        icon: 'fas fa-shield-alt',
        label: 'Rules',
        parent: 'rules',
        section: 'Reports',
        order: 3.5
    }
}

// Build menu items dari permissions
const menuItems = computed(() => {
    const items = []
    const sections = new Set()
    const dropdowns = {}
    
    const userMenus = getMenuPermissions()
    
    console.log('🔨 Building menu with', userMenus.length, 'permissions')
    
    userMenus.forEach(permission => {
        const mapping = menuMappings[permission.name]
        
        if (!mapping) {
            console.warn(`⚠️ No mapping for permission: ${permission.name}`)
            return
        }
        
        console.log(`✅ Processing: ${permission.name}`)
        
        // Check if this is a submenu item
        if (mapping.parentGroup) {
            const parentKey = mapping.parentGroup
            
            if (!dropdowns[parentKey]) {
                const parentConfig = dropdownParents[parentKey]
                if (!parentConfig) {
                    console.warn(`⚠️ No parent config for: ${parentKey}`)
                    return
                }
                
                dropdowns[parentKey] = {
                    ...parentConfig,
                    children: []
                }
            }
            
            dropdowns[parentKey].children.push({
                icon: mapping.icon,
                label: permission.display_name,
                to: mapping.to,
                order: mapping.order
            })
        } else {
            // Single menu item
            if (mapping.section && !sections.has(mapping.section)) {
                sections.add(mapping.section)
                items.push({
                    type: 'section',
                    title: mapping.section,
                    order: mapping.order - 0.5
                })
            }
            
            items.push({
                type: 'item',
                icon: mapping.icon,
                label: permission.display_name,
                to: mapping.to,
                order: mapping.order
            })
        }
    })
    
    // Add dropdowns with their children
    Object.entries(dropdowns).forEach(([key, dropdown]) => {
        if (dropdown.children.length > 0) {
            if (dropdown.section && !sections.has(dropdown.section)) {
                sections.add(dropdown.section)
                items.push({
                    type: 'section',
                    title: dropdown.section,
                    order: dropdown.order - 0.5
                })
            }
            
            dropdown.children.sort((a, b) => (a.order || 999) - (b.order || 999))
            
            items.push({
                type: 'dropdown',
                icon: dropdown.icon,
                label: dropdown.label,
                parent: dropdown.parent,
                children: dropdown.children,
                order: dropdown.order
            })
        }
    })
    
    const sorted = items.sort((a, b) => (a.order || 999) - (b.order || 999))
    console.log('📦 Final menu items:', sorted.length, sorted)
    
    return sorted
})

const sidebarRef = ref(null)
const isCollapsed = ref(props.collapsed)

watch(() => props.collapsed, (newVal) => {
    isCollapsed.value = newVal
})

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

const collapsedWidth = 72
const expandedWidth = 256

const sidebarStyle = computed(() => ({
    width: `${isCollapsed.value ? collapsedWidth : expandedWidth}px`
}))
</script>

<template>
    <aside ref="sidebarRef"
        class="fixed left-0 z-990 bg-white shadow-xl transition-all duration-300 ease-in-out overflow-y-auto sidebar-fixed"
        :style="sidebarStyle" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <div class="h-full flex flex-col">
            <!-- Logo -->
            <div class="flex items-center justify-center h-16 border-b border-solid transition-all duration-300 border-slate-100">
                <div class="flex items-center gap-3 px-4">
                    <div class="inline-flex items-center justify-center w-10 h-10 text-center text-white rounded-circle bg-gradient-to-tl from-blue-500 to-violet-500 shadow-md">
                        <i class="fas fa-bolt text-lg"></i>
                    </div>
                    <div v-show="!isCollapsed" class="ml-2 font-bold">
                        Trace Monitor
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 overflow-y-auto">
                <!-- Debug info (hapus setelah working) -->
                <div v-if="menuItems.length === 0" class="px-3 py-2 text-xs text-slate-400">
                    <p>No menu items</p>
                    <p>Permissions: {{ permissions.length }}</p>
                </div>
                
                <ul class="space-y-2">
                    <template v-for="(item, index) in menuItems" :key="`menu-${index}`">
                        <!-- Section Header -->
                        <li v-if="item.type === 'section'" class="mt-4 first:mt-0">
                            <div class="mb-2 px-3">
                                <h6 v-show="!isCollapsed"
                                    class="text-xs font-bold leading-tight uppercase text-slate-500 tracking-tight-rem">
                                    {{ item.title }}
                                </h6>
                                <hr v-show="isCollapsed" class="mt-0 mb-2 border-slate-200" />
                            </div>
                        </li>

                        <!-- Menu Item -->
                        <li v-else-if="item.type === 'item'">
                            <SidebarItem 
                                :icon="item.icon" 
                                :label="item.label" 
                                :to="item.to" 
                                :collapsed="isCollapsed" 
                            />
                        </li>

                        <!-- Dropdown -->
                        <li v-else-if="item.type === 'dropdown'">
                            <SidebarDropdown 
                                :icon="item.icon" 
                                :label="item.label"
                                :parent="item.parent" 
                                :collapsed="isCollapsed"
                            >
                                <SidebarItem 
                                    v-for="(child, childIndex) in item.children" 
                                    :key="`child-${index}-${childIndex}`"
                                    sub 
                                    :icon="child.icon" 
                                    :label="child.label"
                                    :to="child.to" 
                                    :parent="item.parent" 
                                />
                            </SidebarDropdown>
                        </li>
                    </template>

                    <!-- Logout -->
                    <li class="mt-6 pt-4 border-t border-slate-200">
                        <SidebarItem 
                            icon="fas fa-sign-out-alt" 
                            label="Logout" 
                            action="logout" 
                            :collapsed="isCollapsed" 
                        />
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
</template>

<style scoped>
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

.sidebar-fixed {
    top: var(--nav-h, 64px);
    height: calc(100dvh - var(--nav-h, 64px));
}

@supports (-webkit-touch-callout: none) {
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