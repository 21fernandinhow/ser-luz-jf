# Especificação técnica — Projeto Ser Luz (MVP)

Documento de implementação. Identificadores (código, API, banco) em **inglês**; copy de UI em **português** (fora deste documento).

**KISS:** estrutura e validação mínimas suficientes para o MVP; sem bibliotecas de schema. A **fonte de verdade** das regras é o **servidor** (funções simples). Evoluir para libs ou camadas extras só se aparecer dor real de manutenção.

---

## 1. Arquitetura geral

### 1.1 Visão

- **Monólito Nuxt 3**: UI (Vue) e **Nitro** (`server/`) no mesmo deploy.
- **Supabase Auth**: identidade, JWT, refresh; **sem** usar Supabase Client como ORM principal para regras de negócio — **Prisma** fala com o Postgres do Supabase.
- **Fonte de verdade de role/status**: tabela `profiles` (Postgres), validada em **toda** mutação sensível no servidor.

### 1.2 Fluxo de dados

```
Browser → Nuxt pages/components
       → $fetch / useFetch → Nitro server routes (/api/*)
       → validação no servidor (funções) + sessão/JWT Supabase
       → Prisma → PostgreSQL (Supabase)
```

- **Leituras públicas** (home): sem Prisma se for só conteúdo estático; institucional MVP pode ser SFC + markdown/componentes locais.
- **Auth no cliente**: `@nuxtjs/supabase` (ou módulo equivalente) com PKCE; envio do `access_token` nas chamadas a `/api/*` via header `Authorization: Bearer <jwt>` ou cookie de sessão conforme configuração do módulo.
- **Operações admin sensíveis** (ex.: listar todos, aprovar, **delete definitivo** de utilizador): sempre **server-only**; uso de `SUPABASE_SERVICE_ROLE` apenas onde inevitável (bootstrap, delete Auth, tarefas sem JWT de utilizador).

### 1.3 Separação de responsabilidades

| Camada | Responsabilidade |
|--------|-------------------|
| `pages/` + `components/` | UI, formulários, chamadas HTTP, validação UX (HTML5 + mensagens em PT; checagens basicas) |
| `composables/` | Sessão do lado cliente, helpers de role para redirecionamento leve (nunca autorização definitiva) |
| `server/middleware/` | Opcional: logging, CORS, rate limit |
| `server/utils/` | Auth/RBAC, Prisma, **validação de body** (funções), erros padronizados |
| `server/api/**` | Autorização forte, validação com essas funções, Prisma, formato de erro padronizado |
| `prisma/schema.prisma` | Modelo de dados; migrações com `prisma migrate` |

**Regra:** UI pode esconder botões por role; **negócio e segurança** vivem no servidor.

---

## 2. Estrutura de pastas (Nuxt 3)

