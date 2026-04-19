<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Beneficiários</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ users.length }} resultado(s)</p>
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
        <UserTable :users="users" :loading="loading" />
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
</script>
