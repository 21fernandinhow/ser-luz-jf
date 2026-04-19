<template>
  <div>
    <!-- Estado de sucesso -->
    <template v-if="success">
      <div class="text-center py-6">
        <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Cadastro realizado!</h2>
        <p class="text-gray-600 mb-2">Sua solicitação foi recebida e está em análise.</p>
        <p class="text-sm text-gray-500 mb-6">
          Você já pode fazer login. Aguarde a aprovação da equipe do Projeto Ser Luz para ter acesso completo.
        </p>
        <NuxtLink to="/login" class="btn-primary-inline">Fazer login</NuxtLink>
      </div>
    </template>

    <!-- Formulário -->
    <form v-else novalidate @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="generalError" class="error-banner">{{ generalError }}</div>

      <!-- Dados de acesso -->
      <fieldset class="space-y-4">
        <legend class="field-legend">Dados de acesso</legend>

        <div>
          <label for="b-email" class="label-base">
            E-mail <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="b-email" v-model="form.email" type="email" required autocomplete="email"
            placeholder="seu@email.com" maxlength="254" :disabled="loading" class="input-base"
            :class="fieldErrors.email ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
        </div>

        <div>
          <label for="b-password" class="label-base">
            Senha <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="b-password" v-model="form.password" type="password" required autocomplete="new-password"
            placeholder="Mínimo 6 caracteres" minlength="6" maxlength="72" :disabled="loading" class="input-base"
            :class="fieldErrors.password ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
        </div>
      </fieldset>

      <hr class="border-gray-100" />

      <!-- Dados pessoais -->
      <fieldset class="space-y-4">
        <legend class="field-legend">Dados pessoais</legend>

        <div>
          <label for="b-full-name" class="label-base">
            Nome completo <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="b-full-name" v-model="form.full_name" type="text" required autocomplete="name"
            maxlength="150" :disabled="loading" class="input-base"
            :class="fieldErrors.full_name ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.full_name" class="field-error">{{ fieldErrors.full_name }}</p>
        </div>

        <!-- Endereço -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="b-cep" class="label-base">
              CEP <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="b-cep" :value="form.cep" type="text" required autocomplete="postal-code"
              placeholder="00000-000" maxlength="9" :disabled="loading" class="input-base"
              :class="fieldErrors.cep ? 'border-red-400' : 'border-gray-300'"
              @input="form.cep = maskCEP(($event.target as HTMLInputElement).value)" />
            <p v-if="fieldErrors.cep" class="field-error">{{ fieldErrors.cep }}</p>
          </div>

          <div>
            <label for="b-neighborhood" class="label-base">
              Bairro <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <select id="b-neighborhood" v-model="form.neighborhood" required :disabled="loading"
              class="select-base" :class="fieldErrors.neighborhood ? 'border-red-400' : ''">
              <option value="">Selecione...</option>
              <option v-for="bairro in BAIRROS_JF" :key="bairro" :value="bairro">{{ bairro }}</option>
            </select>
            <p v-if="fieldErrors.neighborhood" class="field-error">{{ fieldErrors.neighborhood }}</p>
          </div>
        </div>

        <div>
          <label for="b-street" class="label-base">
            Rua <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="b-street" v-model="form.street" type="text" required autocomplete="street-address"
            maxlength="200" :disabled="loading" class="input-base"
            :class="fieldErrors.street ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.street" class="field-error">{{ fieldErrors.street }}</p>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label for="b-number" class="label-base">
              Número <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="b-number" v-model="form.address_number" type="text" required
              placeholder="123 ou S/N" maxlength="20" :disabled="loading" class="input-base"
              :class="fieldErrors.address_number ? 'border-red-400' : 'border-gray-300'" />
            <p v-if="fieldErrors.address_number" class="field-error">{{ fieldErrors.address_number }}</p>
          </div>

          <div class="col-span-2">
            <label for="b-complement" class="label-base">Complemento</label>
            <input id="b-complement" v-model="form.complement" type="text"
              placeholder="Apto, bloco, casa…" maxlength="100" :disabled="loading"
              class="input-base border-gray-300" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="b-phone" class="label-base">
              Telefone <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="b-phone" :value="form.phone" type="tel" required autocomplete="tel"
              placeholder="(00) 00000-0000" maxlength="15" :disabled="loading" class="input-base"
              :class="fieldErrors.phone ? 'border-red-400' : 'border-gray-300'"
              @input="form.phone = maskPhone(($event.target as HTMLInputElement).value)" />
            <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
          </div>

          <div>
            <label for="b-document" class="label-base">
              CPF ou RG <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="b-document" :value="form.document_id" type="text" required
              placeholder="000.000.000-00" maxlength="14" :disabled="loading" class="input-base"
              :class="fieldErrors.document_id ? 'border-red-400' : 'border-gray-300'"
              @input="form.document_id = maskCPF(($event.target as HTMLInputElement).value)" />
            <p v-if="fieldErrors.document_id" class="field-error">{{ fieldErrors.document_id }}</p>
          </div>
        </div>
      </fieldset>

      <hr class="border-gray-100" />

      <!-- Composição familiar -->
      <fieldset class="space-y-4">
        <legend class="field-legend">Composição familiar</legend>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="b-household" class="label-base">
              Pessoas na família <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="b-household" v-model.number="form.household_size" type="number" min="1" max="50" required
              :disabled="loading" class="input-base"
              :class="fieldErrors.household_size ? 'border-red-400' : 'border-gray-300'" />
            <p v-if="fieldErrors.household_size" class="field-error">{{ fieldErrors.household_size }}</p>
          </div>

          <div>
            <label for="b-has-children" class="label-base">
              Tem criança(s)? <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <select id="b-has-children" v-model="form.has_children" required :disabled="loading"
              class="select-base" :class="fieldErrors.has_children ? 'border-red-400' : ''">
              <option value="">Selecione...</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
            <p v-if="fieldErrors.has_children" class="field-error">{{ fieldErrors.has_children }}</p>
          </div>
        </div>

        <template v-if="form.has_children === 'true'">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="b-children-count" class="label-base">
                Quantas crianças? <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="b-children-count" v-model.number="form.children_count" type="number" min="1" max="20" required
                :disabled="loading" class="input-base"
                :class="fieldErrors.children_count ? 'border-red-400' : 'border-gray-300'" />
              <p v-if="fieldErrors.children_count" class="field-error">{{ fieldErrors.children_count }}</p>
            </div>

            <div>
              <label for="b-children-ages" class="label-base">Idade das crianças</label>
              <input id="b-children-ages" v-model="form.children_ages_description" type="text"
                placeholder="Ex: 3 e 7 anos" maxlength="200" :disabled="loading" class="input-base border-gray-300" />
            </div>
          </div>
        </template>
      </fieldset>

      <hr class="border-gray-100" />

      <!-- Necessidades -->
      <fieldset class="space-y-4">
        <legend class="field-legend">Necessidades</legend>

        <div>
          <label for="b-need" class="label-base">
            Maior necessidade no momento <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <textarea id="b-need" v-model="form.current_greatest_need" rows="3" required maxlength="1000"
            :disabled="loading" class="textarea-base"
            :class="fieldErrors.current_greatest_need ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.current_greatest_need" class="field-error">{{ fieldErrors.current_greatest_need }}</p>
        </div>

        <div>
          <label for="b-clothing" class="label-base">Tamanho de roupas</label>
          <input id="b-clothing" v-model="form.clothing_sizes" type="text" placeholder="Ex: P, M, G"
            maxlength="100" :disabled="loading" class="input-base border-gray-300" />
        </div>
      </fieldset>

      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Enviando…' : 'Cadastrar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const success = ref(false)
