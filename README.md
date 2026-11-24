# 🍲 RBS – Refeições Bem Servir

Sistema do restaurante **RBS – Refeições Bem Servir**: gestão do cardápio semanal, chatbot de atendimento no WhatsApp Business e central de pedidos de marmita, com um site público que mostra o cardápio do dia.

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
- 📋 **Cardápio semanal** a partir de um modelo personalizável (seções, itens fixos, título e rodapé), com rascunho/publicação e **impressão** no formato atual ([exemplo](docs/referencias/cardapio-exemplo.jpg))
- 🤖 **Chatbot**: edição dos textos e envio do cardápio da semana aos clientes
- ⚙️ **Configurações**: horário limite de pedidos, dia/hora do envio, tamanhos e preços das marmitas
- 🧾 **Pedidos de marmita** em **kanban** (Para fazer → Em preparação → Finalizado), com **impressão**
- 💬 **Solicitações, elogios e reclamações**, separados por tipo
- 📅 Feriados e dias fechados

**Chatbot WhatsApp** (no mesmo número do WhatsApp Business do restaurante)
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
| WhatsApp | WhatsApp Cloud API oficial (Meta) em **coexistência** com o app WhatsApp Business |
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
- ✅ RN-10: cardápio semanal, organizado por dia.
- ✅ RN-11: modelo **totalmente personalizável** (seções/colunas, ordem, itens fixos, título e rodapé). Padrão: Carnes · Complementos · Saladas, como no cardápio atual. Itens pré-preenchidos também são editáveis.
- ✅ RN-13: o chatbot usa sempre o cardápio publicado mais recente.
- ✅ RN-14/18: impressão em 1 página A4 no layout do [exemplo](docs/referencias/cardapio-exemplo.jpg), com período "DD A DD/MM/AAAA" calculado pela semana cadastrada.
- ✅ RN-19: o cardápio é cadastrado para a **próxima semana**.
- ✅ RN-15: o site público mostra **só o cardápio do dia**.
- 🟡 RN-12: rascunho → publicado.

**Chatbot (WhatsApp Business)**
- ✅ RN-20/21: introdução + opções 1/2/3; textos editáveis pelo painel.
- ✅ RN-16: o cliente pede o cardápio pelo chat quando quiser.
- ✅ RN-27: **um envio por semana** do cardápio aos clientes com opt-in, num dia útil (padrão: segunda de manhã, configurável).
- 🟡 RN-29: o bot pausa na conversa quando a administradora responde pelo celular.

**Pedidos**
- ✅ RN-30/31: kanban Para fazer → Em preparação → Finalizado.
- ✅ RN-32: pedidos imprimíveis.
- ✅ RN-33: pedido registra o canal de origem (WhatsApp, site, balcão).
- ✅ RN-35: **horário limite desligado por padrão**; se ativado, sugestão de 13:00 (ver [onde alterar](docs/ESTUDO_DE_NEGOCIO.md#6-onde-alterar-configurações)).
- ✅ RN-39: marmitas **Pequena** e **Grande**; **preços editáveis** a qualquer momento no painel.
- ✅ RN-70/71/72: o cliente escolhe **até 2 carnes**; complementos vão por padrão; salada vai separada.
- ✅ RN-73: **observação** livre no pedido, impressa em destaque.
- ✅ RN-74: pode pedir para **qualquer dia útil** da semana.
- 🟡 RN-75: **entrega** só na região perto de Pinhais, para pedidos até **11h30** (região a definir).

**Feedbacks**
- ✅ RN-40: Solicitações, Elogios e Reclamações em seções separadas.

**Usuários**
- ✅ RN-60/61: só `ADMIN` acessa o painel; modelagem já prevê `CUSTOMER` e `STAFF`.

## Onde alterar configurações

Regras que mudam com frequência ficam no painel, não no código. Tabela completa em [docs/ESTUDO_DE_NEGOCIO.md § 6](docs/ESTUDO_DE_NEGOCIO.md#6-onde-alterar-configurações).

| O quê | Onde (planejado) |
|-------|------------------|
| Horário limite de pedidos | Painel → Configurações → Pedidos · chave `orders.cutoff.*` · padrão em `src/server/settings/defaults.ts` |
| Dia/hora do envio do cardápio | Painel → Configurações → Chatbot · chave `broadcast.weekly.*` |
| Máximo de carnes por marmita | Painel → Configurações → Pedidos · chave `orders.maxMeatChoices` (padrão 2) |
| Entrega: horário limite e regiões | Painel → Configurações → Entrega · chave `delivery.cutoff.time` (padrão 11:30) + tabela `DeliveryArea` |
| Tamanhos e preços das marmitas | Painel → Cardápio → Tamanhos e preços |
| Seções, itens fixos, título e rodapé do cardápio | Painel → Cardápio → Modelo |

## Questões em aberto

Lista completa em [docs/ESTUDO_DE_NEGOCIO.md#5-questões-em-aberto](docs/ESTUDO_DE_NEGOCIO.md#5-questões-em-aberto). As que mais pesam:

- **Q-16**: como delimitar a região de entrega (bairros, CEPs ou km)? Tem taxa?
- **Q-17**: o limite de 2 carnes vale para os dois tamanhos?
- **Q-18**: na sexta, pode pedir para a semana seguinte, se o cardápio já estiver publicado?
- **Q-08**: formato da impressão dos pedidos (folha, etiqueta, impressora térmica?).

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
