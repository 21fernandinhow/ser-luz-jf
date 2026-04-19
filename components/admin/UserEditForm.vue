<template>
  <form novalidate @submit.prevent="handleSubmit" class="space-y-5">
    <div v-if="generalError" class="error-banner">{{ generalError }}</div>

    <!-- Dados pessoais -->
    <fieldset class="space-y-4">
      <legend class="field-legend">Dados pessoais</legend>

      <div>
        <label class="label-base">Nome completo</label>
        <input
          v-model="form.full_name"
          type="text"
          maxlength="150"
          :disabled="saving"
          class="input-base"
          :class="fieldErrors.full_name ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="fieldErrors.full_name" class="field-error">{{ fieldErrors.full_name }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="label-base">Telefone</label>
          <input
            :value="form.phone"
            type="tel"
            placeholder="(00) 00000-0000"
            maxlength="15"
            :disabled="saving"
            class="input-base"
            :class="fieldErrors.phone ? 'border-red-400' : 'border-gray-300'"
            @input="form.phone = maskPhone(($event.target as HTMLInputElement).value)"
          />
          <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
        </div>

        <div>
          <label class="label-base">CPF ou RG</label>
          <input
            :value="form.document_id"
            type="text"
            maxlength="14"
            :disabled="saving"
            class="input-base border-gray-300"
            @input="form.document_id = maskCPF(($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <template v-if="profile.role === 'beneficiary'">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label-base">CEP</label>
            <input
              :value="form.cep"
              type="text"
              placeholder="00000-000"
              maxlength="9"
              :disabled="saving"
              class="input-base"
              :class="fieldErrors.cep ? 'border-red-400' : 'border-gray-300'"
              @input="form.cep = maskCEP(($event.target as HTMLInputElement).value)"
            />
            <p v-if="fieldErrors.cep" class="field-error">{{ fieldErrors.cep }}</p>
          </div>

          <div>
            <label class="label-base">Bairro</label>
            <select v-model="form.neighborhood" :disabled="saving"
              class="select-base" :class="fieldErrors.neighborhood ? 'border-red-400' : ''">
              <option value="">Selecione...</option>
              <option v-for="bairro in BAIRROS_JF" :key="bairro" :value="bairro">{{ bairro }}</option>
            </select>
            <p v-if="fieldErrors.neighborhood" class="field-error">{{ fieldErrors.neighborhood }}</p>
          </div>
        </div>

        <div>
          <label class="label-base">Rua</label>
          <input
            v-model="form.street"
            type="text"
            maxlength="200"
            :disabled="saving"
            class="input-base"
            :class="fieldErrors.street ? 'border-red-400' : 'border-gray-300'"
          />
          <p v-if="fieldErrors.street" class="field-error">{{ fieldErrors.street }}</p>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="label-base">Número</label>
            <input
              v-model="form.address_number"
              type="text"
              placeholder="123 ou S/N"
              maxlength="20"
              :disabled="saving"
              class="input-base border-gray-300"
            />
          </div>
          <div class="col-span-2">
            <label class="label-base">Complemento</label>
            <input
              v-model="form.complement"
              type="text"
              placeholder="Apto, bloco, casa…"
              maxlength="100"
              :disabled="saving"
              class="input-base border-gray-300"
            />
          </div>
        </div>
      </template>
    </fieldset>

    <!-- Beneficiary-specific -->
    <template v-if="profile.role === 'beneficiary'">
      <hr class="border-gray-100" />
      <fieldset class="space-y-4">
        <legend class="field-legend">Composição familiar</legend>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label-base">Pessoas na família</label>
            <input
              v-model.number="form.household_size"
              type="number"
              min="1"
              max="50"
              :disabled="saving"
              class="input-base"
              :class="fieldErrors.household_size ? 'border-red-400' : 'border-gray-300'"
            />
            <p v-if="fieldErrors.household_size" class="field-error">{{ fieldErrors.household_size }}</p>
          </div>

          <div>
            <label class="label-base">Tem criança(s)?</label>
            <select v-model="form.has_children" :disabled="saving" class="select-base">
              <option :value="undefined">Não informado</option>
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
        </div>

        <template v-if="form.has_children === true">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label-base">Quantas crianças?</label>
              <input
                v-model.number="form.children_count"
                type="number"
                min="1"
                max="20"
                :disabled="saving"
                class="input-base"
                :class="fieldErrors.children_count ? 'border-red-400' : 'border-gray-300'"
              />
              <p v-if="fieldErrors.children_count" class="field-error">{{ fieldErrors.children_count }}</p>
            </div>
            <div>
              <label class="label-base">Idade das crianças</label>
              <input
                v-model="form.children_ages_description"
                type="text"
                maxlength="200"
                :disabled="saving"
                class="input-base border-gray-300"
              />
            </div>
          </div>
        </template>

        <div>
          <label class="label-base">Tamanho de roupas</label>
          <input
            v-model="form.clothing_sizes"
            type="text"
            placeholder="Ex: P, M, G"
            maxlength="100"
            :disabled="saving"
            class="input-base border-gray-300"
          />
        </div>

        <div>
          <label class="label-base">Maior necessidade no momento</label>
          <textarea
            v-model="form.current_greatest_need"
            rows="3"
            maxlength="1000"
            :disabled="saving"
            class="textarea-base border-gray-300"
          />
        </div>
      </fieldset>
    </template>

    <!-- Volunteer-specific -->
    <template v-if="profile.role === 'volunteer'">
      <hr class="border-gray-100" />
      <fieldset class="space-y-4">
        <legend class="field-legend">Perfil voluntário</legend>

        <div>
          <label class="label-base">Disponibilidade</label>
          <textarea
            v-model="form.availability"
            rows="2"
            maxlength="500"
            :disabled="saving"
            class="textarea-base border-gray-300"
          />
        </div>

        <div>
          <label class="label-base">Habilidades</label>
          <textarea
            v-model="form.skills"
            rows="3"
            maxlength="1000"
            :disabled="saving"
            class="textarea-base border-gray-300"
          />
        </div>

        <div class="flex items-center gap-3">
          <input
            id="ef-has-car"
            v-model="form.has_car"
            type="checkbox"
            :disabled="saving"
            class="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
          />
          <label for="ef-has-car" class="label-base mb-0 cursor-pointer">Tem carro disponível</label>
        </div>
      </fieldset>
    </template>

    <!-- Admin-only: internal notes -->
    <hr class="border-gray-100" />
    <fieldset>
      <legend class="field-legend">Notas internas</legend>
      <p class="text-xs text-gray-400 mb-2">Visível apenas para administradores.</p>
      <textarea
        v-model="form.internal_notes"
        rows="3"
        maxlength="2000"
        :disabled="saving"
        class="textarea-base border-gray-300"
        placeholder="Observações internas sobre este usuário…"
      />
      <p v-if="fieldErrors.internal_notes" class="field-error">{{ fieldErrors.internal_notes }}</p>
    </fieldset>

    <button type="submit" :disabled="saving" class="btn-primary">
      {{ saving ? 'Salvando…' : 'Salvar alterações' }}
    </button>
  </form>
