# Plano do Projeto — Bem Servir

> Plano incremental. Cada etapa entrega algo **utilizável** e é validada com a administradora antes de seguir.
> Regras de negócio: [ESTUDO_DE_NEGOCIO.md](./ESTUDO_DE_NEGOCIO.md) · Dados: [MODELAGEM_DADOS.md](./MODELAGEM_DADOS.md) · Decisões técnicas: [DECISOES.md](./DECISOES.md)

## Visão geral

```
Etapa 0  Fundação ─────────────┐
Etapa 1  Banco + Autenticação ─┤
Etapa 2  Cardápio (admin) ─────┤──► MVP interno: ela já monta e imprime o cardápio
Etapa 3  Site público ─────────┤
Etapa 4  Pedidos + Kanban ─────┤──► pedidos lançados manualmente já organizados
Etapa 5  Feedbacks ────────────┤
Etapa 6  Chatbot WhatsApp ─────┤──► automação completa (cardápio → bot → pedidos)
Etapa 7  Envio do cardápio ────┤
Etapa 8  Deploy e operação ────┘
Futuro   Pedido pelo site / clientes com login
```

> A ordem põe o **cardápio** primeiro porque o bot e o site dependem dele, e o **WhatsApp** depois porque a aprovação da Meta leva dias. **O cadastro na Meta deve começar já na Etapa 2**, em paralelo.

---

## Etapa 0 — Fundação do projeto
- [ ] Criar app Next.js + TypeScript (App Router, `src/`)
- [ ] Tailwind CSS + shadcn/ui
- [ ] ESLint, Prettier, Husky + lint-staged, Conventional Commits
- [ ] Estrutura de pastas (ver README)
- [ ] `.env.example`, `docker-compose.yml` com PostgreSQL local
- [ ] GitHub Actions: lint + typecheck + testes
- **Entrega:** projeto rodando localmente com página "em construção".

## Etapa 1 — Banco de dados e autenticação
- [ ] Validar a [modelagem](./MODELAGEM_DADOS.md) (depende de Q-02, Q-05)
- [ ] `schema.prisma` + primeira migração
- [ ] Seed: usuária admin, seções do cardápio, feriados nacionais do ano
- [ ] Auth.js com login de e-mail/senha; middleware protegendo `/admin`
- [ ] Layout base do painel (menu lateral: Cardápio, Pedidos, Feedbacks, Chatbot, Configurações)
- **Entrega:** a administradora faz login e vê o painel vazio.

## Etapa 2 — Gestão do cardápio
- [ ] Cadastro de **seções** e do **modelo (formato prévio)**
- [ ] "Nova semana": gera seg–sex a partir do modelo ou copiando a semana anterior
- [ ] Marcação automática de feriados; marcar/desmarcar dia fechado
- [ ] Editor do cardápio por dia (rascunho → publicar)
- [ ] Gestão de feriados (lista + cadastro manual)
- [ ] **Impressão do cardápio** — ⚠️ **solicitar o exemplo de cardápio impresso antes de começar este item**
- [ ] 🔔 Em paralelo: abrir conta Meta Business e solicitar acesso à WhatsApp Cloud API
- **Entrega:** ela monta, publica e imprime o cardápio da semana pelo sistema.

## Etapa 3 — Site público
- [ ] Página inicial com o **cardápio do dia** (só o dia, RN-15)
- [ ] Aviso de dia fechado + próximo dia de funcionamento
- [ ] Informações: endereço, horário, botão "Pedir pelo WhatsApp"
- [ ] Responsivo (a maioria dos acessos será pelo celular), SEO básico, Open Graph
- **Entrega:** link público para divulgar.

## Etapa 4 — Pedidos e kanban
- [ ] Domínio de pedidos (criar, mudar status, cancelar) com testes
- [ ] **Kanban**: Para fazer → Em preparação → Finalizado (arrastar e soltar)
- [ ] Filtro por dia, contadores por coluna, atualização automática
- [ ] Lançamento manual de pedido (canal `BALCAO`), útil antes do bot ficar pronto
- [ ] **Impressão de pedidos** (individual e lista do dia, conforme Q-08)
- **Entrega:** produção do dia organizada no kanban.

## Etapa 5 — Solicitações, elogios e reclamações
- [ ] Aba com três seções separadas: Solicitações · Elogios · Reclamações
- [ ] Status (novo/lido/resolvido) e anotação interna
- [ ] Indicador de "novos" no menu do painel
- **Entrega:** feedbacks centralizados.

## Etapa 6 — Chatbot WhatsApp
- [ ] Webhook (verificação + recebimento), validação de assinatura, idempotência
- [ ] Máquina de estados: boas-vindas → menu (1, 2, 3) → subfluxos
- [ ] 1: cardápio publicado do banco
- [ ] 2: fluxo de pedido completo → cria `Order` no kanban
- [ ] 3: tipo + mensagem → cria `Feedback`
- [ ] **Configuração dos textos do bot** no painel (+ pré-visualização da conversa)
- [ ] Histórico de conversas no painel (consulta)
- [ ] Testes automatizados de cada fluxo da conversa
- **Entrega:** atendimento automatizado no número do restaurante.

## Etapa 7 — Envio do cardápio da semana (depende de Q-01)
- [ ] Lista de clientes com opt-in (e opção de sair: "SAIR")
- [ ] Template aprovado na Meta
- [ ] Botão "Enviar cardápio da semana" com confirmação e estimativa de custo
- [ ] Relatório de envio (enviados, falhas)
- **Entrega:** fim do envio manual.

## Etapa 8 — Deploy e operação
- [ ] Deploy Vercel + banco gerenciado + domínio
- [ ] Backups do banco, monitoramento de erros (Sentry)
- [ ] Manual de uso para a administradora (com prints)
- **Entrega:** sistema em produção.

## Futuro
- Login de clientes (OTP por WhatsApp), pedido pelo site, histórico de pedidos
- Perfil `STAFF` (cozinha só vê o kanban)
- Pagamento via Pix, relatórios (pratos mais pedidos, faturamento)
- Avisar o cliente quando a marmita estiver pronta
