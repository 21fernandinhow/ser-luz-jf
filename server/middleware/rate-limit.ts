import { getRequestIP } from 'h3'
import { createAppError } from '~/server/utils/errors'

const WINDOW_MS = 15 * 60 * 1000 // 15 minutos
const MAX_REQUESTS = 5

interface RateEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateEntry>()

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/register/')) return

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const key = `${ip}:${event.path}`
  const now = Date.now()

  let entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS }
    store.set(key, entry)
  }

  entry.count++

  if (entry.count > MAX_REQUESTS) {
    throw createAppError({
      code: 'RATE_LIMIT',
      message: 'Muitas tentativas. Tente novamente em alguns minutos.',
    })
  }
})