```
ser-luz-jf/
├── assets/                 # imagens, fontes (se houver)
├── components/
│   ├── admin/              # tabelas, filtros, formulário edição admin
│   ├── auth/               # login, guards de UI
│   ├── layout/             # AppHeader, DonateModal, UserMenu
│   ├── panel/              # painéis beneficiary/volunteer compartilhados
│   └── register/           # tabs, RegisterBeneficiaryForm, RegisterVolunteerForm
├── composables/
│   ├── useAuthRedirect.ts  # após login, path por role
│   ├── useRegisterTab.ts   # sync query ?type= com aba ativa
│   └── useDonateModal.ts   # estado do modal Doar
├── layouts/
│   ├── default.vue         # público: header institucional
│   ├── panel.vue           # painéis beneficiary/volunteer
│   └── admin.vue           # shell admin (nav lateral/top)
├── middleware/
│   ├── auth.global.ts      # opcional: redirect guest de /painel e /admin
│   └── admin.ts            # só admin em /admin/**
├── pages/
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   ├── painel/
│   │   ├── beneficiary.vue
│   │   └── volunteer.vue
│   └── admin/
│       ├── index.vue
│       ├── beneficiaries.vue
│       ├── volunteers.vue
│       └── users/
│           └── [id].vue
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   └── session.get.ts      # opcional: perfil + role para hidratação
│   │   ├── profiles/
│   │   │   ├── me.get.ts
│   │   │   ├── me.patch.ts
│   │   │   ├── index.post.ts       # conclusão pós-signUp (se fluxo em 2 passos)
│   │   └── admin/
│   │       ├── beneficiaries.get.ts
│   │       ├── volunteers.get.ts
│   │       ├── users/
│   │       │   ├── [id].get.ts
│   │       │   ├── [id].patch.ts
│   │       │   └── [id].delete.ts  # delete definitivo: profiles + Auth
│   │       └── users/
│   │           └── [id]/
│   │               └── status.patch.ts  # approve / reject
│   ├── middleware/         # rate limit, etc.
│   └── utils/
│       ├── prisma.ts
│       ├── supabase-server.ts      # cliente service role + helper JWT
│       ├── auth.ts                 # extrair usuário do request
│       ├── rbac.ts
│       ├── errors.ts
│       └── validation.ts           # parse de body + regras (register, patch me, admin)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── favicon.ico
│   └── logo.webp
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

**Notas:**

- **`public/`:** ficheiros servidos na raiz (`/favicon.ico`, `/logo.webp`). No MVP, **nomes fixos** `favicon.ico` e `logo.webp`; o header referencia `/logo.webp`; favicon ligado em `app.head` / `nuxt.config.ts`.
- **`server/api`**: um arquivo por rota RESTful; métodos via sufixo `.get.ts`, `.post.ts`, etc., ou `index.ts` com `defineEventHandler` e `getMethod` — escolher **um** padrão e manter.
- **`models/`**: não obrigatório em Nuxt; tipos com `Prisma.Profile` e interfaces TypeScript manuais onde ajudarem leitura. Se crescer, `server/services/profile.service.ts` para queries repetidas.
- **`server/utils/validation.ts`**: pode partir em mais ficheiros só se o ficheiro único passar de ~150–200 linhas.
- **`middleware/auth.global.ts`**: pode apenas definir meta nas rotas via `definePageMeta` e checar `user` do Supabase; evitar duplicar toda lógica RBAC (servidor continua sendo a barreira).

---

## 3. Modelagem de banco (Prisma)

### 3.1 Decisões

- **Uma tabela `profiles`**, 1:1 com `auth.users.id` (UUID), alinhado ao PRD.
- Campos específicos de beneficiário **nullable** em voluntários/admin; regras de preenchimento por **role** nas **funções de validação do servidor** (e, no cliente, HTML5 / checagens opcionais).
- **Índices**: `role`, `status`, `created_at` para listagens admin filtradas.

### 3.2 Schema sugerido

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  admin
  beneficiary
  volunteer
}

enum ProfileStatus {
  pending
  approved
  rejected
}

model Profile {
  id     String @id @db.Uuid
  role   Role
  status ProfileStatus
  email  String

  internalNotes String?   @map("internal_notes")
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Shared / beneficiary / volunteer (null conforme role)
  fullName   String? @map("full_name")
  address    String?
  phone      String?
  documentId String? @map("document_id")

  householdSize            Int?    @map("household_size")
  hasChildren              Boolean? @map("has_children")
  childrenCount            Int?    @map("children_count")
  childrenAgesDescription  String? @map("children_ages_description")
  clothingSizes            String? @map("clothing_sizes")
  currentGreatestNeed      String? @map("current_greatest_need")

  availability String?
  skills       String?

  @@index([role])
  @@index([status])
  @@index([createdAt])
  @@map("profiles")
}
```

### 3.3 Boas práticas

- **Não** referenciar `auth.users` no Prisma a menos que se use schema introspect separado; o vínculo é **convenção**: `profiles.id = auth.users.id`.
- Migração inicial cria só `public.profiles`. Usuários criados no Auth existem antes ou depois da linha em `profiles` — fluxo de cadastro deve garantir **atomicidade operacional** (ver §13).
- Opcional MVP+: tabela `audit_log` com FK para `profiles.id` e campos `actor_id`, `from_status`, `to_status`, `created_at`.

---

## 4. Fluxo de autenticação

### 4.1 Supabase Auth no Nuxt

