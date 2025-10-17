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

                    <h6 class="mb-2 font-bold text-slate-700">Message Rules</h6>
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        Set maximum duration thresholds for specific app messages
                    </p>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="w-full max-w-full px-3 mb-6">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <h6 class="mb-0 font-bold text-slate-700">
                        {{ form.id ? '✏️ Edit Rule' : '➕ Create New Rule' }}
                    </h6>
                </div>

                <div class="flex-auto p-6">
                    <form @submit.prevent="save">
                        <div class="flex flex-wrap -mx-3 mb-4">
                            <div class="w-full max-w-full px-3 mb-4 md:w-4/12 md:flex-0">
                                <label class="inline-block mb-2 ml-1 text-xs font-bold text-slate-700">
                                    App Name <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input v-model="form.app_name" type="text" @input="handleAppNameInput"
                                        @focus="showSuggestions = true" @blur="hideSuggestionsDelayed"
                                        placeholder="e.g. core, vendor, transaction, merchant" required
                                        class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-500 focus:outline-none" />

                                    <!-- Autocomplete Suggestions -->
                                    <div v-if="showSuggestions && filteredAppNames.length > 0"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        <div v-for="(appName, idx) in filteredAppNames" :key="idx"
                                            @mousedown="selectAppName(appName)"
                                            class="px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors text-sm text-slate-700 flex items-center gap-2">
                                            <i class="fas fa-mobile-alt text-blue-500 text-xs"></i>
                                            <span class="font-medium">{{ appName }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full max-w-full px-3 mb-4 md:w-4/12 md:flex-0">
                                <label class="inline-block mb-2 ml-1 text-xs font-bold text-slate-700">
                                    Message Key <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.message_key" type="text"
                                    placeholder="e.g. INQUIRY_ACCEPTANCE_SUCCESS" required
                                    class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-500 focus:outline-none" />
                            </div>

                            <div class="w-full max-w-full px-3 mb-4 md:w-4/12 md:flex-0">
                                <label class="inline-block mb-2 ml-1 text-xs font-bold text-slate-700">
                                    Max Duration (ms) <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.max_duration" type="number" placeholder="e.g. 50" required
                                    min="1"
                                    class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-500 focus:outline-none" />
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button type="submit"
                                class="inline-block px-6 py-3 mb-0 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer leading-normal tracking-tight-rem bg-gradient-to-tl from-blue-500 to-violet-500 hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                <i :class="form.id ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
                                {{ form.id ? 'Update Rule' : 'Create Rule' }}
                            </button>

                            <button type="button" @click="resetForm"
                                class="inline-block px-6 py-3 mb-0 text-xs font-bold text-center uppercase align-middle transition-all ease-in bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-normal text-slate-700 border-slate-700 hover:bg-slate-700 hover:text-white hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                <i class="fas fa-redo mr-2"></i>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Rules Table -->
        <div class="w-full max-w-full px-3">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                    <div class="flex items-center justify-between">
                        <h6 class="mb-0 font-bold text-slate-700">📋 Rules List</h6>
                        <span
                            class="inline-block px-2 py-1 text-xs font-bold leading-normal text-center text-blue-500 align-middle transition-all ease-in bg-blue-500/13 rounded-1.8">
                            {{ rules.length }} {{ rules.length === 1 ? 'rule' : 'rules' }}
                        </span>
                    </div>
                </div>

                <div class="flex-auto p-0 overflow-x-auto" v-if="rules.length">
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
                                    class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Max Duration
                                </th>
                                <th
                                    class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(r, idx) in rules" :key="r.id" class="transition-all hover:bg-gray-50">
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div class="flex items-center px-2 py-1">
                                        <span class="mr-2 text-lg"></span>
                                        <p class="mb-0 text-sm font-semibold leading-tight text-slate-700">
                                            {{ r.app_name }}
                                        </p>
                                    </div>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <code class="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-200 text-slate-800"
                                        style="font-family: monospace;">
                                        {{ r.message_key }}
                                    </code>
                                </td>
                                <td
                                    class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span
                                        class="inline-block px-3 py-1.5 text-xs font-bold leading-normal text-center align-middle transition-all ease-in rounded-lg text-yellow-700 bg-yellow-500/30"
                                        style="font-family: monospace;">
                                        ⏱️ {{ r.max_duration }} ms
                                    </span>
                                </td>
                                <td
                                    class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div class="inline-flex gap-2">
                                        <button @click="edit(r)"
                                            class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-blue-500 uppercase align-middle transition-all ease-in bg-blue-500/13 border-0 rounded-lg shadow-none cursor-pointer leading-normal hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                            <i class="fas fa-edit mr-1"></i>
                                            Edit
                                        </button>
                                        <button @click="remove(r.id)"
                                            class="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-red-500 uppercase align-middle transition-all ease-in bg-red-500/13 border-0 rounded-lg shadow-none cursor-pointer leading-normal hover:shadow-xs hover:-translate-y-px active:opacity-85">
                                            <i class="fas fa-trash mr-1"></i>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div v-else class="p-6 text-center">
                    <div class="mb-4">
                        <i class="fas fa-clipboard-list text-6xl text-slate-300"></i>
                    </div>
                    <h5 class="mb-2 font-bold text-slate-700">No Message Rules Yet</h5>
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        Create your first rule using the form above
                    </p>
                </div>

                <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center"
                    v-if="rules.length">
                    <p class="mb-0 text-sm leading-normal text-slate-400">
                        Showing {{ rules.length }} rule{{ rules.length !== 1 ? 's' : '' }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getMessageRules, createMessageRule, updateMessageRule, deleteMessageRule, getAppRules } from '../services/api'

export default {
    setup() {
        const rules = ref([])
        const appNames = ref([])
        const form = ref({ id: null, app_name: '', message_key: '', max_duration: 50 })
        const showSuggestions = ref(false)

        // Computed property untuk filter app names berdasarkan input
        const filteredAppNames = computed(() => {
            if (!form.value.app_name) {
                return appNames.value
            }
            const searchTerm = form.value.app_name.toLowerCase()
            return appNames.value.filter(name =>
                name.toLowerCase().includes(searchTerm)
            )
        })

        const loadAppNames = async () => {
            try {
                const res = await getAppRules()
                // Extract unique app names from app rules
                if (res && res.data) {
                    const uniqueNames = [...new Set(res.data.map(rule => rule.app_name))]
                    appNames.value = uniqueNames.filter(name => name) // Remove null/undefined
                }
            } catch (e) {
                console.error('Error loading app names:', e)
            }
        }

        const load = async () => {
            try {
                const res = await getMessageRules()
                rules.value = res?.data || []
            } catch (e) {
                console.error('Error loading message rules:', e)
            }
        }

        const handleAppNameInput = () => {
            showSuggestions.value = true
        }

        const selectAppName = (appName) => {
            form.value.app_name = appName
            showSuggestions.value = false
        }

        const hideSuggestionsDelayed = () => {
            // Delay untuk memberikan waktu click event pada suggestion
            setTimeout(() => {
                showSuggestions.value = false
            }, 200)
        }

        const save = async () => {
            try {
                if (form.value.id) {
                    await updateMessageRule(form.value.id, {
                        app_name: form.value.app_name,
                        message_key: form.value.message_key,
                        max_duration: form.value.max_duration
                    })
                } else {
                    await createMessageRule({
                        app_name: form.value.app_name,
                        message_key: form.value.message_key,
                        max_duration: form.value.max_duration
                    })
                }
                await load()
                resetForm()
            } catch (e) {
                console.error('Error saving message rule:', e)
                alert('Failed to save rule. Please try again.')
            }
        }

        const edit = (r) => {
            form.value = {
                id: r.id,
                app_name: r.app_name,
                message_key: r.message_key,
                max_duration: r.max_duration
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const remove = async (id) => {
            if (!confirm('Are you sure you want to delete this rule?')) return
            try {
                await deleteMessageRule(id)
                await load()
            } catch (e) {
                console.error('Error deleting message rule:', e)
                alert('Failed to delete rule. Please try again.')
            }
        }

        const resetForm = () => {
            form.value = { id: null, app_name: '', message_key: '', max_duration: 50 }
        }

        onMounted(async () => {
            await loadAppNames()
            await load()
        })

        return {
            rules,
            appNames,
            filteredAppNames,
            form,
            showSuggestions,
            save,
            edit,
            remove,
            resetForm,
            handleAppNameInput,
            selectAppName,
            hideSuggestionsDelayed
        }
    }
}
</script>