// Protege /painel/* e /admin/* — trata o caso de perfil inexistente (signOut).
// A autenticação básica (redirect para /login se não autenticado) é gerida pelo
// módulo @nuxtjs/supabase via redirectOptions.include.
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  const isProtected
    = to.path.startsWith('/painel') || to.path.startsWith('/admin')

  if (!isProtected || !user.value) return

  // Verifica uma vez por sessão se o perfil ainda existe no banco.
  const profileChecked = useState('profile-404-checked', () => false)
  if (profileChecked.value) return

  try {
    await $fetch('/api/profiles/me')
    profileChecked.value = true
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number; data?: { error?: { code?: string } } }
    const code = err?.data?.error?.code
    if (code === 'NOT_FOUND' || err?.statusCode === 404) {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
      return navigateTo('/login')
    }
    // Outros erros (rede, etc.) — não bloquear a navegação
    profileChecked.value = true
  }
})
