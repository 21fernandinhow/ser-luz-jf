<template>
  <div>
    <NuxtLayout name="panel">
      <!-- Carregando -->
      <div v-if="pending" class="flex justify-center py-16">
        <svg class="w-8 h-8 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <!-- Erro de carregamento -->
      <div v-else-if="loadError" class="error-banner">{{ loadError }}</div>

      <!-- Conteúdo -->
      <template v-else-if="profile">
        <!-- Cabeçalho do painel -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Olá, {{ firstName }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">Voluntário</p>
          </div>
          <StatusBadge :status="profile.status" />
        </div>

        <!-- Aviso de status -->
        <div v-if="profile.status === 'pending'" class="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
          Sua solicitação está em análise. A equipe do Ser Luz entrará em contato em breve.
        </div>
        <div v-else-if="profile.status === 'rejected'" class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          Sua solicitação não foi aprovada neste momento. Para mais informações, entre em contato com a equipe.
        </div>

        <!-- Sucesso ao salvar -->
        <div v-if="saveSuccess" class="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Dados atualizados com sucesso!
        </div>

        <!-- Formulário de edição -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-800 mb-5">Minha ficha</h2>

          <form novalidate @submit.prevent="handleSubmit" class="space-y-5">
            <div v-if="generalError" class="error-banner">{{ generalError }}</div>

            <!-- Dados pessoais -->
            <fieldset class="space-y-4">
              <legend class="field-legend">Dados pessoais</legend>

              <div>
                <label for="v-full-name" class="label-base">
                  Nome completo <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input id="v-full-name" v-model="form.full_name" type="text" required autocomplete="name"
                  maxlength="150" :disabled="saving" class="input-base"
                  :class="fieldErrors.full_name ? 'border-red-400' : 'border-gray-300'" />
                <p v-if="fieldErrors.full_name" class="field-error">{{ fieldErrors.full_name }}</p>
              </div>

              <div>
                <label for="v-email" class="label-base">E-mail</label>
                <input id="v-email" :value="profile.email" type="email" disabled
                  class="input-base border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                <p class="mt-1 text-xs text-gray-400">O e-mail não pode ser alterado por aqui.</p>
              </div>

              <div>
                <label for="v-phone" class="label-base">
                  Telefone <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input id="v-phone" :value="form.phone" type="tel" required autocomplete="tel"
                  placeholder="(00) 00000-0000" maxlength="15" :disabled="saving" class="input-base"
                  :class="fieldErrors.phone ? 'border-red-400' : 'border-gray-300'"
                  @input="form.phone = maskPhone(($event.target as HTMLInputElement).value)" />
                <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
              </div>
            </fieldset>

            <hr class="border-gray-100" />

            <!-- Disponibilidade e habilidades -->
            <fieldset class="space-y-4">
              <legend class="field-legend">Disponibilidade e habilidades</legend>

              <div>
                <label for="v-availability" class="label-base">
                  Disponibilidade <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <textarea id="v-availability" v-model="form.availability" rows="2" required maxlength="500"
                  placeholder="Ex: finais de semana, manhãs de terça e quinta..." :disabled="saving"
                  class="textarea-base" :class="fieldErrors.availability ? 'border-red-400' : 'border-gray-300'" />
                <p v-if="fieldErrors.availability" class="field-error">{{ fieldErrors.availability }}</p>
              </div>

              <div>
                <label for="v-skills" class="label-base">
                  Habilidades / Como posso ajudar <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <textarea id="v-skills" v-model="form.skills" rows="3" required maxlength="1000"
                  placeholder="Ex: dirigir, cozinhar, organizar eventos..." :disabled="saving"
                  class="textarea-base" :class="fieldErrors.skills ? 'border-red-400' : 'border-gray-300'" />
                <p v-if="fieldErrors.skills" class="field-error">{{ fieldErrors.skills }}</p>
              </div>
            </fieldset>

            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Salvando…' : 'Salvar alterações' }}
            </button>
          </form>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface Profile {
  id: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  email: string
  full_name: string | null
  phone: string | null
  availability: string | null
  skills: string | null
}

const profile = ref<Profile | null>(null)
const pending = ref(true)
const loadError = ref('')
const saving = ref(false)
const saveSuccess = ref(false)
const generalError = ref('')
const fieldErrors = ref<Record<string, string>>({})

const form = reactive({
  full_name: '',
  phone: '',
  availability: '',
  skills: '',
})

const firstName = computed(() => profile.value?.full_name?.split(' ')[0] ?? 'usuário')

function fillForm(p: Profile) {
  form.full_name = p.full_name ?? ''
  form.phone = p.phone ?? ''
  form.availability = p.availability ?? ''
  form.skills = p.skills ?? ''
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

onMounted(async () => {
  try {
    const res = await $fetch<{ data: Profile }>('/api/profiles/me')
    profile.value = res.data
    fillForm(res.data)
  }
  catch {
    loadError.value = 'Erro ao carregar seus dados. Tente recarregar a página.'
  }
  finally {
    pending.value = false
  }
})

async function handleSubmit() {
  saving.value = true
  saveSuccess.value = false
  generalError.value = ''
  fieldErrors.value = {}

  try {
    const res = await $fetch<{ data: Profile }>('/api/profiles/me', {
      method: 'PATCH',
      body: {
        full_name: form.full_name,
        phone: form.phone,
        availability: form.availability,
        skills: form.skills,
      },
    })
    profile.value = res.data
    fillForm(res.data)
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
</script>
