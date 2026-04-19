<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppHeader />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <footer class="bg-brand-blue text-blue-200 text-center text-xs py-6 shrink-0">
      © {{ new Date().getFullYear() }} Projeto Ser Luz · Todos os direitos reservados
    </footer>
    <ClientOnly><DonateModal /></ClientOnly>
  </div>
</template>
