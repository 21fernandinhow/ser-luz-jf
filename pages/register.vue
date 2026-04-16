<template>
  <div class="min-h-[calc(100vh-4rem)] bg-surface-muted py-10 px-4">
    <div class="max-w-xl mx-auto">
      <!-- Cabeçalho da página -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-semibold text-brand-blue">Cadastro</h1>
        <p class="text-sm text-gray-500 mt-1">Selecione como deseja participar do Projeto Ser Luz</p>
      </div>

      <!-- Tabs -->
      <div class="flex rounded-lg overflow-hidden border border-gray-200 mb-6 bg-white">
        <button
          class="flex-1 py-3 px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          :class="activeTab === 'beneficiary'
            ? 'bg-brand-blue text-white'
            : 'text-gray-600 hover:bg-gray-50'"
          @click="setTab('beneficiary')"
        >
          Preciso de Ajuda
        </button>
        <button
          class="flex-1 py-3 px-4 text-sm font-semibold transition-colors border-l border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          :class="activeTab === 'volunteer'
            ? 'bg-brand-blue text-white'
            : 'text-gray-600 hover:bg-gray-50'"
          @click="setTab('volunteer')"
        >
          Quero Ajudar
        </button>
      </div>

      <!-- Card do formulário -->
      <div class="bg-white rounded-lg shadow-md p-6 md:p-8">
        <RegisterBeneficiaryForm v-if="activeTab === 'beneficiary'" />
        <RegisterVolunteerForm v-else />
      </div>

      <!-- Link para login -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Já tem conta?
        <NuxtLink to="/login" class="text-brand-blue underline hover:text-blue-800">
          Entrar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { redirectByRole } = useAuthRedirect()
const { activeTab, setTab } = useRegisterTab()

onMounted(async () => {
  if (user.value) {
    await redirectByRole()
  }
})
</script>
