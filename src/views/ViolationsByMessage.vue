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

                    <h6 class="mb-2 font-bold text-slate-700">Message Violations</h6>
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        Specific messages that exceeded their maximum duration threshold
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
                                        Total Message Violations</p>
                                    <h5 class="mb-0 font-bold text-red-600">
                                        {{ violations.length }}
                                    </h5>
                                    <p class="mb-0 text-xs text-slate-500 mt-1">
                                        Across {{ uniqueAppsCount }} app{{ uniqueAppsCount !== 1 ? 's' : '' }}
                                    </p>
                                </div>
                            </div>
                            <div class="px-3 text-right basis-1/3">
                                <div
                                    class="inline-flex items-center justify-center w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-red-600 to-orange-600">
                                    <i class="fas fa-comment-dots text-lg text-white"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Violations Table -->
            <div v-if="violations.length"
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <div class="flex items-center justify-between">
                        <h6 class="mb-0 font-bold text-slate-700">⚠️ Violation Details</h6>
                        <span
                            class="inline-block px-2 py-1 text-xs font-bold leading-normal text-center text-red-500 align-middle transition-all ease-in bg-red-500/13 rounded-1.8">
                            {{ violations.length }} issue{{ violations.length !== 1 ? 's' : '' }}
                        </span>
                    </div>
                </div>

                <div class="flex-auto p-0 overflow-x-auto">
                    <table class="items-center w-full mb-0 align-top border-collapse text-slate-500">
                        <thead class="align-bottom">
                            <tr>
                                <th
                                    class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    App Name
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Message Key
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Duration
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Threshold
                                </th>
                                <th
                                    class="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Overage
                                </th>
                                <th
                                    class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in violations" :key="item.id || idx" class="transition-all"
                                :class="getSeverityBackgroundClass(item)"
                                :style="{ borderLeft: `4px solid ${getSeverityColor(item)}` }">
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div class="flex items-center px-2 py-1">
                                        <span class="mr-2 text-lg">📱</span>
                                        <p class="mb-0 text-sm font-semibold leading-tight text-slate-700">
                                            {{ item.app }}
                                        </p>
                                    </div>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <code class="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-200 text-slate-800"
                                        style="font-family: monospace;">
                                        {{ item.message }}
                                    </code>
                                </td>
                                <td
                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div class="flex items-center justify-center gap-2">
                                        <span
                                            class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center align-middle transition-all ease-in rounded-lg text-red-600 bg-red-500/13">
                                            {{ item.duration_ms }} ms
                                        </span>
                                        <span>{{ getSeverityIcon(item) }}</span>
                                    </div>
                                </td>
                                <td
                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span
                                        class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center align-middle transition-all ease-in rounded-lg text-slate-700 bg-slate-500/30"
                                        style="font-family: monospace;">
                                        {{ item.limit }} ms
                                    </span>
                                </td>
                                <td
                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div class="flex items-center justify-center gap-1">
                                        <span class="text-xs font-bold text-red-600">
                                            +{{ getOveragePercent(item) }}%
                                        </span>
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
                                    }"
                                        class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-blue-500 uppercase align-middle transition-all ease-in bg-blue-500/13 border-0 rounded-lg shadow-none cursor-pointer leading-normal hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                        <i class="fas fa-search mr-1"></i>
                                        View
                                    </router-link>
                                    <span v-else class="text-xs text-slate-400">N/A</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center">
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        Showing {{ violations.length }} violation{{ violations.length !== 1 ? 's' : '' }}
                    </p>
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
                        No message violations detected. All messages are performing within their thresholds.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getViolationsByMessage } from "../services/api";

export default {
    setup() {
        const violations = ref([]);
        const loading = ref(true);

        const uniqueAppsCount = computed(() => {
            return [...new Set(violations.value.map(v => v.app))].length;
        });

        const getSeverityColor = (item) => {
            const overagePercent = ((item.duration_ms - item.limit) / item.limit) * 100;
            if (overagePercent > 100) return '#dc2626';
            if (overagePercent > 50) return '#ea580c';
            return '#f59e0b';
        };

        const getSeverityBackgroundClass = (item) => {
            const overagePercent = ((item.duration_ms - item.limit) / item.limit) * 100;
            if (overagePercent > 100) return 'hover:bg-red-50';
            if (overagePercent > 50) return 'hover:bg-orange-50';
            return 'hover:bg-yellow-50';
        };

        const getSeverityIcon = (item) => {
            const overagePercent = ((item.duration_ms - item.limit) / item.limit) * 100;
            if (overagePercent > 100) return '🔥';
            if (overagePercent > 50) return '⚠️';
            return '⚡';
        };

        const getOveragePercent = (item) => {
            const percent = ((item.duration_ms - item.limit) / item.limit * 100);
            return percent.toFixed(1);
        };

        const fetchViolations = async () => {
            try {
                const res = await getViolationsByMessage();
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
            uniqueAppsCount,
            getSeverityColor,
            getSeverityBackgroundClass,
            getSeverityIcon,
            getOveragePercent
        };
    },
};
</script>