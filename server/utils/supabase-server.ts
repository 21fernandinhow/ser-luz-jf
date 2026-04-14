import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { getHeader } from 'h3'

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
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  if (!token) return null

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null

  return {
    sub: data.user.id,
    email: data.user.email ?? '',
  }
}
