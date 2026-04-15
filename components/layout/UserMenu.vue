<template>
  <div>
    <!-- Não autenticado -->
    <NuxtLink
      v-if="!user"
      to="/login"
      class="text-sm font-medium text-brand-blue hover:underline"
    >
      Entrar
    </NuxtLink>

    <!-- Autenticado -->
    <div v-else class="relative">
      <button
        :aria-expanded="menuOpen"
        aria-label="Menu do usuário"
        class="flex items-center text-gray-700 hover:text-brand-blue transition"
        @click="menuOpen = !menuOpen"
      >
        <!-- Ícone de usuário (heroicons outline) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </button>

      <!-- Overlay invisível para fechar ao clicar fora -->
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-30"
        @click="menuOpen = false"
      />

      <!-- Dropdown -->
      <div
        v-if="menuOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-40"
      >
        <NuxtLink
          :to="panelPath"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          @click="menuOpen = false"
        >
          Meu Painel
        </NuxtLink>
        <button
          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          @click="handleSignOut"
        >
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const menuOpen = ref(false)

const { data: profileResult, refresh } = useAsyncData(
  'user-profile-menu',
  async () => {
    if (!user.value) return null
    try {
      return await $fetch<{ data: { role: string } }>('/api/profiles/me')
    }
    catch {
      return null
    }
  },
  { server: false },
)

// Só atualiza quando o estado de login/logout muda, não em refreshes de token
watch(user, (newUser, oldUser) => {
  if (!!newUser !== !!oldUser) refresh()
})

const panelPath = computed(() => {
  const role = profileResult.value?.data?.role
  if (role === 'admin') return '/admin'
  if (role === 'beneficiary') return '/painel/beneficiary'
  if (role === 'volunteer') return '/painel/volunteer'
  return '/painel'
})

async function handleSignOut() {
  menuOpen.value = false
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
