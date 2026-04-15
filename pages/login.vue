<template>
  <div class="min-h-screen bg-surface-muted flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <!-- Navegação topo -->
      <div class="flex items-center justify-between mb-6">
        <NuxtLink
          to="/"
          class="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="text-sm font-medium text-brand-blue hover:underline"
        >
          Criar conta
        </NuxtLink>
      </div>

      <div class="mb-6 text-center">
        <NuxtLink to="/">
          <img
            src="/logo.webp"
            alt="Projeto Ser Luz"
            class="h-16 mx-auto"
          />
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-brand-blue mt-4">Entrar</h1>
      </div>

      <form novalidate @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="seu@email.com"
            :disabled="loading"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-60"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••"
            :disabled="loading"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-60"
          />
        </div>

        <div
          v-if="errorMsg"
          class="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Não tem conta?
        <NuxtLink to="/register" class="text-brand-blue underline hover:text-blue-800">
          Cadastre-se
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { redirectByRole } = useAuthRedirect()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  if (user.value) {
    await redirectByRole()
  }
})

async function handleLogin() {
  if (!form.email || !form.password) {
    errorMsg.value = 'Preencha o e-mail e a senha.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) throw error

    await redirectByRole()
  }
  catch {
    errorMsg.value = 'E-mail ou senha incorretos.'
  }
  finally {
    loading.value = false
  }
}
</script>
