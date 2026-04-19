import { requireAdmin } from '~/server/utils/rbac'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'
import { createAppError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')!
  const supabase = useSupabaseAdmin()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    throw createAppError({ code: 'NOT_FOUND', message: 'Usuário não encontrado.' })
  }

  return { data: profile }
})
