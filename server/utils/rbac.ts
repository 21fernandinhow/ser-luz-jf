import type { H3Event } from 'h3'
import type { Profile } from '@prisma/client'
import { getAuthUser } from './supabase-server'
import prisma from './prisma'
import { createAppError } from './errors'

export async function requireProfile(event: H3Event): Promise<Profile> {
  const authUser = await getAuthUser(event)
  if (!authUser) {
    throw createAppError({
      code: 'UNAUTHORIZED',
      message: 'Autenticação necessária.',
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: authUser.sub },
  })

  if (!profile) {
    throw createAppError({
      code: 'NOT_FOUND',
      message: 'Perfil não encontrado.',
    })
  }

  return profile
}

export async function requireAdmin(event: H3Event): Promise<Profile> {
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
  profile: Profile,
  targetId: string,
): void {
  if (profile.role !== 'admin' && profile.id !== targetId) {
    throw createAppError({
      code: 'FORBIDDEN',
      message: 'Acesso negado.',
    })
  }
}
