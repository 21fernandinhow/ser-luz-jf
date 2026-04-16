import { validateRegisterVolunteer } from '~/server/utils/validation'
import { createAppError } from '~/server/utils/errors'
import { useSupabaseAdmin } from '~/server/utils/supabase-server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const validation = validateRegisterVolunteer(body)
  if (!validation.ok) {
    throw createAppError({
      code: 'VALIDATION_ERROR',
      message: 'Dados inválidos.',
      details: { fieldErrors: validation.fieldErrors },
    })
  }

  const { email, password, ...profileFields } = validation.data
  const supabase = useSupabaseAdmin()

  // Cria usuário no Supabase Auth via Admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    if (authError.message?.toLowerCase().includes('already')) {
      throw createAppError({
        code: 'CONFLICT',
        message: 'Este e-mail já está cadastrado.',
        details: { fieldErrors: { email: 'E-mail já cadastrado.' } },
      })
    }
    console.error('[register/volunteer] Auth error:', authError.message)
    throw createAppError({
      code: 'INTERNAL',
      message: 'Erro ao criar conta. Tente novamente.',
    })
  }

  if (!authData.user) {
    throw createAppError({ code: 'INTERNAL', message: 'Erro inesperado ao criar conta.' })
  }

  const userId = authData.user.id

  // Cria perfil no banco; se falhar, reverte o usuário Auth (compensação)
  const { error: insertError } = await supabase.from('profiles').insert({
    id: userId,
    email,
    role: 'volunteer',
    status: 'pending',
    ...profileFields,
  })

  if (insertError) {
    console.error('[register/volunteer] Profile insert error, reverting Auth user:', insertError.message)
    await supabase.auth.admin.deleteUser(userId)
    throw createAppError({
      code: 'INTERNAL',
      message: 'Erro ao salvar cadastro. Tente novamente.',
    })
  }

  setResponseStatus(event, 201)
  return {
    data: { message: 'Cadastro realizado! Sua solicitação está em análise.' },
  }
})
