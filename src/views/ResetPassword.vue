<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
        <div class="w-full max-w-6xl">
            <div class="flex flex-wrap justify-center -mx-3">
                <!-- Reset Password Form Column -->
                <div class="flex flex-col w-full max-w-full px-3 mx-auto lg:mx-0 shrink-0 md:flex-0 md:w-1/2 lg:w-1/2 xl:w-1/2">
                    <div class="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none lg:py4 dark:bg-gray-950 rounded-2xl bg-clip-border">
                        <div class="p-6 pb-0 mb-0">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 logo-reset-password mb-4">
                                    <i class="fas fa-shield-alt text-2xl"></i>
                                </div>
                                <h4 class="font-bold text-2xl text-slate-800">Reset Password</h4>
                                <p class="mb-0 text-slate-600">Create a new password for your account</p>
                            </div>
                        </div>
                        <div class="flex-auto p-6">
                            <form @submit.prevent="handleSubmit" role="form">
                                <!-- New Password Field -->
                                <div class="mb-4">
                                    <div class="relative">
                                        <input 
                                            id="new-password"
                                            v-model="form.password" 
                                            :type="showPassword ? 'text' : 'password'" 
                                            required
                                            placeholder="New Password"
                                            class="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none pr-10"
                                            :class="{ 'border-red-500 focus:border-red-500': errors.password }"
                                        />
                                        <button 
                                            type="button" 
                                            @click="showPassword = !showPassword"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
                                        </button>
                                    </div>
                                    <p v-if="errors.password" class="mt-1 text-xs text-red-600">
                                        {{ errors.password }}
                                    </p>
                                    <p v-else class="mt-1 text-xs text-slate-500">
                                        Must be at least 8 characters
                                    </p>
                                </div>

                                <!-- Confirm Password Field -->
                                <div class="mb-4">
                                    <div class="relative">
                                        <input 
                                            id="confirm-password"
                                            v-model="form.password_confirmation" 
                                            :type="showConfirmPassword ? 'text' : 'password'" 
                                            required
                                            placeholder="Confirm Password"
                                            class="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none pr-10"
                                            :class="{ 'border-red-500 focus:border-red-500': errors.password_confirmation }"
                                        />
                                        <button 
                                            type="button" 
                                            @click="showConfirmPassword = !showConfirmPassword"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
                                        </button>
                                    </div>
                                    <p v-if="errors.password_confirmation" class="mt-1.5 text-xs text-red-600">
                                        {{ errors.password_confirmation }}
                                    </p>
                                </div>

                                <!-- Success Message -->
                                <div v-if="success" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 animate-fade-in">
                                    <div class="flex items-start">
                                        <i class="fas fa-check-circle text-emerald-500 mr-2 mt-0.5 flex-shrink-0"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-emerald-800">Password reset successful!</p>
                                            <p class="text-xs text-emerald-600 mt-0.5">{{ successMessage }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Error Message -->
                                <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-fade-in">
                                    <div class="flex items-start">
                                        <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-red-800">Reset failed</p>
                                            <p class="text-xs text-red-600 mt-0.5 break-words">{{ error }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <div class="text-center">
                                    <button 
                                        type="submit" 
                                        :disabled="loading"
                                        class="inline-block w-full px-16 py-3.5 mt-6 mb-0 font-bold leading-normal text-center text-white align-middle transition-all bg-blue-500 border-0 rounded-lg cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs text-sm ease-in tracking-tight-rem shadow-md bg-150 bg-x-25 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span v-if="loading" class="flex items-center justify-center">
                                            <i class="fas fa-spinner fa-spin mr-2"></i>
                                            Resetting password...
                                        </span>
                                        <span v-else class="flex items-center justify-center">
                                            <i class="fas fa-check mr-2"></i>
                                            Reset password
                                        </span>
                                    </button>
                                </div>

                                <!-- Back to Login -->
                                <div class="text-center mt-4">
                                    <button 
                                        type="button"
                                        @click="goToLogin"
                                        class="inline-block w-full px-16 py-3.5 font-bold leading-normal text-center text-slate-700 align-middle transition-all bg-white border border-slate-300 rounded-lg cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs text-sm ease-in tracking-tight-rem shadow-md hover:bg-slate-50"
                                    >
                                        <i class="fas fa-arrow-left mr-2"></i>
                                        Back to sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                            <p class="mx-auto mb-6 leading-normal text-sm">Password must be at least 8 characters with a mix of letters and numbers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '../services/api'

const route = useRoute()
const router = useRouter()

// Form data
const form = ref({
    password: '',
    password_confirmation: ''
})

// Form state
const loading = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')
const errors = ref({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Get token from URL
const token = ref('')

onMounted(() => {
    token.value = route.query.token
    if (!token.value) {
        error.value = 'Invalid or expired reset link'
        setTimeout(() => {
            router.push('/login')
        }, 2000)
    }
})

// Handle submit
const handleSubmit = async () => {
    // Reset states
    error.value = ''
    success.value = false
    errors.value = {}

    // Validate form
    if (!form.value.password.trim()) {
        errors.value.password = 'Password is required'
        return
    }
    if (form.value.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters'
        return
    }
    if (!form.value.password_confirmation.trim()) {
        errors.value.password_confirmation = 'Password confirmation is required'
        return
    }
    if (form.value.password !== form.value.password_confirmation) {
        errors.value.password_confirmation = 'Passwords do not match'
        return
    }

    loading.value = true

    try {
        const response = await resetPassword(
            token.value,
            form.value.password,
            form.value.password_confirmation
        )

        if (response.success) {
            success.value = true
            successMessage.value = response.message || 'Redirecting to login...'
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } else {
            error.value = response.message || 'Failed to reset password. Please try again.'
        }
    } catch (err) {
        console.error('Reset password error:', err)
        
        if (err.response?.data?.message) {
            error.value = err.response.data.message
        } else if (err.response?.status === 400) {
            error.value = 'Invalid or expired reset link'
        } else {
            error.value = 'An error occurred. Please try again later.'
        }
    } finally {
        loading.value = false
    }
}

// Go to login
const goToLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
/* Remove autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
    -webkit-text-fill-color: #0f172a;
    transition: background-color 5000s ease-in-out 0s;
}

/* Smooth transitions */
input,
button {
    transition: all 0.2s ease;
}

/* Fade in animation for messages */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

/* Better text overflow handling */
.break-words {
    word-break: break-word;
    overflow-wrap: break-word;
}

/* Mobile touch optimization */
@media (max-width: 640px) {
    input,
    button {
        -webkit-tap-highlight-color: transparent;
    }
}



.logo-reset-password {
    color: #fff;
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 1rem;
    margin-top: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    transition: all 0.2s ease;
    background-color: #5e72e4 !important;
    border-radius: 0.5rem;
    padding: 0.5rem;
}

.logo-reset-password:hover {
    color: #4e60d4 !important;
    background-color: #e1e3f4 !important;
    transition: all 0.2s ease;
}

.logo-reset-password:active {
    color: #3e4d94 !important;
    background-color: #e1e3f4 !important;
    transition: all 0.2s ease;
}

.logo-reset-password:focus {
    color: #5e72e4 !important;
    background-color: #e1e3f4 !important;
    transition: all 0.2s ease;
}

.logo-reset-password:disabled {
    color: #9fa8da !important;
    background-color: #e1e3f4 !important;
    transition: all 0.2s ease;
}
</style>