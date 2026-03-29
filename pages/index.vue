<template>
  <div class="min-h-screen bg-surface-muted p-8">
    <h1 class="text-2xl font-semibold text-brand-blue">Projeto Ser Luz</h1>
    <p class="mt-2 text-gray-700">Home pública — sem login obrigatório.</p>
    <nav class="mt-8 flex flex-wrap gap-3">
      <NuxtLink
        to="/login"
        class="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Entrar
      </NuxtLink>
      <NuxtLink
        to="/register"
        class="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
      >
        Cadastrar
      </NuxtLink>
      <NuxtLink
        to="/painel/beneficiary"
        class="rounded-lg border border-brand-blue px-4 py-2 text-sm font-medium text-brand-blue hover:bg-white"
      >
        Painel beneficiário
      </NuxtLink>
      <NuxtLink
        to="/painel/volunteer"
        class="rounded-lg border border-brand-blue px-4 py-2 text-sm font-medium text-brand-blue hover:bg-white"
      >
        Painel voluntário
      </NuxtLink>
      <NuxtLink
        to="/admin"
        class="rounded-lg border border-brand-blue px-4 py-2 text-sm font-medium text-brand-blue hover:bg-white"
      >
        Admin
      </NuxtLink>
    </nav>
    <p class="mt-6 max-w-xl text-sm text-gray-600">
      Rotas de painel e admin pedem sessão: sem estar logado, você é enviado para Entrar.
    </p>
  </div>
</template>
