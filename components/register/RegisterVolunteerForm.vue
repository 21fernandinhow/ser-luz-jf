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
          Você já pode fazer login. Aguarde a aprovação da equipe do Projeto Ser Luz para começar a voluntariar.
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
          <label for="v-email" class="label-base">
            E-mail <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="v-email" v-model="form.email" type="email" required autocomplete="email"
            placeholder="seu@email.com" maxlength="254" :disabled="loading" class="input-base"
            :class="fieldErrors.email ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
        </div>

        <div>
          <label for="v-password" class="label-base">
            Senha <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="v-password" v-model="form.password" type="password" required autocomplete="new-password"
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
          <label for="v-full-name" class="label-base">
            Nome completo <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="v-full-name" v-model="form.full_name" type="text" required autocomplete="name"
            maxlength="150" :disabled="loading" class="input-base"
            :class="fieldErrors.full_name ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.full_name" class="field-error">{{ fieldErrors.full_name }}</p>
        </div>

        <div>
          <label for="v-phone" class="label-base">
            Telefone <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="v-phone" :value="form.phone" type="tel" required autocomplete="tel"
            placeholder="(00) 00000-0000" maxlength="15" :disabled="loading" class="input-base"
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
            placeholder="Ex: finais de semana, manhãs de terça e quinta..." :disabled="loading"
            class="textarea-base" :class="fieldErrors.availability ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.availability" class="field-error">{{ fieldErrors.availability }}</p>
        </div>

        <div>
          <label for="v-skills" class="label-base">
            Habilidades / Como posso ajudar <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <textarea id="v-skills" v-model="form.skills" rows="3" required maxlength="1000"
            placeholder="Ex: dirigir, cozinhar, organizar eventos..." :disabled="loading"
            class="textarea-base" :class="fieldErrors.skills ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="fieldErrors.skills" class="field-error">{{ fieldErrors.skills }}</p>
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
  phone: '',
  availability: '',
  skills: '',
})

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

async function handleSubmit() {
  loading.value = true
  generalError.value = ''
  fieldErrors.value = {}

  try {
    await $fetch('/api/register/volunteer', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone: form.phone,
        availability: form.availability,
        skills: form.skills,
      },
    })
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
