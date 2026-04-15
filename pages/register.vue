<template>
  <div class="min-h-screen bg-surface-muted p-8">
    <h1 class="text-2xl font-semibold text-brand-blue">Cadastro</h1>
    <p class="mt-2 text-gray-700">Abas beneficiário/voluntário — Fase 3.</p>
    <NuxtLink to="/" class="mt-6 inline-block text-brand-blue underline"> Voltar à home </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { redirectByRole } = useAuthRedirect()

onMounted(async () => {
  if (user.value) {
    await redirectByRole()
  }
})
</script>
