# 🍲 Bem Servir

Sistema do restaurante **Bem Servir**: gestão do cardápio semanal, chatbot de atendimento no WhatsApp e central de pedidos de marmita, com um site público que mostra o cardápio do dia.

> **Status:** 📐 Planejamento. Código ainda não iniciado. Próxima etapa: **Etapa 0 — Fundação**.

---

## Sumário
- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Regras de negócio definidas](#regras-de-negócio-definidas)
- [Questões em aberto](#questões-em-aberto)
- [Documentação](#documentação)
- [Como contribuir](#como-contribuir)

---

## Visão geral

```
 ┌──────────────┐  publica   ┌──────────┐  consulta  ┌──────────────┐
 │ Painel Admin │ ─────────► │  Banco   │ ◄───────── │ Chatbot      │ ◄──► Clientes
 │ (cardápio,   │            │ (Postgres)│ ─────────► │ WhatsApp     │      (WhatsApp)
 │ pedidos,     │ ◄───────── │          │  pedidos e  └──────────────┘
 │ feedbacks)   │   kanban   └──────────┘  feedbacks
 └──────────────┘                 │
                                  ▼
                         ┌────────────────┐
                         │ Site público   │ ◄── Visitantes
                         │ (cardápio do   │
                         │  dia)          │
                         └────────────────┘
```

Fluxo central: **cardápio → chatbot → pedidos**.

## Funcionalidades

**Site público (deslogado)**
- Cardápio **do dia** (a semana inteira não é exposta, para proteger contra cópia)
- Aviso de feriado/dia fechado

**Painel da administradora**
- 📋 **Cardápio semanal** a partir de um formato prévio, com rascunho/publicação e **impressão**
- 🤖 **Chatbot**: edição dos textos (introdução, opções, mensagens)
- 🧾 **Pedidos de marmita** em **kanban** (Para fazer → Em preparação → Finalizado), com **impressão**
- 💬 **Solicitações, elogios e reclamações**, separados por tipo
- 📅 Feriados e dias fechados

**Chatbot WhatsApp**
1. Ver cardápio
2. Pedir marmita
3. Solicitações, elogios ou reclamações

**Futuro:** clientes com login fazendo pedidos pelo site.

## Stack

| Camada | Tecnologia |
|--------|------------|
| App (front + back) | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS, shadcn/ui, dnd-kit (kanban) |
| Banco | PostgreSQL + Prisma ORM |
| Validação | Zod |
| Autenticação | Auth.js, com papéis `ADMIN` / `STAFF` / `CUSTOMER` |
| WhatsApp | WhatsApp Business Cloud API (oficial, Meta) |
| Testes | Vitest (unidade/domínio), Playwright (E2E) |
| Qualidade | ESLint, Prettier, Husky, Conventional Commits, GitHub Actions |
| Deploy | Vercel + Neon/Supabase |

Justificativas em [docs/DECISOES.md](docs/DECISOES.md).

## Estrutura do repositório

Estrutura planejada:

```
res-bem-servir/
├── docs/                       # Documentação de negócio e técnica
├── prisma/                     # schema.prisma, migrações, seed
├── src/
│   ├── app/
│   │   ├── (public)/           # Site público
│   │   ├── admin/              # Painel da administradora
│   │   └── api/whatsapp/       # Webhook do chatbot
│   ├── components/             # Componentes de UI
│   ├── server/                 # Regras de negócio (domínio)
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── feedback/
│   │   ├── calendar/           # Dias úteis e feriados
│   │   └── chatbot/            # Máquina de estados + cliente WhatsApp
│   └── lib/                    # Utilitários (db, auth, datas)
└── tests/
```

## Regras de negócio definidas

> Resumo. Detalhes, fluxos e histórico em [docs/ESTUDO_DE_NEGOCIO.md](docs/ESTUDO_DE_NEGOCIO.md).
> ✅ definida · 🟡 proposta (a validar)

**Funcionamento**
- ✅ RN-01/02: abre de segunda a sexta; feriados nesses dias são dias fechados.

**Cardápio**
- ✅ RN-10/11: cardápio semanal, por dia, criado a partir de um **formato prévio** editável.
- ✅ RN-13: o chatbot usa sempre o cardápio publicado mais recente.
- ✅ RN-14: o cardápio pode ser impresso (layout conforme o exemplo a ser enviado).
- ✅ RN-15: o site público mostra **só o cardápio do dia**.
- 🟡 RN-12: rascunho → publicado.

**Chatbot**
- ✅ RN-20/21: introdução + opções 1/2/3; textos editáveis pelo painel.

**Pedidos**
- ✅ RN-30/31: kanban Para fazer → Em preparação → Finalizado.
- ✅ RN-32: pedidos imprimíveis.
- ✅ RN-33: pedido registra o canal de origem (WhatsApp, site, balcão).

**Feedbacks**
- ✅ RN-40: Solicitações, Elogios e Reclamações em seções separadas.

**Usuários**
- ✅ RN-60/61: só `ADMIN` acessa o painel; modelagem já prevê `CUSTOMER` e `STAFF`.

## Questões em aberto

Lista completa em [docs/ESTUDO_DE_NEGOCIO.md#5-questões-em-aberto](docs/ESTUDO_DE_NEGOCIO.md#5-questões-em-aberto). As que mais pesam:

- **Q-01**: enviar o cardápio da semana ativamente para a lista (com custo por mensagem) ou só responder quando o cliente perguntar?
- **Q-02 / Q-05**: seções do cardápio, tamanhos e preços das marmitas.
- **Q-04**: horário limite para pedidos.
- **Q-12**: número de WhatsApp dedicado para o bot.

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/ESTUDO_DE_NEGOCIO.md](docs/ESTUDO_DE_NEGOCIO.md) | Contexto, atores, fluxos, regras (RN-XX), riscos e dúvidas (Q-XX) |
| [docs/PLANO_DO_PROJETO.md](docs/PLANO_DO_PROJETO.md) | Etapas de desenvolvimento com checklists |
| [docs/MODELAGEM_DADOS.md](docs/MODELAGEM_DADOS.md) | Modelo de dados (diagrama ER) |
| [docs/DECISOES.md](docs/DECISOES.md) | Decisões de arquitetura (ADRs) |

## Como contribuir

1. Crie uma branch a partir da `main`: `feat/cardapio-editor`, `fix/kanban-drag`...
2. Commits em [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `feat:`, `fix:`, `docs:`...
3. **Toda regra de negócio nova ou alterada** deve ser registrada em `docs/ESTUDO_DE_NEGOCIO.md` **e** resumida neste README, na seção [Regras de negócio definidas](#regras-de-negócio-definidas).
4. Abra um Pull Request para a `main`.

### Rodando localmente
_Será documentado na Etapa 0._
