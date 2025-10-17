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

                    <h6 class="mb-2 font-bold text-slate-700">App Violations</h6>
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        Applications that exceeded their maximum duration threshold
                    </p>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-circle-notch fa-spin text-4xl text-red-500"></i>
                    </div>
                    <p class="mb-0 text-sm leading-normal text-slate-400">Loading violations...</p>
                </div>
            </div>
        </div>

        <!-- Content when loaded -->
        <div v-else class="w-full max-w-full px-3">
            <!-- Summary Card -->
            <div class="w-full mb-6">
                <div
                    class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                    <div class="flex-auto p-4">
                        <div class="flex flex-row -mx-3">
                            <div class="flex-none w-2/3 max-w-full px-3">
                                <div>
                                    <p
                                        class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-500">
                                        Total Violations
                                    </p>
                                    <h5 class="mb-0 font-bold text-red-600">
                                        {{ totalViolations }} violations
                                    </h5>
                                    <p class="mb-0 text-xs text-slate-500 mt-1">
                                        Across {{ Object.keys(groupedViolations).length }} app{{
                                        Object.keys(groupedViolations).length !== 1 ? 's' : '' }}
                                    </p>
                                </div>
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

            <!-- Grouped Violations (Accordion) -->
            <div v-if="Object.keys(groupedViolations).length"
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-4">
                    <div class="flex items-center justify-between">
                        <h6 class="mb-0 font-bold text-slate-700">⚠️ Violations by Application</h6>
                        <button @click="toggleAll"
                            class="inline-block px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-all">
                            <i :class="allExpanded ? 'fas fa-compress-alt' : 'fas fa-expand-alt'" class="mr-1"></i>
                            {{ allExpanded ? 'Collapse All' : 'Expand All' }}
                        </button>
                    </div>
                </div>

                <div class="flex-auto p-4">
                    <!-- App Group Item -->
                    <div v-for="(items, appName) in groupedViolations" :key="appName" class="mb-3">
                        <!-- App Header (Clickable) -->
                        <div @click="toggleApp(appName)"
                            class="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-50 border-2 border-slate-200"
                            :class="{ 'bg-slate-50 border-blue-300': expandedApps[appName] }">
                            <div class="flex items-center gap-4 flex-1">
                                <!-- Expand Icon -->
                                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200">
                                    <i :class="expandedApps[appName] ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                                        class="text-slate-600 text-sm transition-transform"></i>
                                </div>

                                <!-- App Info -->
                                <div class="flex-1">
                                    <div class="flex items-center gap-3">
                                        <h6 class="mb-0 text-base font-bold text-slate-700">
                                            📱 {{ appName }}
                                        </h6>
                                        <span
                                            class="inline-block px-2.5 py-1 text-xs font-bold leading-normal text-center text-red-600 bg-red-500/13 rounded-lg">
                                            {{ items.length }} violation{{ items.length !== 1 ? 's' : '' }}
                                        </span>
                                    </div>
                                    <p class="mb-0 text-xs text-slate-500 mt-1">
                                        {{ getSummaryText(items) }}
                                    </p>
                                </div>

                                <!-- Severity Indicator -->
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full"
                                        :style="{ backgroundColor: getMaxSeverityColor(items) }"></div>
                                    <span class="text-xs font-semibold text-slate-600">
                                        {{ getMaxOverage(items) }}% over
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Expanded Details -->
                        <transition name="expand">
                            <div v-if="expandedApps[appName]" class="mt-2 ml-12 mr-2">
                                <div class="border-2 border-slate-200 rounded-lg overflow-hidden">
                                    <table class="items-center w-full mb-0 align-top border-collapse text-slate-500">
                                        <thead class="align-bottom bg-slate-50">
                                            <tr>
                                                <th
                                                    class="px-4 py-3 font-bold text-left uppercase align-middle text-xxs tracking-none whitespace-nowrap text-slate-500">
                                                    Message
                                                </th>
                                                <th
                                                    class="px-4 py-3 font-bold text-center uppercase align-middle text-xxs tracking-none whitespace-nowrap text-slate-500">
                                                    Duration
                                                </th>
                                                <th
                                                    class="px-4 py-3 font-bold text-center uppercase align-middle text-xxs tracking-none whitespace-nowrap text-slate-500">
                                                    Threshold
                                                </th>
                                                <th
                                                    class="px-4 py-3 font-bold text-center uppercase align-middle text-xxs tracking-none whitespace-nowrap text-slate-500">
                                                    Overage
                                                </th>
                                                <th
                                                    class="px-4 py-3 font-bold text-center uppercase align-middle text-xxs tracking-none whitespace-nowrap text-slate-500">
                                                    Trace
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, idx) in items" :key="idx"
                                                class="transition-all hover:bg-red-50"
                                                :style="{ borderLeft: `4px solid ${getSeverityColor(item)}` }">
                                                <td class="p-3 align-middle bg-transparent border-b">
                                                    <code
                                                        class="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-200 text-slate-800"
                                                        style="font-family: monospace;">
                                                        {{ item.message }}
                                                    </code>
                                                </td>
                                                <td class="p-3 text-center align-middle bg-transparent border-b">
                                                    <span
                                                        class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-red-600 bg-red-500/13 rounded-lg">
                                                        {{ item.duration_ms }} ms
                                                    </span>
                                                </td>
                                                <td class="p-3 text-center align-middle bg-transparent border-b">
                                                    <span
                                                        class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-slate-700 bg-slate-300 rounded-lg"
                                                        style="font-family: monospace;">
                                                        {{ item.limit }} ms
                                                    </span>
                                                </td>
                                                <td class="p-3 text-center align-middle bg-transparent border-b">
                                                    <div class="flex items-center justify-center gap-2">
                                                        <span class="text-xs font-bold text-red-600">
                                                            +{{ getOveragePercent(item) }}%
                                                        </span>
                                                        <span v-if="getOveragePercent(item) > 100">🔥</span>
                                                        <span v-else-if="getOveragePercent(item) > 50">⚠️</span>
                                                        <span v-else>⚡</span>
                                                    </div>
                                                </td>
                                                <td
                                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                                    <router-link v-if="item.correlation_id" :to="{
                                                        name: 'Trace',
                                                        query: {
                                                            correlation_id: item.correlation_id,
                                                            highlight: item.message
                                                        }
                                                    }" class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-blue-500 uppercase align-middle transition-all ease-in bg-blue-500/13 border-0 rounded-lg shadow-none cursor-pointer leading-normal hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                                        <i class="fas fa-search mr-1"></i>
                                                        View
                                                    </router-link>
                                                    <span v-else class="text-xs text-slate-400">N/A</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else
                class="relative flex flex-col min-w-0 break-words bg-white border-0 border-dashed shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-6xl text-emerald-500"></i>
                    </div>
                    <h5 class="mb-2 font-bold text-emerald-600">✅ All Clear!</h5>
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        No application violations detected. All apps are performing within their thresholds.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getViolationsByApp } from "../services/api";

