<template>
  <div class="min-h-screen flex flex-col bg-surface-muted">
    <header class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <img
            v-if="!logoError"
            src="/logo.webp"
            alt="Projeto Ser Luz"
            class="h-12 w-auto"
            @error="logoError = true"
          />
          <span v-else class="text-lg font-bold text-brand-blue">Ser Luz</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 hidden sm:block">Meu Painel</span>
          <button
            class="text-sm text-gray-600 hover:text-brand-blue transition-colors"
            @click="handleSignOut"
          >
            Sair
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const logoError = ref(false)

async function handleSignOut() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>
