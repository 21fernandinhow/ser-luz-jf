<template>
  <div class="min-h-screen flex flex-col bg-surface-muted">
    <header class="sticky top-0 z-30 bg-brand-blue shadow">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Logo + título -->
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

        <!-- Desktop nav -->
        <nav class="hidden sm:flex items-center gap-1">
          <NuxtLink
            to="/admin"
            class="px-3 py-1.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            :class="{ 'bg-white/20 !text-white': $route.path === '/admin' }"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/beneficiaries"
            class="px-3 py-1.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            active-class="bg-white/20 !text-white"
          >
            Beneficiários
          </NuxtLink>
          <NuxtLink
            to="/admin/volunteers"
            class="px-3 py-1.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            active-class="bg-white/20 !text-white"
          >
            Voluntários
          </NuxtLink>
        </nav>

        <div class="hidden sm:flex items-center">
          <button
            class="text-white/70 hover:text-white text-sm transition-colors"
            @click="handleSignOut"
          >
            Sair
          </button>
        </div>

        <!-- Mobile: hamburguer -->
        <button
          class="sm:hidden p-2 rounded-lg text-white hover:bg-white/10 transition"
          :aria-expanded="menuOpen"
          aria-label="Abrir menu"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile dropdown -->
      <div v-if="menuOpen" class="sm:hidden bg-brand-blue border-t border-white/10 px-4 py-3 flex flex-col gap-1">
        <NuxtLink
          to="/admin"
          class="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          :class="{ 'bg-white/20 !text-white': $route.path === '/admin' }"
          @click="menuOpen = false"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/beneficiaries"
          class="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          active-class="bg-white/20 !text-white"
          @click="menuOpen = false"
        >
          Beneficiários
        </NuxtLink>
        <NuxtLink
          to="/admin/volunteers"
          class="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          active-class="bg-white/20 !text-white"
          @click="menuOpen = false"
        >
          Voluntários
        </NuxtLink>
        <button
          class="mt-1 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors text-left"
          @click="handleSignOut"
        >
          Sair
        </button>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <slot />
    </main>
    <footer class="bg-white border-t border-gray-100 text-gray-400 text-center text-xs py-6 shrink-0">
      © {{ new Date().getFullYear() }} Projeto Ser Luz · Todos os direitos reservados
    </footer>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
const logoError = ref(false)
const menuOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => { menuOpen.value = false })

async function handleSignOut() {
  menuOpen.value = false
  await supabase.auth.signOut()
  router.push('/login')
}
</script>
