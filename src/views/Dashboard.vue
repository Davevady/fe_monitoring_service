<template>
    <div class="flex flex-wrap -mx-3">
        <!-- Page Header -->
        <div class="w-full max-w-full px-3 mb-6">
            <div class="relative flex items-center justify-between">
                <div>
                    <h6 class="mb-0 font-bold text-slate-700 text-xl">📊 Dashboard Overview</h6>
                    <p class="mb-0 text-sm text-slate-400">Real-time monitoring and analytics</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs text-slate-500 mr-4">
                        <i class="fas fa-clock mr-1"></i>
                        Last updated: {{ lastUpdated }}
                    </span>
                    <button @click="refreshDashboard"
                        class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer leading-normal tracking-tight-rem bg-gradient-to-tl from-blue-500 to-violet-500 hover:shadow-xs hover:-translate-y-px active:opacity-85">
                        <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
            <div class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl">
                <div class="flex-auto p-4">
                    <div class="flex flex-row -mx-3">
                        <div class="flex-none w-2/3 max-w-full px-3">
                            <p class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                Total Logs</p>
                            <h5 class="mb-2 font-bold text-slate-700">{{ stats.totalLogs.toLocaleString() }}</h5>
                            <p class="mb-0 text-sm leading-normal">
                                <span class="font-bold text-emerald-500">+{{ stats.logsGrowth }}%</span>
                                since last hour
                            </p>
                        </div>
                        <div class="px-3 text-right basis-1/3">
                            <div
                                class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-blue-500 to-violet-500">
                                <i class="fas fa-file-alt text-lg text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
            <div class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl">
                <div class="flex-auto p-4">
                    <div class="flex flex-row -mx-3">
                        <div class="flex-none w-2/3 max-w-full px-3">
                            <p class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                Active Apps</p>
                            <h5 class="mb-2 font-bold text-slate-700">{{ stats.activeApps }}</h5>
                            <p class="mb-0 text-sm leading-normal">
                                <span class="font-bold text-blue-500">{{ stats.totalApps }}</span>
                                total registered
                            </p>
                        </div>
                        <div class="px-3 text-right basis-1/3">
                            <div
                                class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-emerald-500 to-teal-400">
                                <i class="fas fa-mobile-alt text-lg text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
            <div class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl">
                <div class="flex-auto p-4">
                    <div class="flex flex-row -mx-3">
                        <div class="flex-none w-2/3 max-w-full px-3">
                            <p class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                Violations</p>
                            <h5 class="mb-2 font-bold text-red-600">{{ stats.violations.toLocaleString() }}</h5>
                            <p class="mb-0 text-sm leading-normal">
                                <span class="font-bold text-red-500">{{ stats.violationRate }}%</span>
                                violation rate
                            </p>
                        </div>
                        <div class="px-3 text-right basis-1/3">
                            <div
                                class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-red-600 to-orange-600">
                                <i class="fas fa-exclamation-triangle text-lg text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
            <div class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl">
                <div class="flex-auto p-4">
                    <div class="flex flex-row -mx-3">
                        <div class="flex-none w-2/3 max-w-full px-3">
                            <p class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">Avg
                                Duration</p>
                            <h5 class="mb-2 font-bold text-slate-700">{{ stats.avgDuration }} ms</h5>
                            <p class="mb-0 text-sm leading-normal">
                                <span class="font-bold text-emerald-500">-{{ stats.durationImprovement }}%</span>
                                improvement
                            </p>
                        </div>
                        <div class="px-3 text-right basis-1/3">
                            <div
                                class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-orange-500 to-yellow-500">
                                <i class="fas fa-stopwatch text-lg text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Log Volume Trend -->
        <div class="w-full max-w-full px-3 my-6 lg:w-7/12 lg:flex-none">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-4">
                    <div class="flex items-center justify-between">
                        <h6 class="mb-0 font-bold text-slate-700">📈 Log Volume Trend</h6>
                        <div class="flex gap-2">
                            <button v-for="period in ['24h', '7d', '30d']" :key="period"
                                @click="selectedPeriod = period"
                                class="inline-block px-3 py-1 mb-0 text-xs font-bold text-center uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-none cursor-pointer leading-normal"
                                :class="selectedPeriod === period ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'">
                                {{ period }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex-auto p-6 pt-0">
                    <div class="relative w-full" style="height: 280px;">
                        <svg viewBox="0 0 800 280" class="w-full h-full">
                            <line v-for="i in 6" :key="'h-' + i" :x1="0" :y1="i * 46.67" :x2="800" :y2="i * 46.67"
                                stroke="#e2e8f0" stroke-width="1" />
                            <line v-for="i in 12" :key="'v-' + i" :x1="i * 66.67" :y1="0" :x2="i * 66.67" :y2="280"
                                stroke="#e2e8f0" stroke-width="1" />
                            <polygon :points="chartAreaPoints" fill="url(#gradient)" opacity="0.2" />
                            <polyline :points="chartLinePoints" fill="none" stroke="#5e72e4" stroke-width="3"
                                stroke-linejoin="round" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:#5e72e4;stop-opacity:0.6" />
                                    <stop offset="100%" style="stop-color:#5e72e4;stop-opacity:0" />
                                </linearGradient>
                            </defs>
                            <circle v-for="(point, idx) in chartPoints" :key="idx" :cx="point.x" :cy="point.y" r="5"
                                fill="#5e72e4" stroke="#fff" stroke-width="2" class="transition-all cursor-pointer" />
                        </svg>
                    </div>
                    <div class="flex justify-between mt-3 text-xs text-slate-500">
                        <span v-for="(label, idx) in chartLabels" :key="idx">{{ label }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Log Level Distribution - New Design -->
        <div class="w-full max-w-full px-3 my-6 lg:w-5/12 lg:flex-none">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-4">
                    <div class="flex items-center justify-between">
                        <h6 class="mb-0 font-bold text-slate-700">Log Level Distribution</h6>
                        <button @click="showLogModal = true"
                            class="text-xs font-semibold text-blue-500 hover:text-blue-700 uppercase flex items-center gap-1">
                            LOG ANALYSIS
                            <i class="fas fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
                <div class="flex-auto p-6 pt-2">
                    <div class="flex flex-col items-center">
                        <!-- Donut Chart -->
                        <div class="relative mb-4" style="width: 220px; height: 220px;">
                            <svg viewBox="0 0 200 200" class="w-full h-full transform -rotate-90">
                                <circle class="donut-segment-new"
                                    :class="{ 'opacity-30': selectedLevel && selectedLevel !== 'INFO' }" cx="100"
                                    cy="100" r="70" fill="none" :stroke="infoLogs.color || '#10b981'"
                                    :stroke-width="selectedLevel === 'INFO' ? 34 : 30"
                                    :stroke-dasharray="`${infoLogs.percentage * 4.4} 440`" stroke-linecap="round"
                                    style="--segment-offset: 0" @mouseenter="onEnterSegment(infoLogs, $event)"
                                    @mousemove="onMoveTooltip($event)" @mouseleave="onLeaveSegment" />
                                <circle class="donut-segment-new"
                                    :class="{ 'opacity-30': selectedLevel && selectedLevel !== 'ERROR' }" cx="100"
                                    cy="100" r="70" fill="none" :stroke="errorLogs.color || '#ef4444'"
                                    :stroke-width="selectedLevel === 'ERROR' ? 34 : 30"
                                    :stroke-dasharray="`${errorLogs.percentage * 4.4} 440`"
                                    :stroke-dashoffset="`-${infoLogs.percentage * 4.4}`" stroke-linecap="round"
                                    :style="`--segment-offset: -${infoLogs.percentage * 4.4}`"
                                    @mouseenter="onEnterSegment(errorLogs, $event)" @mousemove="onMoveTooltip($event)"
                                    @mouseleave="onLeaveSegment" />
                                <circle class="donut-segment-new"
                                    :class="{ 'opacity-30': selectedLevel && selectedLevel !== 'WARNING' }" cx="100"
                                    cy="100" r="70" fill="none" :stroke="warningLogs.color || '#f59e0b'"
                                    :stroke-width="selectedLevel === 'WARNING' ? 34 : 30"
                                    :stroke-dasharray="`${warningLogs.percentage * 4.4} 440`"
                                    :stroke-dashoffset="`-${(infoLogs.percentage + errorLogs.percentage) * 4.4}`"
                                    stroke-linecap="round"
                                    :style="`--segment-offset: -${(infoLogs.percentage + errorLogs.percentage) * 4.4}`"
                                    @mouseenter="onEnterSegment(warningLogs, $event)" @mousemove="onMoveTooltip($event)"
                                    @mouseleave="onLeaveSegment" />
                            </svg>

                            <!-- Center Text -->
                            <div class="absolute inset-0 flex flex-col items-center justify-center"
                                style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
                                <div class="text-center transition-all duration-300">
                                    <p class="text-[11px] text-slate-500 mb-1">{{ selectedLevel || 'Total' }}</p>
                                    <p class="text-4xl font-bold text-slate-800">
                                        {{ formatShortNumber(selectedLevel ? selectedLevelData.count :
                                        totalLogsFromDistribution) }}
                                    </p>
                                    <p class="text-[11px] text-slate-400 mt-1">{{ selectedLevel ?
                                        (selectedLevelData.percentage + '%') : 'Logs' }}</p>
                                </div>
                            </div>

                            <!-- Tooltip -->
                            <div v-if="tooltip.visible"
                                class="pointer-events-none absolute bg-white text-slate-700 text-xs px-2.5 py-1.5 rounded-md shadow-md border border-slate-200"
                                :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
                                <span class="font-semibold mr-1">{{ tooltip.label }}:</span>
                                <span>{{ formatShortNumber(tooltip.value) }}</span>
                            </div>
                        </div>

                        <!-- Legend Items (horizontal like example) -->
                        <div class="w-full flex items-center justify-center space-x-6 mt-4 flex-wrap gap-0">
                            <div v-for="item in logLevels" :key="item.level" @click="toggleLevel(item.level)"
                                class="flex items-center gap-2 cursor-pointer select-none"
                                :class="{ 'opacity-50': selectedLevel && selectedLevel !== item.level, 'font-semibold text-slate-800': selectedLevel === item.level }">
                                <span class="inline-block rounded-full align-middle"
                                    :style="{ width: '10px', height: '10px', background: item.color, marginRight: '6px' }"></span>
                                <span class="text-xs text-slate-600" :style="{ marginRight: '4px' }">{{
                                    item.level.charAt(0) + item.level.slice(1).toLowerCase() }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Apps Table -->
        <div class="w-full max-w-full px-3 mb-6 lg:w-7/12 lg:flex-none">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div class="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <div class="flex items-center justify-between mb-4">
                        <h6 class="mb-0 font-bold text-slate-700">🏆 Top Apps by Performance</h6>
                        <router-link to="/monitoring"
                            class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-blue-500 uppercase hover:text-blue-600">
                            View All <i class="fas fa-arrow-right ml-1"></i>
                        </router-link>
                    </div>
                </div>
                <div class="flex-auto p-0 overflow-x-auto">
                    <table class="items-center w-full mb-0 align-top border-collapse text-slate-500">
                        <thead class="align-bottom">
                            <tr>
                                <th class="px-6 py-3 font-bold text-left uppercase text-xxs text-slate-400">App Name
                                </th>
                                <th class="px-6 py-3 font-bold text-center uppercase text-xxs text-slate-400">Total Logs
                                </th>
                                <th class="px-6 py-3 font-bold text-center uppercase text-xxs text-slate-400">Avg
                                    Duration</th>
                                <th class="px-6 py-3 font-bold text-center uppercase text-xxs text-slate-400">Status
                                </th>
                                <th class="px-6 py-3 font-bold text-center uppercase text-xxs text-slate-400">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(app, idx) in topApps" :key="idx" class="transition-all hover:bg-gray-50">
                                <td class="p-2 px-6 align-middle border-b">
                                    <div class="flex items-center gap-3">
                                        <div class="inline-flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-lg"
                                            :style="{ backgroundImage: app.color }">
                                            {{ app.name.charAt(0) }}
                                        </div>
                                        <div>
                                            <p class="mb-0 text-sm font-semibold text-slate-700">{{ app.name }}</p>
                                            <p class="mb-0 text-xs text-slate-400">{{ app.version }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-2 text-center border-b">
                                    <span class="text-sm font-semibold text-slate-700">{{ app.logs.toLocaleString()
                                    }}</span>
                                </td>
                                <td class="p-2 text-center border-b">
                                    <span class="inline-block px-2 py-1 text-xs font-bold rounded"
                                        :class="app.avgDuration < 200 ? 'bg-emerald-500/30 text-emerald-600' : app.avgDuration < 500 ? 'bg-orange-500/30 text-orange-600' : 'bg-red-500/30 text-red-600'">
                                        {{ app.avgDuration }} ms
                                    </span>
                                </td>
                                <td class="p-2 text-center border-b">
                                    <span class="inline-block px-2 py-1 text-xs font-bold rounded"
                                        :class="app.status === 'healthy' ? 'bg-emerald-500/30 text-emerald-600' : app.status === 'warning' ? 'bg-orange-500/30 text-orange-600' : 'bg-red-500/30 text-red-600'">
                                        {{ app.status.toUpperCase() }}
                                    </span>
                                </td>
                                <td class="p-2 text-center border-b">
                                    <span :class="app.trend > 0 ? 'text-emerald-500' : 'text-red-500'"
                                        class="text-sm font-bold">
                                        <i :class="app.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                                            class="mr-1"></i>
                                        {{ Math.abs(app.trend) }}%
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Recent Violations -->
        <div class="w-full max-w-full px-3 mb-6 lg:w-5/12 lg:flex-none">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div class="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <div class="flex items-center justify-between mb-4">
                        <h6 class="mb-0 font-bold text-slate-700">⚠️ Recent Violations</h6>
                        <router-link to="/violations/message"
                            class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-red-500 uppercase hover:text-red-600">
                            View All <i class="fas fa-arrow-right ml-1"></i>
                        </router-link>
                    </div>
                </div>
                <div class="flex-auto p-6 pt-0">
                    <div class="flex flex-col gap-3">
                        <div v-for="(violation, idx) in recentViolations" :key="idx"
                            class="mb-2 relative flex flex-col min-w-0 break-words border-0 shadow-sm rounded-2xl transition-all hover:shadow-md"
                            :style="{ borderLeft: `4px solid ${violation.color}` }">
                            <div class="p-4">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex-1">
                                        <p class="mb-1 text-sm font-bold text-slate-700">{{ violation.app }}</p>
                                        <code
                                            class="text-xs bg-slate-200 px-2 py-1 rounded text-slate-800">{{ violation.message }}</code>
                                    </div>
                                    <span class="text-xl ml-2">{{ violation.icon }}</span>
                                </div>
                                <div class="flex items-center justify-between mt-3">
                                    <span class="text-xs text-slate-500">
                                        <i class="far fa-clock mr-1"></i>
                                        {{ violation.time }}
                                    </span>
                                    <span class="text-xs font-bold" :style="{ color: violation.color }">
                                        +{{ violation.overage }}% over limit
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- System Health Indicators -->
        <div class="w-full max-w-full px-3 mb-6">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div class="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pb-4">
                    <h6 class="mb-0 font-bold text-slate-700">💚 System Health Indicators</h6>
                </div>
                <div class="flex-auto p-6 pt-0">
                    <div class="flex flex-wrap -mx-3">
                        <div v-for="(indicator, idx) in healthIndicators" :key="idx"
                            class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                            <div class="relative flex flex-col min-w-0 break-words border-0 shadow-sm rounded-2xl transition-all hover:shadow-md bg-white"
                                :class="getHealthBorderClass(indicator.value)">
                                <div class="p-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="text-2xl">{{ indicator.icon }}</span>
                                        <span class="inline-block px-2 py-1 text-xs font-bold text-white rounded-lg"
                                            :class="getHealthBadgeClass(indicator.value)">
                                            {{ getHealthStatus(indicator.value) }}
                                        </span>
                                    </div>
                                    <p class="mb-1 text-sm font-semibold text-slate-700">{{ indicator.name }}</p>
                                    <div class="flex items-end justify-between mb-2">
                                        <span class="text-2xl font-bold" :class="getHealthTextClass(indicator.value)">{{
                                            indicator.value }}%</span>
                                        <span class="text-xs text-slate-500">{{ indicator.description }}</span>
                                    </div>
                                    <div class="relative w-full rounded-full overflow-hidden"
                                        style="height: 10px; background-color: #e5e7eb;">
                                        <div class="h-full rounded-full transition-all duration-500"
                                            :style="getProgressBarStyle(indicator.value)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Message Type Distribution -->
        <div class="w-full max-w-full px-3 mb-6">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div class="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <h6 class="mb-0 font-bold text-slate-700">📨 Message Type Distribution</h6>
                </div>
                <div class="flex-auto p-6">
                    <div class="flex flex-wrap -mx-3">
                        <div v-for="(msg, idx) in messageTypes" :key="idx"
                            class="w-full max-w-full px-3 mb-4 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/6">
                            <div class="mb-4 relative flex flex-col min-w-0 break-words border-0 shadow-md rounded-2xl transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                                :style="{ background: msg.gradient }">
                                <div class="p-4 text-center">
                                    <span class="text-3xl mb-2 block">{{ msg.icon }}</span>
                                    <p class="text-xs font-semibold text-white mb-1">{{ msg.name }}</p>
                                    <p class="text-2xl font-bold text-white">{{ msg.count.toLocaleString() }}</p>
                                    <p class="text-xs text-white opacity-80 mt-1">{{ msg.percentage }}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Log Analysis -->
    <div v-if="showLogModal" class="fixed z-50 bg-black/45 p-4" @click.self="showLogModal = false"
        style="position:fixed;left:var(--content-left, 0);right:0;top:var(--nav-h, 0);bottom:0;display:flex;align-items:center;justify-content:center;">
        <div class="w-full flex flex-col overflow-hidden argon-modal" role="dialog" aria-modal="true"
            style="max-width: 720px; width: 100%; background:#fff; border-radius:16px; box-shadow:0 20px 50px rgba(0,0,0,0.25); border:1px solid rgba(203,213,225,0.6); max-height:80vh;">
            <!-- Modal Header -->
            <div
                class="flex items-center justify-between px-6 py-4 md:px-7 md:py-5 border-b border-slate-200/70 bg-white shrink-0">
                <div class="flex items-center gap-3">
                    <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <i class="fas fa-chart-pie"></i>
                    </span>
                    <div>
                        <h3 class="text-lg md:text-xl font-bold text-slate-800 leading-tight">Log Analysis Details</h3>
                        <p class="text-[11px] md:text-xs text-slate-500">Distribusi level log untuk periode terkini</p>
                    </div>
                </div>
                <button @click="showLogModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-5 md:px-7 md:py-6 overflow-y-auto space-y-6" style="max-height: calc(80vh - 116px);">
                <!-- Summary Stats -->
                <div class="flex flex-row flex-wrap mt-2">
                    <div class="w-full sm:w-1/2 lg:w-1/3">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center shadow-sm">
                            <p class="text-xs text-blue-600 font-semibold mb-1">TOTAL LOGS</p>
                            <p class="text-2xl font-bold text-blue-700">{{ totalLogsFromDistribution.toLocaleString() }}
                            </p>
                        </div>
                    </div>
                    <div class="w-full sm:w-1/2 lg:w-1/3">
                        <div
                            class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center shadow-sm">
                            <p class="text-xs text-emerald-600 font-semibold mb-1">SUCCESS RATE</p>
                            <p class="text-2xl font-bold text-emerald-700">{{ infoLogs.percentage }}%</p>
                        </div>
                    </div>
                    <div class="w-full sm:w-1 sm:mt-2 lg:w-1/3">
                        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center shadow-sm">
                            <p class="text-xs text-red-600 font-semibold mb-1">ERROR RATE</p>
                            <p class="text-2xl font-bold text-red-700">{{ (errorLogs.percentage +
                                warningLogs.percentage).toFixed(2) }}%</p>
                        </div>
                    </div>
                </div>

                <!-- Detailed Breakdown -->
                <div class="mt-4">
                    <h4 class="font-bold text-slate-700 mb-1">Log Level Breakdown</h4>
                    <p class="text-xs text-slate-500 mb-3">Detail jumlah dan persentase per level log.</p>

                    <!-- INFO -->
                    <div
                        class="border border-slate-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow bg-white mt-2">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-2"
                                    style="background: #10b981;">
                                    <i class="fas fa-info-circle text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-slate-800">INFO</p>
                                    <p class="text-xs text-slate-500">Information logs</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-slate-800">{{ infoLogs.count.toLocaleString() }}
                                </p>
                                <p class="text-xs text-slate-500">{{ infoLogs.percentage }}%</p>
                            </div>
                        </div>
                        <div class="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="absolute h-full rounded-full transition-all duration-500"
                                style="background: #10b981;" :style="{ width: infoLogs.percentage + '%' }"></div>
                        </div>
                    </div>

                    <!-- ERROR -->
                    <div
                        class="border border-slate-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow bg-white mt-2">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-2"
                                    style="background: #ef4444;">
                                    <i class="fas fa-exclamation-circle text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-slate-800">ERROR</p>
                                    <p class="text-xs text-slate-500">Error logs</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-slate-800">{{ errorLogs.count.toLocaleString() }}
                                </p>
                                <p class="text-xs text-slate-500">{{ errorLogs.percentage }}%</p>
                            </div>
                        </div>
                        <div class="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="absolute h-full rounded-full transition-all duration-500"
                                style="background: #ef4444;" :style="{ width: errorLogs.percentage + '%' }"></div>
                        </div>
                    </div>

                    <!-- WARNING -->
                    <div
                        class="border border-slate-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow bg-white mt-2">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-2"
                                    style="background: #f59e0b;">
                                    <i class="fas fa-exclamation-triangle text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-slate-800">WARNING</p>
                                    <p class="text-xs text-slate-500">Warning logs</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-slate-800">{{ warningLogs.count.toLocaleString()
                                }}</p>
                                <p class="text-xs text-slate-500">{{ warningLogs.percentage }}%</p>
                            </div>
                        </div>
                        <div class="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="absolute h-full rounded-full transition-all duration-500"
                                style="background: #f59e0b;" :style="{ width: warningLogs.percentage + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div
                class="flex items-center justify-end gap-3 px-6 py-4 md:px-7 md:py-5 border-t border-slate-200 bg-white shrink-0">
                <button @click="showLogModal = false"
                    class="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getDashboardOverview } from '../services/api'

export default {
    setup() {
        const loading = ref(false)
        const selectedPeriod = ref('24h')
        const lastUpdated = ref('')
        const apiData = ref(null)
        const selectedLevel = ref(null)
        const showLogModal = ref(false)

        const stats = ref({
            totalLogs: 0,
            logsGrowth: 0,
            activeApps: 0,
            totalApps: 0,
            violations: 0,
            violationRate: 0,
            avgDuration: 0,
            durationImprovement: 0
        })

        const processedStats = computed(() => {
            if (!apiData.value) return stats.value
            const data = apiData.value.data
            return {
                totalLogs: data.total_logs || 0,
                logsGrowth: 0,
                activeApps: data.active_apps?.total || 0,
                totalApps: data.active_apps?.apps?.length || 0,
                violations: data.violations?.total || 0,
                violationRate: data.violations?.violation_rate || 0,
                avgDuration: Math.round(data.avg_duration?.overall_ms || 0),
                durationImprovement: 0
            }
        })

        const activeAppsData = computed(() => apiData.value?.data.active_apps?.apps || [])
        const violationsByApp = computed(() => apiData.value?.data.violations?.by_app || [])
        const avgDurationByApp = computed(() => apiData.value?.data.avg_duration?.by_app || [])

        const logLevelDistribution = computed(() => apiData.value?.data.log_level_distribution || { total: 0, distribution: [] })
        const totalLogsFromDistribution = computed(() => logLevelDistribution.value.total || 0)

        const infoLogs = computed(() => logLevelDistribution.value.distribution.find(d => d.level === 'INFO') || { level: 'INFO', count: 0, percentage: 0, color: '#10b981' })
        const warningLogs = computed(() => logLevelDistribution.value.distribution.find(d => d.level === 'WARNING') || { level: 'WARNING', count: 0, percentage: 0, color: '#f59e0b' })
        const errorLogs = computed(() => logLevelDistribution.value.distribution.find(d => d.level === 'ERROR') || { level: 'ERROR', count: 0, percentage: 0, color: '#ef4444' })

        // Legend list source to keep spacing consistent and dynamic
        const logLevels = computed(() => [infoLogs.value, errorLogs.value, warningLogs.value])

        const formatTotalLogs = (total) => {
            if (total >= 1000000) return (total / 1000000).toFixed(1) + 'M'
            if (total >= 1000) return (total / 1000).toFixed(0) + 'K'
            return total.toLocaleString()
        }

        const formatShortNumber = (num) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
            if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
            return num.toString()
        }

        const selectedLevelData = computed(() => {
            if (!selectedLevel.value) {
                return {
                    count: totalLogsFromDistribution.value,
                    percentage: 100
                }
            }

            if (selectedLevel.value === 'INFO') return infoLogs.value
            if (selectedLevel.value === 'ERROR') return errorLogs.value
            if (selectedLevel.value === 'WARNING') return warningLogs.value

            return { count: 0, percentage: 0 }
        })

        const toggleLevel = (level) => {
            if (selectedLevel.value === level) {
                selectedLevel.value = null
            } else {
                selectedLevel.value = level
            }
        }

        // Simple tooltip state for donut segments
        const tooltip = ref({ visible: false, x: 0, y: 0, label: '', value: 0 })
        const onEnterSegment = (segment, evt) => {
            tooltip.value.visible = true
            tooltip.value.label = segment.level
            tooltip.value.value = segment.count || 0
            onMoveTooltip(evt)
        }
        const onMoveTooltip = (evt) => {
            const rect = evt.currentTarget.closest('.relative').getBoundingClientRect()
            const offsetX = evt.clientX - rect.left
            const offsetY = evt.clientY - rect.top
            tooltip.value.x = Math.min(rect.width - 80, Math.max(8, offsetX + 10))
            tooltip.value.y = Math.min(rect.height - 30, Math.max(8, offsetY + 10))
        }
        const onLeaveSegment = () => {
            tooltip.value.visible = false
        }

        const chartData = ref([12450, 9320, 8745, 15230, 22340, 28450, 31250, 29870, 33450, 30120, 25890, 21340])
        const chartLabels = ref(['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'])

        const chartPoints = computed(() => {
            const maxValue = Math.max(...chartData.value)
            const points = []
            chartData.value.forEach((value, index) => {
                const x = (index * 800) / (chartData.value.length - 1)
                const y = 280 - (value / maxValue) * 260
                points.push({ x, y })
            })
            return points
        })

        const chartLinePoints = computed(() => chartPoints.value.map(p => `${p.x},${p.y}`).join(' '))
        const chartAreaPoints = computed(() => {
            const points = chartPoints.value.map(p => `${p.x},${p.y}`).join(' ')
            return `0,300 ${points} 800,300`
        })

        const topApps = computed(() => {
            if (!apiData.value) return []
            const byApp = apiData.value.data.avg_duration?.by_app || []
            return byApp.map((app, index) => {
                const violation = violationsByApp.value.find(v => v.app_name === app.app)
                const violationCount = violation?.count || 0
                let status = 'healthy'
                const activeApp = activeAppsData.value.find(a => a.name === app.app)
                if (activeApp && app.avg_duration_ms > activeApp.max_duration * 0.8) status = 'warning'
                if (activeApp && app.avg_duration_ms > activeApp.max_duration) status = 'critical'
                const gradients = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                ]
                return {
                    name: app.app.charAt(0).toUpperCase() + app.app.slice(1),
                    version: 'v1.0.0',
                    logs: app.count,
                    avgDuration: Math.round(app.avg_duration_ms),
                    status: status,
                    trend: 0,
                    color: gradients[index % gradients.length],
                    violations: violationCount
                }
            }).sort((a, b) => b.logs - a.logs)
        })

        const recentViolations = ref([
            { app: 'Payment Service', message: 'process_transaction', time: '2 min ago', overage: 145, icon: '🔥', color: '#dc2626' },
            { app: 'Analytics Engine', message: 'generate_report', time: '8 min ago', overage: 89, icon: '⚠️', color: '#ea580c' },
            { app: 'Notification API', message: 'send_email', time: '15 min ago', overage: 67, icon: '⚡', color: '#f59e0b' },
            { app: 'User Management', message: 'update_profile', time: '23 min ago', overage: 124, icon: '🔥', color: '#dc2626' },
            { app: 'Auth Service', message: 'validate_token', time: '31 min ago', overage: 56, icon: '⚡', color: '#f59e0b' }
        ])

        const healthIndicators = ref([
            { name: 'System Uptime', value: 99.8, status: 'good', icon: '⚡', description: 'Excellent' },
            { name: 'Response Time', value: 87.3, status: 'good', icon: '⏱️', description: 'Good' },
            { name: 'Error Rate', value: 96.2, status: 'good', icon: '✅', description: 'Very Low' },
            { name: 'Throughput', value: 73.4, status: 'warning', icon: '📊', description: 'Moderate' }
        ])

        const getHealthStatus = (value) => value >= 80 ? 'GOOD' : value >= 60 ? 'WARNING' : 'CRITICAL'
        const getHealthBorderClass = (value) => value >= 80 ? 'border-l-4 border-emerald-500' : value >= 60 ? 'border-l-4 border-yellow-500' : 'border-l-4 border-red-500'
        const getHealthBadgeClass = (value) => value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        const getHealthTextClass = (value) => value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600'
        const getProgressBarStyle = (value) => {
            let gradient = value >= 80 ? 'linear-gradient(to right, #34d399, #10b981)' : value >= 60 ? 'linear-gradient(to right, #fbbf24, #f59e0b)' : 'linear-gradient(to right, #f87171, #ef4444)'
            return { width: value + '%', background: gradient }
        }

        const messageTypes = ref([
            { name: 'API Calls', count: 456789, percentage: 36.6, icon: '🔌', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { name: 'Database', count: 342156, percentage: 27.4, icon: '💾', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { name: 'Cache Ops', count: 198432, percentage: 15.9, icon: '⚡', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { name: 'Auth', count: 134289, percentage: 10.8, icon: '🔐', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            { name: 'Queue', count: 87456, percentage: 7.0, icon: '📬', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { name: 'Webhooks', count: 28710, percentage: 2.3, icon: '🪝', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
        ])

        const updateLastUpdated = () => {
            const now = new Date()
            lastUpdated.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }

        const fetchDashboardData = async () => {
            loading.value = true
            try {
                const response = await getDashboardOverview()
                if (response.status === 'success') {
                    apiData.value = response
                    stats.value = processedStats.value
                    updateLastUpdated()
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                loading.value = false
            }
        }

        const refreshDashboard = async () => await fetchDashboardData()

        onMounted(() => {
            fetchDashboardData()
            const interval = setInterval(() => fetchDashboardData(), 30000)
            onUnmounted(() => clearInterval(interval))
        })

        return {
            loading,
            selectedPeriod,
            lastUpdated,
            stats: processedStats,
            topApps,
            recentViolations,
            healthIndicators,
            messageTypes,
            chartLabels,
            chartPoints,
            chartLinePoints,
            chartAreaPoints,
            getHealthStatus,
            getHealthBorderClass,
            getHealthBadgeClass,
            getHealthTextClass,
            getProgressBarStyle,
            refreshDashboard,
            activeAppsData,
            violationsByApp,
            avgDurationByApp,
            logLevelDistribution,
            totalLogsFromDistribution,
            infoLogs,
            warningLogs,
            errorLogs,
            logLevels,
            formatTotalLogs,
            formatShortNumber,
            selectedLevel,
            selectedLevelData,
            toggleLevel,
            tooltip,
            onEnterSegment,
            onMoveTooltip,
            onLeaveSegment,
            showLogModal
        }
    }
}
</script>

<style scoped>
.argon-modal :deep(.card),
.argon-modal :deep(.card-body),
.argon-modal :deep(.card-header) {
    margin: 0;
}

.argon-modal :deep(.p-0),
.argon-modal :deep(.px-0),
.argon-modal :deep(.py-0) {
    padding: 0 !important;
}

/* Tambah spacing default agar tidak ditempel oleh utility bawaan Argon */
.argon-modal {
    --modal-x: 1.5rem;
}

.argon-modal :deep(.stat-grid)>* {
    margin: 0 !important;
}

.argon-modal :deep(.modal-section)>*+* {
    margin-top: 0.75rem;
}

.transition-all {
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* New donut segment style - clean and simple */
.donut-segment-new {
    transition: opacity 0.4s ease, stroke-width 0.3s ease;
    animation: drawSegment 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    pointer-events: none;
}

/* Draw animation */
@keyframes drawSegment {
    from {
        stroke-dashoffset: 440;
    }

    to {
        stroke-dashoffset: var(--segment-offset);
    }
}

/* Fade in animation */
.fade-in {
    animation: fadeIn 1s ease-in 0.3s both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Scale animation */
.scale-in {
    animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Legend items */
.legend-item {
    animation: slideIn 0.6s ease-out both;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 8px;
    margin: -8px;
}

.legend-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
    transform: translateX(5px);
}

.legend-item:nth-child(1) {
    animation-delay: 0.6s;
}

.legend-item:nth-child(2) {
    animation-delay: 0.8s;
}

.legend-item:nth-child(3) {
    animation-delay: 1s;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Chart circles hover */
svg circle {
    transition: r 0.2s ease;
}

svg circle:hover {
    r: 7;
}

.rounded-circle {
    border-radius: 50%;
}

.cursor-pointer {
    cursor: pointer;
}

p {
    margin-bottom: 0 !important;
    line-height: 1.25 !important;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.4);
    }
}

/* Smooth hover untuk chart circles */
svg circle {
    transition: r 0.2s ease;
}

svg circle:hover {
    r: 7;
}

.rounded-circle {
    border-radius: 50%;
}

.cursor-pointer {
    cursor: pointer;
}

p {
    margin-bottom: 0 !important;
    line-height: 1.25 !important;
}
</style>