const generalError = ref('')
const fieldErrors = ref<Record<string, string>>({})

const form = reactive({
  email: '',
  password: '',
  full_name: '',
  cep: '',
  neighborhood: '',
  street: '',
  address_number: '',
  complement: '',
  phone: '',
  document_id: '',
  household_size: null as number | null,
  has_children: '',
  children_count: null as number | null,
  children_ages_description: '',
  clothing_sizes: '',
  current_greatest_need: '',
})

// ── Máscaras ──────────────────────────────────────────────────────────────────

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

// ── Submit ────────────────────────────────────────────────────────────────────

async function handleSubmit() {
  loading.value = true
  generalError.value = ''
  fieldErrors.value = {}

  const payload: Record<string, unknown> = {
    email: form.email,
    password: form.password,
    full_name: form.full_name,
    cep: form.cep,
    neighborhood: form.neighborhood,
    street: form.street,
    address_number: form.address_number,
    phone: form.phone,
    document_id: form.document_id,
    household_size: form.household_size,
    has_children: form.has_children === 'true' ? true : form.has_children === 'false' ? false : undefined,
    current_greatest_need: form.current_greatest_need,
  }

  if (payload.has_children === true) {
    payload.children_count = form.children_count
    if (form.children_ages_description) payload.children_ages_description = form.children_ages_description
  }

  if (form.complement) payload.complement = form.complement
  if (form.clothing_sizes) payload.clothing_sizes = form.clothing_sizes

  try {
    await $fetch('/api/register/beneficiary', { method: 'POST', body: payload })
    success.value = true
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string; details?: { fieldErrors?: Record<string, string> } } } }
    const apiError = e?.data?.error
    if (apiError?.details?.fieldErrors) fieldErrors.value = apiError.details.fieldErrors
    generalError.value = apiError?.message ?? 'Erro ao realizar cadastro. Tente novamente.'
  }
  finally {
    loading.value = false
  }
}
</script>
