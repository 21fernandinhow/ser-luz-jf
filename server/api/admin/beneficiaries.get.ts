import { requireAdmin } from '~/server/utils/rbac'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'
import { createAppError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const status = query.status as string | undefined

  const supabase = useSupabaseAdmin()
  let q = supabase
    .from('profiles')
    .select('id, email, full_name, phone, status, created_at')
    .eq('role', 'beneficiary')
    .order('created_at', { ascending: false })

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    q = q.eq('status', status)
  }

  const { data, error } = await q
  if (error) throw createAppError({ code: 'INTERNAL', message: 'Erro ao buscar beneficiários.' })

  return { data: data ?? [] }
})
