import { requireAdmin } from '~/server/utils/rbac'
import { createAppError } from '~/server/utils/errors'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'

const VALID_STATUS = ['approved', 'rejected'] as const
type ValidStatus = (typeof VALID_STATUS)[number]

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const status = body?.status as string | undefined

  if (!status || !VALID_STATUS.includes(status as ValidStatus)) {
    throw createAppError({
      code: 'VALIDATION_ERROR',
      message: 'Status inválido. Use "approved" ou "rejected".',
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

  const { data: updated, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single()

  if (error || !updated) {
    throw createAppError({ code: 'INTERNAL', message: 'Erro ao atualizar status.' })
  }

  return { data: updated }
})
