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
            <p class="text-sm text-gray-500 mt-0.5">Beneficiário</p>
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
                <label for="p-full-name" class="label-base">
                  Nome completo <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input id="p-full-name" v-model="form.full_name" type="text" required autocomplete="name"
                  maxlength="150" :disabled="saving" class="input-base"
                  :class="fieldErrors.full_name ? 'border-red-400' : 'border-gray-300'" />
                <p v-if="fieldErrors.full_name" class="field-error">{{ fieldErrors.full_name }}</p>
              </div>

              <div>
                <label for="p-email" class="label-base">E-mail</label>
                <input id="p-email" :value="profile.email" type="email" disabled
                  class="input-base border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                <p class="mt-1 text-xs text-gray-400">O e-mail não pode ser alterado por aqui.</p>
              </div>

              <!-- Endereço -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="p-cep" class="label-base">
                    CEP <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input id="p-cep" :value="form.cep" type="text" required autocomplete="postal-code"
                    placeholder="00000-000" maxlength="9" :disabled="saving" class="input-base"
                    :class="fieldErrors.cep ? 'border-red-400' : 'border-gray-300'"
                    @input="form.cep = maskCEP(($event.target as HTMLInputElement).value)" />
                  <p v-if="fieldErrors.cep" class="field-error">{{ fieldErrors.cep }}</p>
                </div>

                <div>
                  <label for="p-neighborhood" class="label-base">
                    Bairro <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select id="p-neighborhood" v-model="form.neighborhood" required :disabled="saving"
                    class="select-base" :class="fieldErrors.neighborhood ? 'border-red-400' : ''">
                    <option value="">Selecione...</option>
                    <option v-for="bairro in BAIRROS_JF" :key="bairro" :value="bairro">{{ bairro }}</option>
                  </select>
                  <p v-if="fieldErrors.neighborhood" class="field-error">{{ fieldErrors.neighborhood }}</p>
                </div>
              </div>

              <div>
                <label for="p-street" class="label-base">
                  Rua <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input id="p-street" v-model="form.street" type="text" required autocomplete="street-address"
                  maxlength="200" :disabled="saving" class="input-base"
                  :class="fieldErrors.street ? 'border-red-400' : 'border-gray-300'" />
                <p v-if="fieldErrors.street" class="field-error">{{ fieldErrors.street }}</p>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label for="p-number" class="label-base">
                    Número <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input id="p-number" v-model="form.address_number" type="text" required
                    placeholder="123 ou S/N" maxlength="20" :disabled="saving" class="input-base"
                    :class="fieldErrors.address_number ? 'border-red-400' : 'border-gray-300'" />
                  <p v-if="fieldErrors.address_number" class="field-error">{{ fieldErrors.address_number }}</p>
                </div>
                <div class="col-span-2">
                  <label for="p-complement" class="label-base">Complemento</label>
                  <input id="p-complement" v-model="form.complement" type="text"
                    placeholder="Apto, bloco, casa…" maxlength="100" :disabled="saving"
                    class="input-base border-gray-300" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="p-phone" class="label-base">
                    Telefone <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input id="p-phone" :value="form.phone" type="tel" required autocomplete="tel"
                    placeholder="(00) 00000-0000" maxlength="15" :disabled="saving" class="input-base"
                    :class="fieldErrors.phone ? 'border-red-400' : 'border-gray-300'"
                    @input="form.phone = maskPhone(($event.target as HTMLInputElement).value)" />
                  <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
                </div>

                <div>
                  <label for="p-document" class="label-base">CPF ou RG</label>
                  <input id="p-document" :value="form.document_id" type="text"
                    placeholder="000.000.000-00" maxlength="14" :disabled="saving" class="input-base border-gray-300"
                    @input="form.document_id = maskCPF(($event.target as HTMLInputElement).value)" />
                </div>
              </div>
            </fieldset>

            <hr class="border-gray-100" />

            <!-- Composição familiar -->
            <fieldset class="space-y-4">
              <legend class="field-legend">Composição familiar</legend>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="p-household" class="label-base">Pessoas na família</label>
                  <input id="p-household" v-model.number="form.household_size" type="number" min="1" max="50"
                    :disabled="saving" class="input-base"
                    :class="fieldErrors.household_size ? 'border-red-400' : 'border-gray-300'" />
                  <p v-if="fieldErrors.household_size" class="field-error">{{ fieldErrors.household_size }}</p>
                </div>

                <div>
                  <label for="p-has-children" class="label-base">Tem criança(s)?</label>
                  <select id="p-has-children" v-model="form.has_children" :disabled="saving" class="select-base">
                    <option :value="undefined">Não informado</option>
                    <option :value="true">Sim</option>
                    <option :value="false">Não</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <input id="p-has-elderly" v-model="form.has_elderly" type="checkbox" :disabled="saving"
                  class="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                <label for="p-has-elderly" class="label-base mb-0 cursor-pointer">Possui idoso na casa?</label>
              </div>

              <template v-if="form.has_children === true">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="p-children-count" class="label-base">Quantas crianças?</label>
                    <input id="p-children-count" v-model.number="form.children_count" type="number" min="1" max="20"
                      :disabled="saving" class="input-base"
                      :class="fieldErrors.children_count ? 'border-red-400' : 'border-gray-300'" />
                    <p v-if="fieldErrors.children_count" class="field-error">{{ fieldErrors.children_count }}</p>
                  </div>

                  <div>
                    <label for="p-children-ages" class="label-base">Idade das crianças</label>
                    <input id="p-children-ages" v-model="form.children_ages_description" type="text"
                      placeholder="Ex: 3 e 7 anos" maxlength="200" :disabled="saving"
                      class="input-base border-gray-300" />
                  </div>
                </div>
              </template>
            </fieldset>

            <hr class="border-gray-100" />

            <!-- Necessidades -->
            <fieldset class="space-y-4">
              <legend class="field-legend">Necessidades</legend>

              <div>
                <label for="p-need" class="label-base">Maior necessidade no momento</label>
                <textarea id="p-need" v-model="form.current_greatest_need" rows="3" maxlength="1000"
                  :disabled="saving" class="textarea-base border-gray-300" />
              </div>

              <div>
                <label for="p-clothing" class="label-base">Tamanho de roupas</label>
                <input id="p-clothing" v-model="form.clothing_sizes" type="text" placeholder="Ex: P, M, G"
                  maxlength="100" :disabled="saving" class="input-base border-gray-300" />
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
  cep: string | null
  neighborhood: string | null
  street: string | null
  address_number: string | null
  complement: string | null
  document_id: string | null
  household_size: number | null
  has_children: boolean | null
  has_elderly: boolean | null
  children_count: number | null
  children_ages_description: string | null
  clothing_sizes: string | null
  current_greatest_need: string | null
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
  cep: '',
  neighborhood: '',
  street: '',
  address_number: '',
  complement: '',
  document_id: '',
  household_size: null as number | null,
  has_children: undefined as boolean | undefined,
  has_elderly: false,
  children_count: null as number | null,
  children_ages_description: '',
  clothing_sizes: '',
  current_greatest_need: '',
})

