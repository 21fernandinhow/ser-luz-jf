import type { ProfileRow } from '~/server/utils/rbac'
import { requireProfile } from '~/server/utils/rbac'

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
  return { data: serializeProfile(profile, profile.role === 'admin') }
})
