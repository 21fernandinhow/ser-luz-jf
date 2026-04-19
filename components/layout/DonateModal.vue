<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="close"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-brand-blue">Fazer uma Doação</h2>
          <button
            class="text-gray-400 hover:text-gray-600 transition"
            aria-label="Fechar"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-gray-600 mb-6 text-sm leading-relaxed">
          Sua doação faz a diferença na vida de famílias que precisam de apoio. Obrigado por ajudar o Projeto Ser Luz!
        </p>

        <div class="space-y-4">
          <div v-if="config.public.donatePixKey" class="bg-surface-muted rounded-xl p-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Chave Pix</p>
            <p class="font-mono text-sm text-gray-800 break-all select-all">{{ config.public.donatePixKey }}</p>
          </div>

          <div v-if="config.public.donateBankInfo" class="bg-surface-muted rounded-xl p-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Dados Bancários</p>
            <p class="text-sm text-gray-800 whitespace-pre-line">{{ config.public.donateBankInfo }}</p>
          </div>

          <a
            v-if="config.public.donateExternalLink"
            :href="config.public.donateExternalLink"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full text-center bg-brand-blue text-white font-semibold py-3 rounded-xl hover:bg-brand-blue/90 transition"
          >
            Acessar link de doação
          </a>
        </div>

        <p
          v-if="!config.public.donatePixKey && !config.public.donateBankInfo && !config.public.donateExternalLink"
          class="text-sm text-gray-500 text-center"
        >
          Entre em contato com a ONG para obter informações sobre doações.
        </p>

        <button
          class="mt-6 w-full border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition"
          @click="close"
        >
          Fechar
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { isOpen, close } = useDonateModal()
const config = useRuntimeConfig()
</script>
