import { requireAdmin } from '~/server/utils/rbac'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'
import { createAppError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useSupabaseAdmin()

  async function count(role: string, status: string) {
    const { count: n, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', role)
      .eq('status', status)
    if (error) throw createAppError({ code: 'INTERNAL', message: 'Erro ao buscar estatísticas.' })
    return n ?? 0
  }

  const [bPend, bAppr, bRej, vPend, vAppr, vRej] = await Promise.all([
    count('beneficiary', 'pending'),
    count('beneficiary', 'approved'),
    count('beneficiary', 'rejected'),
    count('volunteer', 'pending'),
    count('volunteer', 'approved'),
    count('volunteer', 'rejected'),
  ])

  return {
    data: {
      beneficiaries: { pending: bPend, approved: bAppr, rejected: bRej, total: bPend + bAppr + bRej },
      volunteers: { pending: vPend, approved: vAppr, rejected: vRej, total: vPend + vAppr + vRej },
    },
  }
})
