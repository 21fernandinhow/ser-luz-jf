import type { H3Event } from 'h3'
import { getAuthUser, useSupabaseAdmin } from './supabase-server'
import { createAppError } from './errors'

// Tipo espelhando as colunas da tabela profiles (snake_case conforme Postgres)
export interface ProfileRow {
  id: string
  role: 'admin' | 'beneficiary' | 'volunteer'
  status: 'pending' | 'approved' | 'rejected'
  email: string
  internal_notes: string | null
  created_at: string
  updated_at: string
  full_name: string | null
  address: string | null
  phone: string | null
  document_id: string | null
  household_size: number | null
  has_children: boolean | null
  children_count: number | null
  children_ages_description: string | null
  clothing_sizes: string | null
  current_greatest_need: string | null
  availability: string | null
  skills: string | null
}

export async function requireProfile(event: H3Event): Promise<ProfileRow> {
  const authUser = await getAuthUser(event)
  if (!authUser) {
    throw createAppError({
      code: 'UNAUTHORIZED',
      message: 'Autenticação necessária.',
    })
  }

  const supabase = useSupabaseAdmin()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.sub)
    .single()

  if (error || !profile) {
    throw createAppError({
      code: 'NOT_FOUND',
      message: 'Perfil não encontrado.',
    })
  }

  return profile as ProfileRow
}

export async function requireAdmin(event: H3Event): Promise<ProfileRow> {
  const profile = await requireProfile(event)

  if (profile.role !== 'admin') {
    throw createAppError({
      code: 'FORBIDDEN',
      message: 'Acesso restrito a administradores.',
    })
  }

  return profile
}

export function assertSelfOrAdmin(
  profile: ProfileRow,
  targetId: string,
): void {
  if (profile.role !== 'admin' && profile.id !== targetId) {
    throw createAppError({
      code: 'FORBIDDEN',
      message: 'Acesso negado.',
    })
  }
}
