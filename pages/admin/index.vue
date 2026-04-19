<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">Visão geral da plataforma Ser Luz</p>
      </div>

      <div v-if="pending" class="flex justify-center py-16">
        <svg class="w-8 h-8 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <div v-else-if="stats" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Beneficiários -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-gray-800">Beneficiários</h2>
            <span class="text-2xl font-bold text-gray-900">{{ stats.beneficiaries.total }}</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-yellow-700 font-medium">Pendentes</span>
              <span class="font-semibold">{{ stats.beneficiaries.pending }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-700 font-medium">Aprovados</span>
              <span class="font-semibold">{{ stats.beneficiaries.approved }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-red-700 font-medium">Rejeitados</span>
              <span class="font-semibold">{{ stats.beneficiaries.rejected }}</span>
            </div>
          </div>
          <div class="mt-5 flex gap-2">
            <NuxtLink
              to="/admin/beneficiaries?status=pending"
              class="btn-outline text-xs py-1.5 px-3"
            >
              Ver pendentes
            </NuxtLink>
            <NuxtLink
              to="/admin/beneficiaries"
              class="text-xs text-brand-blue hover:underline font-medium self-center"
            >
              Ver todos →
            </NuxtLink>
          </div>
        </div>

        <!-- Voluntários -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-gray-800">Voluntários</h2>
            <span class="text-2xl font-bold text-gray-900">{{ stats.volunteers.total }}</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-yellow-700 font-medium">Pendentes</span>
              <span class="font-semibold">{{ stats.volunteers.pending }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-700 font-medium">Aprovados</span>
              <span class="font-semibold">{{ stats.volunteers.approved }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-red-700 font-medium">Rejeitados</span>
              <span class="font-semibold">{{ stats.volunteers.rejected }}</span>
            </div>
          </div>
          <div class="mt-5 flex gap-2">
            <NuxtLink
              to="/admin/volunteers?status=pending"
              class="btn-outline text-xs py-1.5 px-3"
            >
              Ver pendentes
            </NuxtLink>
            <NuxtLink
              to="/admin/volunteers"
              class="text-xs text-brand-blue hover:underline font-medium self-center"
            >
              Ver todos →
            </NuxtLink>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface Stats {
  beneficiaries: { pending: number; approved: number; rejected: number; total: number }
  volunteers: { pending: number; approved: number; rejected: number; total: number }
}

const stats = ref<Stats | null>(null)
const pending = ref(true)

onMounted(async () => {
  try {
    const res = await $fetch<{ data: Stats }>('/api/admin/stats')
    stats.value = res.data
  }
  catch {
    // Silenciar; stats não são críticos
  }
  finally {
    pending.value = false
  }
})
</script>
