# Registro de Decisões de Arquitetura (ADR)

> Cada decisão técnica relevante é registrada aqui com contexto, decisão e consequências.
> Status: 🟡 Proposta · ✅ Aceita · ❌ Substituída.

---

## ADR-001 — Aplicação full-stack única com Next.js + TypeScript
**Status:** 🟡 Proposta

**Contexto:** projeto pequeno, mantido por uma pessoa, com site público, painel admin e webhook do WhatsApp.

**Decisão:** uma única aplicação **Next.js (App Router) + TypeScript**, com:
- páginas públicas renderizadas no servidor (bom para SEO e performance);
- painel `/admin` protegido;
- rota `/api/whatsapp/webhook` para o chatbot;
- regras de negócio isoladas em `src/server/` (camada de domínio), fora dos componentes React.

**Consequências:** um só deploy e uma só linguagem. Se o chatbot crescer, a camada `src/server/chatbot` pode ser extraída para um serviço separado sem reescrita.

---

## ADR-002 — PostgreSQL + Prisma
**Status:** 🟡 Proposta

**Decisão:** **PostgreSQL** gerenciado (Neon ou Supabase, plano gratuito) com **Prisma ORM** e migrações versionadas no repositório. Validação de entrada com **Zod**.

**Consequências:** dados relacionais (pedidos, cardápio, clientes) bem modelados, migrações rastreáveis e tipos gerados automaticamente.

---

## ADR-003 — WhatsApp Cloud API oficial em coexistência com o app WhatsApp Business
**Status:** ✅ Aceita (atualizada em 2026-11-23 após respostas de Q-01 e Q-12)

**Contexto:**
- O restaurante não terá número exclusivo e quer continuar usando o **app WhatsApp Business** no celular (Q-12).
- O cardápio da semana será **enviado ativamente** aos clientes (Q-01).
- Bibliotecas não oficiais (whatsapp-web.js, Baileys) são grátis, mas violam os termos e podem levar ao **banimento do número**.

**Decisão:** usar a **WhatsApp Business Cloud API** oficial no **modo coexistência**: o número atual do WhatsApp Business é conectado à API pelo *Embedded Signup* e continua funcionando no app do celular. O chatbot é uma **máquina de estados** própria, persistida em `Conversation`, sem depender de plataformas de chatbot de terceiros.

**Consequências:**
- O número não muda e as conversas aparecem no celular da administradora.
- Mensagens enviadas pelo app continuam gratuitas. As enviadas pela API seguem a tabela da Meta, e o envio ativo do cardápio é um **template de marketing**, cobrado por mensagem e com aprovação prévia.
- O webhook recebe também as mensagens que a administradora envia pelo app (eventos de "eco"), o que permite **pausar o bot** naquela conversa (RN-29).
- Aparelhos vinculados (WhatsApp Web/Desktop) são desconectados na ativação, e algumas funções do app podem ficar limitadas. Conferir a lista atual da Meta antes de ativar.
- Limite de vazão de 20 mensagens/s por número, mais que suficiente para o volume do restaurante.

**Alternativas avaliadas:**
- **Provedor BSP** (360dialog, Twilio, Z-API etc.): facilita o onboarding de coexistência, mas acrescenta mensalidade. Fica como plano B se o cadastro direto na Meta travar.
- **Só recursos nativos do app** (saudação, respostas rápidas, listas de transmissão): plano provisório até o bot ficar pronto.

---

## ADR-004 — Autenticação com Auth.js e papéis
**Status:** 🟡 Proposta

**Decisão:** **Auth.js (NextAuth v5)** com login por e-mail e senha (hash com argon2/bcrypt) para a administradora. Autorização pelo campo `role` do `User`, verificada em middleware e na camada de servidor. No futuro, clientes podem entrar por **código via WhatsApp/SMS** (OTP), já que o telefone é a identidade natural deles.

---

## ADR-005 — UI: Tailwind CSS + shadcn/ui; kanban com dnd-kit
**Status:** 🟡 Proposta

**Decisão:** **Tailwind CSS** + **shadcn/ui** (componentes acessíveis), **dnd-kit** para arrastar no kanban, **TanStack Query** para atualização periódica dos pedidos (polling a cada ~10s no MVP; tempo real via SSE ou Supabase Realtime se precisar).

---

## ADR-006 — Impressão via CSS de impressão
**Status:** 🟡 Proposta

**Decisão:** páginas dedicadas de impressão (`/admin/cardapio/[semana]/imprimir`, `/admin/pedidos/imprimir`) com `@media print` e o `window.print()` do navegador. Assim o resultado também pode ser salvo em PDF. Se houver **impressora térmica** (Q-08), avaliar um layout de 58/80mm.

---

## ADR-007 — Hospedagem e qualidade
**Status:** 🟡 Proposta

**Decisão:**
- Deploy na **Vercel** (app) + **Neon/Supabase** (banco), com custo inicial zero ou muito baixo.
- **GitHub Actions**: lint (ESLint), formatação (Prettier), checagem de tipos, testes (**Vitest** para domínio/chatbot, **Playwright** para fluxos críticos).
- Commits no padrão **Conventional Commits**, branches por funcionalidade e PRs para `main`.
- Variáveis sensíveis só em `.env` (nunca commitadas), com `.env.example` documentado.
