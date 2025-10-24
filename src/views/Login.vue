<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12"
  >
    <div class="w-full max-w-6xl">
      <div class="flex flex-wrap justify-center -mx-3">
        <!-- Login Form Column -->
        <div
          class="flex flex-col w-full max-w-full px-3 mx-auto lg:mx-0 shrink-0 md:flex-0 md:w-1/2 lg:w-1/2 xl:w-1/2"
        >
          <div
            class="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none lg:py4 dark:bg-gray-950 rounded-2xl bg-clip-border"
          >
            <div class="p-6 pb-0 mb-0">
              <div class="text-center mb-6">
                <div
                  class="inline-flex items-center justify-center w-16 h-16 logo-login mb-4"
                >
                  <i class="fas fa-shield-alt text-2xl"></i>
                </div>
                <h4 class="font-bold text-2xl text-slate-800">Sign In</h4>
                <p class="mb-0 text-slate-600">
                  Enter your email and password to sign in
                </p>
              </div>
            </div>
            <div class="flex-auto p-6">
              <!-- Login Form -->
              <form @submit.prevent="handleLogin" role="form">
                <!-- Email Field -->
                <div class="mb-4">
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Email"
                    class="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    :class="{
                      'border-red-500 focus:border-red-500': errors.email,
                    }"
                  />
                  <p v-if="errors.email" class="mt-1.5 text-xs text-red-600">
                    {{ errors.email }}
                  </p>
                </div>

                <!-- Password Field -->
                <div class="mb-4">
                  <div class="relative">
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      placeholder="Password"
                      class="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none pr-10"
                      :class="{
                        'border-red-500 focus:border-red-500': errors.password,
                      }"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i
                        :class="
                          showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                        class="text-sm"
                      ></i>
                    </button>
                  </div>
                  <p v-if="errors.password" class="mt-1.5 text-xs text-red-600">
                    {{ errors.password }}
                  </p>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center pl-12 mb-0.5 text-left min-h-6">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    v-model="rememberMe"
                    class="mt-0.5 rounded-10 duration-250 ease-in-out after:rounded-circle after:shadow-2xl after:duration-250 checked:after:translate-x-5.3 h-5 relative float-left -ml-12 w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-zinc-700/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                  />
                  <label
                    class="ml-2 font-normal cursor-pointer select-none text-sm text-slate-700"
                    for="rememberMe"
                    >Remember me</label
                  >
                </div>

                <!-- Forgot Password -->
                <div class="text-center mb-4">
                  <button
                    type="button"
                    @click="showForgotPassword = true"
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>

                <!-- Error Message -->
                <div
                  v-if="loginError"
                  class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
                >
                  <div class="flex items-start">
                    <i
                      class="fas fa-exclamation-circle text-red-500 mr-2 mt-0.5 flex-shrink-0"
                    ></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-red-800">
                        Login Failed
                      </p>
                      <p class="text-xs text-red-600 mt-0.5 break-words">
                        {{ loginError }}
                      </p>
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
                    <span
                      v-if="loading"
                      class="flex items-center justify-center"
                    >
                      <i class="fas fa-spinner fa-spin mr-2"></i>
                      Signing in...
                    </span>
                    <span v-else>Sign in</span>
                  </button>
                </div>
              </form>
            </div>
            <!-- <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                            <p class="mx-auto mb-6 leading-normal text-sm">Don't have an account? <a href="#" class="font-semibold text-transparent bg-clip-text bg-gradient-to-tl from-blue-500 to-violet-500">Sign up</a></p>
                        </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal
      v-if="showForgotPassword"
      @close="showForgotPassword = false"
      @success="handleForgotPasswordSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { login } from "../services/api";
import ForgotPasswordModal from "../components/ForgotPasswordModal.vue";

const router = useRouter();
const { setAuthData } = useAuth();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const showPassword = ref(false);
const loginError = ref("");
const errors = ref({});
const showForgotPassword = ref(false);
const rememberMe = ref(false);

const handleLogin = async () => {
  errors.value = {};
  loginError.value = "";
  
  if (!form.value.email) {
    errors.value.email = "Email is required";
    return;
  }
  if (!form.value.password) {
    errors.value.password = "Password is required";
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = "Please enter a valid email address";
    return;
  }

  loading.value = true;

  try {
    const response = await login(form.value);

    if (response.success) {
      const { user, tokens } = response.data;

      // ✅ Set auth data (ini akan save ke localStorage)
      setAuthData({ user, tokens });
      
      console.log("✅ Login successful");
      console.log("👤 User:", user.name);
      console.log("🔑 Permissions:", user.permissions?.length || 0);
      
      // Save remember me
      if (rememberMe.value) {
        localStorage.setItem("remember_email", form.value.email);
      } else {
        localStorage.removeItem("remember_email");
      }

      // Redirect
      await router.push("/");
    } else {
      loginError.value = response.message || "Login failed. Please check your credentials.";
    }
  } catch (error) {
    console.error("❌ Login failed:", error);
    
    if (error.response?.data?.message) {
      loginError.value = error.response.data.message;
    } else if (error.response?.status === 401) {
      loginError.value = "Invalid email or password";
    } else if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        errors.value = validationErrors;
      } else {
        loginError.value = error.response.data.message || "Validation failed";
      }
    } else if (error.code === 'ECONNABORTED') {
      loginError.value = "Request timeout. Please try again.";
    } else if (!navigator.onLine) {
      loginError.value = "No internet connection. Please check your network.";
    } else {
      loginError.value = "Login failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

const handleForgotPasswordSuccess = (token) => {
  showForgotPassword.value = false;
  router.push(`/reset-password?token=${token}`);
};

const rememberedEmail = localStorage.getItem("remember_email");
if (rememberedEmail) {
  form.value.email = rememberedEmail;
  rememberMe.value = true;
}
</script>

<!-- Template tetap sama -->

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

/* Mobile touch optimization */
@media (max-width: 640px) {
  input,
  button {
    -webkit-tap-highlight-color: transparent;
  }
}

/* Better text overflow handling on mobile */
@media (max-width: 640px) {
  .break-words {
    word-break: break-word;
    overflow-wrap: break-word;
  }
}

.logo-login {
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

.logo-login:hover {
  color: #4e60d4 !important;
  background-color: #e1e3f4 !important;
  transition: all 0.2s ease;
}

.logo-login:active {
  color: #3e4d94 !important;
  background-color: #e1e3f4 !important;
  transition: all 0.2s ease;
}

.logo-login:focus {
  color: #5e72e4 !important;
  background-color: #e1e3f4 !important;
  transition: all 0.2s ease;
}

.logo-login:disabled {
  color: #9fa8da !important;
  background-color: #e1e3f4 !important;
  transition: all 0.2s ease;
}
</style>
