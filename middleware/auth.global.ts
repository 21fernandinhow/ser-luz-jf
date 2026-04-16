// Protege /painel/* e /admin/*:
//   1. Busca o perfil (cache por userId para evitar refetch a cada navegação).
//   2. Trata perfil inexistente (signOut).
//   3. Garante que cada role só acessa o próprio painel.
// A autenticação básica (redirect para /login) é gerida pelo @nuxtjs/supabase.
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  const isProtected
    = to.path.startsWith('/painel') || to.path.startsWith('/admin')

  if (!isProtected || !user.value) return

  // Cache de perfil vinculado ao userId — invalida automaticamente ao trocar de conta.
  const cachedProfile = useState<{ role: string; userId: string } | null>(
    'auth-profile-cache',
    () => null,
  )

  if (cachedProfile.value?.userId !== user.value.id) {
    cachedProfile.value = null
  }

  if (!cachedProfile.value) {
    try {
      const result = await $fetch<{ data: { role: string } }>('/api/profiles/me')
      cachedProfile.value = { role: result.data.role, userId: user.value.id }
    }
    catch (error: unknown) {
      const err = error as { statusCode?: number; data?: { error?: { code?: string } } }
      const code = err?.data?.error?.code
      if (code === 'NOT_FOUND' || err?.statusCode === 404) {
        const supabase = useSupabaseClient()
        await supabase.auth.signOut()
        return navigateTo('/login')
      }
      return // Erros de rede: não bloquear
    }
  }

  const role = cachedProfile.value.role

  // Regras de acesso por rota
  if (to.path.startsWith('/admin') && role !== 'admin') {
    return navigateTo(role === 'volunteer' ? '/painel/volunteer' : '/painel/beneficiary')
  }

  if (to.path.startsWith('/painel/beneficiary') && role !== 'beneficiary') {
    return navigateTo(role === 'admin' ? '/admin' : '/painel/volunteer')
  }

  if (to.path.startsWith('/painel/volunteer') && role !== 'volunteer') {
    return navigateTo(role === 'admin' ? '/admin' : '/painel/beneficiary')
  }
})
