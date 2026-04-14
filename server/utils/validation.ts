// Validações server-side sem dependência de libs de schema (KISS).
// Retorna { ok: true, data } ou { ok: false, fieldErrors }.

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; fieldErrors: Record<string, string> }

// ---------- Register ----------

export interface RegisterBeneficiaryInput {
  email: string
  password: string
  full_name: string
  address?: string
  phone?: string
  document_id?: string
  household_size?: number
  has_children?: boolean
  children_count?: number
  children_ages_description?: string
  clothing_sizes?: string
  current_greatest_need?: string
}

export interface RegisterVolunteerInput {
  email: string
  password: string
  full_name: string
  address?: string
  phone?: string
  document_id?: string
  availability?: string
  skills?: string
}

export function validateRegisterBeneficiary(
  body: unknown,
): Result<RegisterBeneficiaryInput> {
  const b = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@')) {
    fieldErrors.email = 'E-mail inválido.'
  }
  if (!b.password || typeof b.password !== 'string' || (b.password as string).length < 6) {
    fieldErrors.password = 'Senha deve ter ao menos 6 caracteres.'
  }
  if (!b.full_name || typeof b.full_name !== 'string' || !(b.full_name as string).trim()) {
    fieldErrors.full_name = 'Nome completo é obrigatório.'
  }
  if (
    b.household_size !== undefined &&
    (typeof b.household_size !== 'number' || (b.household_size as number) < 1)
  ) {
    fieldErrors.household_size = 'Tamanho do domicílio deve ser ao menos 1.'
  }
  if (b.has_children === true) {
    if (!b.children_count || typeof b.children_count !== 'number' || (b.children_count as number) < 1) {
      fieldErrors.children_count = 'Informe o número de filhos.'
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  return {
    ok: true,
    data: {
      email: b.email as string,
      password: b.password as string,
      full_name: (b.full_name as string).trim(),
      address: typeof b.address === 'string' ? b.address : undefined,
      phone: typeof b.phone === 'string' ? b.phone : undefined,
      document_id: typeof b.document_id === 'string' ? b.document_id : undefined,
      household_size: typeof b.household_size === 'number' ? b.household_size : undefined,
      has_children: typeof b.has_children === 'boolean' ? b.has_children : undefined,
      children_count: typeof b.children_count === 'number' ? b.children_count : undefined,
      children_ages_description:
        typeof b.children_ages_description === 'string' ? b.children_ages_description : undefined,
      clothing_sizes: typeof b.clothing_sizes === 'string' ? b.clothing_sizes : undefined,
      current_greatest_need:
        typeof b.current_greatest_need === 'string' ? b.current_greatest_need : undefined,
    },
  }
}

export function validateRegisterVolunteer(
  body: unknown,
): Result<RegisterVolunteerInput> {
  const b = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@')) {
    fieldErrors.email = 'E-mail inválido.'
  }
  if (!b.password || typeof b.password !== 'string' || (b.password as string).length < 6) {
    fieldErrors.password = 'Senha deve ter ao menos 6 caracteres.'
  }
  if (!b.full_name || typeof b.full_name !== 'string' || !(b.full_name as string).trim()) {
    fieldErrors.full_name = 'Nome completo é obrigatório.'
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  return {
    ok: true,
    data: {
      email: b.email as string,
      password: b.password as string,
      full_name: (b.full_name as string).trim(),
      address: typeof b.address === 'string' ? b.address : undefined,
      phone: typeof b.phone === 'string' ? b.phone : undefined,
      document_id: typeof b.document_id === 'string' ? b.document_id : undefined,
      availability: typeof b.availability === 'string' ? b.availability : undefined,
      skills: typeof b.skills === 'string' ? b.skills : undefined,
    },
  }
}

// ---------- PATCH /api/profiles/me ----------

const FORBIDDEN_PATCH_ME_KEYS = ['internal_notes', 'status', 'role', 'email', 'id']

export interface PatchMeInput {
  full_name?: string
  address?: string
  phone?: string
  document_id?: string
  household_size?: number
  has_children?: boolean
  children_count?: number
  children_ages_description?: string
  clothing_sizes?: string
  current_greatest_need?: string
  availability?: string
  skills?: string
}

export function validatePatchMe(body: unknown): Result<PatchMeInput> {
  const b = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  // Remove chaves proibidas silenciosamente
  const sanitized: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(b)) {
    if (!FORBIDDEN_PATCH_ME_KEYS.includes(k)) sanitized[k] = v
  }

  if (
    sanitized.household_size !== undefined &&
    (typeof sanitized.household_size !== 'number' || (sanitized.household_size as number) < 1)
  ) {
    fieldErrors.household_size = 'Tamanho do domicílio deve ser ao menos 1.'
  }
  if (sanitized.has_children === true) {
    if (
      sanitized.children_count !== undefined &&
      (typeof sanitized.children_count !== 'number' || (sanitized.children_count as number) < 1)
    ) {
      fieldErrors.children_count = 'Informe o número de filhos.'
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  return { ok: true, data: sanitized as PatchMeInput }
}
