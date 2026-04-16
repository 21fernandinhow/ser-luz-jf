<template>
  <div class="min-h-screen bg-surface-muted p-8">
    <h1 class="text-2xl font-semibold text-brand-blue">Projeto Ser Luz</h1>
    <p class="mt-2 text-gray-700">Home pública — sem login obrigatório.</p>
    <nav class="mt-8 flex flex-wrap gap-3">
      <NuxtLink to="/login" class="btn-primary-inline">Entrar</NuxtLink>
      <NuxtLink to="/register" class="btn-secondary">Cadastrar</NuxtLink>
      <NuxtLink to="/painel/beneficiary" class="btn-outline">Painel beneficiário</NuxtLink>
      <NuxtLink to="/painel/volunteer" class="btn-outline">Painel voluntário</NuxtLink>
      <NuxtLink to="/admin" class="btn-outline">Admin</NuxtLink>
    </nav>
    <p class="mt-6 max-w-xl text-sm text-gray-600">
      Rotas de painel e admin pedem sessão: sem estar logado, você é enviado para Entrar.
    </p>
  </div>
</template>
