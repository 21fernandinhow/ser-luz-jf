<template>
  <header
    class="sticky top-0 z-30 transition-colors"
    :class="isHome ? 'bg-brand-blue' : 'bg-white border-b border-gray-200 shadow-sm'"
  >
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <img
          v-if="!logoError"
          src="/logo.webp"
          alt="Projeto Ser Luz"
          class="h-14 w-auto"
          @error="logoError = true"
        />
        <span
          v-else
          class="text-xl font-bold"
          :class="isHome ? 'text-white' : 'text-brand-blue'"
        >
          Ser Luz
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-3">
        <button
          class="bg-brand-yellow text-gray-900 font-semibold text-sm px-4 py-2 rounded-full hover:brightness-95 transition"
          @click="openDonate"
        >
          Doar
        </button>

        <NuxtLink
          :to="entrarPath"
          class="font-semibold text-sm px-4 py-2 rounded-full transition"
          :class="isHome
            ? 'bg-white text-brand-blue hover:bg-blue-50'
            : 'bg-brand-blue text-white hover:bg-brand-blue/90'"
        >
          Entrar
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const logoError = ref(false)
const { open: openDonate } = useDonateModal()
const route = useRoute()

const isHome = computed(() => ['/', '/login', '/register'].includes(route.path))

const user = useSupabaseUser()

const { data: profileResult } = useAsyncData(
  'header-profile',
  async () => {
    if (!user.value) return null
    try {
      return await $fetch<{ data: { role: string } }>('/api/profiles/me')
    }
    catch {
      return null
    }
  },
  { server: false, watch: [user] },
)

const entrarPath = computed(() => {
  if (!user.value) return '/login'
  const role = profileResult.value?.data?.role
  if (role === 'admin') return '/admin'
  if (role === 'volunteer') return '/painel/volunteer'
  return '/painel/beneficiary'
})
</script>
