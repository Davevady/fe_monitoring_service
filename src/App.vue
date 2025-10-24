<template>
  <div :class="themeClass" class="min-h-screen" :style="{ '--content-left': contentLeftPadding, '--nav-h': navHeight + 'px', height: '100dvh' }">
    <!-- Show login page if not authenticated -->
    <router-view v-if="$route.name === 'Login' || $route.name === 'ResetPassword'" />
    
    <!-- Show main app if authenticated -->
    <template v-else>
      <!-- Navbar fixed -->
      <Navbar :collapsed="collapsed" @toggle-sidebar="toggleSidebar" @toggle-theme="toggleTheme" />

      <!-- Sidebar: tetap di DOM root (fixed) -->
      <Sidebar :collapsed="collapsed" @request-toggle="toggleSidebar" />

      <!-- Main content: beri padding-left sesuai sidebar width -->
      <main class="transition-[padding-left] ml-4 duration-300"
        :style="{ paddingLeft: contentLeftPadding, paddingTop: navHeight + 'px' }">
        <div class="max-w-7xl mx-auto p-6">
          <router-view />
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import { useAuthSession } from './composables/useAuthSession'

const navHeight = 64 // px - pastikan sama dengan navbar height
const collapsedWidth = 64
const expandedWidth = 240

const collapsed = ref(true) // default collapsed
const manualToggle = ref(null) // theme override

// Initialize auth session monitoring (timeout auto dari refresh_expires_in)
const { isIdle, isSessionActive } = useAuthSession()

// theme management (follow OS unless override)
const theme = ref('light')
onMounted(() => {
  const saved = localStorage.getItem('theme_override')
  if (saved === 'light' || saved === 'dark') {
    manualToggle.value = saved
    theme.value = saved
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = prefersDark ? 'dark' : 'light'
  }
  if (!saved) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!manualToggle.value) theme.value = e.matches ? 'dark' : 'light'
    })
  }
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const toggleTheme = (override) => {
  if (override === 'light' || override === 'dark') {
    theme.value = override
    manualToggle.value = override
    localStorage.setItem('theme_override', override)
  } else {
    manualToggle.value = null
    localStorage.removeItem('theme_override')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = prefersDark ? 'dark' : 'light'
  }
}

const themeClass = computed(() => theme.value === 'dark' ? 'dark' : '')

const contentLeftPadding = computed(() => `${collapsed.value ? collapsedWidth : expandedWidth}px`)
</script>

<style>
:root {
  --nav-h: 64px;
}

main {
  min-height: calc(100vh - var(--nav-h));
  background: var(--bg, #fff);
}

.dark main {
  background: #071021;
  color: #e6eef8;
}
</style>
