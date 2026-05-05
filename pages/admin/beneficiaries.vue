<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Beneficiários</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ users.length }} resultado(s)</p>
        </div>
        <button
          :disabled="users.length === 0"
          class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          @click="exportCsv"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div class="mb-5 flex flex-col sm:flex-row gap-3">
        <StatusFilter v-model="statusFilter" />

        <select
          v-model="neighborhoodFilter"
          class="select-base w-full sm:w-56 text-sm"
        >
          <option value="">Todos os bairros</option>
          <option v-for="bairro in BAIRROS_JF" :key="bairro" :value="bairro">{{ bairro }}</option>
        </select>
      </div>

      <div v-if="loadError" class="error-banner mb-4">{{ loadError }}</div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <UserTable :users="users" :loading="loading" show-phone show-address />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface UserRow {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  neighborhood: string | null
  cep: string | null
  street: string | null
  address_number: string | null
  complement: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const route = useRoute()
const router = useRouter()

const statusFilter = ref((route.query.status as string) || '')
const neighborhoodFilter = ref((route.query.neighborhood as string) || '')
const users = ref<UserRow[]>([])
const loading = ref(false)
const loadError = ref('')

async function fetchUsers() {
  loading.value = true
  loadError.value = ''
  try {
    const params = new URLSearchParams()
    if (statusFilter.value) params.set('status', statusFilter.value)
    if (neighborhoodFilter.value) params.set('neighborhood', neighborhoodFilter.value)
    const qs = params.toString()
    const res = await $fetch<{ data: UserRow[] }>(`/api/admin/beneficiaries${qs ? `?${qs}` : ''}`)
    users.value = res.data
  }
  catch {
    loadError.value = 'Erro ao carregar lista. Tente recarregar.'
  }
  finally {
    loading.value = false
  }
}

watch([statusFilter, neighborhoodFilter], ([status, neighborhood]) => {
  const query: Record<string, string> = {}
  if (status) query.status = status
  if (neighborhood) query.neighborhood = neighborhood
  router.replace({ query })
  fetchUsers()
})

onMounted(fetchUsers)

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Reprovado',
}

function exportCsv() {
  const headers = ['Nome', 'E-mail', 'Telefone', 'Bairro', 'CEP', 'Rua', 'Número', 'Complemento', 'Status', 'Cadastro']
  const rows = users.value.map(u => [
    u.full_name ?? '',
    u.email,
    u.phone ?? '',
    u.neighborhood ?? '',
    u.cep ?? '',
    u.street ?? '',
    u.address_number ?? '',
    u.complement ?? '',
    STATUS_LABEL[u.status] ?? u.status,
    new Date(u.created_at).toLocaleDateString('pt-BR'),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `beneficiarios${statusFilter.value ? `-${statusFilter.value}` : ''}${neighborhoodFilter.value ? `-${neighborhoodFilter.value}` : ''}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
