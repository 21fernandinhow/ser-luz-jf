<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Beneficiários</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ users.length }} resultado(s)</p>
      </div>

      <div class="mb-5">
        <AdminStatusFilter v-model="statusFilter" />
      </div>

      <div v-if="loadError" class="error-banner mb-4">{{ loadError }}</div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AdminUserTable :users="users" :loading="loading" />
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
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const route = useRoute()
const router = useRouter()

const statusFilter = ref((route.query.status as string) || '')
const users = ref<UserRow[]>([])
const loading = ref(false)
const loadError = ref('')

async function fetchUsers() {
  loading.value = true
  loadError.value = ''
  try {
    const url = statusFilter.value
      ? `/api/admin/beneficiaries?status=${statusFilter.value}`
      : '/api/admin/beneficiaries'
    const res = await $fetch<{ data: UserRow[] }>(url)
    users.value = res.data
  }
  catch {
    loadError.value = 'Erro ao carregar lista. Tente recarregar.'
  }
  finally {
    loading.value = false
  }
}

watch(statusFilter, (val) => {
  router.replace({ query: val ? { status: val } : {} })
  fetchUsers()
})

onMounted(fetchUsers)
</script>
