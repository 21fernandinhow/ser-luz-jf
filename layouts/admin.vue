<template>
  <div class="min-h-screen flex flex-col bg-surface-muted">
    <header class="sticky top-0 z-30 bg-brand-blue">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Logo + título -->
        <div class="flex items-center gap-3 shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2 transition-transform duration-200 hover:scale-110">
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

        <div class="hidden sm:flex items-center gap-3">
          <a
            href="https://www.instagram.com/_projetoserluz"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white/70 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
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
        <a
          href="https://www.instagram.com/_projetoserluz"
          target="_blank"
          rel="noopener noreferrer"
          class="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Instagram
        </a>
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
    <footer class="bg-brand-blue text-blue-200 text-center text-xs py-6 shrink-0">
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
