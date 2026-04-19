import { requireAdmin } from '~/server/utils/rbac'
import { createAppError } from '~/server/utils/errors'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')!
  const supabase = useSupabaseAdmin()

  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .single()

  if (findError || !existing) {
    throw createAppError({ code: 'NOT_FOUND', message: 'Usuário não encontrado.' })
  }

  const { error: deleteProfileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (deleteProfileError) {
    console.error('[admin/delete] Profile delete error:', deleteProfileError.message)
    throw createAppError({ code: 'INTERNAL', message: 'Erro ao remover usuário.' })
  }

  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(id)
  if (deleteAuthError) {
    // Profile already deleted; log for manual recovery
    console.error('[admin/delete] Auth user delete failed after profile removal:', deleteAuthError.message)
  }

  return { data: { message: 'Usuário removido com sucesso.' } }
})
