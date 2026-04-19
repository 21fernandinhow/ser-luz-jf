<template>
  <div class="flex-1 bg-surface-muted flex items-center justify-center p-4 py-16">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-semibold text-brand-blue">Entrar</h1>
      </div>

      <form novalidate @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="label-base">
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
            class="input-base border-gray-300"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="label-base">
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
            class="input-base border-gray-300"
          />
        </div>

        <div
          v-if="errorMsg"
          class="mb-4 error-banner"
        >
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary"
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
definePageMeta({ layout: 'default' })

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
