import { serverSupabaseUser } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export function useSupabaseAdmin() {
  const config = useRuntimeConfig()
  return createClient(
    process.env.SUPABASE_URL!,
    config.supabaseServiceRoleKey as string,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export async function getAuthUser(
  event: H3Event,
): Promise<{ sub: string; email: string } | null> {
  const user = await serverSupabaseUser(event)
  if (!user) return null
  return { sub: user.id, email: user.email ?? '' }
}
