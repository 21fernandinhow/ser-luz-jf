/**
 * Cria o primeiro usuário admin via service_role.
 * Executar uma única vez: npx tsx scripts/bootstrap-admin.ts
 *
 * Requer variáveis no ambiente:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
 *
 * Exemplo:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... DATABASE_URL=... \
 *     npx tsx scripts/bootstrap-admin.ts
 */

import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente.')
    process.exit(1)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const prisma = new PrismaClient()

  // Cria usuário no Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  })

  if (error) {
    console.error('Erro ao criar usuário no Auth:', error.message)
    process.exit(1)
  }

  if (!data.user) {
    console.error('Erro inesperado: usuário não retornado pelo Auth.')
    process.exit(1)
  }

  const userId = data.user.id
  console.log(`Usuário Auth criado: ${userId}`)

  // Cria perfil admin no Prisma
  const profile = await prisma.profile.create({
    data: {
      id: userId,
      email: ADMIN_EMAIL,
      role: 'admin',
      status: 'approved',
    },
  })

  console.log(`Perfil admin criado: ${profile.id} (${ADMIN_EMAIL})`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
