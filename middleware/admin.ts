// Middleware nomeado: aplique via definePageMeta({ middleware: ['admin'] })
// nas páginas de /admin/**.
export default defineNuxtRouteMiddleware(async () => {
  try {
    const result = await $fetch<{ data: { role: string } }>('/api/profiles/me')
    const role = result.data?.role

    if (role !== 'admin') {
      if (role === 'beneficiary') return navigateTo('/painel/beneficiary')
      if (role === 'volunteer') return navigateTo('/painel/volunteer')
      return navigateTo('/login')
    }
  }
  catch {
    return navigateTo('/login')
  }
})
