import type { ProfileRow } from '~/server/utils/rbac'
import { requireProfile } from '~/server/utils/rbac'
import { validatePatchMe } from '~/server/utils/validation'
import { createAppError } from '~/server/utils/errors'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'

function serializeProfile(profile: ProfileRow, isAdmin: boolean) {
  const data: Record<string, unknown> = {
    id: profile.id,
    role: profile.role,
    status: profile.status,
    email: profile.email,
    full_name: profile.full_name,
    phone: profile.phone,
    cep: profile.cep,
    neighborhood: profile.neighborhood,
    street: profile.street,
    address_number: profile.address_number,
    complement: profile.complement,
    document_id: profile.document_id,
    household_size: profile.household_size,
    has_children: profile.has_children,
    has_elderly: profile.has_elderly,
    children_count: profile.children_count,
    children_ages_description: profile.children_ages_description,
    clothing_sizes: profile.clothing_sizes,
    current_greatest_need: profile.current_greatest_need,
    availability: profile.availability,
    skills: profile.skills,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  }
  if (isAdmin) data.internal_notes = profile.internal_notes
  return data
}

export default defineEventHandler(async (event) => {
  const profile = await requireProfile(event)
  const body = await readBody(event)

  const validation = validatePatchMe(body)
  if (!validation.ok) {
    throw createAppError({
      code: 'VALIDATION_ERROR',
      message: 'Dados inválidos.',
      details: { fieldErrors: validation.fieldErrors },
    })
  }

  const input = validation.data
  const updateData: Record<string, unknown> = {}

  if (input.full_name !== undefined) updateData.full_name = input.full_name
  if (input.phone !== undefined) updateData.phone = input.phone
  if (input.cep !== undefined) updateData.cep = input.cep
  if (input.neighborhood !== undefined) updateData.neighborhood = input.neighborhood
  if (input.street !== undefined) updateData.street = input.street
  if (input.address_number !== undefined) updateData.address_number = input.address_number
  if (input.complement !== undefined) updateData.complement = input.complement
  if (input.document_id !== undefined) updateData.document_id = input.document_id
  if (input.household_size !== undefined) updateData.household_size = input.household_size
  if (input.has_children !== undefined) updateData.has_children = input.has_children
  if (input.has_elderly !== undefined) updateData.has_elderly = input.has_elderly
  if (input.children_count !== undefined) updateData.children_count = input.children_count
  if (input.children_ages_description !== undefined) updateData.children_ages_description = input.children_ages_description
  if (input.clothing_sizes !== undefined) updateData.clothing_sizes = input.clothing_sizes
  if (input.current_greatest_need !== undefined) updateData.current_greatest_need = input.current_greatest_need
  if (input.availability !== undefined) updateData.availability = input.availability
  if (input.skills !== undefined) updateData.skills = input.skills
  if (input.has_car !== undefined && profile.role === 'volunteer') updateData.has_car = input.has_car

  if (Object.keys(updateData).length === 0) {
    return { data: serializeProfile(profile, profile.role === 'admin') }
  }

  const supabase = useSupabaseAdmin()
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', profile.id)
    .select()
    .single()

  if (error || !updated) {
    throw createAppError({
      code: 'INTERNAL',
      message: 'Erro ao atualizar perfil.',
    })
  }

  return { data: serializeProfile(updated as ProfileRow, (updated as ProfileRow).role === 'admin') }
})
