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
          <!-- QR Code -->
          <div class="flex justify-center">
            <img src="/qrcode-pix.png" alt="QR Code Pix" class="w-48 h-48 object-contain rounded-xl border border-gray-100" />
          </div>

          <!-- Chave Pix + botão copiar -->
          <div class="bg-surface-muted rounded-xl p-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Chave Pix</p>
            <p class="font-mono text-xs text-gray-800 break-all select-all mb-3">{{ pixKey }}</p>
            <button
              class="w-full flex items-center justify-center gap-2 bg-brand-blue text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-brand-blue/90 transition"
              @click="copyKey"
            >
              <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {{ copied ? 'Chave copiada!' : 'Copiar chave' }}
            </button>
          </div>
        </div>

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

const pixKey = '00020126360014BR.GOV.BCB.PIX0114427123650001995204000053039865802BR5901N6001C62170513ProjetoSerLuz6304F832'

const copied = ref(false)

async function copyKey() {
  await navigator.clipboard.writeText(pixKey)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2500)
}
</script>
