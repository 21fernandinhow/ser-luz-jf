import { createError as h3CreateError } from 'h3'

type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL'

interface AppErrorOptions {
  code: ErrorCode
  message: string
  details?: { fieldErrors?: Record<string, string>; [key: string]: unknown }
  statusCode?: number
}

export function createAppError({
  code,
  message,
  details,
  statusCode,
}: AppErrorOptions) {
  const statusMap: Record<ErrorCode, number> = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    CONFLICT: 409,
    INTERNAL: 500,
  }

  return h3CreateError({
    statusCode: statusCode ?? statusMap[code],
    data: { error: { code, message, details: details ?? {} } },
  })
}
