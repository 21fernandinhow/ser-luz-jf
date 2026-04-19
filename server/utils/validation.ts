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
  address: string
  phone: string
  document_id: string
  household_size: number
  has_children: boolean
  current_greatest_need: string
  children_count?: number
  children_ages_description?: string
  clothing_sizes?: string
}

export interface RegisterVolunteerInput {
  email: string
  password: string
  full_name: string
  phone: string
  availability: string
  skills: string
}

export function validateRegisterBeneficiary(
  body: unknown,
): Result<RegisterBeneficiaryInput> {
  const b = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@')) {
    fieldErrors.email = 'E-mail inválido.'
  }
  else if ((b.email as string).length > 254) {
    fieldErrors.email = 'E-mail muito longo.'
  }
  if (!b.password || typeof b.password !== 'string' || (b.password as string).length < 6) {
    fieldErrors.password = 'Senha deve ter ao menos 6 caracteres.'
  }
  else if ((b.password as string).length > 72) {
    fieldErrors.password = 'Senha deve ter no máximo 72 caracteres.'
  }
  if (!b.full_name || typeof b.full_name !== 'string' || !(b.full_name as string).trim()) {
    fieldErrors.full_name = 'Nome completo é obrigatório.'
  }
  else if ((b.full_name as string).length > 150) {
    fieldErrors.full_name = 'Nome muito longo (máx. 150 caracteres).'
  }
  if (!b.address || typeof b.address !== 'string' || !(b.address as string).trim()) {
    fieldErrors.address = 'Endereço é obrigatório.'
  }
  else if ((b.address as string).length > 300) {
    fieldErrors.address = 'Endereço muito longo (máx. 300 caracteres).'
  }
  if (!b.phone || typeof b.phone !== 'string' || !(b.phone as string).trim()) {
    fieldErrors.phone = 'Telefone é obrigatório.'
  }
  else {
    const digits = (b.phone as string).replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 11) {
      fieldErrors.phone = 'Telefone inválido.'
    }
  }
  if (!b.document_id || typeof b.document_id !== 'string' || !(b.document_id as string).trim()) {
    fieldErrors.document_id = 'CPF ou RG é obrigatório.'
  }
  if (!b.household_size || typeof b.household_size !== 'number' || (b.household_size as number) < 1) {
    fieldErrors.household_size = 'Informe o número de pessoas na família.'
  }
  else if ((b.household_size as number) > 50) {
    fieldErrors.household_size = 'Valor muito alto (máx. 50).'
  }
  if (typeof b.has_children !== 'boolean') {
    fieldErrors.has_children = 'Informe se há crianças.'
  }
  if (!b.current_greatest_need || typeof b.current_greatest_need !== 'string' || !(b.current_greatest_need as string).trim()) {
    fieldErrors.current_greatest_need = 'Informe a maior necessidade no momento.'
  }
  else if ((b.current_greatest_need as string).length > 1000) {
    fieldErrors.current_greatest_need = 'Texto muito longo (máx. 1000 caracteres).'
  }
  if (b.has_children === true) {
    if (!b.children_count || typeof b.children_count !== 'number' || (b.children_count as number) < 1) {
      fieldErrors.children_count = 'Informe o número de crianças.'
    }
    else if ((b.children_count as number) > 20) {
      fieldErrors.children_count = 'Valor muito alto (máx. 20).'
    }
  }
  if (typeof b.children_ages_description === 'string' && (b.children_ages_description as string).length > 200) {
    fieldErrors.children_ages_description = 'Texto muito longo (máx. 200 caracteres).'
  }
  if (typeof b.clothing_sizes === 'string' && (b.clothing_sizes as string).length > 100) {
    fieldErrors.clothing_sizes = 'Texto muito longo (máx. 100 caracteres).'
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  return {
    ok: true,
    data: {
      email: b.email as string,
      password: b.password as string,
      full_name: (b.full_name as string).trim(),
      address: (b.address as string).trim(),
      phone: b.phone as string,
      document_id: (b.document_id as string).trim(),
      household_size: b.household_size as number,
      has_children: b.has_children as boolean,
      current_greatest_need: (b.current_greatest_need as string).trim(),
      children_count: typeof b.children_count === 'number' ? b.children_count : undefined,
      children_ages_description:
        typeof b.children_ages_description === 'string' ? b.children_ages_description : undefined,
      clothing_sizes: typeof b.clothing_sizes === 'string' ? b.clothing_sizes : undefined,
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
  else if ((b.email as string).length > 254) {
    fieldErrors.email = 'E-mail muito longo.'
  }
  if (!b.password || typeof b.password !== 'string' || (b.password as string).length < 6) {
    fieldErrors.password = 'Senha deve ter ao menos 6 caracteres.'
  }
  else if ((b.password as string).length > 72) {
    fieldErrors.password = 'Senha deve ter no máximo 72 caracteres.'
  }
  if (!b.full_name || typeof b.full_name !== 'string' || !(b.full_name as string).trim()) {
    fieldErrors.full_name = 'Nome completo é obrigatório.'
  }
  else if ((b.full_name as string).length > 150) {
    fieldErrors.full_name = 'Nome muito longo (máx. 150 caracteres).'
  }
  if (!b.phone || typeof b.phone !== 'string' || !(b.phone as string).trim()) {
    fieldErrors.phone = 'Telefone é obrigatório.'
  }
  else {
    const digits = (b.phone as string).replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 11) {
      fieldErrors.phone = 'Telefone inválido.'
    }
  }
  if (!b.availability || typeof b.availability !== 'string' || !(b.availability as string).trim()) {
    fieldErrors.availability = 'Disponibilidade é obrigatória.'
  }
  else if ((b.availability as string).length > 500) {
    fieldErrors.availability = 'Texto muito longo (máx. 500 caracteres).'
  }
  if (!b.skills || typeof b.skills !== 'string' || !(b.skills as string).trim()) {
    fieldErrors.skills = 'Informe suas habilidades.'
  }
  else if ((b.skills as string).length > 1000) {
    fieldErrors.skills = 'Texto muito longo (máx. 1000 caracteres).'
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  return {
    ok: true,
    data: {
      email: b.email as string,
      password: b.password as string,
      full_name: (b.full_name as string).trim(),
      phone: b.phone as string,
      availability: (b.availability as string).trim(),
      skills: (b.skills as string).trim(),
    },
  }
}

// ---------- PATCH /api/admin/users/:id ----------

const FORBIDDEN_ADMIN_PATCH_KEYS = ['id', 'email', 'role', 'status', 'created_at', 'updated_at']

export interface AdminPatchInput {
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
  internal_notes?: string
}

export function validateAdminPatch(body: unknown): Result<AdminPatchInput> {
  const b = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  const sanitized: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(b)) {
    if (!FORBIDDEN_ADMIN_PATCH_KEYS.includes(k)) sanitized[k] = v
  }

  if (typeof sanitized.full_name === 'string' && sanitized.full_name.length > 150) {
    fieldErrors.full_name = 'Nome muito longo (máx. 150 caracteres).'
  }
  if (typeof sanitized.address === 'string' && sanitized.address.length > 300) {
    fieldErrors.address = 'Endereço muito longo (máx. 300 caracteres).'
  }
  if (
    sanitized.household_size !== undefined &&
    (typeof sanitized.household_size !== 'number' || (sanitized.household_size as number) < 1)
  ) {
    fieldErrors.household_size = 'Tamanho do domicílio deve ser ao menos 1.'
  }
  if (
    sanitized.children_count !== undefined &&
    (typeof sanitized.children_count !== 'number' || (sanitized.children_count as number) < 1)
  ) {
    fieldErrors.children_count = 'Informe o número de crianças.'
  }
  if (typeof sanitized.internal_notes === 'string' && sanitized.internal_notes.length > 2000) {
    fieldErrors.internal_notes = 'Notas muito longas (máx. 2000 caracteres).'
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }
  return { ok: true, data: sanitized as AdminPatchInput }
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
