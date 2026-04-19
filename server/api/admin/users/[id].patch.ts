import { requireAdmin } from '~/server/utils/rbac'
import { validateAdminPatch } from '~/server/utils/validation'
import { createAppError } from '~/server/utils/errors'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const validation = validateAdminPatch(body)
  if (!validation.ok) {
    throw createAppError({
      code: 'VALIDATION_ERROR',
      message: 'Dados inválidos.',
      details: { fieldErrors: validation.fieldErrors },
    })
  }

  const supabase = useSupabaseAdmin()

  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .single()

  if (findError || !existing) {
    throw createAppError({ code: 'NOT_FOUND', message: 'Usuário não encontrado.' })
  }

  if (Object.keys(validation.data).length === 0) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single()
    return { data: profile }
  }

  const { data: updated, error } = await supabase
    .from('profiles')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    throw createAppError({ code: 'INTERNAL', message: 'Erro ao atualizar usuário.' })
  }

  return { data: updated }
})
