<template>
  <header class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <img
          v-if="!logoError"
          src="/logo.webp"
          alt="Projeto Ser Luz"
          class="h-14 w-auto"
          @error="logoError = true"
        />
        <span v-else class="text-xl font-bold text-brand-blue">
          Ser Luz
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <button
          class="bg-brand-yellow text-gray-900 font-semibold text-sm px-4 py-2 rounded-full hover:brightness-95 transition"
          @click="$emit('open-donate')"
        >
          Fazer Doação
        </button>
        <UserMenu />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{ 'open-donate': [] }>()

const logoError = ref(false)
</script>
