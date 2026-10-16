# Hookfy

Inspetor de webhooks. O Hookfy expõe uma URL de captura que aceita qualquer método HTTP, salva a requisição recebida (método, headers, query params, corpo, IP) e mostra tudo em uma interface para você inspecionar e depurar integrações.

## Stack

- [TanStack Start](https://tanstack.com/start) + TanStack Router (SSR, rotas baseadas em arquivos)
- [Elysia](https://elysiajs.com) para a API, consumida no front com [Eden Treaty](https://elysiajs.com/eden/overview) e TanStack Query
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- Tailwind CSS 4, Radix UI e shadcn/ui
- [shiki](https://shiki.style) para destacar o corpo das requisições
- [Biome](https://biomejs.dev) para lint e formatação
- [Bun](https://bun.sh) como gerenciador de pacotes

## Pré-requisitos

- [Bun](https://bun.sh)
- Um banco PostgreSQL

## Começando

```bash
bun install
```

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/hookfy
```

A variável é validada em `src/env.ts` e precisa começar com `postgresql://`.

Aplique o schema no banco e inicie o servidor:

```bash
bun run db:push   # ou: bun run db:generate && bun run db:migrate
bun run dev
```

A aplicação fica em <http://localhost:3000>.

## Como usar

Envie qualquer requisição para a URL de captura (também exibida e copiável na sidebar):

```bash
curl -X POST "http://localhost:3000/api/capture/stripe/events?source=test" \
  -H "Content-Type: application/json" \
  -d '{"type": "payment.succeeded"}'
```

A requisição aparece na lista, e ao clicar nela você vê o resumo, os headers, os query params e o corpo.

## API

Todas as rotas ficam sob `/api` e são definidas em `src/server/app.ts`.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/webhooks` | Lista webhooks com paginação por cursor (`limit` de 1 a 100, padrão 20, e `cursor`). Retorna `{ webhooks, nextCursor }`. |
| `GET` | `/api/webhooks/:id` | Detalhes de um webhook. Retorna `{ webhook }` ou 404. |
| `DELETE` | `/api/webhooks/:id` | Remove um webhook. Retorna 204 ou 404. |
| `ANY` | `/api/capture` e `/api/capture/*` | Captura a requisição recebida. Retorna `{ id }`. |

## Estrutura

```
src/
├── components/        # Componentes da interface (sidebar, lista, detalhes)
│   └── ui/            # Componentes base (badge, checkbox, skeleton, resizable...)
├── db/                # Conexão e tabelas do Drizzle
├── lib/
│   └── treaty.ts      # Cliente Eden Treaty (detecta a origem no cliente e no SSR)
├── routes/
│   ├── __root.tsx     # Layout com painéis redimensionáveis
│   ├── webhooks.$id.tsx
│   └── api/$.ts       # Encaminha /api/* para o Elysia
└── server/
    └── app.ts         # App Elysia (exporta o tipo App usado pelo Treaty)
```

O app Elysia fica em `src/server/app.ts`, separado da rota, e é importado dinamicamente em `routes/api/$.ts`. Assim `db` e `pg` não entram no bundle do navegador.

## Scripts

| Comando | Descrição |
| --- | --- |
| `bun run dev` | Servidor de desenvolvimento na porta 3000 |
| `bun run build` | Build de produção |
| `bun run preview` | Pré-visualiza o build |
| `bun run check` | Lint e formatação (Biome) |
| `bun run db:generate` | Gera migrações do Drizzle |
| `bun run db:migrate` | Aplica as migrações |
| `bun run db:push` | Sincroniza o schema direto com o banco |
| `bun run db:studio` | Abre o Drizzle Studio |

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Defina `DATABASE_URL` nas variáveis de ambiente do projeto.
3. Faça o deploy.

A URL de captura é detectada automaticamente a partir do domínio em que a aplicação está rodando.

## Limitações conhecidas

- O IP é lido de `x-forwarded-for` ou `x-real-ip`. Sem proxy na frente, o valor salvo é `unknown`.
- O corpo é salvo como texto cru, sem formatação.
