# Roadmap de desenvolvimento — MVP Ser Luz

Plano por fases derivado da `spec.md`. Cada item é uma unidade de trabalho entregável.

---

## Estado inicial (Fase 0 — concluída)

- Nuxt 3 + Tailwind + `@nuxtjs/supabase` instalados
- `prisma/schema.prisma` (stub mínimo), `server/utils/prisma.ts`
- `nuxt.config.ts` com redirect config; `tailwind.config.ts` com paleta de marca
- Estrutura de pastas criada; páginas stub; `assets/logo.webp`; `public/favicon.ico`; `.env.example`

---

## Fase 1 — Schema e infra de servidor - Concluida

**Objetivo:** banco pronto e utilitários server-side completos.

- [x] Expandir `prisma/schema.prisma` — enums `Role`/`ProfileStatus`, todos os campos (spec §3.2), índices `role`, `status`, `created_at`
- [x] Rodar migration — `init_profiles` aplicada via Supabase MCP
- [x] `server/utils/supabase-server.ts` — cliente `service_role` + helper `getAuthUser(event)`
- [x] `server/utils/errors.ts` — `createError` padronizado `{ error: { code, message, details } }`
- [x] `server/utils/rbac.ts` — `requireAdmin`, `requireProfile`, `assertSelfOrAdmin`
- [x] `server/utils/validation.ts` — validações de register (beneficiário/voluntário) + patch me
- [x] `scripts/bootstrap-admin.ts` — cria primeiro admin via `service_role`

---

## Fase 2 — Auth e perfil - Concluida

**Objetivo:** login funcional, sessão e perfil do usuário autenticado.

- [x] `server/api/profiles/me.get.ts` — retorna perfil do JWT; omite `internalNotes` se não admin
- [x] `server/api/profiles/me.patch.ts` — atualiza campos permitidos por role; bloqueia campos proibidos
- [x] `composables/useAuthRedirect.ts` — redireciona após login por role (`admin` → `/admin`, etc.)
- [x] `middleware/auth.global.ts` — protege `/painel/*` e `/admin/*`; trata perfil 404 (signOut)
- [x] `middleware/admin.ts` — verifica `role === admin` para `/admin/**`
- [x] `pages/login.vue` — formulário real `signInWithPassword` + redirect por role
- [x] `pages/confirm.vue` — callback PKCE do Supabase Auth
- [x] `layouts/default.vue` — header público (logo, Doar, UserMenu)
- [x] `components/layout/AppHeader.vue` — `<img src="/logo.webp">` + nav
- [x] `components/layout/UserMenu.vue` — ícone usuário, link painel/logout

---

## Fase 3 — Cadastro público - Concluida

**Objetivo:** registro de beneficiário e voluntário via API pública.

- [x] `server/api/register/beneficiary.post.ts` — Admin API cria Auth user → Prisma `profiles` (`status: pending`)
- [x] `server/api/register/volunteer.post.ts` — idem volunteer
- [x] `composables/useRegisterTab.ts` — sync `?type=beneficiary|volunteer` com aba ativa
- [x] `components/register/RegisterBeneficiaryForm.vue` — HTML5 + todos os campos (spec §6.2)
- [x] `components/register/RegisterVolunteerForm.vue` — HTML5 + campos disponibilidade/skills
- [x] `pages/register.vue` — tabs + composable + exibe `fieldErrors` da API

---

## Fase 4 — Painéis (beneficiário/voluntário) - Concluida

**Objetivo:** usuário vê e edita sua ficha; vê badge de status.

- [x] `components/auth/StatusBadge.vue` — `pending|approved|rejected` → texto PT + cor
- [x] `layouts/panel.vue` — header simplificado com contexto de painel
- [x] `pages/painel/beneficiary.vue` — carrega `GET /api/profiles/me`, submete `PATCH`, exibe status
- [x] `pages/painel/volunteer.vue` — idem para voluntário

---

## Fase 5 — Admin - Concluída

**Objetivo:** admin lista, filtra, aprova/rejeita, edita e apaga usuários.

- [x] `server/api/admin/beneficiaries.get.ts` — lista `role=beneficiary`, query `?status=`
- [x] `server/api/admin/volunteers.get.ts` — idem volunteer
- [x] `server/api/admin/users/[id].get.ts` — detalhe completo incl. `internalNotes`
- [x] `server/api/admin/users/[id].patch.ts` — atualização ampla por admin
- [x] `server/api/admin/users/[id]/status.patch.ts` — `{ status: approved|rejected }` idempotente
- [x] `server/api/admin/users/[id].delete.ts` — Supabase delete profiles + Auth `deleteUser`
- [x] `layouts/admin.vue` — nav top entre beneficiários e voluntários
- [x] `pages/admin/index.vue` — dashboard com contadores e links
- [x] `pages/admin/beneficiaries.vue` — tabela + filtro por status
- [x] `pages/admin/volunteers.vue` — idem
- [x] `pages/admin/users/[id].vue` — detalhe + edição + ação de status + delete com confirmação
- [x] `components/admin/UserTable.vue` — tabela reutilizável beneficiários/voluntários
- [x] `components/admin/StatusFilter.vue` — filtro por `pending|approved|rejected`
- [x] `components/admin/UserEditForm.vue` — formulário de edição com campos admin
- [x] `server/api/admin/stats.get.ts` — contadores por role/status para o dashboard

---

## Fase 6 — Institucional e polimento

**Objetivo:** home real, modal Doar, acessibilidade e segurança.

- [ ] `pages/index.vue` — hero, blocos institucionais, CTAs `/register?type=...`, abre modal Doar
- [ ] `components/layout/DonateModal.vue` — Pix/banco via `runtimeConfig` público
- [ ] `composables/useDonateModal.ts` — `useState('donate-open')`
- [ ] RLS no Supabase — políticas que espelham RBAC como camada extra
- [ ] Rate limit — middleware Nitro por IP em `POST /api/register/*`
- [ ] Revisão de copy — todas as mensagens de erro e textos de UI em português

---

## Fase 7 — Deploy

**Objetivo:** produção no Vercel com banco Supabase real.

- [ ] Vercel project — framework preset Nuxt 3; `postinstall: prisma generate`
- [ ] Variáveis de ambiente — todas de `spec.md §12.1` configuradas no dashboard Vercel
- [ ] `prisma migrate deploy` — rodar no CI/build apontando para Supabase produção
- [ ] `bootstrap-admin` — executar uma vez em produção para criar o primeiro admin
- [ ] Smoke test — cadastro → login → painel → aprovação admin → delete definitivo

---

*Documento derivado de `spec.md`. Ajustar nomes de arquivo e rotas ao padrão consolidado no repositório.*