const firstName = computed(() => profile.value?.full_name?.split(' ')[0] ?? 'usuário')

function fillForm(p: Profile) {
  form.full_name = p.full_name ?? ''
  form.phone = p.phone ?? ''
  form.cep = p.cep ?? ''
  form.neighborhood = p.neighborhood ?? ''
  form.street = p.street ?? ''
  form.address_number = p.address_number ?? ''
  form.complement = p.complement ?? ''
  form.document_id = p.document_id ?? ''
  form.household_size = p.household_size ?? null
  form.has_children = p.has_children ?? undefined
  form.has_elderly = p.has_elderly ?? false
  form.children_count = p.children_count ?? null
  form.children_ages_description = p.children_ages_description ?? ''
  form.clothing_sizes = p.clothing_sizes ?? ''
  form.current_greatest_need = p.current_greatest_need ?? ''
}

function maskCEP(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function maskCPF(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
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

  const payload: Record<string, unknown> = {
    full_name: form.full_name,
    phone: form.phone,
    cep: form.cep,
    neighborhood: form.neighborhood,
    street: form.street,
    address_number: form.address_number,
    complement: form.complement || null,
  }

  if (form.document_id) payload.document_id = form.document_id
  if (form.household_size != null) payload.household_size = form.household_size
  if (form.has_children !== undefined) payload.has_children = form.has_children
  payload.has_elderly = form.has_elderly
  if (form.current_greatest_need) payload.current_greatest_need = form.current_greatest_need
  if (form.clothing_sizes) payload.clothing_sizes = form.clothing_sizes

  if (form.has_children === true) {
    if (form.children_count != null) payload.children_count = form.children_count
    if (form.children_ages_description) payload.children_ages_description = form.children_ages_description
  }

  try {
    const res = await $fetch<{ data: Profile }>('/api/profiles/me', { method: 'PATCH', body: payload })
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
