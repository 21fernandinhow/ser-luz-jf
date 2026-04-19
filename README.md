# Projeto Ser Luz — Sistema Web

Site oficial: **[https://www.serluzjf.org](https://www.serluzjf.org)**

Sistema web institucional e operacional da ONG **Projeto Ser Luz**, desenvolvido para facilitar o cadastro de beneficiários e voluntários, a gestão interna pela equipe da ONG e a presença digital da instituição.

---

## Sobre o projeto

O Projeto Ser Luz é uma organização sem fins lucrativos focada em apoio social — distribuição de cestas básicas e outras ações comunitárias. Este sistema permite:

- **Beneficiários** se cadastrarem para receber ajuda, acompanharem o status do cadastro e manterem seus dados atualizados.
- **Voluntários** se inscreverem para contribuir com a ONG.
- **Administradores** listarem, aprovarem, rejeitarem e gerenciarem todos os cadastros, com suporte a anotações internas e exclusão definitiva.
- Qualquer visitante conhecer a ONG e realizar doações via modal com Pix/dados bancários.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Nuxt 3 (UI + API Nitro no mesmo deploy) |
| Estilo | Tailwind CSS |
| Auth | Supabase Auth (`@nuxtjs/supabase`) |
| ORM | Prisma → PostgreSQL (Supabase) |
| Deploy | Vercel |

---

## Setup local

### Pré-requisitos

- Node.js 18+
- Projeto no [Supabase](https://supabase.com) criado

### 1. Instale as dependências

```bash
npm install
```

O `postinstall` roda `prisma generate` e `nuxt prepare` automaticamente.

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os valores do seu projeto Supabase:

```bash
cp .env.example .env
```

| Variável | Onde encontrar |
|----------|---------------|
| `DATABASE_URL` | Settings → Database → Transaction pooler (porta 6543, adicione `?pgbouncer=true&connection_limit=1`) |
| `DIRECT_URL` | Settings → Database → Direct connection (porta 5432) |
| `SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `SUPABASE_ANON_KEY` / `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role key |
| `SUPABASE_JWT_SECRET` | Settings → API → JWT Settings |

### 3. Aplique o schema no banco

```bash
npx prisma migrate deploy
```

### 4. Crie o primeiro admin

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... DATABASE_URL=... \
ADMIN_EMAIL=seu@email.com ADMIN_PASSWORD=senha-segura \
npx tsx scripts/bootstrap-admin.ts
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`.

---

## Deploy (Vercel)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Nuxt.js** (auto-detectado)
3. Build command: `nuxt build`
4. Configure todas as variáveis de ambiente no dashboard da Vercel
5. Faça o deploy e rode o `bootstrap-admin` apontando para produção

> O schema é aplicado via Supabase MCP ou `prisma migrate deploy` rodado localmente com `DIRECT_URL` de produção — a porta 5432 não é acessível a partir dos servidores de build da Vercel.

---

## Estrutura principal

```
server/api/          # rotas Nitro (register, profiles, admin)
server/utils/        # RBAC, validação, erros padronizados, cliente Supabase
components/          # admin/, auth/, layout/, panel/, register/
pages/               # roteamento Nuxt (/, /login, /register, /painel/*, /admin/*)
prisma/schema.prisma # modelo de dados — tabela profiles
scripts/             # bootstrap-admin.ts
docs/                # PRD, spec técnica e roadmap
```

---

## Documentação

- [`docs/PRD.md`](docs/PRD.md) — requisitos de produto e regras de negócio
- [`docs/spec.md`](docs/spec.md) — especificação técnica detalhada
- [`docs/roadmap.md`](docs/roadmap.md) — fases de desenvolvimento