export default {
    setup() {
        const violations = ref([]);
        const loading = ref(true);
        const expandedApps = ref({});

        // Group violations by app name
        const groupedViolations = computed(() => {
            const groups = {};
            violations.value.forEach(item => {
                if (!groups[item.app]) {
                    groups[item.app] = [];
                }
                groups[item.app].push(item);
            });
            return groups;
        });

        const totalViolations = computed(() => violations.value.length);

        const allExpanded = computed(() => {
            const appNames = Object.keys(groupedViolations.value);
            return appNames.length > 0 && appNames.every(app => expandedApps.value[app]);
        });

        const toggleApp = (appName) => {
            expandedApps.value[appName] = !expandedApps.value[appName];
        };

        const toggleAll = () => {
            const shouldExpand = !allExpanded.value;
            Object.keys(groupedViolations.value).forEach(app => {
                expandedApps.value[app] = shouldExpand;
            });
        };

        const getSeverityColor = (item) => {
            const overagePercent = ((item.duration_ms - item.limit) / item.limit) * 100;
            if (overagePercent > 100) return '#dc2626'; // Red - Critical
            if (overagePercent > 50) return '#ea580c'; // Orange - High
            return '#f59e0b'; // Yellow - Medium
        };

        const getMaxSeverityColor = (items) => {
            let maxOverage = 0;
            items.forEach(item => {
                const overage = ((item.duration_ms - item.limit) / item.limit) * 100;
                if (overage > maxOverage) maxOverage = overage;
            });

            if (maxOverage > 100) return '#dc2626';
            if (maxOverage > 50) return '#ea580c';
            return '#f59e0b';
        };

        const getMaxOverage = (items) => {
            let maxOverage = 0;
            items.forEach(item => {
                const overage = ((item.duration_ms - item.limit) / item.limit) * 100;
                if (overage > maxOverage) maxOverage = overage;
            });
            return maxOverage.toFixed(1);
        };

        const getOveragePercent = (item) => {
            const percent = ((item.duration_ms - item.limit) / item.limit * 100);
            return percent.toFixed(1);
        };

        const getSummaryText = (items) => {
            const uniqueMessages = [...new Set(items.map(i => i.message))];
            if (uniqueMessages.length === 1) {
                return uniqueMessages[0];
            }
            return `${uniqueMessages.length} different message types`;
        };

        const fetchViolations = async () => {
            try {
                const res = await getViolationsByApp();
                violations.value = Array.isArray(res) ? res : res.data || [];
            } catch (e) {
                console.error('Error loading violations:', e);
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchViolations);

        return {
            violations,
            loading,
            groupedViolations,
            totalViolations,
            expandedApps,
            allExpanded,
            toggleApp,
            toggleAll,
            getSeverityColor,
            getMaxSeverityColor,
            getMaxOverage,
            getOveragePercent,
            getSummaryText
        };
    },
};
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>