- Módulo **`@nuxtjs/supabase`** no MVP (setup manual com `@supabase/ssr` só se houver requisito forte de desvio).
- **Login/logout**: `signInWithPassword` / `signOut` no cliente; sessão persistida conforme doc do módulo (PKCE).

### 4.2 Sessão e chamadas à API

**Padrão MVP:** cookies/sessão geridos por **`@nuxtjs/supabase`** (SSR alinhado à [documentação do módulo](https://supabase.nuxtjs.org/)); o Nitro obtém o utilizador a partir do pedido da mesma forma que os exemplos oficiais (cookie + `getSession` / validação server-side). Server utils expõem `getAuthUser(event): Promise<{ sub, email } | null>`.

Se no futuro for necessário (ex.: cliente externo à app), pode passar-se a enviar `Authorization: Bearer <access_token>` e validar com `supabase.auth.getUser(token)` — fora do caminho feliz do MVP.

### 4.3 Proteção de rotas (páginas)

- **`/painel/*`**: se não autenticado → redirect `/login?redirect=...`.
- **`/admin/*`**: autenticado + `profile.role === admin`; senão → 403 ou redirect `/painel/...` conforme role.
- **Perfil inexistente:** se `GET /api/profiles/me` retornar **404** (ex.: linha removida após delete admin, estado inconsistente), tratar como sessão inválida: `signOut` + mensagem ou redirect ao login.

### 4.4 Sincronização com `profiles`

- **Criação (MVP):** **sempre** via **rota Nuxt** que cria o utilizador no Auth e a linha em `profiles` no mesmo fluxo documentado (§13) — previsível e fácil de depurar.
- **Email espelho**: gravar `email` em `profiles` no cadastro; atualização futura via Auth/webhook se necessário.
- **Trigger em `auth.users`:** opcional para produtos mais maduros; **não** é requisito do MVP (evita duplicar caminhos de criação).

---

## 5. Autorização (RBAC)

### 5.1 Roles

- Enum alinhado ao banco: `admin`, `beneficiary`, `volunteer`.
- **Nenhuma** rota pública ou cliente pode definir `role: admin`.

### 5.2 Middleware Nuxt (páginas)

- Checagem **best-effort** para UX (mostrar admin layout, redirecionar).
- Fonte: `useSupabaseUser()` + `GET /api/profiles/me` (ou composable que cacheia perfil) para saber `role` e `status`.

### 5.3 Regras no backend (obrigatório)

| Endpoint (exemplo) | Regra |
|--------------------|--------|
| `GET/PATCH .../me` | JWT válido; `profile.id === jwt.sub`; resposta **sem** `internalNotes` se não admin |
| `GET .../admin/*` | `role === admin` |
| `PATCH .../users/:id` | Admin: qualquer id existente; não-admin: **proibido** |
| `PATCH .../me` | Campos permitidos por role; beneficiário/voluntário **não** enviam `internalNotes`, `status`, `role`, `email` (ignorar ou 400) |

**Implementação:** funções `requireAdmin(event)`, `requireProfile(event)`, `assertSelfOrAdmin(profile, targetId)`.

---

## 6. API design (server routes)

Base URL: mesma origem (`/api`). JSON `Content-Type: application/json`.

### 6.1 Endpoints

| Método | Rota | Quem | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/register/beneficiary` | público | Cria usuário Auth + `profiles` (role beneficiary, status pending) |
| `POST` | `/api/register/volunteer` | público | Idem volunteer |
| `GET` | `/api/profiles/me` | autenticado | Perfil do JWT; omite `internalNotes` se não admin |
| `PATCH` | `/api/profiles/me` | autenticado | Atualiza campos permitidos ao role |
| `GET` | `/api/admin/beneficiaries` | admin | Lista `role=beneficiary`, query `?status=` |
| `GET` | `/api/admin/volunteers` | admin | Idem `role=volunteer` |
| `GET` | `/api/admin/users/:id` | admin | Detalhe completo incl. `internalNotes` |
| `PATCH` | `/api/admin/users/:id` | admin | Atualização ampla (campos administrativos + ficha) |
| `PATCH` | `/api/admin/users/:id/status` | admin | Body `{ status: approved \| rejected }` + confirmação idempotente |
| `DELETE` | `/api/admin/users/:id` | admin | Delete **definitivo** (confirmação na UI): `delete` da linha em `profiles` (Prisma) **e** remoção do utilizador em **Supabase Auth** (Admin API, `service_role`). Ordem recomendada: validar admin → Prisma `delete` → `deleteUser` Auth; se Auth falhar após apagar `profiles`, documentar recuperação manual. |

**Opcional:** `GET /api/auth/session` para hidratar role no layout após refresh.

### 6.2 Exemplos

**PATCH `/api/profiles/me` (beneficiário)**

Request:

```json
{
  "full_name": "Maria Silva",
  "address": "Rua X",
  "phone": "+5521999999999",
  "document_id": "***",
  "household_size": 4,
  "has_children": true,
  "children_count": 2,
  "children_ages_description": "3 e 7 anos",
  "clothing_sizes": "P/M",
  "current_greatest_need": "cesta básica"
}
```

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "role": "beneficiary",
    "status": "pending",
    "email": "maria@example.com",
    "full_name": "Maria Silva",
    "...": "..."
  }
}
```

**PATCH `/api/admin/users/:id/status`**

Request:

```json
{ "status": "approved" }
```

Response `200`: `{ "data": { "id": "...", "status": "approved" } }`

### 6.3 Validações (servidor)

- Funções em `server/utils/validation.ts` (ou módulos partidos se crescer): `readBody`, checagens com `typeof` / presença / intervalos; regras do PRD (`household_size >= 1`, `has_children` → `children_count`, etc.); remoção de chaves proibidas antes de `update`.
- Resposta `400` com `details.fieldErrors` preenchido por essas funções (objeto plano, ex.: `{ "full_name": "Obrigatório." }`).

---

## 7. Validação de dados

- **Servidor (obrigatório):** funções puras que devolvem `{ ok: true, data }` ou `{ ok: false, fieldErrors }` / mensagem; as rotas mapeiam falha para `400` (§9). Nunca confiar no cliente para segurança ou regras de negócio.
- **Cliente (UX):** **HTML5** — `required`, `type="email"`, `min`, `pattern` leve onde fizer sentido; mensagens e `title` em **português** junto aos campos.
- **Duplicação de regras:** aceite mínimo para KISS — ou só HTML5 + feedback após erro da API (`fieldErrors` nos inputs), ou funções espelho **muito curtas** no cliente (sem dependência de schema) se quiser bloquear submit óbvio antes da rede.
- **Senha:** política definida no Supabase Dashboard; a UI pode listar os mesmos requisitos em texto.
- **Telefone:** máscara opcional na UI; no servidor, validação leve (comprimento / caracteres) ou aceitar string não vazia conforme PRD.

---

## 8. UI / Frontend architecture

### 8.1 Páginas

- **`/`**: hero, blocos institucionais resumidos, CTAs → `/register?type=...`, modal Doar.
- **`/register`**: tabs sincronizadas com `?type=beneficiary|volunteer` (default beneficiary se inválido).
- **`/login`**: email/senha + link para `/register`.
- **`/painel/beneficiary` | `/painel/volunteer`**: leitura/edição ficha; badge de status.
- **`/admin`**: dashboard mínimo + links; sub-rotas listagens e detalhe.

### 8.2 Layouts

- **`default`**: header fixo/sticky — esquerda **logo** (`/logo.webp`, com `alt` acessível) ou **nome** da ONG em texto se fallback (PRD); direita **Doar** + ícone usuário (comportamento PRD).
- **`panel`**: header simplificado ou mesmo header com contexto de painel.
- **`admin`**: navegação entre beneficiários/voluntários.

### 8.3 Ativos (logo e favicon)

- **`AppHeader`:** `<img src="/logo.webp" alt="…" />` (texto PT no `alt`); fallback para nome textual conforme PRD.
- **Favicon:** `link` para `/favicon.ico` em `nuxt.config.ts` (`app.head`) ou equivalente Nuxt 3.

### 8.4 Componentização

- `DonateModal`: props com textos Pix/banco/link (env ou runtime config pública).
- `RegisterTabs` + formulários isolados (HTML5 + submit para API).
- `StatusBadge`: mapa `pending|approved|rejected` → texto PT.

### 8.5 Estado

- MVP: **Pinia opcional**; para muitos casos, `useState` do Nuxt + `useAsyncData` para `/api/profiles/me` basta.
- Modal Doar: `useState('donate-open')` ou composable com ref.

---

## 9. Tratamento de erros

### 9.1 Padrão API

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Mensagem legível em português",
    "details": { "fieldErrors": {} }
  }
}
```

Códigos sugeridos: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `INTERNAL`.

- **`fieldErrors`:** objeto chave-valor simples (`campo_api` → mensagem em português), produzido pelas funções de validação do servidor — sem stack de bibliotecas.

- **401**: sem JWT ou JWT inválido.
- **403**: autenticado mas sem role ou tentativa de acessar recurso alheio.
- **404**: perfil inexistente (id inválido ou já removido) em contexto admin ou em `/api/profiles/me`.

### 9.2 UI

- Toast ou alert inline com `error.message`.
- Formulários: `details.fieldErrors` → inputs.

### 9.3 Logs

- `console.error` em desenvolvimento; produção: **sem** vazar stack para cliente.
- Integração futura: Axiom, Logtail, ou Vercel Logs; incluir `requestId` se disponível.

---

## 10. Segurança

- **Endpoints**: sempre validar JWT no servidor antes de Prisma.
- **Dados sensíveis**: `document_id` — em listagens admin, resposta pode mascarar (ex.: últimos 4 dígitos) via serializer dedicado para DTO admin.
- **Service role**: somente em variável de ambiente servidor; nunca expor ao bundle.
- **Headers**: `helmet`-like via Nitro ou middleware definindo `X-Content-Type-Options`, etc.
- **Rate limiting**: ver §11.2.
- **RLS (Postgres)**: políticas que espelham RBAC como camada extra; app continua validando no Nitro para não depender só do cliente.

---

## 11. Performance e boas práticas

### 11.1 Frontend

- `useAsyncData` com `key` estável para `/api/profiles/me`; evitar refetch em cada navegação se dados não mudaram.
- Listagens admin: paginação (`take/skip` ou cursor) desde o início — mesmo que MVP tenha poucos registros.

### 11.2 Rate limiting

- **MVP:** pode **omitir** rate limit no primeiro incremento e acrescentar na Fase 5 (§14) quando o tráfego existir — KISS.
- **Passo seguinte simples:** middleware Nitro com limite básico por IP em memória (aceitar limitações em serverless multi-instância) ou pacote dedicado se a equipa preferir algo pronto.
- **Produção com tráfego real:** Vercel + KV / Upstash (Redis) para contar IP + rota em `POST /api/register/*` (e login se houver rota API própria).

### 11.3 Queries

- Índices já definidos; filtros admin `where: { role: ... }` (+ `status` quando aplicável).
- Selecionar apenas colunas necessárias com `select` quando listagens forem grandes.

---

## 12. Deploy e ambiente

### 12.1 Variáveis de ambiente

| Variável | Onde | Uso |
|----------|------|-----|
| `DATABASE_URL` | servidor | Prisma (connection string Postgres Supabase, preferir pooler `?pgbouncer=true` + `directUrl` para migrate) |
| `DIRECT_URL` | servidor | `prisma migrate` (conexão direta, se usar pooler) |
| `SUPABASE_URL` | cliente + servidor | SDK |
| `SUPABASE_ANON_KEY` | cliente | apenas operações públicas / auth cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | só servidor | bootstrap admin, register com Admin API, **delete definitivo** (remover utilizador no Auth) |
| `SUPABASE_JWT_SECRET` | servidor | validação local de JWT (se escolhida) |
| `NUXT_PUBLIC_*` | cliente | URLs públicas, textos não secretos do modal doação se necessário |

### 12.2 Vercel

- Framework Preset: Nuxt 3.
- Build: `nuxt build`; Postinstall: `prisma generate`.
- **Migrate**: rodar `prisma migrate deploy` em CI ou `vercel build` com script que executa migrate (cuidado com concorrência — documentar ordem).

### 12.3 Prisma migrate

- Desenvolvimento: `prisma migrate dev`.
- Produção: `prisma migrate deploy` apontando para o mesmo banco Supabase.
- Garantir extensões/schema `public` apenas; não alterar `auth` manualmente salvo triggers documentados.

---

## 13. Fluxos críticos detalhados

### 13.1 Cadastro de usuário (beneficiário ou voluntário)

1. Usuário preenche formulário na aba correta em `/register`.
2. Cliente: HTML5 / checagens mínimas opcionais; `POST /api/register/beneficiary` ou `.../volunteer` com payload JSON.
3. Nitro: funções em `server/utils/validation.ts` + rate limit (se já ativo).
4. Servidor usa **Supabase Admin** `createUser({ email, password, email_confirm: true/false conforme política })` e obtém `user.id`.
5. **Transação Prisma**: `create` em `profiles` com `id = user.id`, `role`, `status: pending`, campos da ficha, `email` espelhado.
6. Se passo 5 falhar após Auth criado: registrar falha e rotina de compensação (retry ou apagar utilizador em Auth via Admin API — documentar).
7. Resposta `201` + cliente pode chamar `signInWithPassword` **ou** retornar mensagem “verifique email” conforme config Supabase.
8. UI mostra sucesso com texto de pendência.

*(Variante: signUp no cliente primeiro, depois `POST /api/profiles/bootstrap` com JWT — exige política RLS ou service role na primeira gravação; escolher um fluxo e manter.)*

### 13.2 Login

1. `signInWithPassword` no cliente.
2. Redirecionar: `GET /api/profiles/me` (ou dados já na sessão).
3. Se **404** em `/api/profiles/me` → `signOut` + mensagem (perfil inexistente).
4. Senão: `role === admin` → `/admin`; `beneficiary` → `/painel/beneficiary`; `volunteer` → `/painel/volunteer`.

### 13.3 Aprovação por admin

1. Admin abre lista filtrada por `status`.
2. `PATCH /api/admin/users/:id/status` com `{ status: approved }` ou `rejected`.
3. Servidor valida admin + alvo existe em `profiles` + transição permitida.
4. Opcional: escrever `audit_log`.
5. Resposta atualizada; UI reflete badge na próxima leitura do beneficiário/voluntário.

### 13.4 Edição de perfil

1. Usuário autenticado em painel carrega `GET /api/profiles/me`.
2. Submete `PATCH /api/profiles/me` com subset permitido.
3. Servidor remove chaves proibidas (`internal_notes`, `status`, `role`, `email`).
4. Prisma `update` com `where: { id: jwt.sub }`.
5. Retorna DTO sem vazamento de campos admin para não-admin.

---

## 14. Estratégia de desenvolvimento

### Fase 0 — Repositório e infra

- Nuxt 3 + Tailwind + paleta PRD (`tailwind.config`).
- Prisma + primeira migration `profiles`.
- Supabase projeto + env local/Vercel.
- Documentar bootstrap do primeiro admin (`scripts/bootstrap-admin.ts` + `SUPABASE_SERVICE_ROLE_KEY`).

### Fase 1 — Auth e perfil

- Módulo Supabase; páginas `/login`; `GET/PATCH /api/profiles/me`; middlewares de rota básicos.

### Fase 2 — Cadastro público

- `server/utils/validation.ts` (register beneficiary/volunteer) + `POST /api/register/*` + `/register` com tabs e query `type`.

### Fase 3 — Painéis

- `/painel/beneficiary` e `/painel/volunteer` com formulários e status.

### Fase 4 — Admin

- Listagens + filtros + detalhe + status + delete definitivo (perfil + Auth) + `internal_notes`.

### Fase 5 — Institucional e polimento

- Home, header, modal Doar, mensagens PT, contraste; `public/logo.webp` e `public/favicon.ico` presentes e ligados no layout / `nuxt.config`.
- RLS no Supabase (iteration).
- Rate limit em rotas sensíveis.

### Fase 6 — Deploy

- Vercel, variáveis, `migrate deploy`, smoke test pós-deploy.

---

*Documento vivo: ajustar rotas/nomes de arquivos ao padrão exato escolhido no repositório (kebab-case vs camelCase nas pastas `server/api`).*
