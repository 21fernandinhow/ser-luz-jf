<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Carregando -->
      <div v-if="pending" class="flex justify-center py-16">
        <svg class="w-8 h-8 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <div v-else-if="loadError" class="error-banner">{{ loadError }}</div>

      <template v-else-if="profile">
        <!-- Navegação de volta -->
        <NuxtLink
          :to="profile.role === 'beneficiary' ? '/admin/beneficiaries' : '/admin/volunteers'"
          class="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline mb-6"
        >
          ← Voltar à lista
        </NuxtLink>

        <!-- Cabeçalho do usuário -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ profile.full_name || profile.email }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ roleLabel }} · {{ profile.email }}
            </p>
          </div>
          <StatusBadge :status="profile.status" />
        </div>

        <!-- Ações de status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 class="text-base font-semibold text-gray-800 mb-1">Aprovação</h2>
          <p class="text-sm text-gray-500 mb-4">
            Status atual: <strong>{{ statusLabel }}</strong>
          </p>

          <div v-if="statusSuccess" class="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            Status atualizado com sucesso!
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              :disabled="profile.status === 'approved' || updatingStatus"
              class="px-5 py-2 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              @click="updateStatus('approved')"
            >
              {{ updatingStatus && targetStatus === 'approved' ? 'Aprovando…' : 'Aprovar' }}
            </button>
            <button
              :disabled="profile.status === 'rejected' || updatingStatus"
              class="px-5 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              @click="updateStatus('rejected')"
            >
              {{ updatingStatus && targetStatus === 'rejected' ? 'Rejeitando…' : 'Rejeitar' }}
            </button>
          </div>
        </div>

        <!-- Formulário de edição -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 class="text-base font-semibold text-gray-800 mb-1">Editar ficha</h2>

          <div v-if="saveSuccess" class="mt-3 mb-5 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            Dados salvos com sucesso!
          </div>

          <div class="mt-5">
            <UserEditForm
              :profile="profile"
              :saving="saving"
              :field-errors="fieldErrors"
              :general-error="generalError"
              @submit="handleSave"
            />
          </div>
        </div>

        <!-- Zona de perigo -->
        <div class="border border-red-200 rounded-xl p-6">
          <h2 class="text-base font-semibold text-red-700 mb-1">Zona de perigo</h2>
          <p class="text-sm text-gray-600 mt-2">
            Remove permanentemente o perfil e a conta de acesso deste usuário. Esta ação não pode ser desfeita.
          </p>

          <template v-if="!confirmDelete">
            <button
              class="mt-4 px-5 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
              @click="confirmDelete = true"
            >
              Remover usuário
            </button>
          </template>

          <div v-else class="mt-4 flex flex-wrap items-center gap-3">
            <span class="text-sm font-medium text-red-700">Confirmar remoção?</span>
            <button
              :disabled="deleting"
              class="px-4 py-1.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              @click="handleDelete"
            >
              {{ deleting ? 'Removendo…' : 'Sim, remover' }}
            </button>
            <button
              class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              @click="confirmDelete = false"
            >
              Cancelar
            </button>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface Profile {
  id: string
  role: 'admin' | 'beneficiary' | 'volunteer'
  status: 'pending' | 'approved' | 'rejected'
  email: string
  full_name: string | null
  phone: string | null
  document_id: string | null
  address: string | null
  household_size: number | null
  has_children: boolean | null
  children_count: number | null
  children_ages_description: string | null
  clothing_sizes: string | null
  current_greatest_need: string | null
  availability: string | null
  skills: string | null
  internal_notes: string | null
  created_at: string
}

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const profile = ref<Profile | null>(null)
const pending = ref(true)
const loadError = ref('')

// Status update
const updatingStatus = ref(false)
const statusSuccess = ref(false)
const targetStatus = ref<'approved' | 'rejected' | ''>('')

// Edit form
const saving = ref(false)
const saveSuccess = ref(false)
const generalError = ref('')
const fieldErrors = ref<Record<string, string>>({})

// Delete
const confirmDelete = ref(false)
const deleting = ref(false)

const roleLabel = computed(() => {
  if (profile.value?.role === 'beneficiary') return 'Beneficiário'
  if (profile.value?.role === 'volunteer') return 'Voluntário'
  return 'Admin'
})

const statusLabel = computed(() => {
  switch (profile.value?.status) {
    case 'approved': return 'Aprovado'
    case 'rejected': return 'Rejeitado'
    default: return 'Pendente'
  }
})

onMounted(async () => {
  try {
    const res = await $fetch<{ data: Profile }>(`/api/admin/users/${id}`)
    profile.value = res.data
  }
  catch {
    loadError.value = 'Usuário não encontrado ou erro ao carregar.'
  }
  finally {
    pending.value = false
  }
})

async function updateStatus(status: 'approved' | 'rejected') {
  updatingStatus.value = true
  targetStatus.value = status
  statusSuccess.value = false
  try {
    const res = await $fetch<{ data: { id: string; status: string } }>(
      `/api/admin/users/${id}/status`,
      { method: 'PATCH', body: { status } },
    )
    if (profile.value) profile.value.status = res.data.status as 'approved' | 'rejected'
    statusSuccess.value = true
    setTimeout(() => { statusSuccess.value = false }, 4000)
  }
  catch {
    // Silenciar; o botão fica habilitado novamente
  }
  finally {
    updatingStatus.value = false
    targetStatus.value = ''
  }
}

async function handleSave(data: Record<string, unknown>) {
  saving.value = true
  saveSuccess.value = false
  generalError.value = ''
  fieldErrors.value = {}

  try {
    const res = await $fetch<{ data: Profile }>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: data,
    })
    profile.value = res.data
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 4000)
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string; details?: { fieldErrors?: Record<string, string> } } } }
    const apiError = e?.data?.error
    if (apiError?.details?.fieldErrors) fieldErrors.value = apiError.details.fieldErrors
    generalError.value = apiError?.message ?? 'Erro ao salvar. Tente novamente.'
  }
  finally {
    saving.value = false
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    router.push(profile.value?.role === 'beneficiary' ? '/admin/beneficiaries' : '/admin/volunteers')
  }
  catch {
    confirmDelete.value = false
    // Mostrar erro seria ideal; por ora apenas fecha o confirm
  }
  finally {
    deleting.value = false
  }
}
</script>
