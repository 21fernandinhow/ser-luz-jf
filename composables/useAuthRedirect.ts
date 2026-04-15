export function useAuthRedirect() {
  const supabase = useSupabaseClient()
  // Compartilhado com auth.global.ts para evitar double-fetch após redirect
  const profileChecked = useState('profile-404-checked', () => false)

  async function redirectByRole() {
    try {
      const result = await $fetch<{ data: { role: string } }>('/api/profiles/me')
      const role = result.data?.role

      // Marca como verificado para que auth.global.ts não busque de novo
      // na navegação seguinte (ex: login → /admin)
      profileChecked.value = true

      if (role === 'admin') return navigateTo('/admin')
      if (role === 'beneficiary') return navigateTo('/painel/beneficiary')
      if (role === 'volunteer') return navigateTo('/painel/volunteer')
    } catch (error: unknown) {
      const err = error as { statusCode?: number; data?: { error?: { code?: string } } }
      const code = err?.data?.error?.code
      if (code === 'NOT_FOUND' || err?.statusCode === 404) {
        await supabase.auth.signOut()
      }
      return navigateTo('/login')
    }
  }

  return { redirectByRole }
}