</template>

<script setup lang="ts">
interface Profile {
  id: string
  role: 'admin' | 'beneficiary' | 'volunteer'
  full_name: string | null
  phone: string | null
  document_id: string | null
  cep: string | null
  neighborhood: string | null
  street: string | null
  address_number: string | null
  complement: string | null
  household_size: number | null
  has_children: boolean | null
  children_count: number | null
  children_ages_description: string | null
  clothing_sizes: string | null
  current_greatest_need: string | null
  availability: string | null
  skills: string | null
  has_car: boolean
  internal_notes: string | null
}

const props = defineProps<{
  profile: Profile
  saving: boolean
  fieldErrors: Record<string, string>
  generalError?: string
}>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
}>()

const form = reactive({
  full_name: '',
  phone: '',
  document_id: '',
  cep: '',
  neighborhood: '',
  street: '',
  address_number: '',
  complement: '',
  household_size: null as number | null,
  has_children: undefined as boolean | undefined,
  children_count: null as number | null,
  children_ages_description: '',
  clothing_sizes: '',
  current_greatest_need: '',
  availability: '',
  skills: '',
  has_car: false,
  internal_notes: '',
})

function fillForm(p: Profile) {
  form.full_name = p.full_name ?? ''
  form.phone = p.phone ?? ''
  form.document_id = p.document_id ?? ''
  form.cep = p.cep ?? ''
  form.neighborhood = p.neighborhood ?? ''
  form.street = p.street ?? ''
  form.address_number = p.address_number ?? ''
  form.complement = p.complement ?? ''
  form.household_size = p.household_size ?? null
  form.has_children = p.has_children ?? undefined
  form.children_count = p.children_count ?? null
  form.children_ages_description = p.children_ages_description ?? ''
  form.clothing_sizes = p.clothing_sizes ?? ''
  form.current_greatest_need = p.current_greatest_need ?? ''
  form.availability = p.availability ?? ''
  form.skills = p.skills ?? ''
  form.has_car = p.has_car ?? false
  form.internal_notes = p.internal_notes ?? ''
}

watch(() => props.profile, fillForm, { immediate: true })

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

function handleSubmit() {
  const data: Record<string, unknown> = {
    full_name: form.full_name,
    phone: form.phone,
    document_id: form.document_id || null,
    internal_notes: form.internal_notes || null,
  }

  if (props.profile.role === 'beneficiary') {
    data.cep = form.cep
    data.neighborhood = form.neighborhood
    data.street = form.street
    data.address_number = form.address_number
    data.complement = form.complement || null
    if (form.household_size != null) data.household_size = form.household_size
    if (form.has_children !== undefined) data.has_children = form.has_children
    if (form.current_greatest_need) data.current_greatest_need = form.current_greatest_need
    if (form.clothing_sizes) data.clothing_sizes = form.clothing_sizes
    if (form.has_children === true) {
      if (form.children_count != null) data.children_count = form.children_count
      if (form.children_ages_description) data.children_ages_description = form.children_ages_description
    }
  }

  if (props.profile.role === 'volunteer') {
    if (form.availability) data.availability = form.availability
    if (form.skills) data.skills = form.skills
    data.has_car = form.has_car
  }

  emit('submit', data)
}
</script>
