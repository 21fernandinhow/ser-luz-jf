<template>
  <div class="min-h-screen flex flex-col bg-surface-muted">
    <header class="sticky top-0 z-30 bg-brand-blue shadow">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img
              v-if="!logoError"
              src="/logo.webp"
              alt="Projeto Ser Luz"
              class="h-10 w-auto"
              @error="logoError = true"
            />
            <span v-else class="text-white font-bold text-lg">Ser Luz</span>
          </NuxtLink>
          <span class="text-white/40 hidden sm:block">|</span>
          <span class="text-white/80 text-sm font-medium hidden sm:block">Administração</span>
        </div>

        <nav class="flex items-center gap-1 overflow-x-auto">
          <NuxtLink
            to="/admin"
            class="px-3 py-1.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            :class="{ 'bg-white/20 !text-white': $route.path === '/admin' }"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/beneficiaries"
            class="px-3 py-1.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            active-class="bg-white/20 !text-white"
          >
            Beneficiários
          </NuxtLink>
          <NuxtLink
            to="/admin/volunteers"
            class="px-3 py-1.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            active-class="bg-white/20 !text-white"
          >
            Voluntários
          </NuxtLink>
        </nav>

        <button
          class="text-white/70 hover:text-white text-sm transition-colors shrink-0"
          @click="handleSignOut"
        >
          Sair
        </button>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
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
