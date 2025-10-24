<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl border-0 animate-scale-in relative overflow-hidden">
            <!-- Header -->
            <div class="relative flex items-center justify-between px-6 py-6 border-b border-black/12.5">
                <div class="flex items-center gap-4">
                    <div class="inline-flex items-center justify-center w-12 h-12 text-white rounded-xl logo-reset-password mr-4">
                        <i class="fas fa-key text-lg"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-xl text-slate-800">Reset Password</h4>
                        <p class="mb-0 text-sm text-slate-600">Enter your email to receive reset link</p>
                    </div>
                </div>
                <button 
                    @click="$emit('close')" 
                    class="flex-shrink-0 ml-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" role="form" class="flex-auto p-6">
                <!-- Email Field -->
                <div class="mb-4">
                    <input 
                        id="reset-email"
                        v-model="form.email" 
                        type="email" 
                        required
                        placeholder="Email"
                        class="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        :class="{ 'border-red-500 focus:border-red-500': errors.email }"
                    />
                    <p v-if="errors.email" class="mt-1.5 text-xs text-red-600">
                        {{ errors.email }}
                    </p>
                </div>

                <!-- Success Message -->
                <div v-if="success" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 animate-fade-in">
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-emerald-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-emerald-800">Email sent successfully!</p>
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
                        class="inline-block w-full px-4 md:px-16 py-3.5 mt-6 mb-0 font-bold leading-normal text-center text-white align-middle transition-all bg-blue-500 border-0 rounded-lg cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs text-sm ease-in tracking-tight-rem shadow-md bg-150 bg-x-25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span v-if="loading" class="flex items-center justify-center">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            Sending...
                        </span>
                        <span v-else class="flex items-center justify-center">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Send reset link
                        </span>
                    </button>
                </div>
            </form>

            <!-- Footer -->
            <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                <p class="mx-auto mb-6 leading-normal text-sm">Check your email for the password reset link</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { forgotPassword } from '../services/api'

const emit = defineEmits(['close', 'success'])

// Form data
const form = ref({
    email: ''
})

// Form state
const loading = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')
const errors = ref({})

// Handle submit
const handleSubmit = async () => {
    // Reset states
    error.value = ''
    success.value = false
    errors.value = {}

    // Validate form
    if (!form.value.email.trim()) {
        errors.value.email = 'Email address is required'
        return
    }

    loading.value = true

    try {
        const response = await forgotPassword(form.value.email.trim())

        if (response.success) {
            success.value = true
            successMessage.value = response.message || 'Password reset link has been sent to your email'
            
            // Emit success with token after a delay
            setTimeout(() => {
                emit('success', response.data?.token)
            }, 2000)
        } else {
            error.value = response.message || 'Failed to send reset link. Please try again.'
        }
    } catch (err) {
        console.error('Forgot password error:', err)
        
        if (err.response?.data?.message) {
            error.value = err.response.data.message
        } else {
            error.value = 'An error occurred. Please try again later.'
        }
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Smooth transitions */
.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}

/* Modal entrance animation */
@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-scale-in {
    animation: scale-in 0.2s ease-out;
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

/* Enhanced animations */
@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-4px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Glow effect for focus states */
@keyframes glow {
    0%, 100% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
    }
    50% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
    }
}

.animate-glow {
    animation: glow 2s ease-in-out infinite;
}

/* Enhanced scale animation */
@keyframes scale-in-bounce {
    0% {
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05) translateY(-5px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-scale-in {
    animation: scale-in-bounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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

.logo-reset-password:disabled {
    color: #fff !important;
    background-color: #e1e3f4 !important;
    transition: all 0.2s ease;
}
</style>