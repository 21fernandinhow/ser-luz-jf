# CLAUDE.md — Projeto Ser Luz

> **Este arquivo é um atalho de orientação rápida para agentes.**
> A fonte de verdade do projeto são os documentos em `docs/`:
> - `docs/PRD.md` — requisitos de produto, regras de negócio, UX
> - `docs/spec.md` — especificação técnica detalhada (arquitetura, API, banco, fluxos)
> - `docs/roadmap.md` — fases de desenvolvimento com checklist de tarefas
>
> Sempre consulte essas docs antes de tomar decisões de implementação.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Nuxt 3 (UI + API Nitro no mesmo deploy) |
| Estilo | Tailwind CSS (paleta da marca em `tailwind.config.ts`) |
| Auth | Supabase Auth (`@nuxtjs/supabase`) |
| ORM | Prisma → PostgreSQL (Supabase) |
| Deploy | Vercel |

## Convenções de idioma

- **Código** (nomes de arquivo, variáveis, campos de banco, rotas, enums): **inglês**
- **UI** (labels, botões, mensagens de erro, textos): **português**

## Estrutura-chave

```
server/utils/        # validação, RBAC, erros padronizados, cliente Supabase
server/api/          # rotas Nitro (sufixo .get.ts / .post.ts / .patch.ts / .delete.ts)
composables/         # helpers cliente (auth redirect, tab state, etc.)
components/          # admin/, auth/, layout/, panel/, register/
pages/               # Nuxt file-based routing
prisma/schema.prisma # modelo de dados — única tabela `profiles`
```

## Padrões a seguir

**Erros de API:** sempre via `createAppError()` de `server/utils/errors.ts`
```ts
throw createAppError({ code: 'VALIDATION_ERROR', message: 'Dados inválidos.', details: { fieldErrors } })
```

**Resposta bem-sucedida:** `{ data: { ... } }` (ou `{ data: { message: '...' } }` para ações)

**Validação no servidor:** funções em `server/utils/validation.ts` retornam `{ ok: true, data }` ou `{ ok: false, fieldErrors }`

**Auth server-side:** `requireProfile(event)` e `requireAdmin(event)` de `server/utils/rbac.ts`

**Cliente Supabase Admin (service_role):** `useSupabaseAdmin()` de `server/utils/supabase-server.ts` — somente server-side

## Paleta de cores (Tailwind)

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-blue` | `#0e4cab` | header, botões primários, links |
| `brand-yellow` | `#f0c657` | CTAs secundários, destaques |
| `surface-white` | `#ffffff` | cards, fundos de formulário |
| `surface-muted` | `#f5f5f5` | fundo de página |

## Roles e status

**Roles:** `admin` | `beneficiary` | `volunteer`
**Status:** `pending` | `approved` | `rejected`

Regra: apenas `admin` aprova/rejeita. Cadastro público nunca gera `role: admin`.

## Estado atual (ver roadmap.md para detalhes)

- Fase 0–2: concluídas (infra, schema, auth, perfil)
- Fase 3: cadastro público (`/register` com tabs + API `/api/register/*`)
- Fase 4+: painéis, admin, institucional, deploy
